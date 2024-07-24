import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, useNavigate, useNavigation } from 'react-router-dom'
import { IoCashOutline } from 'react-icons/io5'
import { BiLinkExternal } from "react-icons/bi"
import { PiWarningCircleFill } from "react-icons/pi"
import { MdContentCopy } from "react-icons/md"
import Loading, { Submitting } from '../Loading/Loading'
import Fonepay from '../../Img/fonepay.svg'
import './Payment.css'

export default function Payment({ price, discount, orderId, priceInfo, submitting, submit }) {

    const { state } = useNavigation()
    const [disable, setDisable] = useState(true)

    return (
        <Form className={`payment-container ${state === 'submitting' ? 'disable' : ''}`} method='post'
            replace preventScrollReset>
            <div className="payment-method-container">
                <Suspense fallback={<Loading />}>
                    <Await resolve={price}>
                        {priceLoaded => {
                            const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)
                            const promotion = priceLoaded * discount / 100
                            const totalPrice = priceLoaded + delivery - promotion
                            return <Content priceLoaded={totalPrice} orderId={orderId} priceInfo={priceInfo}
                                setDisable={setDisable} />
                        }}
                    </Await>
                </Suspense>
            </div>
            <button type='submit' className='add-btn' disabled={disable}>
                {state === 'submitting' ? <>{submitting}<Submitting /></> : submit}
            </button>
        </Form >
    )
}

function Content({ priceLoaded, orderId, priceInfo, setDisable }) {

    const ref = useRef()

    async function copyOrderId() {
        await navigator.clipboard.writeText(`Order: #${orderId}`)
        ref.current.classList.add('copied')
        setTimeout(() => ref.current?.classList.remove('copied'), 3000)
    }

    const navigate = useNavigate()

    useEffect(() => { if (priceLoaded) setDisable(false) }, [])

    return priceLoaded ? (
        <>
            <input type='number' name='total' value={priceLoaded} step={0.01} readOnly />
            <label>
                <input type='radio' name='payment' value='Cash on Delivery' required />
                <IoCashOutline className='cash-icon' />Cash on Delivery
            </label>
            <label>
                <input type='radio' name='payment' value='Online Payment' required />
                <img src={Fonepay} alt='fonepay' />
            </label>
            <div className="qr-container">
                <img src='https://firebasestorage.googleapis.com/v0/b/nush-oats.appspot.com/o/PaymentQR%2Fqrcode.jpg?alt=media&token=587cbb71-83ea-41d3-865a-8781fcf9f0d6' alt='qr-code' />
                <div className="total-price-div">
                    <p>Grand Total:&nbsp;&nbsp;<strong>रू&nbsp;{priceLoaded}.00</strong></p>
                    <BiLinkExternal title='Details' className='price-info-icon' onClick={() => navigate(priceInfo)} />
                </div>
                <p className='remarks'><PiWarningCircleFill />Please add the following in remarks -</p>
                <div className='order-id-div'>
                    <p className='orderid' ref={ref}>Order: #{orderId}</p>
                    <MdContentCopy title='copy' className='copy-icon' onClick={copyOrderId} />
                </div>
            </div>
        </>
    ) : (<h2 className='no-price-found'>No product found</h2>)
}