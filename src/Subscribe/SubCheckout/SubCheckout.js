import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, Link, defer, useActionData, useLoaderData, useNavigate, useNavigation, useOutletContext, useParams, useSearchParams, useSubmit } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { db, product, queryClient } from '../../Db/FirebaseConfig'
import DropDown from '../../Components/DropDown/DropDown'
import Quantity from '../../Components/Quantity/Quantity'
import Loading from '../../Components/Loading/Loading'
import { IoInformationCircle } from "react-icons/io5"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import './SubCheckout.css'

export async function action({ request }) {
    const formData = await request.formData()
    const promotionsCollectionRef = collection(db, 'Promotions')
    const q = query(promotionsCollectionRef, where('code', '==', formData.get('promotion').toUpperCase()))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) return { ...querySnapshot.docs[0].data() }
    else return { invalid: true }
}

export function loader({ params }) {
    return defer({
        productInfo: queryClient.fetchQuery({
            queryKey: [params.id], queryFn: () => product(params.id)
        })
    })
}

export default function SubCheckout() {

    const { productInfo } = useLoaderData()
    const { searchData } = useOutletContext()
    const [inStock, setInStock] = useState(true)
    const navigate = useNavigate()

    function proceed(event) {
        if (inStock) navigate(`address${searchData}`)
        else {
            event.target.setCustomValidity("Product is out of stock or selected quantity isn't available")
            event.target.reportValidity()
        }
    }

    return (
        <div className='product-checkout-wrapper'>
            <div className="product-checkout-container">
                <Suspense fallback={<Loading />}>
                    <Await resolve={productInfo}>
                        {(productInfoLoaded) => <ProductInfo productInfoLoaded={productInfoLoaded} setInStock={setInStock} />}
                    </Await>
                </Suspense>
            </div>
            <button className='checkout-btn' onClick={proceed}>Checkout</button>
        </div>
    )
}

function ProductInfo({ productInfoLoaded, setInStock }) {

    const formRef = useRef()
    const inputRef = useRef()
    const { id } = useParams()
    const navigate = useNavigate()
    const { state } = useNavigation()
    const submit = useSubmit()
    const actionData = useActionData()
    const { discount, setDiscount } = useOutletContext()
    const [searchParams, setSearchParams] = useSearchParams()

    const [quantity, setQuantity] = useState(Number(searchParams.get('quantity')) || 2)

    const [size, setSize] = useState(productInfoLoaded?.sizes[0])

    const type = searchParams.get('type') || 'weekly'

    const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)

    const promotion = (productInfoLoaded.price * quantity) * (discount / 100)

    useEffect(() => {
        if ((Number(searchParams.get('quantity')) || 2) !== quantity) setSearchParams({ type, quantity })
    }, [quantity])

    useEffect(() => {
        if (quantity > productInfoLoaded?.stock) setInStock(false)
        else if (quantity <= productInfoLoaded?.stock) setInStock(true)
    }, [quantity, productInfoLoaded])

    useEffect(() => {
        const productID = productInfoLoaded?.productids[size]
        if (productID && productID != id)
            navigate(`/buy/details/${productID}/subscribe?type=${type}&quantity=${quantity}`)
    }, [size])

    useEffect(() => {
        if (actionData) {
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

    return productInfoLoaded ? (
        <>
            <div className='product-info-card'>
                {quantity > productInfoLoaded.stock &&
                    <div className='out-of-stock'>
                        <IoInformationCircle />
                        {productInfoLoaded.stock > 1 ? <p>Only {productInfoLoaded.stock} bottles are currently available</p> :
                            <p>Product is out of stock</p>}
                    </div>}
                <Link to={`/buy/details/${id}`}>
                    <img src={productInfoLoaded.img[0]} alt={`${productInfoLoaded.title} image`} />
                </Link>
                <h2>{productInfoLoaded.title}</h2>
                <h3>रू&nbsp;{(productInfoLoaded.price).toFixed(2)}</h3>
                <div className="size-container">
                    <p>Size</p>
                    <DropDown items={productInfoLoaded.sizes} selected={size} setSelected={setSize} name='size' />
                </div>
                <Quantity quantity={quantity} setQuantity={setQuantity} />
            </div>
            <div className='checkout-container'>
                <h2>ORDER TOTAL</h2>
                <p>Sub-total</p>
                <p>रू&nbsp;{(productInfoLoaded.price * quantity).toFixed(2)}&nbsp;/&nbsp;{type.slice(0, -2)}</p>
                <p>Delivery fee</p>
                <p>रू&nbsp;{delivery.toFixed(2)}</p>
                <div className='discount'>
                    <Form method='post' replace preventScrollReset ref={formRef}
                        className={`promo-div${state === 'submitting' ? ' disable' : ''}`}>
                        <input type='text' name='promotion' placeholder='Promo Code' minLength={6} maxLength={6} required
                            ref={inputRef} />
                        {state !== 'submitting' && <IoMdCheckmarkCircleOutline className='promo-icon' onClick={promo} />}
                    </Form>
                    <p>-&nbsp;रू&nbsp;{promotion.toFixed(2)}</p>
                </div>
                <hr color='#000' />
                <h3>Grand Total</h3>
                <p>
                    रू&nbsp;{(productInfoLoaded.price * quantity + delivery - promotion).toFixed(2)}&nbsp;/&nbsp;{type.slice(0, -2)}
                </p>
            </div>
        </>
    ) : (<h2 className='no-product-found'>No product found</h2>)
}