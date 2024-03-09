import React, { useRef, useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import HandleAuth from '../Utils/HandleAuth'
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { FcGoogle } from "react-icons/fc"
import './Login.css'

export async function action({ request }) {
    const formData = await request.formData()
    try {
        const result = await HandleAuth(formData)
        if (result.redirect) {
            const pathname = new URL(request.url).searchParams.get('redirectTo') || '/buy'
            const type = new URL(request.url).searchParams.get('type')
            if (type) {
                const quantity = new URL(request.url).searchParams.get('quantity')
                throw redirect(`${pathname}?type=${type}&quantity=${quantity}`)
            }
            else throw redirect(pathname)
        }
        else return { success: 'Password reset link sent' }
    }

    catch (err) {
        return err
    }
}

export default function Login() {

    const navigation = useNavigation()

    const ref = useRef()

    const actionData = useActionData()
    const login = actionData?.login
    const register = actionData?.register
    const reset = actionData?.reset
    const success = actionData?.success

    const [passShow, setPassShow] = useState(false)

    function registration() {
        ref.current.classList.toggle('registration')
        setPassShow(false)
    }

    function resetPass() {
        ref.current.classList.toggle('reset-pass')
        setPassShow(false)
    }

    function hideShow() {
        setPassShow(!passShow)
    }

    return (
        <div className="login-container">
            <div className="wrapper" ref={ref}>
                <div className="form-box register">
                    <Form className={navigation.state === 'submitting' ? 'disable' : ''} method='post' replace>
                        <h2>Registration</h2>
                        {register && <h4>{register}</h4>}
                        <label className='input-box'>
                            <IoPersonOutline className="icon" />
                            <input type="text" name="regUser" placeholder='Username' required />
                        </label>
                        <label className="input-box">
                            <IoMailOutline className="icon" />
                            <input type="email" name="regMail" placeholder='Email' required />
                        </label>
                        <label className="input-box">
                            <IoLockClosedOutline className="icon" />
                            {passShow ? <IoEyeOffOutline className='pass-icon' onClick={hideShow} /> :
                                <IoEyeOutline className='pass-icon' onClick={hideShow} />}
                            <input type={passShow ? "text" : "password"} name="regPass" placeholder='Password'
                                minLength={8} required />
                        </label>
                        <label className="terms-of-service">
                            <input type="checkbox" name="agree" required />
                            I agree to<a href='#'>Terms of Service</a>
                        </label>
                        <button type="submit" className="auth-btn" name='intent' value='register'>
                            {navigation.state === 'submitting' ? 'Registering...' : 'Register'}
                        </button>
                    </Form>
                    <p className='or-login'>- Or Sign in Using -</p>
                    <Form method='post' replace>
                        <button disabled={navigation.state === 'submitting'} type='submit' className="google-btn"
                            name='intent' value='signin'>
                            <FcGoogle />
                            Google
                        </button>
                    </Form>
                    <div className="login-register">
                        <p>Already have an account ? <a className="login-link" onClick={registration}>Login</a></p>
                    </div>
                </div>
                <div className="form-box">
                    <Form className={navigation.state === 'submitting' ? 'disable' : ''} method='post' replace>
                        <h2>Login</h2>
                        {login && <h4>{login}</h4>}
                        <label className='input-box'>
                            <IoMailOutline className="icon" />
                            <input type="email" name="logMail" placeholder='Email' required />
                        </label>
                        <label className='input-box'>
                            <IoLockClosedOutline className="icon" />
                            {passShow ? <IoEyeOffOutline className='pass-icon' onClick={hideShow} /> :
                                <IoEyeOutline className='pass-icon' onClick={hideShow} />}
                            <input type={passShow ? "text" : "password"} name="logPass" placeholder='Password'
                                minLength={8} required />
                        </label>
                        <div className="remember-forgot">
                            <label><input type="checkbox" name="remember" />Remember me</label>
                            <a className="forgot-link" onClick={resetPass}>Forgot Password</a>
                        </div>
                        <button type="submit" className="auth-btn" name='intent' value='login'>
                            {navigation.state === 'submitting' ? 'Logging in...' : 'Log in'}
                        </button>
                    </Form>
                    <p className='or-login'>- Or Sign in Using -</p>
                    <Form method='post' replace>
                        <button disabled={navigation.state === 'submitting'} type='submit' className="google-btn"
                            name='intent' value='signin'>
                            <FcGoogle />
                            Google
                        </button>
                    </Form>
                    <div className="login-register">
                        <p>Don't have an account ? <a className="register-link" onClick={registration}>Register</a></p>
                    </div>
                </div>
                <div className="form-box">
                    <Form className={navigation.state === 'submitting' ? 'disable' : ''} method='post' replace>
                        <h2>Reset Password</h2>
                        {reset && <h4>{reset}</h4>}
                        {success && <h4 className='success'>{success}</h4>}
                        <label className="input-box">
                            <IoMailOutline className="icon" />
                            <input type="email" name="resetMail" placeholder='Email' required />
                        </label>
                        <button type="submit" className="auth-btn" name='intent' value='reset'>
                            {navigation.state === 'submitting' ? 'Sending...' : 'Send'}
                        </button>
                    </Form>
                    <div className="login-register">
                        <p>Remember your password ? <a className="login-back" onClick={resetPass}>Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
