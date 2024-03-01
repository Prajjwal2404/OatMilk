import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { db } from '../Db/db'
import oatmilk from '../Img/oatmilk.png'
import ImgSlider from './ImgSlider/ImgSlider'
import Rating from '../Components/Rating'
import Quantity from '../Components/Quantity/Quantity'
import DropDown from '../Components/DropDown/DropDown'
import { IoArrowBack } from "react-icons/io5"
import { BsCartFill, BsForwardFill } from 'react-icons/bs'
import { RxQuestionMarkCircled } from "react-icons/rx"
import useMedia from '../Utils/Media'
import './Details.css'

export default function Details() {

    const { id } = useParams()

    const [data, setData] = useState(null)

    useEffect(() => {
        db.forEach(item => {
            if (item.id === Number(id)) {
                setData(item)
                return false
            }
        })
    }, [])

    const outlet = useOutletContext()

    const hide = useMedia('screen and (max-width: 1150px) and (min-width: 650px)')

    useEffect(() => {
        if (hide) outlet.ref.current.classList.add('hide')
        else outlet.ref.current?.classList.remove('hide')
        return () => outlet.ref.current?.classList.remove('hide')
    }, [hide])

    const navigate = useNavigate()

    const imgArr = [oatmilk, oatmilk, oatmilk, oatmilk, oatmilk]

    const [quantity, setQuantity] = useState(1)

    const [size, setSize] = useState('500ml')

    const sizes = ['500ml', '200ml']

    const iDs = { '500ml': 'oatmilk500ml', '200ml': 'oatmilk200ml' }

    const [subscribe, setSubscribe] = useState(false)

    function handleSubscribe() {
        setSubscribe(!subscribe)
    }

    const [frequency, setFrequency] = useState('Weekly')

    const frequencies = ['Weekly', 'Monthly']

    return (
        <div className='details-container'>
            {hide && <div className="buy-back-icon" onClick={() => navigate(-1)}><IoArrowBack /></div>}
            <ImgSlider imgArr={imgArr} />
            <div className="details-content-container">
                <h1>{data?.title}</h1>
                <div className="review-rating-div">
                    <div className='rating-div'><Rating rating={data?.rating} className='details-rating' /></div>
                    <p>({data?.review}&nbsp;review{data?.review < 2 ? '' : 's'})</p>
                </div>
                <h2>रू&nbsp;{data?.price}.00&nbsp;&nbsp;<span>incl.&nbsp;taxes</span></h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat asperiores quam quod quidem minima nisi blanditiis vitae nesciunt, soluta, reiciendis rerum aliquid, saepe quo quibusdam?</p>
                <div className="quantity-size">
                    <Quantity quantity={quantity} setQuantity={setQuantity} />
                    <div className="size-container">
                        <p>Size</p>
                        <DropDown items={sizes} selected={size} setSelected={setSize} name='size' />
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
                        <p>Weekly:&nbsp;&nbsp;Get selected quantity delivered every 1 week<br />Monthly:&nbsp;&nbsp;Get selected quantity delivered every 1 month</p>
                    </div>}
                    <p>Never run out of product. Cancel anytime.</p>
                </div>
                {subscribe ? <button type='button' onClick={() => console.log(iDs[size])}>Proceed to Checkout
                    <BsForwardFill size='1.25rem' /></button> :
                    <button type='button' onClick={() => console.log(iDs[size])}><BsCartFill />Add to Cart</button>}
            </div>
        </div>
    )
}