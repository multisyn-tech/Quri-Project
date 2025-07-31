import React, { useEffect } from 'react';
import Home from '../../components/BillingFuntionality/Dashboard/Home';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQRDetails, reset } from '../../features/qrcode/qrcodeSlice';
import scanQR from '../../../src/assets/img/scanQR/11136.jpg'
import { Col, Row } from 'reactstrap';
import SpinnerComponent from '../../Manage/Fallback-spinner';
import { getOrdersByTableID, resetCartItems, reset as resetOrders } from '../../features/orders/orderSlice';



const HomeScreen = () => {
    const { qrCode } = useParams();
    const dispatch = useDispatch();

    const qrdetails = useSelector((state) => state.qrcode.qrCodeDetails);
    const OrderByTableID = useSelector((state) => state.qrcode.ordersByTableID);
    const loading12 = useSelector((state) => state.qrcode.loading);
    const error = useSelector((state) => state.qrcode.error);

    useEffect(() => {
        if (qrCode) {
            dispatch(reset());

            dispatch(resetOrders());   // Reset Orders state
            dispatch(resetCartItems());   // Reset Orders state

            dispatch(getQRDetails(qrCode));

        }
    }, [qrCode, dispatch]);

    // New useEffect to dispatch getOrdersByTableID after qrDetails is fetched
    useEffect(() => {
        if (!loading12 && qrdetails?.flag === 1) {
            dispatch(getOrdersByTableID(qrdetails?.data?.TableID));
        }
    }, [qrdetails, dispatch, loading12]);

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
