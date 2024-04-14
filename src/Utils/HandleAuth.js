import { db, auth, queryClient } from "../Db/FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signInWithRedirect, EmailAuthProvider, linkWithCredential, linkWithPopup, linkWithRedirect } from "firebase/auth"
import { deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite"
import { CurrentUser } from "./HandleUser"

export default async function handleAuth(formData) {

    const intent = formData.get('intent')

    const currentuser = await CurrentUser()

    if (intent === 'login') {
        try {
            if (!formData.get('remember')) {
                await setPersistence(auth, browserSessionPersistence)
            }
            else {
                await setPersistence(auth, browserLocalPersistence)
            }
            if (currentuser?.isAnonymous) await anonymousCleanUp()
            await signInWithEmailAndPassword(auth, formData.get('logMail'), formData.get('logPass'))
            return { redirect: true }
        }
        catch (err) {
            if (err.code === 'auth/invalid-credential') {
                throw { login: 'Incorrect email or password' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (intent === 'register') {

        try {
            if (currentuser?.isAnonymous) {
                const credential = EmailAuthProvider.credential(formData.get('regMail'), formData.get('regPass'))
                await linkWithCredential(currentuser, credential)
                const userDocRef = doc(db, 'Users', currentuser.uid)
                const fields = {
                    username: formData.get('regUser'), email: formData.get('regMail').toLowerCase(), expiresAt: deleteField()
                }
                await updateDoc(userDocRef, fields)
                await queryClient.invalidateQueries({ queryKey: ['userData'] })
            }
            else {
                await createUserWithEmailAndPassword(auth, formData.get('regMail'), formData.get('regPass'))
                const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
                const fields = {
                    username: formData.get('regUser'), email: formData.get('regMail').toLowerCase(), cart: [], addresses: []
                }
                await setDoc(userDocRef, fields)
            }
            return { redirect: true }
        }
        catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                throw { register: 'Email already registered' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (intent === 'signinDesktop' || intent === 'signupDesktop') {

        try {
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })
            if (currentuser?.isAnonymous && intent === 'signupDesktop') {
                const credential = await linkWithPopup(currentuser, provider)
                const userDocRef = doc(db, 'Users', currentuser.uid)
                const fields = {
                    username: credential.user.providerData[0].displayName, email: credential.user.email.toLowerCase(),
                    expiresAt: deleteField()
                }
                await updateDoc(userDocRef, fields)
                await queryClient.invalidateQueries({ queryKey: ['userData'] })
            }
            else {
                if (currentuser?.isAnonymous) await anonymousCleanUp()
                await signInWithPopup(auth, provider)
                const user = await CurrentUser()
                const userDocRef = doc(db, 'Users', user.uid)
                const userSnapshot = await getDoc(userDocRef)
                if (!userSnapshot.exists()) {
                    const fields = {
                        username: user.providerData[0].displayName, email: user.email.toLowerCase(), cart: [], addresses: []
                    }
                    await setDoc(userDocRef, fields)
                }
            }
            return { redirect: true }
        }
        catch (err) {
            if (err.code === 'auth/credential-already-in-use') {
                throw { signup: 'Google account already registered' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (intent === 'signinMobile' || intent === 'signupMobile') {
        try {
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })
            if (currentuser?.isAnonymous && intent === 'signupMobile') await linkWithRedirect(currentuser, provider)
            else {
                if (currentuser?.isAnonymous) await anonymousCleanUp()
                await signInWithRedirect(auth, provider)
            }
        }
        catch (err) {
            if (err.code === 'auth/credential-already-in-use') {
                throw { signup: 'Google account already registered' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (intent === 'reset') {

        try {
            await sendPasswordResetEmail(auth, formData.get('resetMail'))
            return { redirect: false }
        }
        catch (err) {
            if (err.code === 'auth/invalid-email') {
                throw { reset: "Invalid email" }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }
}

export async function handleRedirect() {
    try {
        const user = await CurrentUser()
        if (user?.uid) {
            const userDocRef = doc(db, 'Users', user.uid)
            const userSnapshot = await getDoc(userDocRef)
            if (!userSnapshot.exists()) {
                const fields = {
                    username: user.providerData[0].displayName, email: user.email.toLowerCase(), cart: [], addresses: []
                }
                await setDoc(userDocRef, fields)
                await queryClient.invalidateQueries({ queryKey: ['userData'] })
            }
            else if (userSnapshot.get('expiresAt')) {
                const fields = {
                    username: user.providerData[0].displayName, email: user.email.toLowerCase(), expiresAt: deleteField()
                }
                await updateDoc(userDocRef, fields)
                await queryClient.invalidateQueries({ queryKey: ['userData'] })
            }
            return { redirect: true }
        }
    }
    catch (err) {
        console.error(err)
        alert(err.message)
    }
}

async function anonymousCleanUp() {
    await queryClient.invalidateQueries({ queryKey: ['currentuser'] })
    await queryClient.invalidateQueries({ queryKey: ['userData'] })
    await queryClient.invalidateQueries({ queryKey: ['subscribed'] })
    await queryClient.invalidateQueries({ queryKey: ['subscriptionsData'] })
}