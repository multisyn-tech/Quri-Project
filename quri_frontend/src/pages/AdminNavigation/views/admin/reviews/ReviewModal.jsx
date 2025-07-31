import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Rating, Box } from '@mui/material';
import { IoIosClose } from "react-icons/io";

const ReviewModal = ({ open, onClose, review }) => {
    if (!review) return null;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="review-dialog-title" maxWidth="sm" fullWidth>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                    <IoIosClose size={25} />
                </Button>
            </DialogActions>
            <DialogTitle id="review-dialog-title" className='flex flex-col items-center justify-center'>
                <Typography variant="subtitle1" gutterBottom>
                    Review ID # {review.ReviewID}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Order ID # {review.OrderID}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" alignItems="center" mt={2} mb={2} className='flex flex-col justify-center items-center'>
                    <Box ml={1}>
                        <Typography variant="h6">{Number(review.Rating).toFixed(1)}/5</Typography>
                    </Box>
                    <Rating name="read-only" value={Number(review.Rating)} readOnly precision={0.5} />
                </Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Review
                </Typography>
                <Box bgcolor="background.paper" p={2} borderRadius={2} boxShadow={3}>
                    <Typography>{review.Comments}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
