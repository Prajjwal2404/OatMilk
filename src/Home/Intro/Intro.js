import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Oat from '../../Illustrations/Oat'
import Bottle from '../../Illustrations/Bottle'
import Person from '../../Illustrations/Person'
import useRem from '../../Utils/Rem'
import './Intro.css'

export default function Intro() {

    const rem = useRem({ mobileRem: 18.85 })
    const ref = useRef()

    const width = window.innerWidth
    const yOffset = width > 650 ? 0 : 0.035
    const isDesktop = width > 650 ? true : false


    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

    const xOat = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [((isDesktop ? 2 : 0) * rem), ((isDesktop ? 4.25 : 2) * rem)])
    const yOat = useTransform(scrollYProgress, [(0.26 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.81 - yOffset)], [((isDesktop ? 2 : 4) * rem), ((isDesktop ? 41.5 : 46) * rem), ((isDesktop ? 41.5 : 46) * rem), ((isDesktop ? 73.65 : 85.55) * rem)])
    const scaleOat = useTransform(scrollYProgress, [(0.26 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.81 - yOffset)], [1, 0.45, 0.45, 0.16])
    const opacityBottle = useTransform(scrollYProgress, [(0.38 - yOffset), (0.53 - yOffset)], [0, 1])
    const xBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [((isDesktop ? 2 : 0) * rem), ((isDesktop ? 4 : 1.85) * rem)])
    const yBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [(2 * rem), ((isDesktop ? 35 : 42.15) * rem)])
    const scaleBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [1, 0.3])
    const rotateBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [0, -115])

    function AboutOpacity(yStart, yEnter, yExit, yEnd) {
        return useTransform(scrollYProgress, [yStart, yEnter, yExit, yEnd], [0, 1, 1, 0])
    }

    function AboutX(yStart, yEnter, yExit, yEnd) {
        return useTransform(scrollYProgress, [yStart, yEnter, yExit, yEnd], [(10 * rem), ((width > 900 ? 3 : 0) * rem), ((width > 900 ? 3 : 0) * rem), ((isDesktop ? 10 : -10) * rem)])
    }

    const opacityAboutOat = AboutOpacity((0.03 - yOffset), (0.23 - yOffset), (0.26 - yOffset), (0.46 - yOffset))
    const xAboutOat = AboutX((0.03 - yOffset), (0.23 - yOffset), (0.26 - yOffset), (0.46 - yOffset))
    const opacityAboutOatMilk = AboutOpacity((0.33 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.76 - yOffset))
    const xAboutOatMilk = AboutX((0.33 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.76 - yOffset))
    const opacityAboutWhyOatMilk = AboutOpacity((0.63 - yOffset), (0.81 - yOffset), 1, 1.1)
    const xAboutWhyOatMilk = AboutX((0.63 - yOffset), (0.81 - yOffset), 1, 1.1)

    return (
        <>
            <div className='intro-title-div'>
                <h1>The preferred choice</h1>
                <p>Quality being an uncompromising commitment, Oats by Nush products are meticulously crafted using only the highest-grade oats, ensuring premium quality, promoting better health and a greener planet.</p>
            </div>
            <div className='intro-container' ref={ref}>
                <div className='intros-div'>
                    <motion.div
                        className='oat-div'
                        style={{ x: xOat, y: yOat, scale: scaleOat, rotate: rotateBottle }}>
                        <Oat />
                    </motion.div>
                    <motion.div
                        className='about-div'
                        style={{ opacity: opacityAboutOat, x: xAboutOat }}>
                        <h1>Huh? Oats?</h1>
                        <p>A nutritional powerhouse packed with fiber, vitamins, minerals, and antioxidants, Oats support weight management, digestive health, promote satiety, regulate blood sugar levels, and promote overall well being. Incorporating Oats into your diet can provide sustained energy, lower cholesterol, and reduce the risk of chronic diseases. With their versatility and health benefits, oats are an essential addition to a balanced diet.</p>
                    </motion.div>
                </div>
                <div className='intros-div'>
                    <motion.div
                        className='bottle-div'
                        style={{ opacity: opacityBottle, x: xBottle, y: yBottle, scale: scaleBottle, rotate: rotateBottle }}>
                        <Bottle />
                    </motion.div>
                    <motion.div
                        className='about-div'
                        style={{ opacity: opacityAboutOatMilk, x: xAboutOatMilk }}>
                        <h1>Wait... Oat M<span><Bottle /></span>lk?</h1>
                        <p>A plant-based dairy alternative, Oat Milk is crafted from oats and water, offers a lusciously creamy texture complemented by a delicate, natural sweetness. A popular choice among those seeking dairy-free options, Oat Milk is fortified with essential nutrients like Calcium and Vitamin D. Naturally lactose-free, cholesterol-free, and low in saturated fat, Oat Milk is also versatile making it suitable for use in coffee, cereal, smoothies, baking, cooking, and much more, offering a nutritious and better alternative to traditional dairy milk.</p>
                    </motion.div>
                </div>
                <div className="intros-div">
                    <div className="person-div">
                        <Person />
                    </div>
                    <motion.div
                        className="about-div"
                        style={{ opacity: opacityAboutWhyOatMilk, x: xAboutWhyOatMilk }}>
                        <h1>But Why? Why Oat M<span><Bottle /></span>lk?</h1>
                        <p>Oat milk, the queen of all alternative milks, is cherished for its rich, creamy texture, and subtly sweet flavor. But it's not just about taste; Oat Milk is also a nutritional powerhouse, rich in essential vitamins, minerals, and antioxidants. Oat Milk is also set apart by its versatility and sustainability. Oats require very minimal water and land compared to other milk alternatives, making Oat Milk a more eco-friendly choice. Whether you're lactose intolerant, vegan, or simply seeking a healthier option, Oat Milk offers a delicious and planet-friendly alternative for all.</p>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
