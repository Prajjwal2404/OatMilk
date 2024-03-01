import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { db } from '../Db/db'
import Filter from '../Components/Filter/Filter'
import ProductCard from '../Components/ProductCard/ProductCard'
import './Listing.css'

export default function Listing() {

    const [selected, setSelected] = useState('')
    var filteredProducts = db

    function handleCategory(event) {
        setSelected(event.target.value)
    }

    if (selected) filteredProducts = db.filter(({ type }) => type === selected)

    const products = filteredProducts.map(product => <ProductCard key={product.id} id={product.id} img={product.img}
        title={product.title} price={product.price} size={product.size} rating={product.rating} review={product.review} />)

    return (
        <div className='listings-container'>
            <Filter handleCategory={handleCategory} productList={db} selected={selected} />
            <motion.div layout className="products-container">
                {products}
            </motion.div>
        </div>
    )
}
