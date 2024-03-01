import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import './NotFoundPage.css'

export default function NotFound() {

    const { pathname } = useLocation()

    return (
        <>
            <div className='notfound-div'>
                <h1>Sorry, the page you were looking for was not found.</h1>
                <Link to={'/'}>Return to Home</Link>
            </div>
            {pathname.includes('/buy') && <Footer />}
        </>
    )
}