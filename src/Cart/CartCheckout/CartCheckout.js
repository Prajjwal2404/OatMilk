import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, Link, defer, useActionData, useLoaderData, useNavigate, useNavigation, useOutletContext, useSubmit } from 'react-router-dom'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite'
import { db, product, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Loading from '../../Components/Loading/Loading'
import DropDown from '../../Components/DropDown/DropDown'
import Quantity from '../../Components/Quantity/Quantity'
import Dialog from '../../Components/Dialog/Dialog'
import { IoInformationCircle } from "react-icons/io5"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import './CartCheckout.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const intent = formData.get('intent')

    if (intent === 'discount') {
        const promotionsCollectionRef = collection(db, 'Promotions')
        const q = query(promotionsCollectionRef, where('code', '==', formData.get('promotion').toUpperCase()))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) return { ...querySnapshot.docs[0].data() }
        else return { invalid: true }
    }

    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser()
    }).then(res => res.uid)

    const cartArr = await queryClient.fetchQuery({
        queryKey: ['userData'], queryFn: () => user(userId)
    }).then(res => res.cart)

    if (intent === 'update') {
        const updateIdx = Number(formData.get('idx'))
        const product = formData.get('product')
        let quantity = Number(formData.get('quantity'))
        const removeIdx = []

        cartArr.forEach((item, idx) => {
            if (item.productId === product && idx !== updateIdx) {
                quantity += item.quantity
                removeIdx.push(idx)
            }
        })

        cartArr[updateIdx] = { productId: product, quantity: quantity }
        removeIdx.forEach(index => cartArr.splice(index, 1))
    }

    else if (intent === 'delete') {
        const idx = Number(formData.get('id'))
        cartArr.splice(idx, 1)
    }

    const userDocRef = doc(db, 'Users', userId)
    await updateDoc(userDocRef, { cart: cartArr })
    await queryClient.invalidateQueries({ queryKey: ['userData'] })
    await queryClient.invalidateQueries({ queryKey: ['cartItems'] })
    return ++actionReturn
}

export function loader() {
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid)
        })).then(res => queryClient.fetchQuery({
            queryKey: ['cartItems'], queryFn: () => {
                return Promise.all(res.cart.map((item, idx) => product(item.productId).then(resThis => {
                    return { ...resThis, quantity: item.quantity, idx: idx }
                })))
            }
        }))
    })
}

export default function CartCheckout() {

    const { dataSet } = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSet}>
                {dataSetLoaded => <Content dataSetLoaded={dataSetLoaded} />}
            </Await>
        </Suspense>
    )
}

