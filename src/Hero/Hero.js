import React from 'react'
import Logo from '../Illustrations/Logo'
import Mountains from '../Illustrations/Mountains'
import './Hero.css'

export default function Hero() {
    return (
        <div className='hero'>
            <div className='logo-div'>
                <Logo />
            </div>
            <div className='scroll' />
            <div className='mountains'>
                <Mountains />
            </div>
        </div>
    )
}
