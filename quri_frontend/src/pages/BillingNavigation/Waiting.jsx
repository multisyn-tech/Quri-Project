import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BackgroundImg from "../../assets/Billing/Background.png"
import Bill from '../../components/BillingFuntionality/Billing/Bill';
import TotalBillings from './TotalBillings';
import People from '../../components/BillingFuntionality/SplitBill/SplitBillData/People';
import WaitingScreen from '../MenuNavigation/views/OrderPlaced/OrderPlacingData/Waiting';
import { getDetailsOfOrders, getDetailsOfRejectedOrders, resetCartItems } from '../../features/orders/orderSlice';


// this screeen appears after order placement waaiting for order accept/reject from restaurant
const Waiting = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orders?.orders || []);

    const latestOrder = orderDetails[orderDetails.length - 1];
    let lastOrderId = latestOrder?.result.OrderID
    // console.log("Last order id:", lastOrderId);

    const [lastOrderStatus, setLastOrderStatus] = useState('');
    const [showRejectedItems, setShowRejectedItems] = useState([]);

    const showModal = location.state?.showModal || false;

    const [seconds, setSeconds] = useState(0);



    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    // useEffect(() => {
    //     if (lastOrderStatus === "Accepted") {
    //         setTimeout(() => {
    //             // navigate('/quri/bill/checkout');
    //             navigate('/quri/home/bill');
    //         }, 5000);
    //     }

    // }, [lastOrderStatus, navigate, showRejectedItems]);




    // setTimeout(() => {
    //     dispatch(getDetailsOfOrders(lastOrderId)).then((res) => {
    //         let orderStatus = res.payload;
    //         // console.log(orderStatus)
    //         setLastOrderStatus(orderStatus.orderDetails.Status)
    //         // console.log("Fetched order status:", orderStatus);
    //     });

    //     dispatch(getDetailsOfRejectedOrders(lastOrderId)).then((res) => {
    //         const items = JSON.parse(res?.payload?.RejectedOrder || '[]');
    //         // console.log(items);
    //         console.log(lastOrderStatus);

    //         setShowRejectedItems(items); 

    //         if (lastOrderStatus === "Rejected" && items.length > 0) {
    //             setTimeout(() => {
    //                 // navigate('/quri/menu/home', {
    //                 navigate('/quri/menu/orderSummary', {
    //                     state: { rejectedItems: items } 
    //                 });
    //             }, 5000);
    //         }
    //     });


    // }, 3000);

    useEffect(() => {
        let timer;

        if (lastOrderStatus === "Accepted") {
            timer = setTimeout(() => {
                navigate('/quri/home/bill');
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [lastOrderStatus, navigate, showRejectedItems]);



    useEffect(() => {
        const interval = setInterval(() => {
            console.log("waiting...");
            // console.log("lastOrderStatus:", lastOrderStatus)

            dispatch(getDetailsOfOrders(lastOrderId)).then((res) => {
                const orderStatus = res.payload;
                setLastOrderStatus(orderStatus.orderDetails.Status);


                dispatch(getDetailsOfRejectedOrders(lastOrderId)).then((res2) => {
                    let items = []
                    items = JSON.parse(res2?.payload?.RejectedOrder || '[]');

                    setShowRejectedItems(items);

                    let status = null
                    status = orderStatus?.orderDetails?.Status || lastOrderStatus;

            
                    // console.log("status of order:", status)
                    // console.log("rejected items :", items)



                    if (status === "Rejected" && items.length > 0) {
                        clearInterval(interval); //  Stop polling if order is rejected
                        navigate('/quri/menu/orderSummary', {
                            state: { rejectedItems: items },
                        });
                    }
                });
            });
        }, 20000);

        return () => clearInterval(interval);
    }, [dispatch, lastOrderId, navigate]);







    const handleCloseModal = () => {
        navigate('/quri/home/bill', { state: { showModal: false } });
    };

    return (
        <div className='' >
            <WaitingScreen />
        </div>
    );
}

export default Waiting;
