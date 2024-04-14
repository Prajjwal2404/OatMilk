import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useParams, Link, Await, defer, useLoaderData, useNavigation, Form } from 'react-router-dom'
import { Timestamp, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore/lite'
import { auth, db, product, queryClient, user } from '../Db/FirebaseConfig'
import { signInAnonymously } from 'firebase/auth'
import Loading from '../Components/Loading/Loading'
import ImgSlider from './ImgSlider/ImgSlider'
import Rating from '../Components/Rating/Rating'
import Quantity from '../Components/Quantity/Quantity'
import DropDown from '../Components/DropDown/DropDown'
import { IoArrowBack, IoPersonSharp, IoClose } from "react-icons/io5"
import { BsCartFill, BsCartCheckFill, BsForwardFill } from 'react-icons/bs'
import { RxQuestionMarkCircled } from "react-icons/rx"
import RequireAuth, { CurrentUser } from '../Utils/HandleUser'
import useMedia from '../Utils/Media'
import Review from './Review/Review'
import './Details.css'

let actionReturn = 0
export async function action({ request, params }) {
    const formData = await request.formData()
    const intent = formData.get('intent')
    if (intent === 'cart') {
        const userId = await queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(res => res.uid)
        const userDocRef = doc(db, 'Users', userId)
        await updateDoc(userDocRef, {
            cart: arrayUnion({
                productId: params.id, quantity: Number(formData.get('quantity'))
            })
        })
        await queryClient.invalidateQueries({ queryKey: ['userData'] })
        await queryClient.invalidateQueries({ queryKey: ['cartItems'] })
    }
    else if (intent === 'guest') {
        await signInAnonymously(auth)
        const currentuser = await CurrentUser()
        const userDocRef = doc(db, 'Users', currentuser.uid)
        const ttlTimestamp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const fields = {
            cart: [{ productId: params.id, quantity: Number(formData.get('quantity')) }],
            addresses: [], expiresAt: Timestamp.fromDate(ttlTimestamp)
        }
        await setDoc(userDocRef, fields)
        await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
    }
    else if (intent === 'review') {
        await RequireAuth(request, true)
        const sno = formData.get('sno')
        const rating = Number(formData.get('rating'))
        const review = formData.get('review')
        const userId = await queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(res => res.uid)
        const username = (await user(userId)).username
        const reviewDocRef = doc(db, 'Reviews', `${userId}_${sno}`)
        await setDoc(reviewDocRef, {
            userId: userId, username: username, productId: params.id,
            rating: rating, review: review, timeStamp: serverTimestamp()
        })
        await queryClient.invalidateQueries({ queryKey: ['reviews', { page: params.id }] })
        await updateAverageRating(params)
        await queryClient.invalidateQueries({ queryKey: [params.id] })
        await queryClient.invalidateQueries({ queryKey: ['productsData'] })
    }
    return ++actionReturn
}

async function updateAverageRating(params) {
    const reviewArr = await queryClient.fetchQuery({
        queryKey: ['reviews', { page: params.id }], queryFn: async () => {
            const reviewCollectionRef = collection(db, 'Reviews')
            const q = query(reviewCollectionRef, where('productId', '==', params.id))
            return getDocs(q).then(res => res.docs.map(doc => ({ ...doc.data() })).sort((a, b) =>
                b.timeStamp - a.timeStamp))
        },
        staleTime: Infinity, gcTime: Infinity
    })
    let total = 0
    reviewArr.forEach(({ rating }) => total += rating)
    const productDocRef = doc(db, 'Products', params.id)
    await updateDoc(productDocRef, { rating: Math.round(total / reviewArr.length), review: reviewArr.length })
}

export async function loader({ params }) {
    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser(),
        staleTime: Infinity, gcTime: Infinity
    }).then(res => { if (res?.uid) return res.uid; else return false })

    return defer({
        dataSet: Promise.all([
            queryClient.fetchQuery({
                queryKey: [params.id], queryFn: () => product(params.id),
                staleTime: Infinity, gcTime: Infinity
            }),
            userId ? queryClient.fetchQuery({
                queryKey: ['subscribed', { page: params.id }],
                queryFn: () => {
                    const subscriptionsCollectionRef = collection(db, 'Subscriptions')
                    const subscriptionsDocsRef = query(subscriptionsCollectionRef, where('userId', '==', userId), where('productId', '==', params.id))
                    return getDocs(subscriptionsDocsRef)
                }, staleTime: Infinity, gcTime: Infinity
            }).then(res => !res.empty) : false,
            userId ? queryClient.fetchQuery({
                queryKey: ['userData'], queryFn: () => user(userId),
                staleTime: Infinity, gcTime: Infinity
            }).then(res => {
                const inCart = res.cart.find(({ productId }) => productId === params.id)
                return inCart ? true : false
            }) : false
        ]),
        reviews: queryClient.fetchQuery({
            queryKey: ['reviews', { page: params.id }], queryFn: async () => {
                const reviewCollectionRef = collection(db, 'Reviews')
                const q = query(reviewCollectionRef, where('productId', '==', params.id))
                return getDocs(q).then(res => res.docs.map(doc => ({ ...doc.data() })).sort((a, b) =>
                    b.timeStamp - a.timeStamp))
            },
            staleTime: Infinity, gcTime: Infinity
        }),
        loggedIn: userId ? true : false
    })
}

