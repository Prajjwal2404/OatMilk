import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../Db/FirebaseConfig'

export default function Cart() {
    async function logout() {
        await signOut(auth)
    }
    return (
        <button onClick={logout}>Log Out</button>
    )
}
