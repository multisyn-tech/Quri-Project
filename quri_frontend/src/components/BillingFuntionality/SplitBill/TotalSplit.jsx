import React,{useState,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TotalItems from '../TotalBill/TotalItems';
import AddingTip from '../TotalBill/AddingTip';
import Fee from './Fee'
import BillProceeding from '../TotalBill/BillProceeding';
import SharingPayCode from './SharingPayCode';
import { viewOrder } from '../../../features/orders/orderSlice';

const TotalSplit = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.order);
  const tableId=useSelector((state) => state.qrcode.qrCodeDetails.data.TableID);

  useEffect(() => {
    dispatch(viewOrder(tableId)); // Dispatching the viewOrder action on component mount
}, [dispatch]);



  const QURI_SERVICE_FEE = 0.99;
  const VAT = 14.3;

  const [isQuriFeeVisible, setIsQuriFeeVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);

  const calculateSubtotal = () => {
    if (!order.orderDetails) {
      return 0;
    }
    return order.orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + QURI_SERVICE_FEE + VAT;

  const quriServiceFee = () => {
    setIsQuriFeeVisible(true);
    setIsBillVisible(false);
  }

  const closeQuriFee = () => {
    setIsQuriFeeVisible(false);
  }

  const openBill = () => {
    setIsBillVisible(true);
    setIsQuriFeeVisible(false);
  };

  const closeBill = () => {
    setIsBillVisible(false);
  }

  return (
    <>
      <TotalItems
        orderDetails={order.orderDetails}
        subtotal={subtotal}
        VAT={VAT}
        QURI_SERVICE_FEE={QURI_SERVICE_FEE}
        onShowQuriFee={quriServiceFee}
      />
      <SharingPayCode/>
      <AddingTip
        total={total}
        onShowBill={openBill}
      />
      {isQuriFeeVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div>
            <Fee onClose={closeQuriFee} />
          </div>
        </div>
      )}
      {isBillVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div>
            <BillProceeding onClose={closeBill} total={total} />
          </div>
        </div>
      )}
    </>
  );
}

export default TotalSplit;
