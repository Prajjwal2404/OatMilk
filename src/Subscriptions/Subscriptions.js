import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, Link, defer, useActionData, useLoaderData } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore/lite'
import { db, product, queryClient } from '../Db/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Utils/HandleUser'
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Loading from '../Components/Loading/Loading'
import Filter from '../Components/Filter/Filter'
import ProductCard from '../Components/ProductCard/ProductCard'
import Dialog from '../Components/Dialog/Dialog'
import './Subscriptions.css'

let actionReturn = 0
export async function action({ request }) {
    const formData = await request.formData()
    const info = JSON.parse(formData.get('id'))
    const subscriptionsDocRef = doc(db, 'Subscriptions', info.docId)
    await deleteDoc(subscriptionsDocRef)
    await queryClient.invalidateQueries({ queryKey: ['subscriptionsData'] })
    await queryClient.invalidateQueries({ queryKey: ['subscribed', { page: info.productId }] })
    sessionStorage.removeItem('subscriptionData')
    return ++actionReturn
}

export async function loader({ request }) {
    await RequireAuth(request, true)
    return defer({
        dataSet: queryClient.fetchQuery({
            queryKey: ['currentuser'], queryFn: () => CurrentUser()
        }).then(currentuser => {
            const subscriptionsCollectionRef = collection(db, 'Subscriptions')
            const subscriptionsDocsRef = query(subscriptionsCollectionRef, where('userId', '==', currentuser.uid))
            return queryClient.fetchQuery({
                queryKey: ['subscriptionsData'],
                queryFn: () => getDocs(subscriptionsDocsRef).then(res => {
                    const docData = res.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
                    docData.sort((a, b) => b.startDate - a.startDate)
                    return Promise.all(docData.map((data, idx) => product(data.productId).then(resThis => {
                        return { ...resThis, ...data, idx: idx }
                    })))
                })
            })
        })
    })
}

export default function Subscriptions() {

    const { dataSet } = useLoaderData()
    const actionData = useActionData()

    const [selected, setSelected] = useState('')

    function handleCategory(event) {
        setSelected(event.target.value)
    }

    const [manageSub, setManageSub] = useState(null)
    const ref = useRef([])

    const options = { day: 'numeric', month: 'short', year: 'numeric' }

    function closeManage() {
        ref.current[0].classList.remove('show')
    }

    function showConfirm() {
        ref.current[1].classList.add('show')
    }

    useEffect(() => {
        if (actionData) {
            ref.current[0].classList.remove('show')
            ref.current[1].classList.remove('show')
        }
    }, [actionData])

    function content(dataSetLoaded) {

        const extras = ['Weekly', 'Monthly']

        function showManage(event, index) {
            event.preventDefault()
            ref.current[0].classList.add('show')
            setManageSub(dataSetLoaded[index])
        }

        let filteredProducts = dataSetLoaded

        if (selected) filteredProducts = dataSetLoaded.filter(({ category, type }) => selected === category || selected.toLowerCase() === type)

        const products = filteredProducts.map(product => <ProductCard key={product.id} id={product.id}
            img={product.img[0]} title={product.title} price={product.price} size={product.sizes[0]}
            rating={product.rating} review={product.review} subscription={product.type}
            clickHandler={el => showManage(el, product.idx)} />)

        return dataSetLoaded.length > 0 ?
            <div className='listings-container'>
                <Filter handleCategory={handleCategory} productList={dataSetLoaded} selected={selected} extras={extras} />
                <motion.div layout className="products-container">
                    {products}
                </motion.div>
            </div> :
            <div className='no-sub'>
                <h1>No Subscription</h1>
                <Link to='/buy'>Continue Shopping</Link>
            </div>
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataSet}>
                    {content}
                </Await>
            </Suspense>
            <div className='dialog-wrapper'>
                <div className='subscription-dialog' ref={el => ref.current[0] = el}>
                    <h2>Manage Subscription</h2>
                    <span className='dialog-close-icon' onClick={closeManage}><IoClose /></span>
                    <div className='manage-subscription'>
                        <p><span>Product:</span> {manageSub?.title}</p>
                        <p><span>Size:</span> {manageSub?.sizes[0]}</p>
                        <p><span>Quantity:</span> {manageSub?.quantity}</p>
                        <p><span>Frequency:</span> {manageSub?.type}</p>
                        <p className='address-used'><span>Delivery Address:</span></p>
                        <p><span>Start Date:</span> {manageSub?.startDate.toDate().toLocaleDateString('en-IN', options)}</p>
                        <div className='sub-add-div'>
                            <h4>{manageSub?.address.title}. {manageSub?.address.fullName}</h4>
                            <p>{manageSub?.address.street}</p>
                            <p>{manageSub?.address.city}, {manageSub?.address.district}</p>
                            <p>Phone number: {manageSub?.address.phone}</p>
                        </div>
                        <button type='button' onClick={showConfirm}>Cancel Subscription</button>
                        <Link to={`/buy/details/${manageSub?.productId}`}>View Product</Link>
                    </div>
                </div>
            </div>
            <Dialog refEl={el => ref.current[1] = el} closeRef={ref.current[1]} title='Cancel Subscription?'
                value={manageSub ? JSON.stringify({ docId: manageSub.docId, productId: manageSub.productId }) : ''}
                submiting='Canceling' intent='cancel' />
        </>
    )
}
