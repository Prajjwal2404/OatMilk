import { redirect } from 'react-router-dom'
import { auth, queryClient } from '../Db/FirebaseConfig'
import { onAuthStateChanged } from "firebase/auth"

export default async function RequireAuth(request, checkAnonymous) {

    const user = await queryClient.fetchQuery({
        queryKey: ['currentuser'], queryFn: () => CurrentUser(),
        staleTime: Infinity, gcTime: Infinity
    })

    if (!user) {
        const pathname = new URL(request.url).pathname
        const type = new URL(request.url).searchParams.get('type')
        if (type) {
            const quantity = new URL(request.url).searchParams.get('quantity')
            throw redirect(`/buy/login?redirectTo=${pathname}&type=${type}&quantity=${quantity}`)
        }
        else throw redirect(`/buy/login?redirectTo=${pathname}`)
    }

    else if (checkAnonymous && user.isAnonymous) {
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
