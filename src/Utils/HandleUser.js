import { redirect } from 'react-router-dom'
import { auth } from '../Db/FirebaseConfig'
import { onAuthStateChanged } from "firebase/auth"

export default async function RequireAuth(request) {

    if (!await CurrentUser()) {
        const pathname = new URL(request.url).pathname
        const type = new URL(request.url).searchParams.get('type')
        if (type) {
            const quantity = new URL(request.url).searchParams.get('quantity')
            throw redirect(`/buy/login?redirectTo=${pathname}&type=${type}&quantity=${quantity}`)
        }
        else throw redirect(`/buy/login?redirectTo=${pathname}`)
    }

    return null
}

export async function CurrentUser() {
    return new Promise(function (resolve) {
        onAuthStateChanged(auth, user => resolve(user))
    })
}
