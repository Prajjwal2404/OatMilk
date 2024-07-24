import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, useActionData, useNavigation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import Loading, { Submitting } from '../../Components/Loading/Loading'
import Rating from '../../Components/Rating/Rating'
import './Review.css'

export default function Review({ reviews, sno, isVerified }) {

    const ref = useRef()
    const { state, formData } = useNavigation()
    const actionData = useActionData()
    const [rating, setRating] = useState(0)

    useEffect(() => {
        if (actionData) {
            setRating(0)
            ref.current.value = ''
        }
    }, [actionData])

    function checkVerified(event) {
        if (isVerified === 'noUser' || isVerified) ref.current.setCustomValidity('')
        else ref.current.setCustomValidity('Only verified users can add a review, complete an order flow to get verified')
        ref.current.reportValidity()
        if (!event.target.checkValidity()) event.preventDefault()
    }

    return (
        <>
            <div className='reviews-container'>
                <Suspense fallback={<Loading />}>
                    <Await resolve={reviews}>
                        {reviewsLoaded => <ReviewElems reviewArray={reviewsLoaded} />}
                    </Await>
                </Suspense>
            </div>
            <Form method='post' className={`review-submit ${state === 'submitting' ? 'disable' : ''}`} replace
                preventScrollReset onSubmit={checkVerified}>
                <div className='rating-container-div'>
                    <div className='rating-container'>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <button type='submit' name='intent' value='review'>
                        {state === 'submitting' && formData?.get('intent') === 'review' ? <>Submitting<Submitting /></> : 'Submit'}
                    </button>
                </div>
                <input type='text' name='sno' value={sno} readOnly />
                <textarea ref={ref} rows={3} placeholder='Enter your review' name='review' maxLength={250} required />
            </Form>
        </>
    )
}

function ReviewElems({ reviewArray }) {

    const [currentReviews, setCurrentReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => setCurrentPage(1), [reviewArray])

    useEffect(() => {
        if (reviewArray.length > 10) {
            const lastIndex = currentPage * 10
            const firstIndex = lastIndex - 10
            setCurrentReviews(reviewArray.slice(firstIndex, lastIndex))
        }
        else setCurrentReviews(reviewArray)
    }, [reviewArray, currentPage])

    const reviewElemsArr = currentReviews.map(review =>
        <motion.div key={review.userId} className='reviews-div'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <h4>{review.username}</h4>
            <div><Rating rating={review.rating} className='review-star' /></div>
            <p>{review.review}</p>
            <hr color='#000' />
        </motion.div>
    )

    function Pages({ totalPages }) {
        return [...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1
            return (
                <label key={pageNum}>
                    <input type='radio' name='page' value={pageNum} checked={pageNum === currentPage}
                        onChange={() => setCurrentPage(pageNum)} />
                    {pageNum}
                </label>
            )
        })
    }

    return reviewElemsArr.length > 0 ?
        <>
            <AnimatePresence mode='wait'>
                {reviewElemsArr}
            </AnimatePresence>
            {reviewArray.length > 10 && <div className='pagination-container'>
                <Pages totalPages={Math.ceil(reviewArray.length / 10)} />
            </div>}
        </> :
        <>
            <p>No Reviews</p>
            <hr />
        </>
}

function StarRating({ rating, setRating }) {

    return [...Array(5)].map((_, index) => {
        const currentRate = index + 1
        return (
            <label key={currentRate}>
                <input type='radio' name='rating' value={currentRate} checked={currentRate === rating}
                    onChange={() => setRating(currentRate)} required />
                {currentRate <= rating ? <AiFillStar className='star-rate' /> :
                    <AiOutlineStar className='star-rate' />}
            </label>
        )
    })
}
