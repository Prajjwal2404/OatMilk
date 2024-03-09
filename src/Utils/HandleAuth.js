import { db, auth } from "../Db/FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore/lite"
import { CurrentUser } from "./HandleUser"

export default async function HandleAuth(formData) {

    const intent = formData.get('intent')

    if (intent === 'login') {
        try {
            if (!formData.get('remember')) {
                await setPersistence(auth, browserSessionPersistence)
            }
            else {
                await setPersistence(auth, browserLocalPersistence)
            }
            await signInWithEmailAndPassword(auth, formData.get('logMail'), formData.get('logPass'))
            return { redirect: true }
        }
        catch (err) {
            if (err.message == 'Firebase: Error (auth/invalid-credential).') {
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
            await createUserWithEmailAndPassword(auth, formData.get('regMail'), formData.get('regPass'))
            const user = await CurrentUser()
            const userRef = doc(db, 'Users', user.uid)
            const fields = {
                username: formData.get('regUser'), email: user.email.toLowerCase(),
                subscriptions: [], cart: [], addresses: [], orders: []
            }
            await setDoc(userRef, fields)
            return { redirect: true }
        }
        catch (err) {
            if (err.message == 'Firebase: Error (auth/email-already-in-use).') {
                throw { register: 'Email already registered' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (intent === 'signin') {

        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            const user = await CurrentUser()
            const userRef = doc(db, 'Users', user.uid)
            const userSnapshot = await getDoc(userRef)
            if (!userSnapshot.exists()) {
                const fields = {
                    username: user.providerData[0].displayName, email: user.email.toLowerCase(),
                    subscriptions: [], cart: [], addresses: [], orders: []
                }
                await setDoc(userRef, fields)
            }
            return { redirect: true }
        }
        catch (err) {
            console.error(err)
            alert(err.message)
        }
    }

    else if (intent === 'reset') {

        try {
            await sendPasswordResetEmail(auth, formData.get('resetMail'))
            return { redirect: false }
        }
        catch (err) {
            if (err.message == 'Firebase: Error (auth/invalid-email).') {
                throw { reset: "Invalid email" }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }
}