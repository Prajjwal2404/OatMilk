import React from 'react'
import mission from '../../Img/mission.webp'
import vision from '../../Img/vision.webp'
import nushnJayLogo from '../../Img/nushnjay-logo.webp'
import './AboutIntro.css'

export default function AboutIntro() {
    return (
        <>
            <div className='about-intro-container'>
                <div className='about-intro-wrapper'>
                    <div className='about-intro'>
                        <img src={mission} />
                        <div className='about-mission'>
                            <h1>Our Mission</h1>
                            <p>At Oats by Nush, we are dedicated to pioneering
                                premium plant-based alternatives, centered around
                                Oats, all while staying true to our environmental
                                sustainability ambitions. Our mission is to redefine
                                excellence by creating top-quality nourishing oatbased
                                products, responsibly sourced and sustainably
                                produced. With a focus on premium ingredients and
                                eco-friendly practices, we aim to provide consumers
                                with guilt-free indulgences that not only satisfies but
                                also supports our planet and promotes better health.
                                Through innovation, integrity, and a steadfast
                                commitment to sustainability, we strive to ignite
                                positive change, cultivating a healthier, happier world
                                for generations to come.</p>
                        </div>
                    </div>
                    <div className='about-intro'>
                        <div className='about-mission'>
                            <h1>Our Vision</h1>
                            <p>At Oats by Nush, we envision a future where everyone
                                can indulge in delicious, nutritious, guilt-free plantbased
                                products without compromising taste or
                                quality. Our vision transcends consumer satisfaction
                                to include promoting optimal well-being, nurturing our
                                planet, and inspiring positive global change. By
                                prioritizing premium quality and sustainability in all
                                aspects of our operations, we aim to foster a better
                                world where both people and the planet thrive.</p>
                        </div>
                        <img src={vision} />
                    </div>
                </div>
            </div>
            <div className='nushnjay-logo-container'>
                <div className='nushnjay-logo-wrapper'>
                    <img src={nushnJayLogo} alt='Nush and Jay holdings logo' />
                    <h1>A subsidiary of<br />Nush and Jay Holdings</h1>
                </div>
            </div>
        </>
    )
}
