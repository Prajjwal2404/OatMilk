import React from 'react'
import environment from '../../Img/environment.webp'
import leaf1 from '../../Img/leaf1.webp'
import leaf2 from '../../Img/leaf2.webp'
import './EnvironmentHero.css'

export default function EnvironmentHero() {
    return (
        <div className='environment-hero-container'>
            <div className="environment-img-div">
                <img className='hero' src={environment} alt='hero' />
                <img className='leaf1' src={leaf1} alt='leaf1' />
                <img className='leaf2' src={leaf2} alt='leaf3' />
            </div>
            <div className="scroll env-scroll" />
        </div>
    )
}
