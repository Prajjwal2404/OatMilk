import React from 'react'
import earth from '../../Img/earth.webp'
import './AboutEnvironment.css'

export default function AboutEnvironment() {
    return (
        <div className='environment-intro-container'>
            <h1>Dedicated to making a difference!</h1>
            <div className='about-environment-wrapper'>
                <div className="about-environment-container">
                    <div className='about-environment-img-wrapper'><img src={earth} alt='earth' /></div>
                    <div className="about-environment-sub-container">
                        <div className="about-environment-div">
                            <h1>Our Approach</h1>
                            <p>At Oats by Nush, we are committed to nurturing a more sustainable planet through every step of our journey. Our approach revolves around three key pillars :-</p>
                        </div>
                        <div className="about-environment-div">
                            <h2>Responsible Sourcing</h2>
                            <p>We meticulously select our oat ingredients from suppliers who share our values of sustainability and ethical practices. We partner with suppliers who cultivate oats using advanced, eco friendly methods, substantially decreasing greenhouse gas emissions.</p>
                        </div>
                        <div className="about-environment-div">
                            <h2>Eco-friendly Production</h2>
                            <p>We employ innovative and eco-conscious manufacturing processes to minimize waste and reduce energy consumption. From water saving techniques to renewable energy sources, we are constantly seeking ways to minimize our environmental impact.</p>
                        </div>
                        <div className="about-environment-div">
                            <h2>Packaging Sustainability</h2>
                            <p>We're dedicated to reducing packaging waste by utilizing recyclable and biodegradable materials whenever possible. Additionally, we're exploring innovative packaging solutions, such as compostable packaging, to further minimize our environmental footprint.</p>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Through these initiatives, we're not just creating delicious oat-based products, we're also championing sustainability and paving the way towards a greener, healthier planet for generations to come.</h2>
        </div>
    )
}
