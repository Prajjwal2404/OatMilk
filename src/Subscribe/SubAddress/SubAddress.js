import React from 'react'
import { defer, redirect, useLoaderData } from 'react-router-dom'
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite'
import { db, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Address from '../../Components/Address/Address'

export async function action({ request, params }) {

    const formData = await request.formData()
    const intent = formData.get('intent')

    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser()
    }).then(res => res.uid)

    const orderId = JSON.parse(sessionStorage.getItem('subscriptionData'))?.orderId ||
        `OBN${(Date.now() + Math.floor(Math.random() * 90 + 10)).toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`

    const timeStamp = new Date().getTime()

    const data = { orderId: orderId, userId: userId, productId: params.id, timeStamp: timeStamp }

    if (intent === 'new') {
        const address = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), city: formData.get('city'),
            district: formData.get('district'), title: formData.get('title')
        }
        if (formData.get('save')) {
            const userDocRef = doc(db, 'Users', userId)
            await updateDoc(userDocRef, { addresses: arrayUnion(address) })
            await queryClient.invalidateQueries({ queryKey: ['userData'] })
        }
        const proceed = await checkSubscription(params, userId)
        if (proceed) {
            const finalData = { ...data, address: address }
            sessionStorage.setItem('subscriptionData', JSON.stringify(finalData))
        }
        else {
            const finalData = { ...data, isSubscribed: true }
            sessionStorage.setItem('subscriptionData', JSON.stringify(finalData))
        }
    }

    else if (intent === 'saved') {
        const address = JSON.parse(formData.get('saved-add'))
        const proceed = await checkSubscription(params, userId)
        if (proceed) {
            const finalData = { ...data, address: address }
            sessionStorage.setItem('subscriptionData', JSON.stringify(finalData))
        }
        else {
            const finalData = { ...data, isSubscribed: true }
            sessionStorage.setItem('subscriptionData', JSON.stringify(finalData))
        }
    }

    const type = new URL(request.url).searchParams.get('type') || 'weekly'
    const quantity = new URL(request.url).searchParams.get('quantity') || 2
    throw redirect(`/buy/details/${params.id}/subscribe/payment?type=${type}&quantity=${quantity}`)
}

async function checkSubscription(params, userId) {
    const subscription = await queryClient.fetchQuery({
        queryKey: ['subscribed', { page: params.id }],
        queryFn: () => {
            const subscriptionsCollectionRef = collection(db, 'Subscriptions')
            const subscriptionsDocsRef = query(subscriptionsCollectionRef, where('userId', '==', userId), where('productId', '==', params.id))
            return getDocs(subscriptionsDocsRef)
        }
    })
    if (!subscription.empty) return false
    else return true
}

export function loader() {
    return defer({
        dataSet: queryClient.fetchQuery({ queryKey: ['currentuser'], queryFn: () => CurrentUser() }).then(res => queryClient.fetchQuery({ queryKey: ['userData'], queryFn: () => user(res.uid) }))
    })
}

export default function SubAddress() {

    const { dataSet } = useLoaderData()

    return <Address dataSet={dataSet} />
}
