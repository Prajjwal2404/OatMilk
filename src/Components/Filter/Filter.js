import React from 'react'
import './Filter.css'

export default function Filter({ handleCategory, productList, selected }) {
    let productCategory = []
    productList.forEach(product => { if (!productCategory.includes(product.type)) productCategory.push(product.type) })
    let products = productCategory.map((category, idx) =>
        <CategoryItem key={idx} value={category} title={category} handleCategory={handleCategory} selected={selected} />)

    return (
        <div className='categories'>
            <CategoryItem value='' title='All Products' handleCategory={handleCategory} selected={selected} />
            {products}
        </div>
    )
}

function CategoryItem(props) {
    return (
        <label>
            <input type='radio' name='category' value={props.value} onChange={props.handleCategory}
                checked={props.value === props.selected} />
            <span>
                {props.title}
            </span>
        </label>
    )
}