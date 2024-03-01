import React from 'react'
import Logo from '../../Illustrations/Logo'
import Questionmark from '../../Illustrations/Questionmark'
import './FAQHero.css'

export default function FAQHero() {
    return (
        <div className='faq-hero-container'>
            <div className='faq-img-wrapper'>
                <div className='faq-logo'><Logo hero={true} /></div>
                <div className='question-mark'><Questionmark /></div>
            </div>
            <div className='scroll' />
        </div>
    )
}
