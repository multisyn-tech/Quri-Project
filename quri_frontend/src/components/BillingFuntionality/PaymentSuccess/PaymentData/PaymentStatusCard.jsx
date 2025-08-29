import React from 'react';

const PaymentStatusCard = ({ tableNumber, dateTime, amountPaid, status }) => {
    // Define colors for different statuses
    const statusColors = {
        fullyPaid: 'bg-green-400',
        partiallyPaid: 'bg-orange-400 ',
        unpaid: 'bg-red-400'
    };

    return (
        <section className="flex justify-center items-center w-full h-full p-4">
            <div className="w-full max-w-md bg-purple-100 rounded-xl shadow-md p-6">
                <div className='flex items-center justify-center' style={{color:'#40008C'}}>
                <p>{dateTime}</p>
                </div>
                <div className="flex justify-between items-center">
                    
                    <div style={{color:'#40008C'}}>
                        <p>Table: {tableNumber}</p>        
                    </div>
                    <div className={`px-3 py-1 rounded text-white font-bold ${statusColors[status]} text-sm`}>
                        {status === 'fullyPaid' && 'Fully paid'}
                        {status === 'partiallyPaid' && 'Partially paid'}
                        {status === 'unpaid' && 'Unpaid'}
                    </div>
                </div>
                <div className="mt-2 flex justify-between items-center" style={{color:'#40008C'}}>
                    <p className="font-bold text-lg" >You paid:</p>
                    <p className="font-bold text-lg">
                        {amountPaid} AED
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PaymentStatusCard;
