import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TotalSplit from './TotalSplit';
const BillSplit = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate('/quri/home/bill');
    }
    return (
        <>
            <header className="p-4 mt-2">
                <section className="flex flex-row items-center justify-between">
                    <button className="mb-4" onClick={goBack}>
                        <FaArrowLeft size={24} />
                    </button>
                    <h1 className="flex-grow text-center text-xl text-gray-500 font-bold">Pay Your Bill</h1>
                </section>
            </header>

            <header>
                <TotalSplit />
            </header>
        </>
    )
}


export default BillSplit;