import React from 'react'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import './Quantity.css'

export default function Quantity({ quantity, setQuantity }) {

    function handleMinus() {
        if (quantity > 1) setQuantity(prevQuantity => prevQuantity - 1)
    }

    function handlePlus() {
        if (quantity < 12) setQuantity(prevQuantity => prevQuantity + 1)
    }

    return (
        <div className='quantity-container'>
            <p>Quantity</p>
            <div className='quantity-div'>
                <span id='minus' onClick={handleMinus}><AiOutlineMinus className='quantity-icon' />
                </span>
                <p>{quantity}</p>
                <span id='plus' onClick={handlePlus}><AiOutlinePlus className='quantity-icon' />
                </span>
            </div>
        </div>
    )
}