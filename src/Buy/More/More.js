import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BsPersonFill } from "react-icons/bs"
import { PiPackageFill, PiAddressBookFill } from "react-icons/pi"
import useMedia from '../../Utils/Media'
import './More.css'

export default function More() {

    const isMobile = useMedia('screen and (max-width: 650px)')

    return (
        <>
            {isMobile && <nav className='more-nav'>
                <NavItems title='Account' path='/buy/account' icon={<BsPersonFill className='more-item-icon' />} end={true} />
                <NavItems title='Orders' path='orders' icon={<PiPackageFill className='more-item-icon' />} />
                <NavItems title='Addresses' path='addresses' icon={<PiAddressBookFill className='more-item-icon' />} />
            </nav>}
            <Outlet />
        </>
    )
}

function NavItems({ title, path, icon, end }) {
    return (
        <NavLink to={path} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
            <div>
                {icon}
                <p>{title}</p>
            </div>
        </NavLink>
    )
}
