import React from 'react'
import HeroLogo from '../../Illustrations/HeroLogo'
import './HomeHero.css'

export default function HomeHero() {
    return (
        <div className='home-hero'>
            <div className='hero-logo-div'>
                <HeroLogo />
            </div>
            <div className='scroll' />
        </div>
    )
}
