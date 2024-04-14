import React from 'react'
import { defer, redirect, useLoaderData } from 'react-router-dom'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore/lite'
import { db, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Address from '../../Components/Address/Address'

export async function action({ request }) {

    const formData = await request.formData()
    const intent = formData.get('intent')

    const currentuser = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser(),
        staleTime: Infinity, gcTime: Infinity
    })

    const userId = currentuser.uid

    const orderId = JSON.parse(localStorage.getItem('cartData'))?.orderId ||
        `OBN${(Date.now() + Math.floor(Math.random() * 90 + 10)).toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`

    const timeStamp = new Date().getTime()

    const data = { orderId: orderId, userId: userId, timeStamp: timeStamp }

    if (intent === 'new') {
        let address = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), city: formData.get('city'),
            district: formData.get('district')
        }
        if (currentuser.isAnonymous) address = { ...address, email: formData.get('email') }
        if (formData.get('save')) {
            const userDocRef = doc(db, 'Users', userId)
            await updateDoc(userDocRef, { addresses: arrayUnion(address) })
            await queryClient.invalidateQueries({ queryKey: ['userData'] })
        }
        const finalData = { ...data, address: address }
        localStorage.setItem('cartData', JSON.stringify(finalData))
    }

    else if (intent === 'saved') {
        const address = JSON.parse(formData.get('saved-add'))
        const finalData = { ...data, address: address }
        localStorage.setItem('cartData', JSON.stringify(finalData))
    }

    throw redirect('/buy/cart/payment')
}

export function loader() {
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid),
            staleTime: Infinity, gcTime: Infinity
        }).then(resThis => {
            if (res.isAnonymous) return { isAnonymous: true, ...resThis }
            else return resThis
        }))
    })
}

export default function CartAddress() {

    const { dataSet } = useLoaderData()

    return <Address dataSet={dataSet} />
}

