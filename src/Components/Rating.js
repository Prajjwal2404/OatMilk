import React from 'react'
import { AiFillStar, AiOutlineStar } from "react-icons/ai"

export default function Rating({ rating, className }) {
    let starRating = []
    for (let i = 0; i < 5; i++) {
        rating > 0 ? starRating.push(<AiFillStar className={className} key={i} />) : starRating.push(<AiOutlineStar className={className} key={i} />)
        rating--
    }

    return (
        <>
            {starRating}
        </>
    )
}