import React from 'react'
import AboutHero from './AboutHero/AboutHero'
import AboutIntro from './AboutIntro/AboutIntro'
import Message from '../Components/Message/Message'
import Mountains from '../Illustrations/Mountains'

export default function About() {
    return (
        <div>
            <AboutHero />
            <AboutIntro />
            <Message />
            <Mountains />
        </div>
    )
}
