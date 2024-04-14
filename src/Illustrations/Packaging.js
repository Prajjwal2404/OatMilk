import React from 'react'
import { motion } from 'framer-motion'
import label from '../Img/label.webp'

export default function Packaging({ labelX }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 335" width='100%'>
            <defs>
                <clipPath id="clipLabel">
                    <path fill="none" stroke="#000" strokeMiterlimit="10"
                        d="m1.4,315.9c5.6,1.26,11.26,2.46,16.98,3.57,68.99,13.46,156.33,17.62,260.43-5.79V.5H.5l.89,314.6" />
                </clipPath>
            </defs>
            <motion.image href={label} height="100%" clipPath="url(#clipLabel)" x={labelX} />
        </svg>
    )
}
