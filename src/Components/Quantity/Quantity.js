import React from 'react'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { IoTrashOutline } from "react-icons/io5"
import './Quantity.css'

export default function Quantity({ quantity, setQuantity, showRemove, removeFn }) {

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
                {showRemove && quantity === 1 ?
                    <span onClick={removeFn}><IoTrashOutline /></span> :
                    <span onClick={handleMinus}><AiOutlineMinus className='quantity-icon' />
                    </span>}
                <p>{quantity}</p>
                <span onClick={handlePlus}><AiOutlinePlus className='quantity-icon' />
                </span>
            </div>
        </div>
    )
}