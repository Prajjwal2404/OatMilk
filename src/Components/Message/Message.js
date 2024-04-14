import React from 'react'
import { Form, useNavigation, useActionData } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore/lite'
import { db } from '../../Db/FirebaseConfig'
import OatDoodle from '../../Illustrations/OatDoodle'
import { IoMailOutline, IoPersonOutline } from "react-icons/io5"
import { BiMessageSquareEdit } from "react-icons/bi"
import './Message.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const intent = formData.get('intent')
    if (intent === 'send') {
        const name = formData.get('name')
        const email = formData.get('email')
        const message = formData.get('message')
        const subject = `New message from ${name}`
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="utf-8" />
        </head>
        <body style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 1.75;">
        <p style="margin: 0; padding: 0;">Name: ${name}</p>
        <br style="line-height: 0.25;" />
        <p style="margin: 0; padding: 0;">Message: ${message}</p>
        </body>
        </html>`
        const emailsCollectionRef = collection(db, 'Emails')
        await addDoc(emailsCollectionRef, {
            to: ['info@oatsbynush.com'], replyTo: [email], message: { subject: subject, html: html }
        })
        return ++actionReturn
    }
}

export default function Message() {

    const { state } = useNavigation()
    const actionData = useActionData()

    return (
        <div className='message-container'>
            <div className="doodle-div">
                <OatDoodle />
            </div>
            <Form className={state === 'submitting' ? 'message-form disable' : 'message-form'} method='post'
                replace preventScrollReset>
                <h2>Send us a Message</h2>
                <div className='input-div'>
                    <input key={actionData ? `${actionData}msg` : '0msg'} type='text' name='name' autoComplete='name'
                        placeholder='Name' required /><IoMailOutline className='input-icon' />
                </div>
                <div className='input-div'>
                    <input key={actionData ? `${actionData + 1}msg` : '1msg'} type='email' name='email'
                        autoComplete='email' placeholder='Email' required /><IoPersonOutline className='input-icon' />
                </div>
                <div className='input-div'>
                    <textarea key={actionData ? `${actionData + 2}msg` : '2msg'} rows={4} name='message'
                        placeholder='Your Message' required /><BiMessageSquareEdit className='input-icon' />
                </div>
                <div className='message-btn-div'>
                    <button type='submit' name='intent' value='send'>
                        {state === 'submitting' ? 'Sending...' : 'Send'}
                    </button>
                    {actionData && state === 'idle' && <h4>Message sent!</h4>}
                </div>
            </Form>
        </div>
    )
}