function Content({ dataSetLoaded }) {

    const formRef = useRef()
    const inputRef = useRef()
    const removeRef = useRef()
    const actionData = useActionData()
    const navigate = useNavigate()
    const submit = useSubmit()
    const { state, formData } = useNavigation()
    const { discount, setDiscount } = useOutletContext()

    useEffect(() => {
        if (actionData) removeRef.current.classList.remove('show')
    }, [actionData])

    const [idx, setIdx] = useState(-1)
    const [inStock, setInStock] = useState({})

    const cartItemElems = dataSetLoaded.map(data => <CartItem key={data.idx} itemData={data} setIdx={setIdx}
        removeRef={removeRef} setInStock={setInStock} />).toReversed()

    useEffect(() => {
        const productIdArr = dataSetLoaded.map(data => data.id)
        const deletedProductsArr = Object.keys(inStock).filter(element => !productIdArr.includes(element))
        deletedProductsArr.forEach(id => {
            setInStock(prevInStock => {
                const newInStock = { ...prevInStock }
                delete newInStock[id]
                return newInStock
            })
        })
    }, [dataSetLoaded])

    let subtotal = 0
    dataSetLoaded.forEach(item => {
        subtotal += (item.price * item.quantity)
    })

    const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)

    const promotion = subtotal * discount / 100

    function proceed(event) {
        const isAllInStock = Object.values(inStock).every(item => item === true)
        if (isAllInStock) navigate('/buy/cart/address')
        else {
            event.target.setCustomValidity("A product is out of stock or it's selected quantity isn't available")
            event.target.reportValidity()
        }
    }

    useEffect(() => {
        if (actionData && typeof actionData === 'object') {
            if (actionData.invalid) {
                inputRef.current.setCustomValidity('Invalid Promo Code')
                inputRef.current.reportValidity()
            }
            else if (actionData.validity.toDate().setHours(0, 0, 0, 0) < (new Date()).setHours(0, 0, 0, 0)) {
                inputRef.current.setCustomValidity('Promo Code Expired')
                inputRef.current.reportValidity()
            }
            else {
                setDiscount(Number(actionData.discount))
            }
        }
    }, [actionData])

    function promo() {
        inputRef.current.setCustomValidity('')
        if (!formRef.current.checkValidity()) inputRef.current.reportValidity()
        else submit(formRef.current)
    }

    return (
        <div className='cart-checkout-container'>
            <div className='cart-items-container'>
                {cartItemElems}
            </div>
            <Dialog refEl={removeRef} closeRef={removeRef.current} title='Remove Product?' value={idx}
                submiting='Removing' intent='delete' />
            <div className='total-info-container'>
                <div className='checkout-container-wrapper'>
                    <div className='checkout-container'>
                        <h2>ORDER TOTAL</h2>
                        <p>Sub-total</p>
                        <p>रू&nbsp;{subtotal.toFixed(2)}</p>
                        <p>Delivery fee</p>
                        <p>रू&nbsp;{delivery.toFixed(2)}</p>
                        <div className='discount'>
                            <Form method='post' replace preventScrollReset ref={formRef} className={`promo-div${state === 'submitting' && formData?.get('intent') === 'discount' ? ' disable' : ''}`}>
                                <input type='text' name='intent' value='discount' readOnly />
                                <input type='text' name='promotion' placeholder='Promo Code' minLength={6} maxLength={6}
                                    required ref={inputRef} />
                                {(state !== 'submitting' || formData?.get('intent') !== 'discount') &&
                                    <IoMdCheckmarkCircleOutline className='promo-icon' onClick={promo} />}
                            </Form>
                            <p>-&nbsp;रू&nbsp;{promotion.toFixed(2)}</p>
                        </div>
                        <hr color='#000' />
                        <h3>Grand Total</h3>
                        <p>रू&nbsp;{(subtotal + delivery - promotion).toFixed(2)}</p>
                    </div>
                </div>
                <button className='checkout-btn' onClick={proceed}>Checkout</button>
            </div>
        </div>
    )
}

function CartItem({ itemData, setIdx, removeRef, setInStock }) {

    const { state } = useNavigation()

    const formRef = useRef()

    const submit = useSubmit()

    const [quantity, setQuantity] = useState(itemData.quantity)

    useEffect(() => setQuantity(itemData.quantity), [itemData.quantity])

    const [size, setSize] = useState(itemData.sizes[0])

    const [productId, setProductId] = useState(itemData.id)

    useEffect(() => setProductId(itemData.productids[size]), [size])

    useEffect(() => {
        if (productId !== itemData.id || quantity !== itemData.quantity) submit(formRef.current)
    }, [productId, quantity])

    useEffect(() => {
        if (quantity > itemData.stock) setInStock(prevInStock => ({ ...prevInStock, [itemData.id]: false }))
        else if (quantity <= itemData.stock) setInStock(prevInStock => ({ ...prevInStock, [itemData.id]: true }))
    }, [quantity, itemData])

    function showRemove() {
        removeRef.current.classList.add('show')
        setIdx(itemData.idx)
    }

    return (
        <div className='cart-item-container'>
            <div className={`product-info-card${state === 'submitting' ? ' disable' : ''}`}>
                {quantity > itemData.stock &&
                    <div className='out-of-stock'>
                        <IoInformationCircle />
                        {itemData.stock > 1 ? <p>Only {itemData.stock} bottles are currently available</p> :
                            <p>Product is out of stock</p>}
                    </div>}
                <Link to={`/buy/details/${itemData.id}`}>
                    <img src={itemData.img[0]} alt={`${itemData.title} image`} />
                </Link>
                <h2>{itemData.title}</h2>
                <h3>रू&nbsp;{(itemData.price).toFixed(2)}</h3>
                <div className="size-container">
                    <p>Size</p>
                    <DropDown items={itemData.sizes} selected={size} setSelected={setSize} name='size' />
                </div>
                <Quantity quantity={quantity} setQuantity={setQuantity} showRemove={true} removeFn={showRemove} />
            </div>
            <Form method='post' replace ref={formRef} preventScrollReset>
                <input type='number' name='idx' value={itemData.idx} readOnly />
                <input type='text' name='product' value={productId} readOnly />
                <input type='number' name='quantity' value={quantity} readOnly />
                <input type='text' name='intent' value='update' readOnly />
            </Form>
        </div>
    )
}