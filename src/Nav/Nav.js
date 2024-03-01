import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Link, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { IoMenu, IoClose } from "react-icons/io5"
import Logo from '../Illustrations/Logo'
import Footer from '../Footer/Footer'
import useMedia from '../Utils/Media'
import './Nav.css'

export default function Nav() {

    const isMobile = useMedia('screen and (max-width: 650px)')
    const [switcher, setSwitcher] = useState(false)
    const ref = useRef([])

    useEffect(() => {
        function checkMenu(event) {
            if (!ref.current[0].contains(event.target) && switcher) menuSwitch()
        }
        if (isMobile) window.addEventListener('click', checkMenu)
        else window.removeEventListener('click', checkMenu)
        return () => window.removeEventListener('click', checkMenu)
    }, [isMobile, switcher])

    function menuSwitch() {
        setSwitcher(!switcher)
        ref.current[1].classList.toggle('open')
    }

    const { pathname } = useLocation()

    return (
        <>
            <div className='wrapper-nav'>
                <nav className='navigation'>
                    <Link to='/' className='logo-link' aria-label='home'><Logo /></Link>
                    {isMobile && <span className='menu-span' onClick={menuSwitch} ref={el => ref.current[0] = el}>
                        {switcher ? <IoClose className='menu-icon' /> : <IoMenu className='menu-icon' />}</span>}
                    <div className="pages" ref={el => ref.current[1] = el}>
                        <NavLink to='/' className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                        <NavLink to='product' className={({ isActive }) => isActive ? 'active' : ''}>Product</NavLink>
                        <NavLink to='process' className={({ isActive }) => isActive ? 'active' : ''}>Process</NavLink>
                        <NavLink to='environment' className={({ isActive }) => isActive ? 'env-active' : ''}>Environment</NavLink>
                        <NavLink to='faq' className={({ isActive }) => isActive ? 'active' : ''}>FAQ</NavLink>
                    </div>
                    <NavLink to='buy' className={({ isActive }) => isActive ? 'active buy-btn' : 'buy-btn'}>Buy</NavLink>
                </nav>
            </div>
            <ScrollRestoration getKey={location => { return location.pathname }} />
            <Outlet />
            {!pathname.includes('/buy') && <Footer />}
        </>
    )
}
