import { addDoc, collection } from "firebase/firestore/lite"
import { db } from "../Db/FirebaseConfig"

export default async function Email(email, name, orderId, products, total, address, mode) {
    const subject = `Your Oats By Nush Order Number ${orderId} has been placed 🌾✨`
    const orders = products.map(product => (
        `<li>
            <p style="margin: 0; padding: 0;">Product 1: ${product.title} ${product.size}</p>
            <p style="margin: 0; padding: 0;">Quantity: ${product.quantity}</p>
            <p style="margin: 0 0 15px 0; padding: 0;">Price: रू ${(product.price).toFixed(2)}</p>
        </li>`
    ))
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    const orderDate = (new Date()).toLocaleDateString('en-IN', options)
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 1.75;">
    <p style="margin: 0; padding: 0;">Dear ${name},</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Thank you for choosing Oats By Nush for your plant-based delight needs! 🥛🌱 We're thrilled to confirm that we've received your order and it's currently being processed with care.</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Here are the details of your order:</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Order Number: ${orderId}</p>
    <p style="margin: 0; padding: 0;">Date of Order: ${orderDate}</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Order Summary:</p>
    <br style="line-height: 0.25;" />
    <ul style="margin: 0; padding: 0 0 0 15px;">${orders.join('')}</ul>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Total Amount: रू ${total.toFixed(2)}</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Shipping Address:</p>
    <p style="margin: 0; padding: 0;"><strong>${address.fullName}</strong></p>
    <p style="margin: 0; padding: 0;">${address.street}</p>
    <p style="margin: 0; padding: 0;">${address.city}, ${address.district}</p>
    <p style="margin: 0; padding: 0;">Phone number: ${address.phone}</p>
    ${address.email ? `<p style="margin: 0; padding: 0;">Email: ${address.email}</p>` : ''}
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Payment Method: ${mode}</p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">After your order is confirmed, expect a confirmation email followed by prompt dispatch of your product. If you have any questions or need assistance with your order, feel free to reply to this email or reach out to us at <a href="mailto:info@oatsbynush.com" target="_blank">info@oatsbynush.com</a></p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">We appreciate your support for our sustainable, nutritious oat-based products, and we can't wait for you to experience the goodness that is Oats by Nush! 🌾✨<p>
    <br style="line-height: 0.25;" />
    <p style="margin: 0; padding: 0;">Warm regards,</p>
    <p style="margin: 0; padding: 0;">The Oats By Nush Team</p>
    </body>
    </html>`
    const emailsCollectionRef = collection(db, 'Emails')
    await addDoc(emailsCollectionRef, {
        to: [email], bcc: ['info@oatsbynush.com'], message: { subject: subject, html: html }
    })
}