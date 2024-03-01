import { useEffect, useState } from "react"

export default function useMedia(screen) {
    const [matches, setMatches] = useState(window.matchMedia(screen).matches)

    useEffect(() => {
        const listener = () => setMatches(window.matchMedia(screen).matches)
        window.addEventListener('resize', listener)
        return () => window.removeEventListener('resize', listener)
    }, [matches, screen])

    return matches
}