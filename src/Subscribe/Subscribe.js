import React, { Suspense, useRef, useState } from 'react'
import { Await, Form, defer, redirect, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { IoLocationSharp, IoArrowBack } from "react-icons/io5"
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore/lite'
import { db, user } from '../Db/FirebaseConfig'
import { CurrentUser } from '../Utils/HandleUser'
import RequireAuth from '../Utils/HandleUser'
import Loading from '../Components/Loading/Loading'
import './Subscribe.css'

export async function action({ request, params }) {

    const formData = await request.formData()
    const intent = formData.get('intent')

    if (intent === 'new') {
        const address = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), city: formData.get('city'),
            pincode: formData.get('pincode'), state: formData.get('state')
        }
        if (formData.get('save')) {
            const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
            await updateDoc(userDocRef, {
                addresses: arrayUnion(address)
            })
            await placeSubscription(address, request, params)
            throw redirect('/cart?order=success')
        }
        else {
            await placeSubscription(address, request, params)
            throw redirect('/cart?order=success')
        }
    }

    else if (intent === 'saved') {
        const address = JSON.parse(formData.get('address'))
        await placeSubscription(address, request, params)
        throw redirect('/cart?order=success')
    }
}

async function placeSubscription(address, request, params) {

    const productId = params.id
    const userId = (await CurrentUser()).uid
    const userObj = await user(userId)
    const userSubscriptions = userObj.subscriptions
    const subscribed = userSubscriptions.filter(item => item.productId === productId)

    if (subscribed.length === 0) {
        const quantity = new URL(request.url).searchParams.get('quantity') || '1'
        const type = new URL(request.url).searchParams.get('type') || 'weekly'
        const date = new Date()
        const userDocRef = doc(db, 'Users', userId)
        const userSubscriptionData = {
            productId: productId, quantity: quantity,
            type: type, startDate: date, address: address
        }
        await updateDoc(userDocRef, { subscriptions: arrayUnion(userSubscriptionData) })
        const userOrderData = {
            productId: productId, quantity: quantity, timeStamp: date, address: address, status: 'placed',
            month: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
        }
        await updateDoc(userDocRef, { orders: arrayUnion(userOrderData) })
        const subscriptionsCollectionRef = collection(db, 'Subscriptions')
        const subscriptionData = { ...userSubscriptionData, userId: userId }
        await addDoc(subscriptionsCollectionRef, subscriptionData)
        const ordersCollectionRef = collection(db, 'Orders')
        const orderData = { ...userOrderData, userId: userId }
        await addDoc(ordersCollectionRef, orderData)
    }
}

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: CurrentUser().then(res => user(res.uid)) })
}

export default function Subscribe() {

    const dataSetPromise = useLoaderData()
    const navigation = useNavigation()
    const navigate = useNavigate()
    const ref = useRef([])

    const [location, setLocation] = useState(false)

    function autoFill(event) {
        setLocation(true)
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const res = await fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}`)
            const { address } = await res.json()
            ref.current[1].value = address.road && address.neighbourhood ? `${address.road} ${address.neighbourhood}` :
                address.road ? address.road : address.neighbourhood ? address.neighbourhood : ref.current[1].value
            ref.current[2].value = address.postcode ? address.postcode : ref.current[2].value
            ref.current[3].value = address.city ? address.city : ref.current[3].value
            ref.current[4].value = address.state ? address.state : ref.current[4].value
            event.target.disabled = false
            setLocation(false)
        })
    }

    function showhide() {
        ref.current[0].classList.toggle('hidden')
    }

    function content(dataSetLoaded) {

        const addressElems = dataSetLoaded.addresses.map((item, idx) =>
            <AddressCard
                key={idx}
                fullName={item.fullName}
                phone={item.phone}
                street={item.street}
                pincode={item.pincode}
                city={item.city}
                state={item.state}
                value={JSON.stringify(item)} />
        )

        if (addressElems.length === 0) ref.current[5].disabled = true

        return (
            <>
                {addressElems.length > 0 ? addressElems : <h2>No saved address</h2>}
            </>
        )
    }

    return (
        <div className='subscribe-container'>
            <div className="subscribe-back-icon" onClick={() => navigate(-1)}><IoArrowBack /></div>
            <div className='subscribe-wrapper' ref={el => ref.current[0] = el}>
                <Form className={`add-form new ${navigation.state === 'submitting' ? 'disable' : ''}`} method='post' replace>
                    <button type='button' className='autofill' onClick={autoFill} disabled={location}>
                        <IoLocationSharp />{location ? 'Getting location...' : 'Autofill using current location'}
                    </button>
                    <input type="text" required name="fullName" placeholder='Name' />
                    <input type="number" required name="phone" placeholder='Phone Number' />
                    <input type="text" required name="street" placeholder='Area, Street, House no.'
                        ref={el => ref.current[1] = el} />
                    <input type="text" required name="city" placeholder='City'
                        ref={el => ref.current[2] = el} />
                    <div className='state-city-div'>
                        <input type="text" className='small' required name="state" placeholder='State'
                            ref={el => ref.current[3] = el} />
                        <input type="number" className='small' required name="pincode" placeholder='Pincode'
                            ref={el => ref.current[4] = el} />
                    </div>
                    <div className="save-add-div">
                        <label><input type="checkbox" name="save" />Save</label>
                        <a className="saved-add" onClick={showhide}>Saved Addresses</a>
                    </div>
                    <button type="submit" className="add-btn" name='intent' value='new'>
                        {navigation.state === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </Form>
                <Form className={`add-form ${navigation.state === 'submitting' ? 'disable' : ''}`} method='post' replace>
                    <div className='add-card-container'>
                        <Suspense fallback={<Loading />}>
                            <Await resolve={dataSetPromise.dataSet}>
                                {content}
                            </Await>
                        </Suspense>
                    </div>
                    <a className='new-add' onClick={showhide}>New Address</a>
                    <button ref={el => ref.current[5] = el} type='submit' className='add-btn' name='intent' value='saved'>
                        {navigation.state === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </Form>
            </div>
        </div>
    )
}

function AddressCard({ fullName, phone, street, pincode, city, state, value }) {

    return (
        <label>
            <input type='radio' name='address' value={value} />
            <h4>{fullName}</h4>
            <p>{street}</p>
            <p>{city}, {state} {pincode}</p>
            <p>Phone number: {phone}</p>
        </label>
    )
}