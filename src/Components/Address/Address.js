import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, useNavigation } from 'react-router-dom'
import { Loader } from '@googlemaps/js-api-loader'
import { IoLocationSharp } from 'react-icons/io5'
import Loading, { Submitting } from '../Loading/Loading'
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

    const titles = ['Mr', 'Ms', 'Mrs']
    const [title, setTitle] = useState(titles[0])

    function showhide() {
        ref.current[0].classList.toggle('hidden')
    }

    return (
        <div className='subscribe-wrapper' ref={el => ref.current[0] = el}>
            <Form className={`add-form first ${state === 'submitting' ? 'disable' : ''}`} method='post'
                replace preventScrollReset>
                <button type='button' className='autofill' onClick={() => AutoFill(ref, setLocation, setDistrict)}
                    disabled={location}><IoLocationSharp />
                    {location ? <span>Getting location<Submitting /></span> : 'Autofill using current location'}
                </button>
                <div className='fullName-div'>
                    <input type='text' name='title' value={title} readOnly />
                    <DropDown items={titles} selected={title} setSelected={setTitle} classname='small' />
                    <input type="text" required name="fullName" autoComplete='name' placeholder='Name' />
                </div>
                {anonymous && <input type='email' required name='email' autoComplete='email' placeholder='Email Address' />}
                <input type="number" required name="phone" autoComplete='tel' placeholder='Phone Number' />
                <textarea required name="street" autoComplete='street-address'
                    placeholder='Area, Street, House no.' ref={el => ref.current[1] = el} />
                <div className='state-city-div'>
                    <input type="text" className='small' required name="city" autoComplete='address-level3'
                        placeholder='Locality' ref={el => ref.current[2] = el} />
                    <input type='text' name='district' value={district} readOnly />
                    <DropDown items={districts} selected={district} setSelected={setDistrict} classname='small' />
                </div>
                <div className="save-add-div">
                    <label><input type="checkbox" name="save" />Save</label>
                    <a className="saved-add" onClick={showhide}>Saved Addresses</a>
                </div>
                <button type="submit" className="add-btn" name='intent' value='new'>
                    {state === 'submitting' ? <>Proceeding<Submitting /></> : 'Proceed to Payment'}
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
                    {state === 'submitting' ? <>Proceeding<Submitting /></> : 'Proceed to Payment'}
                </button>
            </Form>
        </div>
    )
}

export function AutoFill(ref, setLocation, setDistrict) {
    setLocation(true)
    const districts = JSON.parse(process.env.REACT_APP_DISTRICTS)
    const apiKey = process.env.REACT_APP_API_KEY
    const loader = new Loader({ apiKey: apiKey, libraries: ['geocoding'], region: 'NP' })
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { Geocoder } = await loader.importLibrary('geocoding')
        const geocoder = new Geocoder()
        geocoder.geocode({ location: { lat: coords.latitude, lng: coords.longitude } }, result => {
            result[0].address_components.forEach(item => {
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
    })
}

function SavedAdd({ dataSetLoaded, setDisable, setAnonymous }) {

    const addressesArr = dataSetLoaded.addresses.toReversed()

    const addressElems = addressesArr.map((item, idx) =>
        <AddressCard
            key={idx}
            title={item.title}
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

function AddressCard({ title, fullName, email, phone, street, city, district, value }) {

    return (
        <label>
            <input type='radio' name='saved-add' value={value} required />
            <h4>{title}. {fullName}</h4>
            <p>{street}</p>
            <p>{city}, {district}</p>
            <p>Phone number: {phone}</p>
            {email && <p>Email: {email}</p>}
        </label>
    )
}