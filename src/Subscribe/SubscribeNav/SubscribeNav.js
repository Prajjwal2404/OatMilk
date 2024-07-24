import React, { useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Outlet, useParams, useSearchParams, Link } from 'react-router-dom'
import { queryClient } from '../../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../../Utils/HandleUser'
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5"
import './SubscribeNav.css'

export async function loader({ request, params }) {
    await RequireAuth(request, true)
    const checkKey = sessionStorage.getItem('subscriptionData')
    if (checkKey) {
        const userId = await queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => res.uid)
        const keyData = JSON.parse(checkKey)
        const currentTime = new Date().getTime()
        const expireTime = keyData.timeStamp + 600000
        if (keyData.productId !== params.id || keyData.userId !== userId || currentTime > expireTime) {
            sessionStorage.removeItem('subscriptionData')
            queryClient.removeQueries({ queryKey: 'subDiscount' })
        }
    }
    return null
}

export default function SubscribeNav() {

    const stateData = queryClient.getQueryData('subDiscount')
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const [discount, setDiscount] = useState(0)

    useLayoutEffect(() => { if (stateData) setDiscount(stateData) }, [])
    useEffect(() => { queryClient.setQueryData('subDiscount', discount) }, [discount])

    if (searchParams.get('success') === '1') {
        return (
            <div className='placed-container'>
                <IoCheckmarkCircle className='placed-icon' />
                <h2>Subscribed Successfully</h2>
                <Link to={'/buy/subscriptions'} className='add-btn'>Go to Subscriptions</Link>
            </div>
        )
    }

    const searchData = `?type=${searchParams.get('type') || 'weekly'}&quantity=${searchParams.get('quantity') || 2}`

    return (
        <div className='subscribe-container'>
            <div className='subscribe-nav-div'>
                <Link to={`/buy/details/${id}`} className="subscribe-back-icon"><IoArrowBack /></Link>
                <nav>
                    <NavLink to={`/buy/details/${id}/subscribe${searchData}`} end
                        className={({ isActive }) => isActive ? 'active' : ''}>Checkout
                    </NavLink>
                    <hr color='#000' />
                    <NavLink to={`address${searchData}`} className={({ isActive }) => isActive ? 'active' : ''}>
                        Address
                    </NavLink>
                    <hr color='#000' />
                    <NavLink to={`payment${searchData}`} className={({ isActive }) => isActive ? 'active' : ''}>
                        Payment
                    </NavLink>
                </nav>
            </div>
            <Outlet context={{ searchData, discount, setDiscount }} />
        </div>
    )
}
