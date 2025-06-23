import React from 'react'
import { images } from '../constants/images'

const LogoCarousel = () => {
    return (
        <div className="carousel carousel-center rounded-box size-full gap-20 justify-center">
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale scale-150'
                    src={images.topcv_logo}
                    alt="topcv"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale object-contain'
                    src={images.itviec_logo}
                    alt="itviec"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale'
                    src={images.vieclam24h_logo}
                    alt="vieclam24h"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale object-contain'
                    src={images.topdev_logo}
                    alt="topdev"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale object-contain'
                    src={images.careerViet_logo}
                    alt="careerviet"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale object-contain'
                    src={images.careerLink_logo}
                    alt="careerlink"
                />
            </div>
            <div className="carousel-item carousel-item-logo">
                <img
                    className='grayscale'
                    src={images.vietnamwork_logo}
                    alt="vietnamwork"
                />
            </div>
        </div>
    )
}

export default LogoCarousel