import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import FooterImage from '../../../../assets/Billing/love_quri.png';

const SlidingTemplate = ({ isOpen, toggle, title, children }) => {
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
                {children}
                <div>
                    <img src={FooterImage} alt="Footer Image" />
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default SlidingTemplate;