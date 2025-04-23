import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { IoCloseOutline } from "react-icons/io5";
import BackgroundImage from '../../../../assets/Billing/Sign_In_Card.png'; // Import the background image
import HeaderImage from '../../../../assets/Billing/Exclusive_Rewards.png';
import stars from '../../../../assets/Billing/Starrrrrrrrrrrrrrrrrrrrzzzzzzz.png';
import FooterImage from '../../../../assets/Billing/Quri-Heading.png';


const ReusableModal = ({ isOpen, toggle, title, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      aria-labelledby="dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          overflow: 'hidden',

        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'transparent', // Make the backdrop invisible
          },
        },
      }}
    >
      <DialogTitle id="dialog-title" className="flex  justify-between items-center px-4 py-2">
        <span className="flex text-lg">{title}</span>
        <div className='-mx-4'>
          <IconButton color="inherit" onClick={toggle}>
            <IoCloseOutline />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent
        className="flex flex-col items-center justify-center p-6"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='flex justify-start items-center'>
          {/* Welcome Back Section */}
          <div className="absolute left-10  flex  items-start">
            <h1 className="flex flex-col font-normal text-2xl">
              Welcome Back
              <span
                style={{
                  backgroundImage: 'linear-gradient(to right, #FF5AA7, #FFD855, #FF7B02)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
              {/* name */}
              </span>
            </h1>
            <img src={stars} alt="Star Image" />
          </div>
        </div>


        {children}
        <div className='flex w-full mt-4 items-center justify-center'>
          <p className='font-normal text-[#000000] px-2'>with love by</p>
          <img src={FooterImage} alt="Footer Image" width={"28px"} height={"10px"}/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableModal;
