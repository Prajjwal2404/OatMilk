import React, { useLayoutEffect, useRef, useState } from 'react'
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io"
import './ImgSlider.css'

export default function ImgSlider({ imgArr }) {

    const [selected, setSelected] = useState(0)

    const ref = useRef()

    useLayoutEffect(() => {
        ref.current.style.marginLeft = `${selected * -100}%`
    }, [selected])

    function handleChange(event) {
        setSelected(Number(event.target.value))
    }

    function moveLeft() {
        if (selected > 0) setSelected(prevSelected => prevSelected - 1)
        else setSelected(imgArr.length - 1)
    }

    function moveRight() {
        if (selected < imgArr.length - 1) setSelected(prevSelected => prevSelected + 1)
        else setSelected(0)
    }

    const slidesElems = imgArr.map((img, idx) =>
        <div key={idx} className="img-slide-div"><img src={img} alt='oatmilk' /></div>)

    const selectorElems = imgArr.map((img, idx) =>
        <ImgSelector key={idx} value={idx} selected={selected} handleChange={handleChange} img={img} />)

    return (
        <div className="img-slider-container">
            <div className="img-slides-container">
                <div className="img-slides-wrapper" ref={ref} style={{ '--wrapper-width': `${imgArr.length}` }}>
                    {slidesElems}
                </div>
                <IoIosArrowDropleftCircle className='slider-arrow-left slider-arrow' onClick={moveLeft} />
                <IoIosArrowDroprightCircle className='slider-arrow-right slider-arrow' onClick={moveRight} />
            </div>
            <div className="slides-selector-container">
                {selectorElems}
            </div>
        </div>
    )
}

function ImgSelector({ value, selected, handleChange, img }) {
    return (
        <label>
            <input type="radio" name='img-selector' value={value} checked={selected === value} onChange={handleChange} />
            <img src={img} alt='oatmilk' />
        </label>
    )
}
