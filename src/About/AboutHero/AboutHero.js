import React from 'react'
import { motion } from 'framer-motion'
import Logo from '../../Illustrations/Logo'
import Welcome from '../../Illustrations/Welcome'
import './AboutHero.css'

export default function AboutHero() {
    return (
        <div className='about-hero'>
            <div className="about-hero-div">
                <motion.div className='about-hero-logo'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.25, duration: 0.5 }}>
                    <Logo />
                </motion.div>
                <motion.div className='about-hero-welcome'
                    initial={{ scale: 2.5, top: '50%', y: '-50%', right: '50%', x: '80%' }}
                    animate={{ scale: 1, top: '-2.5%', y: 0, right: 0, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}>
                    <Welcome />
                </motion.div>
            </div>
            <div className='scroll' />
        </div>
    )
}
