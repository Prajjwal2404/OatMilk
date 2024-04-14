import React from 'react'
import { useLocation, useRouteError } from 'react-router-dom'
import Footer from '../../Footer/Footer'

export default function Error() {

    const { pathname } = useLocation()
    const error = useRouteError()
    console.error(error)

    return (
        <>
            <div className='notfound-div error-div'>
                <h1>Error: {error.message || error.data}</h1>
                <pre>{error.status || error.code} - {error.statusText}</pre>
                <button onClick={() => window.location.reload()}>Refresh Page</button>
            </div>
            {pathname.includes('/buy') && <Footer />}
        </>
    )
}