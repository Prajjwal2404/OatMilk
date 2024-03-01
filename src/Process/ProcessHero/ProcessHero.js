import React, { useLayoutEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import Logo from '../../Illustrations/Logo'
import milk from '../../Img/milk.svg'
import Pour from '../../Illustrations/Pour'
import './ProcessHero.css'

export default function ProcessHero() {

    const ref = useRef()
    const controls = useAnimationControls()

    useLayoutEffect(() => {
        function checkImage() {
            if (ref.current.complete) {
                controls.start({ height: '44%' })
                clearInterval(interval)
            }
        }
        const interval = setInterval(checkImage, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='process-hero'>
            <div className="process-img">
                <motion.img
                    className='filled-logo'
                    ref={ref}
                    src={milk}
                    alt='milk'
                    initial={{ height: '14%' }}
                    animate={controls}
                    transition={{ duration: 2, delay: 0.1 }}
                />
                <Logo hero={true} />
                <div className='pouring-bottle'><Pour /></div>
            </div>
            <div className="scroll" />
        </div>
    )
}
