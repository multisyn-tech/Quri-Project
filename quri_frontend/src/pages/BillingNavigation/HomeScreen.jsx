import React, { useEffect, useState, useRef } from 'react';
import Home from '../../components/BillingFuntionality/Dashboard/Home';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQRDetails, reset } from '../../features/qrcode/qrcodeSlice';
import scanQR from '../../../src/assets/img/scanQR/11136.jpg'
import { Col, Row } from 'reactstrap';
import SpinnerComponent from '../../Manage/Fallback-spinner';
import { getOrdersByTableID, resetCartItems, reset as resetOrders } from '../../features/orders/orderSlice';
import { v4 as uuidv4 } from "uuid";
import storeHelpers from "../../components/utility/storeStage";
import { resetActivity } from '../../features/activity/activitySlice';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const HomeScreen = () => {
    const { qrCode } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const qrdetails = useSelector((state) => state.qrcode.qrCodeDetails);
    const OrderByTableID = useSelector((state) => state.qrcode.qrCodeDetails?.data?.TableID);
    const loading12 = useSelector((state) => state.qrcode.loading);
    const error = useSelector((state) => state.qrcode.error);
    const { getOrderStatus } = storeHelpers;
    const [pollingActive, setPollingActive] = useState(true);
    const [activities, setActivities] = useState([]);
    const hasFetchedActivities = useRef(false);

    useEffect(() => {
        if (qrCode) {
            // dispatch(reset());
            // dispatch(resetOrders());   // Reset Orders state
            // dispatch(resetCartItems());

            dispatch(getQRDetails(qrCode));

        }
    }, [qrCode, dispatch]);


    useEffect(() => {
        if (!loading12 && qrdetails?.flag === 1) {
            dispatch(getOrdersByTableID(qrdetails?.data?.TableID));
        }
    }, [qrdetails, dispatch, loading12]);


    useEffect(() => {
        if (OrderByTableID) {
            localStorage.setItem("tableId", OrderByTableID);
        }
    }, [OrderByTableID]);


    const getOrCreateUserId = () => {
        let id = localStorage.getItem("user_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("user_id", id);
        }

        return id;
    };


    const checkAndRedirect = (stage) => {
        // console.log("Redirecting based on stage:", stage);
        if (stage == "created") navigate("/quri/menu/home");
        if (stage == "checkout" || stage == "confirmed") navigate("/quri/home/bill");
        if (stage == "paid") navigate("/quri/menu/orderPlaced");
    };


    const fetchActivities = async () => {
        const restId = parseInt(localStorage.getItem('RestaurantID'), 10);
        const tabId = parseInt(localStorage.getItem('tableId'), 10);
        // console.log(restId, tabId)
        try {
            const response = await fetch(`${BASE_URL}/customers/get_all_activity/${restId}/${tabId}`);
            const data = await response.json();
            // console.log(data)
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };




    // useEffect(() => {

    //     getOrCreateUserId();

    //     const fetchAndCheckStage = async () => {
    //         await fetchActivities();

    //         if (activities.length > 0) {
    //             const lastActivity = activities[activities.length - 1];
    //             if (lastActivity && lastActivity.stage) {
    //                 // console.log(lastActivity.stage);
    //                 checkAndRedirect(lastActivity.stage);
    //             }
    //         }
    //     };

    //     fetchAndCheckStage();

    //     const pollingInterval = setInterval(() => {
    //         if (activities.length === 0) {
    //             // console.log("No activities, fetching...");
    //             fetchActivities();
    //         } else {
    //             const lastActivity = activities[activities.length - 1];
    //             if (lastActivity && lastActivity.stage) {
    //                 // console.log("Polling stage:", lastActivity.stage);
    //                 checkAndRedirect(lastActivity.stage);
    //             }
    //         }
    //     }, 3000);


    //     return () => clearInterval(pollingInterval);

    // }, [navigate, activities]);



    // 👇 This effect ONLY runs when a new QR code resolves to a TableID





    useEffect(() => {
        if (OrderByTableID) {
            localStorage.setItem("tableId", OrderByTableID);
          
            fetchActivities().then(() => {
                setTimeout(() => {
                    setActivities((prev) => {
                        if (prev.length > 0) {
                            const lastActivity = prev[prev.length - 1];
                            if (lastActivity?.stage) {
                                checkAndRedirect(lastActivity.stage);
                            }
                        }
                        return prev;
                    });
                }, 1000);
            });
        }
    }, [OrderByTableID]);


    useEffect(() => {
        getOrCreateUserId();

        const pollingInterval = setInterval(() => {
            setActivities((prev) => {
                if (prev.length === 0) {
                    fetchActivities();
                } else {
                    const lastActivity = prev[prev.length - 1];
                    if (lastActivity?.stage) {
                        checkAndRedirect(lastActivity.stage);
                    }
                }
                return prev;
            });
        }, 3000);

        return () => clearInterval(pollingInterval);
    }, [navigate]);









    if (loading12) {
        return <SpinnerComponent />;
    }

    if (!loading12 && qrdetails?.flag === 1) {
        return (
            <div>
                <Home />
            </div>
        );
    }

    if (!loading12 && qrdetails?.flag === 0) {
        return (
            <div>
                <Home />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {/* {console.log('ERRORr', error)} */}
                <Row className='m-2'>
                    <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                        <div className='w-full h-full' style={{ maxWidth: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={scanQR}
                                alt="Scan QR"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    maxWidth: '60%',
                                }}
                            />
                        </div>
                    </Col>
                    <Col xs='12' sm='12' md='12' lg='12' xl='12' style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>
                            {error ? (
                                <>
                                    {error} <br />
                                    <span>Try Again</span>
                                </>
                            ) : (
                                'An error occurred'
                            )}
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }


};

export default HomeScreen;
