import React from 'react'
import { defer, redirect, useLoaderData } from 'react-router-dom'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore/lite'
import { db, product, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Payment from '../../Components/Payment/Payment'
import Email from '../../Utils/Email'

export async function action({ request }) {
    const formData = await request.formData()
    const currentuser = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser(),
        staleTime: Infinity, gcTime: Infinity
    })
    const userId = currentuser.uid
    const userData = await queryClient.fetchQuery({
        queryKey: ['userData'], queryFn: () => user(userId),
        staleTime: Infinity, gcTime: Infinity
    })
    const products = await queryClient.fetchQuery({
        queryKey: ['cartItems'], queryFn: () => {
            return Promise.all(userData.cart.map((item, idx) => product(item.productId).then(resThis => {
                return { ...resThis, quantity: item.quantity, idx: idx }
            })))
        }, staleTime: Infinity, gcTime: Infinity
    }).then(res => res.map(item => ({
        productId: item.id, productImg: item.img[0], title: item.title,
        size: item.sizes[0], price: item.price, quantity: item.quantity
    })))
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const address = cartData.address
    const orderId = cartData.orderId
    const paymentMode = formData.get('payment')
    const totalPrice = Number(formData.get('total'))
    const email = currentuser.isAnonymous ? address.email : userData.email
    const name = currentuser.isAnonymous ? 'Guest' : userData.username
    await placeOrder(products, userId, address, orderId, paymentMode, totalPrice, email)
    await Email(email, name, orderId, products, totalPrice, address, paymentMode)
    await queryClient.invalidateQueries({ queryKey: ['userData'] })
    await queryClient.invalidateQueries({ queryKey: ['cartItems'] })
    await queryClient.invalidateQueries({ queryKey: ['ordersData'] })
    localStorage.removeItem('cartData')
    throw redirect('/buy/cart?success=1')
}

async function placeOrder(products, userId, address, orderId, paymentMode, totalPrice, email) {
    const date = new Date()
    const ordersCollectionRef = collection(db, 'Orders')
    const orderData = {
        products: products, timeStamp: date, address: address, status: 'placed', email: email,
        month: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
        orderId: orderId, paymentMode: paymentMode, totalPrice: totalPrice, userId: userId
    }
    await addDoc(ordersCollectionRef, orderData)
    const userDocRef = doc(db, 'Users', userId)
    await updateDoc(userDocRef, { cart: [] })
}

export function loader() {
    const checkKey = localStorage.getItem('cartData')
    if (!checkKey) throw redirect('/buy/cart')
    else return defer({
        totalPrice: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid),
            staleTime: Infinity, gcTime: Infinity
        })).then(res => queryClient.fetchQuery({
            queryKey: ['cartItems'], queryFn: () => {
                return Promise.all(res.cart.map((item, idx) => product(item.productId).then(resThis => {
                    return { ...resThis, quantity: item.quantity, idx: idx }
                })))
            }, staleTime: Infinity, gcTime: Infinity
        })).then(res => {
            let subtotal = 0
            let totalWeight = 0
            res.forEach(item => {
                subtotal += (item.price * item.quantity)
                totalWeight += (item.weight * item.quantity / 1000)
            })
            const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)
            const deliveryInc = Number(process.env.REACT_APP_DELIVERY_FEES_INCREMENT)
            const totalDelivery = delivery + ((Math.ceil(totalWeight) - 1) * deliveryInc)
            const promotion = Number(process.env.REACT_APP_DISCOUNT_AMOUNT)
            return subtotal + totalDelivery - promotion
        }), cartData: JSON.parse(checkKey)
    })
}

export default function CartPayment() {

    const { totalPrice, cartData } = useLoaderData()

    return <Payment price={totalPrice} orderId={cartData.orderId} priceInfo='/buy/cart'
        submitting='Ordering...' submit='Place Order' />
}
