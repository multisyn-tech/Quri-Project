import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Fade from '@mui/material/Fade';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams(); // Get the token from the URL

    useEffect(() => {
        const verifyEmail = async () => {
            const response = await axios.get(`${BASE_URL}/admin/verify-email/${token}`);
            // Navigate to the login page after a 2-second delay
        setTimeout(() => {
            setMessage(response.data.message || 'Email verified successfully!');
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
              navigate('/admins/Login');
            }, 2000);
          }, 2000); // Initial delay before showing the success message
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <Box className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            {loading ? (
                <>
                    <Fade in={loading}>
                        <CircularProgress size={60} />
                    </Fade>
                    <Typography variant="h6" className="mt-4 text-center text-gray-800">
                        {message}
                    </Typography>
                </>
            ) : (
                <Fade in={!loading}>
                    <Box className="flex flex-col items-center mt-6">
                        {success ? (
                            <>
                                <CheckCircleOutlineIcon style={{ fontSize: 60, color: 'green' }} />
                                <Typography variant="h5" className="mt-4 text-center text-gray-800">
                                    {message}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <ErrorOutlineIcon style={{ fontSize: 60, color: 'red' }} />
                                <Typography variant="h5" className="mt-4 text-center text-gray-800">
                                    {message}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default VerifyEmail;
