import React from 'react'
import { defer, redirect, useLoaderData, useOutletContext } from 'react-router-dom'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore/lite'
import { db, product, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Payment from '../../Components/Payment/Payment'
import Email from '../../Utils/Email'

export async function action({ request }) {
    const formData = await request.formData()
    const currentuser = await queryClient.fetchQuery({ queryKey: ['currentuser'], queryFn: () => CurrentUser() })
    const userId = currentuser.uid
    const userData = await queryClient.fetchQuery({ queryKey: ['userData'], queryFn: () => user(userId) })
    const products = await queryClient.fetchQuery({
        queryKey: ['cartItems'], queryFn: () => {
            return Promise.all(userData.cart.map((item, idx) => product(item.productId).then(resThis => {
                return { ...resThis, quantity: item.quantity, idx: idx }
            })))
        }
    }).then(res => res.map(item => ({
        productId: item.id, productImg: item.img[0], title: item.title,
        size: item.sizes[0], price: item.price, quantity: item.quantity
    })))
    const cartData = JSON.parse(sessionStorage.getItem('cartData'))
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
    sessionStorage.removeItem('cartData')
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
    const checkKey = sessionStorage.getItem('cartData')
    if (!checkKey) throw redirect('/buy/cart')
    else return defer({
        price: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid)
        })).then(res => queryClient.fetchQuery({
            queryKey: ['cartItems'], queryFn: () => {
                return Promise.all(res.cart.map((item, idx) => product(item.productId).then(resThis => {
                    return { ...resThis, quantity: item.quantity, idx: idx }
                })))
            }
        })).then(res => {
            let subtotal = 0
            res.forEach(item => {
                subtotal += (item.price * item.quantity)
            })
            return subtotal
        }), cartData: JSON.parse(checkKey)
    })
}

export default function CartPayment() {

    const { price, cartData } = useLoaderData()
    const { discount } = useOutletContext()

    return <Payment price={price} discount={discount} orderId={cartData.orderId} priceInfo='/buy/cart'
        submitting='Ordering' submit='Place Order' />
}
