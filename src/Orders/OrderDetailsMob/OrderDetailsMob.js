import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { OrderCard } from '../OrdersList/OrdersList'
import useMedia from '../../Utils/Media'

export default function OrderDetailsMob() {

    const isMobile = useMedia('screen and (max-width: 1050px)')

    const { dataSet } = useOutletContext()

    if (isMobile) {

        let months = []
        dataSet.forEach(({ month }) => {
            if (!months.includes(month)) months.push(month)
        })
        const orderElems = months.map((month, idx) => {
            const currentMonthOrders = dataSet.filter(order => order.month === month)
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
            </div>
        )
    }

    return (
        <div className='order-details-wrapper'>
            <div className='order-details-container mob'>
                <h2>Order details appear here</h2>
            </div>
        </div>
    )
}