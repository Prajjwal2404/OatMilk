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
                    initial={{ scale: 0, originX: 0, originY: "100%" }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.75 }}>
                    <Logo />
                </motion.div>
                <motion.div className='about-hero-welcome'
                    initial={{ scale: 2.5, top: '50%', y: '-50%', right: '50%', x: '80%' }}
                    animate={{ scale: 1, top: '-2.5%', y: 0, right: 0, x: 0 }}
                    transition={{ type: "spring", delay: 0.75 }}>
                    <Welcome />
                </motion.div>
            </div>
            <div className='scroll' />
        </div>
    )
}
