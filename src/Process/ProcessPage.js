import React from 'react'
import ProcessHero from './ProcessHero/ProcessHero'
import Processes from './Processes/Processes'
import Message from '../Components/Message/Message'
import Mountains from '../Illustrations/Mountains'

export default function Process() {
    return (
        <div>
            <ProcessHero />
            <Processes />
            <Message />
            <Mountains />
        </div>
    )
}
