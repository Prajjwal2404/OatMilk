import React, { Suspense, useEffect, useState } from 'react'
import { Await, Link, defer, useLoaderData, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { product, queryClient } from '../../Db/FirebaseConfig'
import DropDown from '../../Components/DropDown/DropDown'
import Quantity from '../../Components/Quantity/Quantity'
import Loading from '../../Components/Loading/Loading'
import { RxQuestionMarkCircled } from "react-icons/rx"
import './SubCheckout.css'

export function loader({ params }) {
    return defer({
        productInfo: queryClient.fetchQuery({
            queryKey: [params.id], queryFn: () => product(params.id),
            staleTime: Infinity, gcTime: Infinity
        })
    })
}

export default function SubCheckout() {

    const { productInfo } = useLoaderData()
    const { searchData } = useOutletContext()

    return (
        <div className='product-checkout-wrapper'>
            <div className="product-checkout-container">
                <Suspense fallback={<Loading />}>
                    <Await resolve={productInfo}>
                        {(productInfoLoaded) => <ProductInfo productInfoLoaded={productInfoLoaded} />}
                    </Await>
                </Suspense>
            </div>
            <Link to={`address${searchData}`} className='checkout-btn'>Checkout</Link>
        </div>
    )
}

function ProductInfo({ productInfoLoaded }) {

    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const { id } = useParams()

    const [quantity, setQuantity] = useState(Number(searchParams.get('quantity')) || 1)

    const [size, setSize] = useState(productInfoLoaded?.sizes[0])

    const type = searchParams.get('type') || 'weekly'

    const delivery = Number(process.env.REACT_APP_DELIVERY_FEES)

    const deliveryInc = Number(process.env.REACT_APP_DELIVERY_FEES_INCREMENT)

    const totalDelivery = delivery + ((Math.ceil(productInfoLoaded.weight * quantity / 1000) - 1) * deliveryInc)

    const promotion = Number(process.env.REACT_APP_DISCOUNT_AMOUNT)

    useEffect(() => {
        if ((Number(searchParams.get('quantity')) || 1) !== quantity) setSearchParams({ type, quantity })
    }, [quantity])

    useEffect(() => {
        const productID = productInfoLoaded?.productids[size]
        if (productID && productID != id)
            navigate(`/buy/details/${productID}/subscribe?type=${type}&quantity=${quantity}`)
    }, [size])

    return productInfoLoaded ? (
        <>
            <div className='product-info-card'>
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
                <p>रू&nbsp;{(productInfoLoaded.price * quantity).toFixed(2)}/{type.slice(0, -2)}</p>
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
                <p>
                    रू&nbsp;{(productInfoLoaded.price * quantity + totalDelivery - promotion).toFixed(2)}/{type.slice(0, -2)}
                </p>
            </div>
        </>
    ) : (<h2 className='no-product-found'>No product found</h2>)
}