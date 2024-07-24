import React from 'react'
import { Link, defer, redirect, useLoaderData, useOutletContext, useParams } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore/lite'
import { db, product, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import { PiWarningCircleFill } from 'react-icons/pi'
import Payment from '../../Components/Payment/Payment'
import Email from '../../Utils/Email'
import './SubPayment.css'

export async function action({ request, params }) {
    const formData = await request.formData()
    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser()
    }).then(res => res.uid)
    const userData = await queryClient.fetchQuery({
        queryKey: ['userData'], queryFn: () => user(userId)
    })
    const quantity = Number(new URL(request.url).searchParams.get('quantity')) || 2
    const type = new URL(request.url).searchParams.get('type') || 'weekly'
    const products = await queryClient.fetchQuery({
        queryKey: [params.id], queryFn: () => product(params.id)
    }).then(res => ([{
        productId: res.id, productImg: res.img[0], title: res.title,
        size: res.sizes[0], price: res.price, quantity: quantity
    }]))
    const subscribeData = JSON.parse(sessionStorage.getItem('subscriptionData'))
    const address = subscribeData.address
    const orderId = subscribeData.orderId
    const paymentMode = formData.get('payment')
    const totalPrice = Number(formData.get('total'))
    await placeSubscription(products, type, userId, address, orderId, paymentMode, totalPrice, userData.email)
    await Email(userData.email, userData.username, orderId, products, totalPrice, address, paymentMode)
    await queryClient.invalidateQueries({ queryKey: ['subscriptionsData'] })
    await queryClient.invalidateQueries({ queryKey: ['ordersData'] })
    await queryClient.invalidateQueries({ queryKey: ['subscribed', { page: products[0].productId }] })
    sessionStorage.removeItem('subscriptionData')
    throw redirect(`/buy/details/${params.id}/subscribe?success=1`)
}

async function placeSubscription(products, type, userId, address, orderId, paymentMode, totalPrice, email) {
    const date = new Date()
    const subscriptionsCollectionRef = collection(db, 'Subscriptions')
    const subscriptionData = {
        userId: userId, productId: products[0].productId,
        quantity: products[0].quantity, type: type, startDate: date, address: address
    }
    await addDoc(subscriptionsCollectionRef, subscriptionData)
    const ordersCollectionRef = collection(db, 'Orders')
    const orderData = {
        products: products, timeStamp: date, address: address, status: 'placed', email: email,
        month: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
        orderId: orderId, paymentMode: paymentMode, totalPrice: totalPrice, userId: userId
    }
    await addDoc(ordersCollectionRef, orderData)
}

export function loader({ request, params }) {
    const checkKey = sessionStorage.getItem('subscriptionData')
    const quantity = new URL(request.url).searchParams.get('quantity') || 2
    if (!checkKey) {
        const type = new URL(request.url).searchParams.get('type') || 'weekly'
        throw redirect(`/buy/details/${params.id}/subscribe?type=${type}&quantity=${quantity}`)
    }
    else return defer({
        price: queryClient.fetchQuery({
            queryKey: [params.id], queryFn: () => product(params.id)
        }).then(res => {
            if (!res) return null
            return res.price * Number(quantity)
        }), subscriptionData: JSON.parse(checkKey)
    })
}

export default function SubPayment() {

    const { price, subscriptionData } = useLoaderData()

    const { searchData, discount } = useOutletContext()

    const { id } = useParams()

    const priceInfo = `/buy/details/${id}/subscribe${searchData}`

    return subscriptionData.isSubscribed ?
        <div className='placed-container'>
            <PiWarningCircleFill className='already-placed-icon' />
            <h2>Already Subscribed</h2>
            <Link to={'/buy/subscriptions'} className='add-btn'>Go to Subscriptions</Link>
        </div> : <Payment price={price} discount={discount} orderId={subscriptionData.orderId}
            priceInfo={priceInfo} submitting='Subscribing' submit='Subscribe' />
}
