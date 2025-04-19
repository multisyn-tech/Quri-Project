import React, { useState } from 'react';
import { FaRegStar } from "react-icons/fa";
import { CloseOutline } from 'antd-mobile-icons'; // Close icon
import HeadingImage from '../../../../assets/Billing/Modal_Pic.png'; // Image or logo for the restaurant
import { Modal, Box, IconButton } from '@mui/material'; // MUI components
import { PiStarFill } from "react-icons/pi";
const style = {
    position: 'fixed', // Make it fixed to the viewport
    top: "20%",
    left: 0,
    width: '100vw', // Full width of the viewport
    height: "100vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 0, // No rounded corners, as we want to cover the whole screen
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const ReviewModal = ({ open, onClose }) => {
    const [selectedRating, setSelectedRating] = useState(0);

    const handleStarClick = (index) => {
        if (selectedRating === index + 1) {
            setSelectedRating(index); // Decrease the rating by one when the same star is clicked
        } else {
            setSelectedRating(index + 1); // Set the rating to the clicked star
        }
    };

    return (
        <Modal
            open={open} // Control visibility with the `open` prop
            onClose={onClose} // Close modal when backdrop is clicked or close button is clicked
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                {/* Close button */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                >
                    <CloseOutline size={24} />
                </IconButton>

                {/* Image/Logo */}
                <div className="mt-12">
                <img src={HeadingImage} alt="Header Image" className="w-auto max-w-full h-auto border-2 rounded-3xl border-orange-400" />
                </div>

                {/* Restaurant Name */}
                <h2 id="modal-title" className="text-xl font-semibold text-center mt-6">
                    Accents Restaurant
                </h2>

                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mt-6">
                    {[...Array(5)].map((_, index) => (
                        <PiStarFill
                            key={index}
                            size={36}
                            className={`cursor-pointer ${selectedRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => handleStarClick(index)}
                        />
                    ))}
                </div>

                {/* Description */}
                <p id="modal-description" className="text-2xl font-bold text-center mt-6">
                    Share your experience at Accents.
                </p>
            </Box>
        </Modal>
    );
};

export default ReviewModal;
