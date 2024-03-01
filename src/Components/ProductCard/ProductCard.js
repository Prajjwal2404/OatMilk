import React from 'react'
import { motion } from 'framer-motion'
import { AiFillStar } from "react-icons/ai"
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard(props) {
    return (
        <motion.div layout className='product-card'>
            <Link to={`details/${props.id}`}>
                <div className="card-img"><img src={props.img} alt={props.title} /></div>
                <h3>{props.title}</h3>
                <div className="info">
                    <p>रू&nbsp;{props.price}</p>
                    <p>{props.size}</p>
                </div>
                <div className="review-rating">
                    <div className="rating">
                        <AiFillStar className='star-icon' />
                        {props.rating}
                    </div>
                    <p>{props.review}</p>
                </div>
            </Link>
        </motion.div>
    )
}
