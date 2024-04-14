import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calcium, Protien, Fiber, Vitamin } from '../Illustrations/Nutrients'
import { Vegan, Gluten, Dairy, Soy, Nut, Gmo, Flavor, Color, Sugar, Preservative } from '../Illustrations/Free'
import nushoat from '../Img/nushoat.webp'
import Packaging from '../Illustrations/Packaging'
import Message from '../Components/Message/Message'
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

    const labelX = useTransform(scrollYProgress, isTablet ? [0.07, 0.33, 0.405, 0.665, 0.74, 1] : [0, 0.25, 0.35, 0.6, 0.7, 0.95], [40, -160, -160, -360, -360, -560])

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
                        Do you, uh,{isTablet ? ' ' : <br />}Oats?
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
                            <p>With no preservatives or added sugar, we're just the right step towards healthier dairy alternative. Ingredients: Water, Oats, Canola Oil, Calcium Carbonate, Dipotassium Phosphate, Guar Gum</p>
                            <div className='nutrition-div'><Calcium /><Protien /><Fiber /><Vitamin /></div></>}
                        {isTablet && <>
                            <motion.div className="info-wrapper wrapper-first" style={{ '--margin-value': infoLeft }}>
                                <h1>Boring, but important!</h1>
                                <p>With no preservatives or added sugar, we're just the right step towards healthier dairy alternative. Ingredients: Water, Oats, Canola Oil, Calcium Carbonate, Dipotassium Phosphate, Guar Gum</p>
                                <div className='nutrition-div'><Calcium /><Protien /><Fiber /><Vitamin /></div>
                            </motion.div>
                            <div className="info-wrapper">
                                <h1>We are Transparent</h1>
                                <p>For a reason. Natural and preservative-free, our product may settle a bit, but fret not—simply give it a good shake before use.</p>
                                <p>Every bottle sold is a huge win for our planet, reflecting our unwavering commitment to sustainability. Also, no animals were harmed in the making of this product.</p>
                            </div>
                            <div className="info-wrapper">
                                <h1>The good stuff</h1>
                                <div className='free-div'>
                                    <Vegan /><Gluten /><Dairy /><Soy /><Nut />
                                    <Gmo /><Flavor /><Color /><Sugar /><Preservative />
                                </div>
                            </div>
                        </>}
                    </motion.div>
                </div>
                <div className="product-info-container">
                    {!isTablet && <><div className="info-div">
                        <h1>We are Transparent</h1>
                        <p>For a reason. Natural and preservative-free, our product may settle a bit, but fret not—simply give it a good shake before use.</p>
                        <p>Every bottle sold is a huge win for our planet, reflecting our unwavering commitment to sustainability. Also, no animals were harmed in the making of this product.</p>
                    </div>
                        <div className="oatmilk-bottle-div" /></>}
                </div>
                <div className="product-info-container">
                    {!isTablet && <><div className="oatmilk-bottle-div" />
                        <div className="info-div last">
                            <h1>The good stuff</h1>
                            <div className='free-div'>
                                <Vegan /><Gluten /><Dairy /><Soy /><Nut />
                                <Gmo /><Flavor /><Color /><Sugar /><Preservative />
                            </div>
                        </div></>}
                </div>
            </div>
            <Message />
        </>
    )
}
