import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore/lite"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)


export const db = getFirestore(app)

export const auth = getAuth(app)

export async function data() {
    const productsCollectionRef = collection(db, 'Products')
    const dataSnapshot = await getDocs(productsCollectionRef)
    return dataSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}

export async function product(id) {
    const productDocRef = doc(db, 'Products', id)
    const productSnapshot = await getDoc(productDocRef)
    return { ...productSnapshot.data(), id: productSnapshot.id }
}

export async function user(id) {
    const userDocRef = doc(db, 'Users', id)
    const userSnapshot = await getDoc(userDocRef)
    return { ...userSnapshot.data(), id: userSnapshot.id }
}