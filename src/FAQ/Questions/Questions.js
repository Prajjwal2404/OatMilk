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
                <QuestionTabs value='oatmilk' selected={selected} handleChange={handleChange} title='OATMILK' />
                <QuestionTabs value='usage' selected={selected} handleChange={handleChange} title='USAGE' />
                <QuestionTabs value='delivery' selected={selected} handleChange={handleChange} title='DELIVERY' />
                <QuestionTabs value='nutritional' selected={selected} handleChange={handleChange} title='NUTRITIONAL INFO' />
                <QuestionTabs value='sustainability' selected={selected} handleChange={handleChange} title='SUSTAINABILITY' />
            </div>
            <div className='questions-wrapper'>
                <AnimatePresence mode='wait'>
                    {faqsElems}
                </AnimatePresence>
            </div>
        </div>
    )
}

function QuestionTabs({ value, selected, handleChange, title }) {
    return (
        <label>
            <input type='radio' name='faq' value={value} checked={selected === value} onChange={handleChange} />
            {title}
        </label>
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