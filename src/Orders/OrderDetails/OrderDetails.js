import React from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { IoMdCheckmark } from "react-icons/io"
import { RxQuestionMarkCircled } from "react-icons/rx"
import './OrderDetails.css'

export default function OrderDetails() {

    const { orderId } = useParams()

    const { dataSet } = useOutletContext()

    const orderData = dataSet.find(order => order?.orderId === orderId)

    const productsElems = orderData?.products.map((product, idx) => <ProductCard key={idx} productData={product} />)

    return (
        <div className='order-details-wrapper'>
            <Link to='/buy/account/orders' className="orders-back-icon"><IoArrowBack /></Link>
            <div className='order-details-container'>
                {productsElems ? <>
                    <div className='order-status-container'>
                        <div className='order-status-div'>
                            <IoMdCheckmark className='status-icon' />
                            <p>Ordered</p>
                        </div>
                        <hr color='#000' />
                        <div className='order-status-div'>
                            {orderData.status === 'transit' || orderData.status === 'delivered' ?
                                <IoMdCheckmark className='status-icon' /> : ''}<p>Transit</p>
                        </div>
                        <hr color='#000' />
                        <div className='order-status-div'>
                            {orderData.status === 'delivered' && <IoMdCheckmark className='status-icon' />}
                            <p>Delivered</p>
                        </div>
                    </div>
                    <div className='ordered-products-container'>
                        {productsElems}
                    </div>
                    <div className='order-total-container'>
                        <h3>Total:&nbsp;&nbsp;रू&nbsp;{(orderData.totalPrice).toFixed(2)}</h3>
                        <div className='price-details-icon'>
                            <RxQuestionMarkCircled />
                            <p>includes delivery fee and promotions</p>
                        </div>
                        <h3>{orderData.paymentMode}</h3>
                    </div>
                    <div className='delivery-address-div'>
                        <h4>{orderData.address.fullName}</h4>
                        <p>{orderData.address.street}</p>
                        <p>{orderData.address.city}, {orderData.address.district}</p>
                        <p>Phone number: {orderData.address.phone}</p>
                        {orderData.address.email && <p>Email: {orderData.address.email}</p>}
                    </div></> : <h2 className='no-order-found'>No order found</h2>}
            </div>
        </div>
    )
}

function ProductCard({ productData }) {
    return (
        <div className='ordered-product-container'>
            <Link to={`/buy/details/${productData.productId}`}>
                <img src={productData.productImg} alt={`${productData.title} image`} />
            </Link>
            <h3>{productData.title}</h3>
            <h4>{productData.size}</h4>
            <p>रू&nbsp;{(productData.price).toFixed(2)}</p>
            <p>Quantity: {productData.quantity}</p>
        </div>
    )
}