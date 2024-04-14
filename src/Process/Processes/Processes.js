import React, { useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import Milling from '../../Illustrations/Milling'
import Milled from '../../Illustrations/Milled'
import Tap from '../../Illustrations/Tap'
import Container from '../../Illustrations/Container'
import Beaker from '../../Illustrations/Beaker'
import OatFilter from '../../Illustrations/OatFilter'
import Salt from '../../Illustrations/Salt'
import Oil from '../../Illustrations/Oil'
import Bonfire from '../../Illustrations/Bonfire'
import Filling from '../../Illustrations/Filling'
import useRem from '../../Utils/Rem'
import './Processes.css'

export default function Processes() {

    const rem = useRem({ mobileRem: 17.29 })
    const ref = useRef()

    const width = window.innerWidth
    const isDesktop = width > 650 ? true : false


    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

    const milledY = useTransform(scrollYProgress, [0.12, 0.24, 0.25, 0.37], [((isDesktop ? -5 : -3.25) * rem), (33 * rem), (33 * rem), ((isDesktop ? 72 : 70) * rem)])
    const milledOpacity = useTransform(scrollYProgress, [0.25, 0.37], [1, 0])
    const containerX = useTransform(scrollYProgress, [0.38, 0.5], [((isDesktop ? -5 : -3.25) * rem), ((isDesktop ? -11 : -7.15) * rem)])
    const containerY = useTransform(scrollYProgress, [0.25, 0.37, 0.38, 0.5], [0, ((isDesktop ? 39 : 37) * rem), ((isDesktop ? 39 : 37) * rem), ((isDesktop ? 73 : 70.15) * rem)])
    const containerFill = useTransform(scrollYProgress, [0.25, 0.37], ['#3dbcc56e', '#000'])
    const containerScale = useTransform(scrollYProgress, [0.38, 0.5], [1, 0.5])
    const beakerX = useTransform(scrollYProgress, [0.3, 0.37], [(-10 * rem), 0])
    const beakerOpacity = useTransform(scrollYProgress, [0.3, 0.37], [0, 1])
    const filteredX = useTransform(scrollYProgress, [0.51, 0.63], [0, ((isDesktop ? -6 : -3.89) * rem)])
    const filteredY = useTransform(scrollYProgress, [0.51, 0.63, 0.64, 0.76, 0.77, 0.89], [0, ((isDesktop ? 40 : 37) * rem), ((isDesktop ? 40 : 37) * rem), ((isDesktop ? 73 : 70) * rem), ((isDesktop ? 73 : 70) * rem), ((isDesktop ? 111.8 : 106.7) * rem)])
    const filteredScale = useTransform(scrollYProgress, [0.51, 0.63, 0.64, 0.76, 0.77, 0.89], [1, 2, 2, 1.15, 1.15, 1.8])
    const filteredFill = useTransform(scrollYProgress, [0.64, 0.76, 0.77, 0.89], ['#fafafa00', '#fafafa', '#fafafa', '#fafafa00'])
    const saltX = useTransform(scrollYProgress, [0.56, 0.63], [(-10 * rem), 0])
    const saltOpacity = useTransform(scrollYProgress, [0.56, 0.63], [0, 1])
    const oilX = useTransform(scrollYProgress, [0.56, 0.63], [(10 * rem), 0])
    const oilOpacity = useTransform(scrollYProgress, [0.56, 0.63], [0, 1])
    const bonfireScale = useTransform(scrollYProgress, [0.77, (isDesktop ? 0.80 : 0.794)], [1, 0])


    function AboutOpacity(yStart, yEnter, yExit, yEnd) {
        return useTransform(scrollYProgress, [yStart, yEnter, yExit, yEnd], [0, 1, 1, 0])
    }

    function AboutX(yStart, yEnter, yExit, yEnd) {
        return useTransform(scrollYProgress, [yStart, yEnter, yExit, yEnd], [(10 * rem), ((width > 900 ? 3 : 0) * rem), ((width > 900 ? 3 : 0) * rem), ((isDesktop ? 10 : -10) * rem)])
    }

    const millingOpacity = AboutOpacity(0.01, 0.11, 0.12, 0.22)
    const millingX = AboutX(0.01, 0.11, 0.12, 0.22)
    const waterOpacity = AboutOpacity(0.14, 0.24, 0.25, 0.35)
    const waterX = AboutX(0.14, 0.24, 0.25, 0.35)
    const enzymeOpacity = AboutOpacity(0.27, 0.37, 0.38, 0.48)
    const enzymeX = AboutX(0.27, 0.37, 0.38, 0.48)
    const filtrationOpacity = AboutOpacity(0.40, 0.50, 0.51, 0.61)
    const filtrationX = AboutX(0.40, 0.50, 0.51, 0.61)
    const ingredientsOpacity = AboutOpacity(0.53, 0.63, 0.64, 0.74)
    const ingredientsX = AboutX(0.53, 0.63, 0.64, 0.74)
    const heatingOpacity = AboutOpacity(0.66, 0.76, 0.77, 0.87)
    const heatingX = AboutX(0.66, 0.76, 0.77, 0.87)
    const bottlingOpacity = AboutOpacity(0.79, 0.89, 1, 1.1)
    const bottlingX = AboutX(0.79, 0.89, 1, 1.1)

    return (
        <>
            <div className='processes-container' ref={ref}>
                <div className="processes-div">
                    <div className="process-img-div">
                        <div className='milling'>
                            <Milling />
                        </div>
                        <motion.div
                            className='milled'
                            style={{ y: milledY, x: '-50%', opacity: milledOpacity }}>
                            <Milled />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: millingX, opacity: millingOpacity }}>
                        <h1>Milling</h1>
                        <p>It all begins as trucks laden with the finest oat kernels, meticulously cleaned, peeled, and dried, arrive at our factory gates. Now, the milling magic begins!</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <div className="tap">
                            <Tap />
                        </div>
                        <motion.div
                            className="container"
                            style={{ y: containerY, x: containerX, scale: containerScale }}>
                            <Container liquid={containerFill} bubbles='#00000000' />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: waterX, opacity: waterOpacity }}>
                        <h1>Mixing Water</h1>
                        <p>In this stage, milled oats are blended with water, forming a smooth, creamy mixture akin to porridge. This essential step ensures the oats are perfectly liquefied to help create the beloved drink we all love.</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <motion.div
                            className="beaker"
                            style={{ x: beakerX, opacity: beakerOpacity, rotate: -60, rotateX: 180 }}>
                            <Beaker />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: enzymeX, opacity: enzymeOpacity }}>
                        <h1>Enzyming</h1>
                        <p> Afterward, the blend of oat and water undergoes enzymatic treatment in our specialized tank, where the real magic unfolds. Natural enzymes work their wonders, breaking down oat starch into 'simpler' sugars, giving the product a natural sweetness.</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <div className="filter">
                            <OatFilter />
                        </div>
                        <motion.div
                            className="filtered"
                            style={{ x: filteredX, y: filteredY, scale: filteredScale }}>
                            <Container liquid='#f3e3c6' bubbles={filteredFill} />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: filtrationX, opacity: filtrationOpacity }}>
                        <h1>Filtration</h1>
                        <p>Next, in our filtration tank, we expertly separate out any insoluble bits, ensuring that only the pure, wholesome goodness remains alongside our filtered oat base.</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <motion.div
                            className="salt"
                            style={{ x: saltX, opacity: saltOpacity }}>
                            <Salt />
                        </motion.div>
                        <motion.div
                            className="oil"
                            style={{ x: oilX, opacity: oilOpacity, rotate: -150 }}>
                            <Oil />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: ingredientsX, opacity: ingredientsOpacity }}>
                        <h1>Ingredients</h1>
                        <p>Now, we enhance the oat base with essential ingredients including vitamins and minerals, ensuring a perfectly balanced nutritional profile as we transform it into creamy oat milk.</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <motion.div
                            className="bonfire"
                            style={{ x: '-50%', scale: bonfireScale, originY: 1 }}>
                            <Bonfire />
                        </motion.div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: heatingX, opacity: heatingOpacity }}>
                        <h1>Heat Treatment</h1>
                        <p>We use pasteurization to extend the shelf life of our oat milk before packaging. To ensure proper mixing and consistency, we pass the oat milk through a homogenizer. Occasionally, our product might separate, which is why our bottles remind you to 'shake well!' before enjoying.</p>
                    </motion.div>
                </div>
                <div className="processes-div">
                    <div className="process-img-div">
                        <div className="filling">
                            <Filling />
                        </div>
                    </div>
                    <motion.div
                        className="process-about-div"
                        style={{ x: bottlingX, opacity: bottlingOpacity }}>
                        <h1>Bottling</h1>
                        <p>Our oat milk is then bottled into beautiful, recyclable and reusable glass bottles, ready to be sent to you as soon as possible for you to enjoy!</p>
                    </motion.div>
                </div>
            </div>
            <div className="final-product">
                <img src='https://firebasestorage.googleapis.com/v0/b/nush-oats.appspot.com/o/Product-Images%2Foatmilk%2Foatmilk500mlfront.webp?alt=media&token=f96a7442-066d-4eec-ab67-d0fef6b6624e' alt="OatMilk" />
                <h1>And it's all worth it!</h1>
            </div>
        </>
    )
}
