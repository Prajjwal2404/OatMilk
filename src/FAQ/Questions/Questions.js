import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqs } from '../../Db/faqs'
import './Questions.css'

export default function Questions() {

    const [selected, setSelected] = useState('oatmilk')

    function handleChange(event) {
        setSelected(event.target.value)
    }

    const faqsArr = faqs.filter(({ category }) => category === selected)

    const faqsElems = faqsArr.map(faq => <Question key={faq.id} question={faq.question} answer={faq.answer} />)

    return (
        <div className='questions-container'>
            <div className='questions-tab-container'>
                <label>
                    <input type='radio' name='faq' value='oatmilk' checked={selected === 'oatmilk'} onChange={handleChange} />
                    OATMILK
                </label>
                <label>
                    <input type='radio' name='faq' value='usage' checked={selected === 'usage'} onChange={handleChange} />
                    USAGE
                </label>
                <label>
                    <input type='radio' name='faq' value='delivery' checked={selected === 'delivery'} onChange={handleChange} />
                    DELIVERY
                </label>
                <label>
                    <input type='radio' name='faq' value='nutritional' checked={selected === 'nutritional'} onChange={handleChange} />
                    NUTRITIONAL INFO
                </label>
                <label>
                    <input type='radio' name='faq' value='sustainability' checked={selected === 'sustainability'} onChange={handleChange} />
                    SUSTAINABILITY
                </label>
            </div>
            <div className='questions-wrapper'>
                <AnimatePresence mode='wait'>
                    {faqsElems}
                </AnimatePresence>
            </div>
        </div>
    )
}

function Question({ question, answer }) {
    return (
        <>
            <motion.div className='question-div'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {question}
                {answer}
            </motion.div>
            <hr color='#dfdfdf' />
        </>
    )
}