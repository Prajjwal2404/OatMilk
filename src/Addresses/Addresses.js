import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, defer, useActionData, useLoaderData, useNavigation } from 'react-router-dom'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore/lite'
import { db, user, queryClient } from '../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Utils/HandleUser'
import { AiFillPlusCircle } from 'react-icons/ai'
import { IoClose, IoLocationSharp } from 'react-icons/io5'
import { AutoFill } from '../Components/Address/Address'
import Loading, { Submitting } from '../Components/Loading/Loading'
import DropDown from '../Components/DropDown/DropDown'
import Dialog from '../Components/Dialog/Dialog'
import './Addresses.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const intent = formData.get('intent')

    const currentuser = await queryClient.fetchQuery({ queryKey: ['currentuser'], queryFn: () => CurrentUser() })
    const userId = currentuser.uid

    const userDocRef = doc(db, 'Users', userId)
    if (intent === 'new') {
        let address = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), city: formData.get('city'),
            district: formData.get('district'), title: formData.get('title')
        }
        if (currentuser.isAnonymous) address = { ...address, email: formData.get('email') }
        await updateDoc(userDocRef, { addresses: arrayUnion(address) })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
    }
    else if (intent === 'update') {
        let addressArr = await queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(userId)
        }).then(res => res.addresses)
        let address = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), city: formData.get('city'),
            district: formData.get('district'), title: formData.get('title')
        }
        if (currentuser.isAnonymous) address = { ...address, email: formData.get('email') }
        if (JSON.stringify(addressArr[Number(formData.get('idx'))]) !== JSON.stringify(address)) {
            addressArr[Number(formData.get('idx'))] = address
            await updateDoc(userDocRef, { addresses: addressArr })
            await queryClient.invalidateQueries({ queryKey: ['userData'] })
        }
    }
    else if (intent === 'delete') {
        await updateDoc(userDocRef, { addresses: arrayRemove(JSON.parse(formData.get('id'))) })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
    }
    return ++actionReturn
}

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid),
        }).then(resThis => {
            if (res.isAnonymous) return { isAnonymous: true, ...resThis }
            else return resThis
        }))
    })
}

export default function Addresses() {

    const { dataSet } = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSet}>
                {dataSetLoaded => <Content addressDataLoaded={dataSetLoaded.addresses}
                    isAnonymous={dataSetLoaded.isAnonymous} />}
            </Await>
        </Suspense>
    )

}

