import React, { Suspense } from 'react'
import { defer, useLoaderData, Await, Outlet, NavLink, Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { db, queryClient } from '../../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../../Utils/HandleUser'
import Loading from '../../Components/Loading/Loading'
import useMedia from '../../Utils/Media'
import './OrdersList.css'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser(),
            staleTime: Infinity, gcTime: Infinity
        }).then(currentuser => queryClient.fetchQuery({
            queryKey: ['ordersData'], queryFn: async () => {
                const ordersCollectionRef = collection(db, 'Orders')
                const ordersDocsRef = query(ordersCollectionRef, where('userId', '==', currentuser.uid))
                return getDocs(ordersDocsRef).then(res => res.docs.map(doc => ({ ...doc.data() }))
                    .sort((a, b) => b.timeStamp - a.timeStamp))
            }, staleTime: Infinity, gcTime: Infinity
        }))
    })
}

export default function OrdersList() {

    const { dataSet } = useLoaderData()

    return (
        <div className='order-history-wrapper'>
            <h1>Order history</h1>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataSet}>
                    {dataSetLoaded => <Content dataSetLoaded={dataSetLoaded} />}
                </Await>
            </Suspense>
        </div>
    )
}

function Content({ dataSetLoaded }) {

    const isMobile = useMedia('screen and (max-width: 1050px)')

    if (dataSetLoaded.length === 0) {
        return (
            <div className='no-sub no-order'>
                <h1>No Order History</h1>
                <Link to='/buy'>Continue Shopping</Link>
            </div>
        )
    }

    if (isMobile) return (<Outlet context={{ dataSet: dataSetLoaded }} />)

    let months = []
    dataSetLoaded.forEach(({ month }) => {
        if (!months.includes(month)) months.push(month)
    })
    const orderElems = months.map((month, idx) => {
        const currentMonthOrders = dataSetLoaded.filter(order => order.month === month)
        const currentMonthOrdersElems = currentMonthOrders.map((order, idx) => <OrderCard key={idx} orderData={order} />)
        return (
            <div key={idx} className='order-history-cards-container'>
                <h2>{month}</h2>
                {currentMonthOrdersElems}
            </div>
        )
    })

    return (
        <div className='order-history-container'>
            <div className='order-history-cards-wrapper'>
                {orderElems}
            </div>
            <Outlet context={{ dataSet: dataSetLoaded }} />
        </div>
    )
}

export function OrderCard({ orderData }) {

    const productNum = orderData.products.length - 1
    const date = new Date(orderData.timeStamp.seconds * 1000 + (orderData.timeStamp.nanoseconds / 1000000))
    const options = { day: 'numeric', month: 'long', year: 'numeric' }

    return (
        <NavLink to={orderData.orderId} className={({ isActive }) => isActive ? 'active' : ''} preventScrollReset>
            <div className='order-history-img-div' data-products={`+${productNum}`}>
                <img src={orderData.products[0].productImg} alt={`${orderData.products[0].title} image`} />
            </div>
            <h4>Order: #{orderData.orderId}</h4>
            <h3>
                {`${orderData.products[0].title} ${orderData.products[0].size}${orderData.products.length > 1 ?
                    `, +${productNum}` : ''}`}
            </h3>
            <div className='order-other-info-div'>
                <p>{date.toLocaleDateString('en-IN', options)}</p>
                <p><span>Total:&nbsp;</span>रू&nbsp;{(orderData.totalPrice).toFixed(2)}</p>
            </div>
        </NavLink>
    )
}