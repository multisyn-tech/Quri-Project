import React from 'react';
import Content from './PaymentData/Content';
import Header from './PaymentData/Header';
import Done from './PaymentData/Done';

const PaymentSuccess = () => {

    

    return (
        <div className="h-screen flex flex-col">
            <header className="flex-none">
                <Header />
            </header>
            <section className="flex-grow">
                <Content />
            </section>
            <section className="flex-none">
                <Done />
            </section>
        </div>
    );
}

export default PaymentSuccess;
