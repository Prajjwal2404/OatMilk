import React from 'react'
import { Form, useNavigation } from 'react-router-dom'
import './Dialog.css'

export default function Dialog({ refEl, closeRef, title, value, submiting, intent }) {

    const { state } = useNavigation()

    function closeConfirm() {
        closeRef.classList.remove('show')
    }

    return (
        <div className='dialog-wrapper'>
            <div className='confirm-dialog' ref={refEl}>
                <h2>{title}</h2>
                <Form className={state === 'submitting' ? 'disable' : ''} method='post' replace preventScrollReset>
                    <input type='text' name='id' value={value} readOnly />
                    <button type='submit' className='confirm' name='intent' value={intent}>
                        {state === 'submitting' ? submiting : 'Yes'}
                    </button>
                    <button type='button' onClick={closeConfirm} className='close'>No</button>
                </Form>
            </div>
        </div>
    )
}
