import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Form, Link, defer, useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore/lite'
import { db, product, queryClient, user } from '../../Db/FirebaseConfig'
import { CurrentUser } from '../../Utils/HandleUser'
import Loading from '../../Components/Loading/Loading'
import DropDown from '../../Components/DropDown/DropDown'
import Quantity from '../../Components/Quantity/Quantity'
import Dialog from '../../Components/Dialog/Dialog'
import { RxQuestionMarkCircled } from "react-icons/rx"
import './CartCheckout.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const intent = formData.get('intent')

    const userId = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser(),
        staleTime: Infinity, gcTime: Infinity
    }).then(res => res.uid)

    const cartArr = await queryClient.fetchQuery({
        queryKey: ['userData'], queryFn: () => user(userId),
        staleTime: Infinity, gcTime: Infinity
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
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(res => queryClient.fetchQuery({
            queryKey: ['userData'], queryFn: () => user(res.uid),
            staleTime: Infinity, gcTime: Infinity
        })).then(res => queryClient.fetchQuery({
            queryKey: ['cartItems'], queryFn: () => {
                return Promise.all(res.cart.map((item, idx) => product(item.productId).then(resThis => {
                    return { ...resThis, quantity: item.quantity, idx: idx }
                })))
            }, staleTime: Infinity, gcTime: Infinity
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

    const removeRef = useRef()
    const actionData = useActionData()

    useEffect(() => {
        if (actionData) removeRef.current.classList.remove('show')
    }, [actionData])

    const [idx, setIdx] = useState(-1)

    const cartItemElems = dataSetLoaded.map(data => <CartItem key={data.idx} itemData={data} setIdx={setIdx}
        removeRef={removeRef} />).toReversed()

    let subtotal = 0
    let totalWeight = 0
    dataSetLoaded.forEach(item => {
        subtotal += (item.price * item.quantity)
        totalWeight += (item.weight * item.quantity / 1000)
    })

    const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)

    const deliveryInc = Number(process.env.REACT_APP_DELIVERY_FEES_INCREMENT)

    const totalDelivery = delivery + ((Math.ceil(totalWeight) - 1) * deliveryInc)

    const promotion = Number(process.env.REACT_APP_DISCOUNT_AMOUNT)

    return (
        <div className='cart-checkout-container'>
            <div className='cart-items-container'>
                {cartItemElems}
            </div>
            <Dialog refEl={removeRef} closeRef={removeRef.current} title='Remove Product?' value={idx}
                submiting='Removing...' intent='delete' />
            <div className='total-info-container'>
                <div className='checkout-container-wrapper'>
                    <div className='checkout-container'>
                        <h2>ORDER TOTAL</h2>
                        <p>Sub-total</p>
                        <p>रू&nbsp;{subtotal.toFixed(2)}</p>
                        <div className="delivery-fee-div">
                            <p>Delivery fee</p>
                            <RxQuestionMarkCircled className='delivery-fee-icon' />
                            <p>+&nbsp;रू&nbsp;{deliveryInc} per kg after 1kg</p>
                        </div>
                        <p>रू&nbsp;{totalDelivery.toFixed(2)}</p>
                        <p className='discount'>Promotion</p>
                        <p className='discount'>-&nbsp;रू&nbsp;{promotion.toFixed(2)}</p>
                        <hr color='#000' />
                        <h3>Grand Total</h3>
                        <p>रू&nbsp;{(subtotal + totalDelivery - promotion).toFixed(2)}</p>
                    </div>
                </div>
                <Link to='/buy/cart/address' className='checkout-btn'>Checkout</Link>
            </div>
        </div>
    )
}

function CartItem({ itemData, setIdx, removeRef }) {

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

    function showRemove() {
        removeRef.current.classList.add('show')
        setIdx(itemData.idx)
    }

    return (
        <div className='cart-item-container'>
            <div className={`product-info-card${state === 'submitting' ? ' disable' : ''}`}>
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