import React from 'react'
import earth from '../../Img/earth.webp'
import './AboutEnvironment.css'

export default function AboutEnvironment() {
    return (
        <>
            <div className='about-environment-wrapper'>
                <div className="about-environment-container">
                    <div className='about-environment-img-wrapper'><img src={earth} alt='earth' /></div>
                    <div className="about-environment-sub-container">
                        <div className="about-environment-div">
                            <h1>Less</h1>
                            <p>Oat milk uses 80% less land, produces less than one-third the greenhouse gas emissions and uses just 4% of the water required to produce one-litre of dairy milk.</p>
                        </div>
                        <div className="about-environment-div">
                            <h1>Local</h1>
                            <p>Locally produced right here in Nepal. Our oat milk doesn't have to travel tens of thousands kilometres to get you.</p>
                        </div>
                        <div className="about-environment-div">
                            <h1>Circular</h1>
                            <p>Our factory aspires to be zero-waste and we recollect and filter water where possible. In addition, we aspire to use by-products of our production process to create food & other materials.</p>
                        </div>
                        <div className="about-environment-div">
                            <h1>Glass</h1>
                            <p>When considering our packaging, we employed a systems-approach to the design process. Our packaging is not only plastic-free, it's created form 'high-value' glass which is widely collected & recycled.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="our-mission-wrapper">
                <div className="our-misson-div">
                    <h1>How can you take part in the global mission?</h1>
                    <p>By choosing us, you are creating an impact on all the pressing issues for nature. We are proud of your choice and so should be you! And if you haven't tried out the earth-friendly (and tasty as well) alternative, place an enquiry now!</p>
                    <p>We, at OatMlk, are a team of responsible global citizens who are striving to turn milk into personal moments of health and joy people, without recklessly deteriorating the planet's resources in the process.</p>
                    <p>Just drop us a line below.</p>
                </div>
            </div>
        </>
    )
}
