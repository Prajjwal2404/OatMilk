import React, { Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Await, Form, defer, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth, db, queryClient, user } from '../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Utils/HandleUser'
import Loading, { Submitting } from '../Components/Loading/Loading'
import { BiEdit } from "react-icons/bi"
import { IoCloseCircle } from "react-icons/io5"
import { RxQuestionMarkCircled } from "react-icons/rx"
import { doc, updateDoc } from 'firebase/firestore/lite'
import './Account.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser()
    }).then(res => res.uid)
    const userObj = await queryClient.fetchQuery({ queryKey: ['userData'], queryFn: () => user(userId) })
    const name = formData.get('nameInput')
    if (userObj.username !== name) {
        const userDocRef = doc(db, 'Users', userId)
        await updateDoc(userDocRef, { username: name })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
    }
    return ++actionReturn
}

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => {
            if (res.isAnonymous) return { isAnonymous: true }
            else return queryClient.fetchQuery({
                queryKey: ['userData'], queryFn: () => user(res.uid)
            })
        })
    })
}

export default function Account() {

    const dataSetPromise = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {(dataSetLoaded) => <CheckAnonymous dataSetLoaded={dataSetLoaded} />}
            </Await>
        </Suspense>
    )
}

function CheckAnonymous({ dataSetLoaded }) {
    if (dataSetLoaded.isAnonymous) return <Anonymous />
    else return <NotAnonymous dataSetLoaded={dataSetLoaded} />
}

function Anonymous() {
    const navigate = useNavigate()

    function signup() {
        navigate('/buy/login?redirectTo=/buy/account')
    }

    async function logout() {
        await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
        await queryClient.invalidateQueries({ queryKey: ['subscribed'] })
        await queryClient.invalidateQueries({ queryKey: ['subscriptionsData'] })
        await queryClient.invalidateQueries({ queryKey: ['cartItems'] })
        await queryClient.invalidateQueries({ queryKey: ['ordersData'] })
        queryClient.removeQueries({ queryKey: 'subDiscount' })
        queryClient.removeQueries({ queryKey: 'cartDiscount' })
        await signOut(auth)
        navigate('/buy')
    }

    return (
        <div className='user-info-container'>
            <h1>Account details</h1>
            <h2>Guest User</h2>
            <div className="log-sign-container">
                <button type='button' onClick={logout}>Log Out</button>
                <div className='divider' />
                <div className='sign-up-div'>
                    <button type='button' onClick={signup}>Sign Up</button>
                    <RxQuestionMarkCircled className='log-sign-info-icon' />
                    <p>Your data will remain intact</p>
                </div>
            </div>
        </div>
    )
}

function NotAnonymous({ dataSetLoaded }) {
    const [name, setName] = useState(dataSetLoaded.username)

    const actionData = useActionData()
    const navigate = useNavigate()
    const { state } = useNavigation()
    const ref = useRef()

    const [editName, setEditName] = useState(false)

    function nameChange() {
        flushSync(() => setEditName(true))
        ref.current.classList.add('edit')
        ref.current.focus()
    }

    function nameChanged() {
        setEditName(false)
        setName(dataSetLoaded.username)
        ref.current.classList.remove('edit')
    }

    useEffect(() => {
        if (actionData) {
            setEditName(false)
            ref.current.classList.remove('edit')
        }
    }, [actionData])

    async function logout() {
        await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
        await queryClient.invalidateQueries({ queryKey: ['subscribed'] })
        await queryClient.invalidateQueries({ queryKey: ['subscriptionsData'] })
        await queryClient.invalidateQueries({ queryKey: ['cartItems'] })
        await queryClient.invalidateQueries({ queryKey: ['ordersData'] })
        queryClient.removeQueries({ queryKey: 'subDiscount' })
        queryClient.removeQueries({ queryKey: 'cartDiscount' })
        await signOut(auth)
        navigate('/buy')
    }

    return (
        <div className='user-info-container'>
            <h1>Account details</h1>
            <Form method='post' className={state === 'submitting' ? 'user-info-div disable' : 'user-info-div'}
                replace preventScrollReset>
                <h3>Full name</h3>
                <div className='user-input-div'>
                    <input type='text' name='nameInput' value={name} readOnly />
                    <p contentEditable={editName} ref={ref} onBlur={el => setName(el.target.textContent)}
                        suppressContentEditableWarning>{name}</p>
                    {editName ? <><button type='submit'>{state === 'submitting' ? <>Updating<Submitting /></> : 'Update'}
                    </button><IoCloseCircle className='edit-close-icon' onClick={nameChanged} /></> :
                        <BiEdit className='user-edit-icon' onClick={nameChange} />}
                </div>
            </Form>
            <div className='user-info-div'>
                <h3>Email address</h3>
                <p>{dataSetLoaded.email}</p>
            </div>
            <button type='button' onClick={logout}>Log Out</button>
        </div>
    )
}