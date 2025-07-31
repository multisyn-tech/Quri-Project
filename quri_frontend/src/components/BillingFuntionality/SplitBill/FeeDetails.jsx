import React from 'react'
import Slider from "react-slick";
import Button from '../Buttons/Button';
import { useNavigate } from 'react-router-dom';
import QuriHeading from '../../../assets/Billing/Quri-Heading.png';
import CardPayment from '../../../assets/Billing/Card.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const QuriFeeDetail = () => {
    const navigate = useNavigate();

    const billingPage = () => {
        navigate('/quri/bill/split');


    }
    const homePage = () => {
        navigate('/quri/home');
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    return (
        <>
            <section className='flex justify-center items-center mt-10'>
                <span> <img src={QuriHeading} alt="Heading" /></span>
            </section>
            <section >
                <Slider {...settings}>
                    <div>
                        <img src={CardPayment} alt="Slide 1" className="w-full" />
                        <h3 className="text-center mt-4 text-2xl font-bold mb-2 uppercase">Swift, secure payments</h3>
                        <p className="text-center text-sm text-gray-400 mb-4">Quri Offers Safe secure payments <br /> for their Customers</p>
                    </div>
                    <div>
                        <img src={CardPayment} alt="Slide 2" className="w-full" />
                        <h3 className="text-center text-2xl mt-4 text-2xl font-bold mb-2 uppercase">Swift, secure payments</h3>
                        <p className="text-center text-sm text-gray-400  mb-4">Quri Offers Safe secure payments <br /> for their Customers</p>
                    </div>
                    <div>
                        <img src={CardPayment} alt="Slide 3" className="w-full" />
                        <h3 className="text-center mt-4 text-2xl font-bold mb-2 uppercase">Swift, secure payments</h3>
                        <p className="text-center text-sm text-gray-400  mb-4">Quri Offers Safe secure payments <br /> for their Customers</p>
                    </div>
                </Slider>
            </section>
            <section className='flex flex-col justify-center items-center space-y-4 mt-20'>
                <Button
                    onClick={billingPage}
                    gradientFrom="#FFD855"
                    gradientTo="#FF7B02"
                >

                    <span>Count Me In</span>
                </Button>
                <Button
                    onClick={homePage}
                    gradientFrom="#0F84F6"
                    gradientTo="#88F2FF"
                >
                    <span>Free Ride</span>

                </Button>
            </section>
        </>
    )
}

export default QuriFeeDetail;