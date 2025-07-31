import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const Profile = ({ isOpen, toggle, title, children }) => {
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

        >
            <DialogTitle id="dialog-title" className="flex  justify-between items-center px-4 py-2">
                <span className="flex text-lg">{title}</span>
                <div className='-mx-4'>
                    <IconButton color="inherit" onClick={toggle}>
                        <FaTimes />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent className="flex flex-col items-center justify-center p-6">
                <div className='text-left w-full'>
                <h1 className='font-bold text-lg'>
                    Hi{' '}
                    <span style={{
                        backgroundImage: 'linear-gradient(to right, #FF5AA7, #FFD855, #FF7B02)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Ibrahim,
                    </span>
                </h1>

                <p className='font-semibold text-left mt-2 '>
                    Earn points by paying with Quri at  Quri select restaurants to unlock discounts.
                </p>
                </div>
                {children}
            </DialogContent>
        </Dialog>
    )
};

export default Profile;