import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, addSettings } from '../../../../../features/settings/settingSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BackgroundCover = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const dispatch = useDispatch();

    const img = useSelector((state) => state.settings.img);

    const bgimg = useSelector((state) =>
        state.settings.settings.find((item) => item.KeyID === 'bg')?.Value
    );

    const loading = useSelector((state) => state.settings.loading);



    const resID = localStorage.getItem('RestaurantID'); // Assuming the RestaurantID is stored in local storage

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    // Fetch settings (and image) immediately after the component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            await dispatch(getSettings());
        };
        fetchSettings();
    }, [dispatch]);


    const handleUpload = (key, selectedImage) => {
        dispatch(addSettings({ key: "bg", selectedImage, resID }))
            .unwrap()
            .then(() => {
                setOpenSnackbar(true);  // Show success snackbar
                dispatch(getSettings());  // Refetch settings to get the updated image
            })
            .catch(error => console.error('Error uploading image:', error.message));
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Image uploaded successfully!
                </MuiAlert>
            </Snackbar>
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center md:mr-4 mb-4 md:mb-0">
                    <div className="me-4">
                        <img
                            className="rounded"
                            src={img == null || img === '' ? 'default-profile-image-path' : `${BASE_URL}/${bgimg}`}
                            alt="User"
                            height="100"
                            width="100"
                        />
                    </div>
                    <div className="flex items-end mt-2 md:mt-0">
                        <div>
                            <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                Upload
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleUpload('image', e.target.files[0])}
                                />
                            </label>
                            <p className="text-sm mt-1">Allowed JPG or PNG.</p>
                        </div>
                    </div>
                </div>
                {loading && <p>Loading...</p>}
            </div>
        </>
    );
};

export default BackgroundCover;
