import React, { Suspense, useState } from 'react'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { motion } from 'framer-motion'
import { data } from '../Db/FirebaseConfig'
import Loading from '../Components/Loading/Loading'
import Filter from '../Components/Filter/Filter'
import ProductCard from '../Components/ProductCard/ProductCard'
import './Listing.css'

export function loader() {
    return defer({ dataSet: data() })
}

export default function Listing() {

    const [selected, setSelected] = useState('')
    const dataSetPromise = useLoaderData()

    function handleCategory(event) {
        setSelected(event.target.value)
    }

    function content(dataSetLoaded) {

        let filteredProducts = dataSetLoaded

        if (selected) filteredProducts = dataSetLoaded.filter(({ type }) => type === selected)

        const products = filteredProducts.map(product => <ProductCard key={product.id} id={product.id} img={product.img[0]}
            title={product.title} price={product.price} size={product.sizes[0]} rating={product.rating} review={product.review} />)

        return (
            <div className='listings-container'>
                <Filter handleCategory={handleCategory} productList={dataSetLoaded} selected={selected} />
                <motion.div layout className="products-container">
                    {products}
                </motion.div>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {content}
            </Await>
        </Suspense>
    )
}
