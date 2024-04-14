import React from 'react'
import { Link } from 'react-router-dom'
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5"
import Portfolio from '../Img/portfolio.svg'
import Logo from '../Illustrations/Logo'
import './Footer.css'

export default function Footer() {
    return (
        <div className='footer-wrapper'>
            <div className='footer-container'>
                <div className='contact'>
                    <h4>Contact Us</h4>
                    <div className='socials-div'>
                        <a href='https://www.facebook.com/profile.php?id=61558287860284&mibextid=LQQJ4d' target='_blank'
                            aria-label='facebook'><IoLogoFacebook /></a>
                        <a href='https://www.instagram.com/oatsbynush' target='_blank'
                            aria-label='instagram'><IoLogoInstagram /></a>
                        <a className='portfolio' href='https://www.prajjwalpratapshah.in' target='_blank'
                            aria-label='portfolio'>
                            <img src={Portfolio} alt='portfolio' />
                            <h6>Developer</h6>
                        </a>
                    </div>
                    <h4>Reach us at <a href='mailto:info@oatsbynush.com' target='_blank' aria-label='email'>info@oatsbynush.com</a></h4>
                </div>
                <div className='legal-stuff'>
                    <div className='legal-links'>
                        <Link to='/terms'>Terms of Service</Link>
                        <Link to='/privacy'>Privacy Policy</Link>
                        <Link to='/shipping'>Shipping Policy</Link>
                        <Link to='/returnrefund'>Return and Refund Policy</Link>
                    </div>
                    <h5>Copyright © Nush Oats Pvt. Ltd., All Rights Reserved</h5>
                </div>
                <div className='logo-div'>
                    <Logo classname='logo' />
                </div>
            </div>
        </div>
    )
}
