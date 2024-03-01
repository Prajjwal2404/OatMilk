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
    const yOat = useTransform(scrollYProgress, [(0.26 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.81 - yOffset)], [(2 * rem), ((isDesktop ? 41.5 : 43.5) * rem), ((isDesktop ? 41.5 : 43.5) * rem), ((isDesktop ? 73.65 : 80.75) * rem)])
    const scaleOat = useTransform(scrollYProgress, [(0.26 - yOffset), (0.53 - yOffset), (0.56 - yOffset), (0.81 - yOffset)], [1, 0.45, 0.45, 0.16])
    const opacityBottle = useTransform(scrollYProgress, [(0.38 - yOffset), (0.53 - yOffset)], [0, 1])
    const xBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [((isDesktop ? 2 : 0) * rem), ((isDesktop ? 4 : 1.85) * rem)])
    const yBottle = useTransform(scrollYProgress, [(0.56 - yOffset), (0.81 - yOffset)], [(2 * rem), ((isDesktop ? 35 : 39.75) * rem)])
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
                    <h1>What is Oat?</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis, repellat assumenda. Consectetur fugit ea eveniet quae neque. Maxime aut ipsam id ut earum? Recusandae eum culpa officiis eius voluptate ratione ab excepturi deserunt optio minima voluptatem nulla, magni beatae aliquam nemo dolorem, voluptatibus inventore dolorum facere atque at quasi vitae. Adipisci nisi nesciunt doloremque eos pariatur nobis. Magni sequi quod maxime cupiditate debitis saepe dolorem alias similique, necessitatibus reiciendis cumque voluptatum, distinctio ad qui id placeat fuga eveniet, aspernatur amet.</p>
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
                    <h1>What is OatMilk?</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure voluptatibus, laborum vitae modi, placeat fuga asperiores ab magni expedita harum, eius facilis sunt aliquid enim. Repellendus impedit nostrum numquam alias temporibus. Ducimus quia hic assumenda possimus delectus ex vero odio aliquam accusantium dignissimos eaque, officiis voluptate laboriosam praesentium expedita placeat, cupiditate quod temporibus ullam molestias quis? Maxime tempora magni iusto sunt, ad quasi assumenda ea, cumque laborum neque veritatis harum vitae sequi impedit. Commodi quaerat animi voluptatibus, nihil labore.</p>
                </motion.div>
            </div>
            <div className="intros-div">
                <div className="person-div">
                    <Person />
                </div>
                <motion.div
                    className="about-div"
                    style={{ opacity: opacityAboutWhyOatMilk, x: xAboutWhyOatMilk }}>
                    <h1>Why OatMilk?</h1>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci beatae quae culpa optio deserunt sint, molestias placeat deleniti eius modi eos harum repudiandae obcaecati nisi voluptate ipsa quis quo cupiditate illo! Aliquam deleniti, modi doloribus, magni vel labore corporis quibusdam sit voluptatum numquam tenetur! Laboriosam eos illum sint officia adipisci veritatis ratione vel officiis sit temporibus, sequi tempore laborum nesciunt natus alias animi enim? Laudantium minus quae pariatur ipsum aspernatur fugit veniam, earum facilis? Libero porro sed nobis perferendis vero.</p>
                </motion.div>
            </div>
        </div>
    )
}
