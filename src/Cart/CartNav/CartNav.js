import React, { useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Outlet, useSearchParams, Link, useOutletContext } from 'react-router-dom'
import { queryClient } from '../../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../../Utils/HandleUser'
import { IoCheckmarkCircle } from "react-icons/io5"

export async function loader({ request }) {
    await RequireAuth(request)
    const checkKey = sessionStorage.getItem('cartData')
    if (checkKey) {
        const userId = await queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => res.uid)
        const keyData = JSON.parse(checkKey)
        const currentTime = new Date().getTime()
        const expireTime = keyData.timeStamp + 600000
        if (keyData.userId !== userId || currentTime > expireTime) {
            sessionStorage.removeItem('cartData')
            queryClient.removeQueries({ queryKey: 'cartDiscount' })
        }
    }
    return null
}

export default function CartNav() {

    const stateData = queryClient.getQueryData('cartDiscount')
    const { cartItems } = useOutletContext()
    const [searchParams] = useSearchParams()
    const [discount, setDiscount] = useState(0)

    useLayoutEffect(() => { if (stateData) setDiscount(stateData) }, [])
    useEffect(() => { queryClient.setQueryData('cartDiscount', discount) }, [discount])

    if (searchParams.get('success') === '1') {
        return (
            <div className='placed-container'>
                <IoCheckmarkCircle className='placed-icon' />
                <h2>Order Placed Successfully</h2>
                <Link to={'/buy/account/orders'} className='add-btn'>Go to Orders</Link>
            </div>
        )
    }

    if (cartItems === 0) {
        return (
            <div className='no-sub'>
                <h1>Cart is Empty</h1>
                <Link to='/buy'>Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className='subscribe-container'>
            <div className='subscribe-nav-div cartnav'>
                <nav>
                    <NavLink to='/buy/cart' end className={({ isActive }) => isActive ? 'active' : ''}>
                        Checkout
                    </NavLink>
                    <hr color='#000' />
                    <NavLink to='address' className={({ isActive }) => isActive ? 'active' : ''}>
                        Address
                    </NavLink>
                    <hr color='#000' />
                    <NavLink to='payment' className={({ isActive }) => isActive ? 'active' : ''}>
                        Payment
                    </NavLink>
                </nav>
            </div>
            <Outlet context={{ discount, setDiscount }} />
        </div>
    )
}