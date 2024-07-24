import React, { useEffect, useState } from 'react'
import './Loading.css'

export default function Loading() {
    return (
        <div className='loading-container'>
            <div className='loading'></div>
        </div>
    )
}

export function Submitting() {
    const [dots, setDots] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => setDots(prevDots => (prevDots % 3) + 1), 500)
        return () => clearInterval(interval)
    }, [])

    return <span className='submitting-dots'>{'.'.repeat(dots)}{'\u00A0'.repeat(3 - dots)}</span>
}