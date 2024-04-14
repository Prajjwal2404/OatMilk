import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, useNavigation } from 'react-router-dom'
import { IoLocationSharp } from 'react-icons/io5'
import Loading from '../Loading/Loading'
import DropDown from '../DropDown/DropDown'
import './Address.css'

export default function Address({ dataSet }) {

    const ref = useRef([])
    const { state } = useNavigation()

    const [location, setLocation] = useState(false)
    const [disable, setDisable] = useState(true)
    const [anonymous, setAnonymous] = useState(false)

    const districts = JSON.parse(process.env.REACT_APP_DISTRICTS)
    const [district, setDistrict] = useState(districts[0])

    function showhide() {
        ref.current[0].classList.toggle('hidden')
    }

    return (
        <div className='subscribe-wrapper' ref={el => ref.current[0] = el}>
            <Form className={`add-form first ${state === 'submitting' ? 'disable' : ''}`} method='post'
                replace preventScrollReset>
                <button type='button' className='autofill' onClick={() => autoFill(ref, setLocation, setDistrict)}
                    disabled={location}><IoLocationSharp />
                    {location ? 'Getting location...' : 'Autofill using current location'}
                </button>
                <input type="text" required name="fullName" autoComplete='name' placeholder='Name' />
                {anonymous && <input type='email' required name='email' autoComplete='email' placeholder='Email Address' />}
                <input type="number" required name="phone" autoComplete='tel' placeholder='Phone Number' />
                <textarea required name="street" autoComplete='street-address'
                    placeholder='Area, Street, House no.' ref={el => ref.current[1] = el} />
                <div className='state-city-div'>
                    <input type="text" className='small' required name="city" autoComplete='address-level3'
                        placeholder='City' ref={el => ref.current[2] = el} />
                    <input type='text' name='district' value={district} readOnly />
                    <DropDown items={districts} selected={district} setSelected={setDistrict} classname='small' />
                </div>
                <div className="save-add-div">
                    <label><input type="checkbox" name="save" />Save</label>
                    <a className="saved-add" onClick={showhide}>Saved Addresses</a>
                </div>
                <button type="submit" className="add-btn" name='intent' value='new'>
                    {state === 'submitting' ? 'Proceeding...' : 'Proceed to Payment'}
                </button>
            </Form>
            <Form className={`add-form ${state === 'submitting' ? 'disable' : ''}`} method='post' replace preventScrollReset>
                <div className='add-card-container'>
                    <Suspense fallback={<Loading />}>
                        <Await resolve={dataSet}>
                            {(dataSetLoaded) => <SavedAdd dataSetLoaded={dataSetLoaded} setDisable={setDisable}
                                setAnonymous={setAnonymous} />}
                        </Await>
                    </Suspense>
                </div>
                <a className='new-add' onClick={showhide}>New Address</a>
                <button disabled={disable} type='submit' className='add-btn' name='intent' value='saved'>
                    {state === 'submitting' ? 'Proceeding...' : 'Proceed to Payment'}
                </button>
            </Form>
        </div>
    )
}

export function autoFill(ref, setLocation, setDistrict) {
    const districts = JSON.parse(process.env.REACT_APP_DISTRICTS)
    setLocation(true)
    const gmapAPI = 'https://maps.googleapis.com/maps/api/geocode/json?region=np'
    const filters = 'street_address|route|locality|administrative_area_level_3|administrative_area_level_2'
    const apiKey = process.env.REACT_APP_API_KEY
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const res = await fetch(`${gmapAPI}&latlng=${coords.latitude},${coords.longitude}&result_type=${filters}&key=${apiKey}`)
        const address = await res.json()
        address.results[0].address_components.forEach(item => {
            const street = item.types.includes('street_address') || item.types.includes('route') ||
                item.types.includes('locality')
            if (street) ref.current[1].value = `${ref.current[1].value} ${item.short_name} `
            const city = item.types.includes('administrative_area_level_3')
            if (city) ref.current[2].value = item.short_name
            const state = item.types.includes('administrative_area_level_2')
            if (state && districts.includes(item.short_name)) setDistrict(item.short_name)
        })
        ref.current[1].value = ref.current[1].value.trim()
        setLocation(false)
    })
}

function SavedAdd({ dataSetLoaded, setDisable, setAnonymous }) {

    const addressesArr = dataSetLoaded.addresses.toReversed()

    const addressElems = addressesArr.map((item, idx) =>
        <AddressCard
            key={idx}
            fullName={item.fullName}
            email={dataSetLoaded.isAnonymous ? item.email : null}
            phone={item.phone}
            street={item.street}
            city={item.city}
            district={item.district}
            value={JSON.stringify(item)} />
    )

    useEffect(() => {
        if (addressElems.length > 0) setDisable(false)
        if (dataSetLoaded.isAnonymous) setAnonymous(true)
    }, [])

    return addressElems.length > 0 ? addressElems : <h2>No saved address</h2>
}

function AddressCard({ fullName, email, phone, street, city, district, value }) {

    return (
        <label>
            <input type='radio' name='saved-add' value={value} required />
            <h4>{fullName}</h4>
            <p>{street}</p>
            <p>{city}, {district}</p>
            <p>Phone number: {phone}</p>
            {email && <p>Email: {email}</p>}
        </label>
    )
}