import { useEffect } from 'react'
import image1 from '../Img/earth.webp'
import image2 from '../Img/environment.webp'
import image3 from '../Img/vision.webp'
import image4 from '../Img/fonepay.svg'
import image5 from '../Img/label.webp'
import image6 from '../Img/leaf1.webp'
import image7 from '../Img/leaf2.webp'
import image8 from '../Img/logo.svg'
import image9 from '../Img/milk.svg'
import image10 from '../Img/mission.webp'
import image11 from '../Img/nushnjay-logo.webp'
import image12 from '../Img/nushoat.webp'
import image13 from '../Img/oatmilk.webp'

const imageArray = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13]

export default function PreloadImg() {
    useEffect(() => {
        imageArray.forEach(src => {
            const img = new Image()
            img.src = src
        })
    }, [])

    return null
}
