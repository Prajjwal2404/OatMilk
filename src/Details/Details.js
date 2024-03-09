import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { product } from '../Db/FirebaseConfig'
import Loading from '../Components/Loading/Loading'
import ImgSlider from './ImgSlider/ImgSlider'
import Rating from '../Components/Rating'
import Quantity from '../Components/Quantity/Quantity'
import DropDown from '../Components/DropDown/DropDown'
import { IoArrowBack } from "react-icons/io5"
import { BsCartFill, BsForwardFill } from 'react-icons/bs'
import { RxQuestionMarkCircled } from "react-icons/rx"
import useMedia from '../Utils/Media'
import './Details.css'

export function loader({ params }) {
    return defer({ product: product(params.id) })
}

export default function Details() {

    const dataSetPromise = useLoaderData()

    const outlet = useOutletContext()

    const hide = useMedia('screen and (max-width: 1150px) and (min-width: 650px)')

    useEffect(() => {
        if (hide) outlet.ref.current.classList.add('hide')
        else outlet.ref.current?.classList.remove('hide')
        return () => outlet.ref.current?.classList.remove('hide')
    }, [hide])

    const navigate = useNavigate()

    const { id } = useParams()

    const [quantity, setQuantity] = useState(1)

    const [size, setSize] = useState(null)

    useEffect(() => {
        async function switchSize() {
            const productID = (await dataSetPromise.product).productids[size]
            if (productID != id) navigate(`/buy/details/${productID}`)
        }
        if (size) switchSize()
    }, [size])

    const [subscribe, setSubscribe] = useState(false)

    function handleSubscribe() {
        setSubscribe(!subscribe)
    }

    const [frequency, setFrequency] = useState('Weekly')

    const frequencies = ['Weekly', 'Monthly']

    function content(dataSetLoaded) {

        async function proceed() {
            navigate(`/buy/details/${id}/subscribe?type=${frequency.toLowerCase()}&quantity=${quantity}`)
        }

        return (
            <div className='details-container'>
                {hide && <div className="buy-back-icon" onClick={() => navigate(-1)}><IoArrowBack /></div>}
                <ImgSlider imgArr={dataSetLoaded.img} />
                <div className="details-content-container">
                    <h1>{dataSetLoaded?.title}</h1>
                    <div className="review-rating-div">
                        <div className='rating-div'><Rating rating={dataSetLoaded?.rating} className='details-rating' /></div>
                        <p>({dataSetLoaded?.review}&nbsp;review{dataSetLoaded?.review < 2 ? '' : 's'})</p>
                    </div>
                    <h2>रू&nbsp;{dataSetLoaded?.price}.00&nbsp;&nbsp;<span>incl.&nbsp;taxes</span></h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat asperiores quam quod quidem minima nisi blanditiis vitae nesciunt, soluta, reiciendis rerum aliquid, saepe quo quibusdam?</p>
                    <div className="quantity-size">
                        <Quantity quantity={quantity} setQuantity={setQuantity} />
                        <div className="size-container">
                            <p>Size</p>
                            <DropDown items={dataSetLoaded.sizes} selected={size} setSelected={setSize} name='size' />
                        </div>
                    </div>
                    <div className="subscribe-div">
                        <label>
                            <input type='checkbox' name='subscribe' checked={subscribe} onChange={handleSubscribe} />
                            <p>Subscribe</p>
                        </label>
                        {subscribe && <div className='frequency-div'>
                            <DropDown items={frequencies} selected={frequency} setSelected={setFrequency} name='frequency' />
                            <RxQuestionMarkCircled className='info-icon' />
                            <p>Weekly:&nbsp;&nbsp;Get selected quantity delivered every 7 days<br />Monthly:&nbsp;&nbsp;Get selected quantity delivered every 30 days</p>
                        </div>}
                        <p>Never run out of product. Cancel anytime.</p>
                    </div>
                    {subscribe ? <button type='button' onClick={proceed}>Proceed to Checkout
                        <BsForwardFill size='1.25rem' /></button> :
                        <button type='button'><BsCartFill />Add to Cart</button>}
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.product}>
                {content}
            </Await>
        </Suspense>
    )
}