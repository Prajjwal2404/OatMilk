import React from 'react'

export default function Shipping() {
    return (
        <div className='policies-container'>
            <h1>Shipping Policy</h1>
            <div className="policies-points-container">
                <h2>Shipment processing time</h2>
                <p>Our standard practice is to dispatch orders for delivery on the following business day after confirmation, barring any unforeseen circumstances. In instances of high order volumes, we appreciate your patience as we strive to fulfill your orders promptly.</p>
            </div>
            <div className="policies-points-container">
                <h2>Shipping rates</h2>
                <p>Delivery fees are Rs 120 for first 1kg and +Rs 50 per kg after that for customers in Kathmandu valley. For customers outside the valley, we appreciate your patience as we work towards extending our services to your region.</p>
            </div>
            <div className="policies-points-container">
                <h2>Shipment confirmation</h2>
                <p>Once the order is placed, you shall receive a confirmation on email, including information regarding the order as well as an order number. In case of any queries, please write to <a href='mailto:info@oatsbynush.com' target='_blank' aria-label='email'>info@oatsbynush.com</a> referencing the order number.</p>
            </div>
            <div className="policies-points-container">
                <h2>Damages</h2>
                <p>Oats by Nush is not liable for any products damaged or lost during shipping. However, to ensure complete customer satisfaction, please contact our support team directly to file a claim for an exchange if you receive a product damaged or defective during delivery. Please save all packaging material and damaged goods before filing a claim.</p>
            </div>
        </div>
    )
}
