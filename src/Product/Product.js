import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import nushoat from '../Img/nushoat.webp'
import Packaging from '../Illustrations/Packaging'
import Message from '../Message/Message'
import useMedia from '../Utils/Media'
import './Product.css'

export default function Product() {

    const ref = useRef()

    const [container, setContainer] = useState({ height: 0, width: 0 })

    useLayoutEffect(() => {
        setContainer({ height: ref.current.offsetHeight, width: ref.current.offsetWidth })
        function containerSize() {
            setContainer({ height: ref.current.offsetHeight, width: ref.current.offsetWidth })
        }
        window.addEventListener('resize', containerSize)
        return () => window.removeEventListener('resize', containerSize)
    }, [])

    const isMobile = container.width <= 650

    const isTablet = useMedia("screen and (max-width: 750px)")

    const endOffset = isMobile ? 3.475 : isTablet ? 3.31 : 3.6

    const scrollEnd = container.height - (container.height / endOffset)

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

    const labelX = useTransform(scrollYProgress, isTablet ? [0.07, 0.33, 0.405, 0.665, 0.74, 1] : [0, 0.25, 0.35, 0.6, 0.7, 0.95], [-10, -585, -585, -1175, -1175, -1760])

    const bottleX = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.6, 0.7, 0.95], [0, (container.width * -0.4 - 144), (container.width * -0.4 - 144), (container.width * -0.015), (container.width * -0.015), (container.width * -0.4 - 144)])

    const bottleY = useTransform(scrollYProgress, isMobile ? [0.04, 1] : isTablet ? [0.07, 1] : [0, 0.95], [0, scrollEnd])

    const infoY = useTransform(scrollYProgress, [0.33, 1], [0, container.height * 0.5025])

    const infoLeft = useTransform(scrollYProgress, [0.405, 0.665, 0.74, 1], [0, -100, -100, -200])

    const variantH = { initial: { x: window.innerWidth * -1 }, animate: { x: isTablet ? 0 : "-3rem" } }

    const variantB = { initial: { x: window.innerWidth }, animate: { x: 0 } }

    return (
        <>
            <div className='product-container' ref={ref}>
                <div className='product-hero'>
                    <motion.h1
                        variants={variantH}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.25 }}>
                        As good as{isTablet ? ' ' : <br />}it gets.
                    </motion.h1>
                    <motion.div
                        variants={variantB}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.25 }}>
                        <motion.div className='nushoat-div' key={isTablet}
                            style={{ x: isTablet ? 0 : bottleX, y: bottleY }}>
                            <img src={nushoat} alt='oatmilk' />
                            <div className="label-div">
                                <Packaging labelX={labelX} />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="product-info-container">
                    <div className="oatmilk-bottle-div" />
                    <motion.div className="info-div" key={isTablet} style={{ y: isTablet ? infoY : 0 }}>
                        {!isTablet && <><h1>Boring, but important!</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p></>}
                        {isTablet && <>
                            <motion.div className="info-wrapper wrapper-first" style={{ '--margin-value': infoLeft }}>
                                <h1>Boring, but important!</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p>
                            </motion.div>
                            <div className="info-wrapper">
                                <h1>We are Transparent</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p>
                            </div>
                            <div className="info-wrapper">
                                <h1>FREE</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p>
                            </div>
                        </>}
                    </motion.div>
                </div>
                <div className="product-info-container">
                    {!isTablet && <><div className="info-div">
                        <h1>We are Transparent</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p>
                    </div>
                        <div className="oatmilk-bottle-div" /></>}
                </div>
                <div className="product-info-container">
                    {!isTablet && <><div className="oatmilk-bottle-div" />
                        <div className="info-div">
                            <h1>FREE</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id neque nemo veniam provident voluptas voluptatem ipsa eligendi, ratione, rerum debitis molestiae fuga ab consequuntur! Dolorum ullam molestiae officia voluptate, iste animi sit odio, magnam, nemo vitae tenetur nostrum perferendis? Nesciunt a eaque quidem pariatur.</p>
                        </div></>}
                </div>
            </div>
            <Message />
        </>
    )
}
