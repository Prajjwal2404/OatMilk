import React, { useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { IoChevronForward, IoMenu, IoCalendar } from 'react-icons/io5'
import { RiShoppingBag3Fill } from "react-icons/ri"
import { IoMdCart } from "react-icons/io"
import { BsPersonFill } from "react-icons/bs"
import { PiPackageFill, PiAddressBookFill } from "react-icons/pi"
import useMedia from '../Utils/Media'
import Footer from '../Footer/Footer'
import './Buy.css'

export default function Buy() {

    const isMobile = useMedia('screen and (max-width: 650px)')

    const ref = useRef()

    return (
        <div className='buy-container'>
            <nav className="buy-nav" ref={ref}>
                <NavItems title='Products' path='/buy' end={true} icon={<RiShoppingBag3Fill className='item-icon' />} />
                <NavItems title='Subscriptions' path='subscriptions' icon={<IoCalendar className='item-icon' />} />
                <NavItems title='Cart' path='cart' icon={<IoMdCart className='item-icon' />} classname='cart' cartitems={0} />
                {isMobile ? <NavItems title='More' path='account' icon={<IoMenu className='item-icon' />} /> :
                    <div className='account-div'>
                        <NavItems title='Addresses' path='account/addresses' icon={<PiAddressBookFill className='item-icon' />} classname='addresses' />
                        <NavItems title='Orders' path='account/orders' icon={<PiPackageFill className='item-icon' />} classname='orders' />
                        <NavItems title='Account' path='account' end={true} icon={<BsPersonFill className='item-icon' />} />
                    </div>}
            </nav>
            <div className='buy-outlet'>
                <div className='outlet-wrapper'>
                    <Outlet context={{ ref }} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

function NavItems({ title, path, icon, classname, end, cartitems }) {
    return (
        <NavLink to={path} end={end} className={({ isActive }) => isActive ? `active ${classname}` : classname} data-cartitems={cartitems}>
            <div>
                {icon}
                <h5>{title}</h5>
                <IoChevronForward className='chevron-icon' />
            </div>
        </NavLink>
    )
}