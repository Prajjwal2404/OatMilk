import React from 'react'
import HomeHero from './HomeHero/HomeHero'
import Intro from './Intro/Intro'
import Message from '../Components/Message/Message'
import Mountains from '../Illustrations/Mountains'

export default function Home() {
    return (
        <div>
            <HomeHero />
            <Intro />
            <Message />
            <Mountains />
        </div>
    )
}
