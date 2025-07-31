import React,{useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BackgroundImg from "../../assets/Billing/Background.png"
import Bill from '../../components/BillingFuntionality/Billing/Bill';
import TotalBillings from './TotalBillings';
import People from '../../components/BillingFuntionality/SplitBill/SplitBillData/People';

const Billing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const showModal = location.state?.showModal || false;




    const handleCloseModal = () => {
        navigate('/quri/home/bill', { state: { showModal: false } });
    };

    return (
        <div className='' >
            <Bill />
            {showModal && <People onClose={handleCloseModal} />}
            {/* <TotalBillings/> */}
        </div>
    );
}

export default Billing;
