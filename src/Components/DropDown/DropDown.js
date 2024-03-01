import React, { useEffect, useRef } from 'react'
import { IoIosArrowDown } from "react-icons/io"
import './DropDown.css'

export default function DropDown({ items, selected, setSelected, name }) {

    const ref = useRef([])

    function handleChange(event) {
        setSelected(event.target.value)
        openClose()
    }

    function openClose() {
        ref.current[1].classList.toggle('open')
    }

    useEffect(() => {
        function checkDropDown(event) {
            if (!ref.current[0].contains(event.target) && !ref.current[1].contains(event.target) &&
                ref.current[1].classList.contains('open')) openClose()
        }
        window.addEventListener('click', checkDropDown)
        return () => window.removeEventListener('click', checkDropDown)
    }, [])

    const dropDownElems = items.map((item, idx) => <DropDownItem key={idx} text={item} name={name}
        handleChange={handleChange} selected={selected} value={item} />)


    return (
        <div className='dropdown-container'>
            <button type='button' className='dropdown-btn' onClick={openClose} ref={el => ref.current[0] = el}>
                {selected}
                <IoIosArrowDown />
            </button>
            <div className='dropdown' ref={el => ref.current[1] = el} style={{ '--max-height-value': `${items.length}` }}>
                <div className='dropdown-wrapper'>
                    {dropDownElems}
                </div>
            </div>
        </div>
    )
}

function DropDownItem({ text, name, handleChange, selected, value }) {
    return (
        <label>
            <p>{text}</p>
            <input type='radio' name={name} value={value} checked={selected === value} onChange={handleChange} />
        </label>
    )
}