import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDrawer } from '../../../../state/drawerContext';
import SliderImage1 from '../../../../assets/Billing/3d1.png';
import SliderImage2 from '../../../../assets/Billing/3d2.png';
import SliderImage3 from '../../../../assets/Billing/3d3.png';

import SlidingTemplate from '../Modal/SlidingTemplate'

const Sliders = () => {
    const { isRewardsModalOpen, toggleRewardsModal } = useDrawer();

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        appendDots: (dots) => (
            <div
                style={{
                    position: "relative",
                    bottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <ul className="flex">{dots}</ul>
            </div>
        ),
        customPaging: (i) => (
            <div
                className="w-3 h-3 rounded-full "
                style={{
                    backgroundColor: "#d1d1d1", // Inactive dot color
                    marginTop: "10px",
                }}
            ></div>
        ),
    };
    const customCSS = `
        .slick-dots li.slick-active div {
          background-color: #ACACAC !important; /* Active dot color */
        }
      `;


    return (
        <>
            <style>{customCSS}</style>
            <SlidingTemplate isOpen={isRewardsModalOpen} toggle={toggleRewardsModal} title="">
                <div className="text-center w-full max-w-sm mx-auto">
                    <section  >
                        <Slider {...settings}>
                            <div>
                                <img src={SliderImage1} alt="Slide 1" className="w-full" />
                                <h3 className="text-center mt-2 text-2xl font-medium mb-2 ">Pay <span className='text-orange-300'>anywhere</span></h3>
                                <p className="text-center text-sm text-gray-400 mb-4">With Quri, you can order your food any pay your bill hassle-free at any of our supported restaurants! </p>
                            </div>
                            <div>
                                <img src={SliderImage2} alt="Slide 2" className="w-full" />
                                <h3 className="text-center text-2xl mt-2 font-medium mb-2 ">Earn <span className='text-orange-300' >rewards</span> </h3>
                                <p className="text-center text-sm text-gray-400  mb-4">No more carrying loyalty cards or downloading an app. With Quri, by just paying your bill you get access to exclusive discounts at the restaurant!</p>
                            </div>
                            <div>
                                <img src={SliderImage3} alt="Slide 3" className="w-full" />
                                <h3 className="text-center mt-2 text-2xl font-medium mb-2 ">Everyone <span className='text-orange-300'>pays</span></h3>
                                <p className="text-center text-sm text-gray-400  mb-4">No more pulling out a calculator and doing maths with the receipt, easily split the bill with your friends virtually and let us handle the calculations.</p>
                            </div>
                        </Slider>
                    </section>
                </div>
            </SlidingTemplate>
        </>
    )
}

export default Sliders