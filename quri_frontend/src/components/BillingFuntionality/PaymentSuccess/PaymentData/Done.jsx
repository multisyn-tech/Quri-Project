import React, { useState } from 'react';
import star from '../../../../assets/Billing/star.png';
import receipt from '../../../../assets/Billing/receipt.png';
import FooterImage from '../../../../assets/Billing/Quri-Heading.png';
import ReviewModal from './ReviewModal';

const Done = ({ onDownloadReceipt }) => {
    // State to manage the visibility of the ReviewModal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Open the modal
    const openModal = () => {
        setIsModalVisible(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalVisible(false);
    };



    return (
        <>
            {/* Review and Receipt Section */}
            <section className='flex flex-col space-y-4 items-center justify-center w-full p-4'>
                {/* Leave a Review Button */}
                <button
                    className="flex items-center justify-start gap-3 border border-gray-300 text-black py-3 px-6 rounded-full w-full max-w-xs hover:bg-gray-100 active:bg-gray-200 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out"
                    onClick={openModal} // When clicked, open the modal
                >
                    <img src={star} alt="star" className="w-5 h-5" /> {/* Icon aligned to the left */}
                    <span className="font-medium flex-grow text-center text-xl">Leave a Review</span> {/* Text centered */}
                </button>

                {/* Get Receipt Button */}
                <button onClick={onDownloadReceipt} className="flex items-center justify-start gap-3 bg-black text-white py-3 px-6 rounded-full w-full max-w-xs hover:bg-gray-800 active:bg-gray-900 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out">
                    <img src={receipt} alt="receipt" className="w-5 h-5" /> {/* Icon aligned to the left */}
                    <span className="font-medium flex-grow text-center text-xl">Get Receipt</span> {/* Text centered */}
                </button>
            </section>

            {/* Review Modal */}
            <ReviewModal open={isModalVisible} onClose={closeModal} />  {/* Pass modal state to ReviewModal */}

            {/* Footer Section */}
            <footer className='flex items-center justify-center mt-10 mb-2'>
                <p className='flex flex-row items-center justify-center'>
                    served by <span className='ml-2'><img src={FooterImage} alt="Quri Image" width="35" /></span>
                </p>
            </footer>
        </>
    );
};

export default Done;
