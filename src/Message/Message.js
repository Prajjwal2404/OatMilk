import React from 'react'
import OatDoodle from '../Illustrations/OatDoodle'
import { IoMailOutline, IoPersonOutline } from "react-icons/io5"
import { BiMessageSquareEdit } from "react-icons/bi"
import './Message.css'

export default function Message() {
    return (
        <div className='message-container'>
            <div className="doodle-div">
                <OatDoodle />
            </div>
            <form className="message-form">
                <h2>Send us a Message</h2>
                <div className='input-div'>
                    <input type='text' name='name' autoComplete='name' placeholder='Name' required />
                    <IoMailOutline className='input-icon' />
                </div>
                <div className='input-div'>
                    <input type='email' name='email' autoComplete='email' placeholder='Email' required />
                    <IoPersonOutline className='input-icon' />
                </div>
                <div className='input-div'>
                    <textarea rows={4} name='message' placeholder='Your Message' required />
                    <BiMessageSquareEdit className='input-icon' />
                </div>
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}
