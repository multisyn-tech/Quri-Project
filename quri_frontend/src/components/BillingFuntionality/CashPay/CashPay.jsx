import React from 'react';
import QuriHeading from '../../../assets/Billing/Quri-Heading.png';
import Waiter from '../../../assets/Billing/waiters.png';
import Button from '../Buttons/Button';

const CashPay = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <section className="flex flex-col items-center p-4">
                <div className="mb-8">
                    <img src={QuriHeading} alt="Heading" className="h-16" />
                </div>
                <div className="mb-8">
                    <img src={Waiter} alt="Waiter" className="w-80 h-auto" />
                </div>
                <p className="text-center text-xl text-gray-400 mb-8 leading-tight">
                    Please inform the waiter that you'd like to pay with the card machine or cash
                </p>
                <Button gradientFrom="#0F84F6" gradientTo="#88F2FF">
                    <span>Done</span>
                </Button>
            </section>
        </div>
    );
}

export default CashPay;