function Content({ addressDataLoaded, isAnonymous }) {

    const ref = useRef([])
    const deleteRef = useRef()
    const { state, formData } = useNavigation()
    const [addIdx, setAddIdx] = useState(-1)
    const [location, setLocation] = useState(false)
    const [anonymous, setAnonymous] = useState(false)
    const actionData = useActionData()

    useEffect(() => {
        if (isAnonymous) setAnonymous(true)
    }, [])

    useEffect(() => {
        if (actionData) {
            closeAddress()
            deleteRef.current.classList.remove('show')
        }
    }, [actionData])

    const districts = JSON.parse(process.env.REACT_APP_DISTRICTS)
    const [district, setDistrict] = useState(districts[0])

    const titles = ['Mr', 'Ms', 'Mrs']
    const [title, setTitle] = useState('Mr')

    function addAddress() {
        setAddIdx(-1)
        ref.current.forEach((el, idx) => {
            if (idx > 0) el.value = ''
        })
        setDistrict(districts[0])
        setTitle(titles[0])
        ref.current[0].classList.add('show')
    }

    function editAddress(idx) {
        setAddIdx(idx)
        const editAdd = addressDataLoaded[idx]
        ref.current.forEach((el, idx) => {
            switch (idx) {
                case 1:
                    el.value = editAdd.street
                    break
                case 2:
                    el.value = editAdd.city
                    break
                case 3:
                    el.value = editAdd.fullName
                    break
                case 4:
                    el.value = editAdd.phone
                    break
                case 5:
                    el.value = editAdd.email
                    break
            }
        })
        setDistrict(editAdd.district)
        setTitle(editAdd.title)
        ref.current[0].classList.add('show')
    }

    function closeAddress() {
        ref.current[0].classList.remove('show')
    }

    function deleteAdd() {
        deleteRef.current.classList.add('show')
    }

    const addressesCardArr = addressDataLoaded.map((item, idx) =>
        <AddressesCard
            key={idx}
            title={item.title}
            fullName={item.fullName}
            email={isAnonymous ? item.email : null}
            phone={item.phone}
            street={item.street}
            city={item.city}
            district={item.district}
            idx={idx}
            edit={editAddress} />
    ).toReversed()

    return (
        <>
            <div className='adds-card-container'>
                <h1>Saved addresses</h1>
                <div className='add-new' onClick={addAddress}><AiFillPlusCircle /></div>
                {addressesCardArr.length > 0 ? addressesCardArr : <h2>No Saved Address</h2>}
            </div>
            <div className='dialog-wrapper'>
                <div className='adds-form-container' ref={el => ref.current[0] = el}>
                    <span className='adds-close' onClick={closeAddress}><IoClose /></span>
                    <Form className={`add-form ${state === 'submitting' ? 'disable' : ''}`} method='post'
                        replace preventScrollReset>
                        <button type='button' className='autofill adds' disabled={location}
                            onClick={() => AutoFill(ref, setLocation, setDistrict)}><IoLocationSharp />
                            {location ? 'Getting location...' : 'Autofill using current location'}
                        </button>
                        <input type='number' name='idx' value={addIdx} readOnly />
                        <div className='fullName-div'>
                            <input type='text' name='title' value={title} readOnly />
                            <DropDown items={titles} selected={title} setSelected={setTitle} classname='small' />
                            <input type="text" required name="fullName" autoComplete='name' placeholder='Name'
                                ref={el => ref.current[3] = el} />
                        </div>
                        {anonymous && <input type='email' required name='email' autoComplete='email'
                            placeholder='Email Address' ref={el => ref.current[5] = el} />}
                        <input type="number" required name="phone" autoComplete='tel' placeholder='Phone Number'
                            ref={el => ref.current[4] = el} />
                        <textarea required name="street" autoComplete='street-address'
                            placeholder='Area, Street, House no.' ref={el => ref.current[1] = el} />
                        <div className='state-city-div'>
                            <input type="text" className='small' required name="city" autoComplete='address-level3'
                                placeholder='Locality' ref={el => ref.current[2] = el} />
                            <input type='text' name='district' value={district} readOnly />
                            <DropDown items={districts} selected={district} setSelected={setDistrict} classname='small' />
                        </div>
                        {addIdx < 0 ? <button type="submit" className="add-btn" name='intent' value='new'>
                            {state === 'submitting' ? <>Saving<Submitting /></> : 'Save Address'}
                        </button> : <div className='delete-update-div'>
                            <button type="button" className="add-btn small delete" onClick={deleteAdd}>Delete</button>
                            <button type="submit" className="add-btn small" name='intent' value='update'>
                                {state === 'submitting' && formData?.get('intent') === 'update' ? <>Updating<Submitting /></> : 'Update'}
                            </button>
                        </div>}
                    </Form>
                </div>
            </div>
            <Dialog refEl={deleteRef} closeRef={deleteRef.current} title='Delete Address?' submiting='Deleting'
                value={JSON.stringify(addressDataLoaded[addIdx]) || ''} intent='delete' />
        </>
    )
}

function AddressesCard({ title, fullName, email, phone, street, city, district, idx, edit }) {
    return (
        <div className='adds-card-div' onClick={() => edit(idx)}>
            <h4>{title}. {fullName}</h4>
            <p>{street}</p>
            <p>{city}, {district}</p>
            <p>Phone number: {phone}</p>
            {email && <p>Email: {email}</p>}
        </div>
    )
}