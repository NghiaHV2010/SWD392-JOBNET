import React from 'react'
import { websites } from '../constants/website.js'

const LogoCarousel = ({ selectedWebsite, setSelectedWebsite }) => {
    return (
        <div className="carousel carousel-center rounded-box size-full gap-20 justify-center">
            {
                websites.map((web, index) => (
                    <div key={index} className="carousel-item carousel-item-logo relative">
                        {!web.isAtice &&
                            <div className="badge badge-error absolute z-10 l-[50%] bottom-0">
                                Coming soon
                            </div>
                        }
                        <img
                            className={`${selectedWebsite.name === web.name ? '' : 'grayscale'} object-contain transition-all`}
                            src={web.logo}
                            alt={web.name}
                            onClick={() => { web.isAtice && setSelectedWebsite(web) }}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default LogoCarousel