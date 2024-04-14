import React, { Suspense, useEffect, useState } from 'react'
import { Await, Form, Link, defer, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { auth, queryClient } from '../Db/FirebaseConfig'
import { getRedirectResult } from 'firebase/auth'
import handleAuth, { handleRedirect } from '../Utils/HandleAuth'
import { CurrentUser } from '../Utils/HandleUser'
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { FcGoogle } from "react-icons/fc"
import Loading from '../Components/Loading/Loading'
import useMedia from '../Utils/Media'
import './Login.css'

export async function action({ request }) {
    const formData = await request.formData()
    try {
        const result = await handleAuth(formData)
        if (result.redirect) {
            await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
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

export function loader({ request }) {
    return defer({
        result: Promise.all([getRedirectResult(auth).then(res => { if (res) return handleResult(request); return null })
            .catch(err => {
                if (err.code === 'auth/credential-already-in-use') {
                    return { signup: 'Google account already registered' }
                }
                else {
                    console.error(err)
                    alert(err.message)
                }
            }), CurrentUser()
        ])
    })
}

async function handleResult(request) {
    const result = await handleRedirect()
    if (result.redirect) {
        await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
        const pathname = new URL(request.url).searchParams.get('redirectTo') || '/buy'
        const type = new URL(request.url).searchParams.get('type')
        if (type) {
            const quantity = new URL(request.url).searchParams.get('quantity')
            return { redirect: `${pathname}?type=${type}&quantity=${quantity}` }
        }
        else return { redirect: pathname }
    }
    return { redirect: false }
}

export default function Login() {

    const { result } = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={result}>
                {(resultResolved) => <Content resultResolved={resultResolved} />}
            </Await>
        </Suspense>
    )
}

function Content({ resultResolved }) {

    useEffect(() => {
        if (resultResolved[0]?.redirect) navigate(resultResolved[0].redirect, { replace: true })
        else if (resultResolved[1] && !resultResolved[1].isAnonymous) navigate('/buy', { replace: true })
    }, [])

    const { state, formData } = useNavigation()
    const navigate = useNavigate()

    const actionData = useActionData()
    const login = actionData?.login
    const register = actionData?.register
    const signup = actionData?.signup || resultResolved[0]?.signup
    const reset = actionData?.reset
    const success = actionData?.success

    const [passShow, setPassShow] = useState(false)
    const [registration, setRegistration] = useState(resultResolved[1]?.isAnonymous)
    const [resetPass, setResetPass] = useState(false)

    function registrationToggle() {
        setRegistration(!registration)
        setPassShow(false)
    }

    function resetPassToggle() {
        setResetPass(!resetPass)
        setPassShow(false)
    }

    function hideShow() {
        setPassShow(!passShow)
    }

    const isMobile = useMedia("screen and (max-width: 650px)")
    const signupValue = isMobile ? 'signupMobile' : 'signupDesktop'
    const signinValue = isMobile ? 'signinMobile' : 'signinDesktop'

    return resultResolved[1] && !resultResolved[1].isAnonymous ? (<></>) :
        (<div className="login-container">
            <div className={`wrapper${registration ? ' registration' : ''}${resetPass ? ' reset-pass' : ''}`}>
                <div className="form-box register">
                    <Form className={state === 'submitting' ? 'disable' : ''} method='post' replace preventScrollReset>
                        <h2>Registration</h2>
                        {register && state === 'idle' && <h4>{register}</h4>}
                        <label className='input-box'>
                            <IoPersonOutline className="icon" />
                            <input type="text" name="regUser" autoComplete='name' placeholder='Username' required />
                        </label>
                        <label className="input-box">
                            <IoMailOutline className="icon" />
                            <input type="email" name="regMail" autoComplete='email' placeholder='Email' required />
                        </label>
                        <label className="input-box">
                            <IoLockClosedOutline className="icon" />
                            {passShow ? <IoEyeOffOutline className='pass-icon' onClick={hideShow} /> :
                                <IoEyeOutline className='pass-icon' onClick={hideShow} />}
                            <input type={passShow ? "text" : "password"} name="regPass" autoComplete='new-password'
                                placeholder='Password' minLength={8} required />
                        </label>
                        <label className="terms-of-service">
                            <input type="checkbox" name="agree" required />
                            <p>I agree to <Link to='/terms'>Terms of Service</Link> and <Link to='/privacy'>Privacy Policy</Link></p>
                        </label>
                        <button type="submit" className="auth-btn" name='intent' value='register'>
                            {state === 'submitting' && formData.get('intent') === 'register' ? 'Registering...' : 'Register'}
                        </button>
                    </Form>
                    <p className='or-login'>- Or Sign up Using -</p>
                    <Form method='post' replace preventScrollReset>
                        <button disabled={state === 'submitting'} type='submit' className="google-btn"
                            name='intent' value={signupValue}>
                            <FcGoogle />
                            {state === 'submitting' && formData.get('intent') === signupValue ? 'Signing...' : 'Google'}
                        </button>
                        {signup && state === 'idle' && <h4>{signup}</h4>}
                    </Form>
                    <div className="login-register">
                        <p>Already have an account ? <a className="login-link" onClick={registrationToggle}>Login</a></p>
                    </div>
                </div>
                <div className="form-box">
                    <Form className={state === 'submitting' ? 'disable' : ''} method='post' replace preventScrollReset>
                        <h2>Login</h2>
                        {login && state === 'idle' && <h4>{login}</h4>}
                        <label className='input-box'>
                            <IoMailOutline className="icon" />
                            <input type="email" name="logMail" autoComplete='email' placeholder='Email' required />
                        </label>
                        <label className='input-box'>
                            <IoLockClosedOutline className="icon" />
                            {passShow ? <IoEyeOffOutline className='pass-icon' onClick={hideShow} /> :
                                <IoEyeOutline className='pass-icon' onClick={hideShow} />}
                            <input type={passShow ? "text" : "password"} name="logPass" autoComplete='current-password'
                                placeholder='Password' minLength={8} required />
                        </label>
                        <div className="remember-forgot">
                            <label><input type="checkbox" name="remember" />Remember me</label>
                            <a className="forgot-link" onClick={resetPassToggle}>Forgot Password</a>
                        </div>
                        <button type="submit" className="auth-btn" name='intent' value='login'>
                            {state === 'submitting' && formData.get('intent') === 'login' ? 'Logging in...' : 'Log in'}
                        </button>
                    </Form>
                    <p className='or-login'>- Or Sign in Using -</p>
                    <Form method='post' replace preventScrollReset>
                        <button disabled={state === 'submitting'} type='submit' className="google-btn"
                            name='intent' value={signinValue}>
                            <FcGoogle />
                            {state === 'submitting' && formData.get('intent') === signinValue ? 'Signing...' : 'Google'}
                        </button>
                    </Form>
                    <div className="login-register">
                        <p>Don't have an account ? <a className="register-link" onClick={registrationToggle}>Register</a></p>
                    </div>
                </div>
                <div className="form-box">
                    <Form className={state === 'submitting' ? 'disable' : ''} method='post' replace preventScrollReset>
                        <h2>Reset Password</h2>
                        {reset && state === 'idle' && <h4>{reset}</h4>}
                        {success && state === 'idle' && <h4 className='success'>{success}</h4>}
                        <label className="input-box">
                            <IoMailOutline className="icon" />
                            <input type="email" name="resetMail" autoComplete='email' placeholder='Email' required />
                        </label>
                        <button type="submit" className="auth-btn" name='intent' value='reset'>
                            {state === 'submitting' && formData.get('intent') === 'reset' ? 'Sending...' : 'Send'}
                        </button>
                    </Form>
                    <div className="login-register">
                        <p>Remember your password ? <a className="login-back" onClick={resetPassToggle}>Login</a></p>
                    </div>
                </div>
            </div>
        </div>)
}