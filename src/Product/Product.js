import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import nushoat from '../Img/nushoat.webp'
import Packaging from '../Illustrations/Packaging'
import Message from '../Message/Message'
import './Product.css'

export default function Product() {

    const [container, setContainer] = useState({ height: 0, width: 0 })

    useLayoutEffect(() => {
        setContainer({ height: ref.current.offsetHeight, width: ref.current.offsetWidth })
        function containerSize() {
            setContainer({ height: ref.current.offsetHeight, width: ref.current.offsetWidth })
        }
        window.addEventListener('resize', containerSize)
        return () => window.removeEventListener('resize', containerSize)
    }, [])

    const scrollEnd = container.height - (container.height / 3.6)

    const ref = useRef()

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

    const labelX = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.6, 0.7, 0.95], [-10, -585, -585, -1175, -1175, -1760])

    const bottleX = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.6, 0.7, 0.95], [0, (container.width * -0.4 - 144), (container.width * -0.4 - 144), (container.width * -0.015), (container.width * -0.015), (container.width * -0.4 - 144)])

    const bottleY = useTransform(scrollYProgress, [0, 0.95], [0, scrollEnd])

    const variant = {
        initialH: {
            x: window.innerWidth * -1
        },
        initialB: {
            x: window.innerWidth
        },
        animateH: {
            x: "-3rem"
        },
        animateB: {
            x: 0
        }
    }

    return (
        <>
            <div className='product-container' ref={ref}>
                <div className='product-hero'>
                    <motion.h1
                        variants={variant}
                        initial="initialH"
                        animate="animateH"
                        transition={{ delay: 0.25 }}>
                        As good as<br />it gets.
                    </motion.h1>
                    <motion.div
                        variants={variant}
                        initial="initialB"
                        animate="animateB"
                        transition={{ delay: 0.25 }}>
                        <motion.div className='nushoat-div'
                            style={{ x: bottleX, y: bottleY }}>
                            <motion.img src={nushoat} alt='oatmilk' />
                            <div className="label-div">
                                <Packaging labelX={labelX} />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="product-info-container">
                    <div className="oatmilk-bottle-div" />
                    <div className="info-div">
                        <h1>Boring, but important!</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur dolorum atque odio illo, ea fugiat.</p>
                    </div>
                </div>
                <div className="product-info-container">
                    <div className="info-div">
                        <h1>We are Transparent</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur dolorum atque odio illo, ea fugiat.</p>
                    </div>
                    <div className="oatmilk-bottle-div" />
                </div>
                <div className="product-info-container">
                    <div className="oatmilk-bottle-div" />
                    <div className="info-div">
                        <h1>FREE</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur dolorum atque odio illo, ea fugiat.</p>
                    </div>
                </div>
            </div>
            <Message />
        </>
    )
}