export default function Details() {

    const { dataSet, reviews, loggedIn } = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSet}>
                {(dataSetLoaded) => <Content dataSetLoaded={dataSetLoaded} reviews={reviews} loggedIn={loggedIn} />}
            </Await>
        </Suspense>
    )
}

function Content({ dataSetLoaded, reviews, loggedIn }) {

    const [productLoaded, subscribed, inCart] = dataSetLoaded

    const outlet = useOutletContext()

    const hide = useMedia('screen and (max-width: 1150px) and (min-width: 650px)')

    useEffect(() => {
        if (hide) outlet.ref.current.classList.add('hide')
        else outlet.ref.current?.classList.remove('hide')
        return () => outlet.ref.current?.classList.remove('hide')
    }, [hide])

    const ref = useRef()

    const { state, formData } = useNavigation()

    const navigate = useNavigate()

    const { id } = useParams()

    const [quantity, setQuantity] = useState(1)

    const [size, setSize] = useState(productLoaded?.sizes[0])

    useEffect(() => {
        const productID = productLoaded?.productids[size]
        if (productID && productID != id) navigate(`/buy/details/${productID}`)
    }, [size])

    const [subscribe, setSubscribe] = useState(false)

    useEffect(() => setSubscribe(subscribed), [subscribed])

    function handleSubscribe() {
        setSubscribe(!subscribe)
    }

    const [frequency, setFrequency] = useState('Weekly')

    const frequencies = ['Weekly', 'Monthly']

    function proceed() {
        navigate(`/buy/details/${id}/subscribe?type=${frequency.toLowerCase()}&quantity=${quantity}`)
    }

    function login() {
        navigate(`/buy/login?redirectTo=/buy/details/${id}`)
    }

    function loginOptions() {
        ref.current.classList.toggle('show')
    }

    useEffect(() => { if (!productLoaded) navigate('/notfound', { replace: true }) }, [])

    return productLoaded && (
        <div className='details-container'>
            {hide && <div className="buy-back-icon" onClick={() => navigate('/buy')}><IoArrowBack /></div>}
            <ImgSlider imgArr={productLoaded.img} />
            <div className="details-content-container">
                <h1>{productLoaded.title}</h1>
                <div className="review-rating-div">
                    <div className='rating-div'><Rating rating={productLoaded.rating} className='details-rating' /></div>
                    <p>({productLoaded.review}&nbsp;review{productLoaded.review < 2 ? '' : 's'})</p>
                </div>
                <div className="price-wt">
                    <h2>रू&nbsp;{(productLoaded.price).toFixed(2)}&nbsp;&nbsp;<span>incl.&nbsp;taxes</span></h2>
                    <h3>wt.&nbsp;{productLoaded.weight}g</h3>
                </div>
                <p>{productLoaded.description}</p>
                <div className="quantity-size">
                    <Quantity quantity={quantity} setQuantity={setQuantity} />
                    <div className="size-container">
                        <p>Size</p>
                        <DropDown items={productLoaded.sizes} selected={size} setSelected={setSize} name='size' />
                    </div>
                </div>
                <div className="subscribe-div">
                    <label>
                        {subscribed ? <input type='checkbox' name='subscribed' checked readOnly /> :
                            <input type='checkbox' name='subscribe' checked={subscribe} onChange={handleSubscribe} />}
                        <p>Subscribe{subscribed ? 'd' : ''}</p>
                    </label>
                    {subscribe && <div className='frequency-div'>
                        {subscribed ? <Link to='/buy/subscriptions' className='manage-sub'>Manage</Link> :
                            <DropDown items={frequencies} selected={frequency} setSelected={setFrequency} name='frequency' />}
                        <RxQuestionMarkCircled className='info-icon' />
                        <p>Weekly:&nbsp;&nbsp;Get selected quantity delivered every 7 days<br />Monthly:&nbsp;&nbsp;Get selected quantity delivered every 30 days</p>
                    </div>}
                    <p>Never run out of product. Cancel anytime.</p>
                </div>
                {subscribe && !subscribed ? <button type='button' onClick={proceed}>Proceed to Checkout
                    <BsForwardFill size='1.25rem' /></button> : inCart ?
                    <button type='button' disabled><BsCartCheckFill />Added to Cart</button> :
                    loggedIn ? <Form className='add-to-cart-form' method='post' replace preventScrollReset>
                        <input type='number' name='quantity' value={quantity} readOnly />
                        <button type='submit' name='intent' value='cart'><BsCartFill />
                            {state !== 'idle' && formData?.get('intent') === 'cart' ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </Form> : <>
                        <button type='button' onClick={loginOptions}><BsCartFill />
                            {state !== 'idle' && formData?.get('intent') === 'guest' ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <div className="dialog-wrapper">
                            <div className="login-options-container" ref={ref}>
                                <span className='login-options-close' onClick={loginOptions}><IoClose /></span>
                                <button type='button' onClick={login}>Login to Continue</button>
                                <p>- Or Continue as -</p>
                                <Form method='post' replace preventScrollReset>
                                    <input type='number' name='quantity' value={quantity} readOnly />
                                    <button type='submit' name='intent' value='guest' onClick={loginOptions}>
                                        <IoPersonSharp size='1.1rem' />Guest
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </>}
                <h2>Customer Reviews</h2>
                <div className="reviews-wrapper">
                    <Review reviews={reviews} sno={productLoaded.Sno} />
                </div>
            </div>
        </div>
    )
}