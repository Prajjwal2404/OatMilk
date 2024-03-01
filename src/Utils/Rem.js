import { useEffect, useState } from 'react'

export default function useRem({ mobileRem }) {

    const [rem, setRem] = useState(parseFloat(getComputedStyle(document.documentElement).fontSize))

    useEffect(() => {
        if (window.innerWidth <= 650) setRem(mobileRem)
        const handleRemChange = () => {
            if (window.innerWidth > 650) setRem(parseFloat(getComputedStyle(document.documentElement).fontSize))
            else setRem(mobileRem)
        }
        window.addEventListener('resize', handleRemChange)
        return () => window.removeEventListener('resize', handleRemChange)
    }, [])

    return rem
}
