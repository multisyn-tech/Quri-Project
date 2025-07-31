import React, { useEffect, useState, useRef } from "react";
import { TbChevronsDownLeft, TbCreditCard } from "react-icons/tb";
import { IoLogoApple } from "react-icons/io5";
import { useSelector } from 'react-redux';

import { loadStripe } from '@stripe/stripe-js';

import Swal from 'sweetalert2';

import { QURI_SERVICE_FEE } from '../../../config/constants';
import axios from "axios";

import GooglePayButton from '@google-pay/button-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;

import ApplePayButton from "./utility/ApplePayButton";
import Airpay from "./utility/Airpay";


const NewCardPay = () => {

  const airpayRef = useRef();


  const [tip, setTip] = useState(0);
  const [loading, setLoading] = useState(false)
  const [showModalSpinner, setShowModalSpinner] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');


  const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
  const orderInfo = useSelector((state) => state.orders?.order?.order?.order || []);

  const orderID = useSelector((state) => state.orders?.order?.order?.OrderID || null);



  const calculateSubtotal = () => {
    return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
  };



  useEffect(() => {
    const updateTip = () => {
      const updatedTip = JSON.parse(localStorage.getItem('tipAmount')) || 0;
      setTip(updatedTip);
    };

    // Listen to custom event
    window.addEventListener('tipUpdated', updateTip);

    return () => {
      window.removeEventListener('tipUpdated', updateTip);
    };
  }, []);



  const subtotal = calculateSubtotal();
  let total = (parseFloat(subtotal) || 0) + (parseFloat(QURI_SERVICE_FEE) || 0) + (parseFloat(tip) || 0);
  let formattedTotal = total.toFixed(2);


  // store orderdetails to local storage for use in success page
  localStorage.removeItem("billAmount");
  localStorage.setItem("billAmount", JSON.stringify(Number(total).toFixed(2)));


  const handleExternalTrigger = () => {
    if (airpayRef.current) {
      airpayRef.current.submit(); // triggers handleSubmit from Airpay.jsx
    }
  };



  // --------------------------------------------------


  const handleStripePayment = async () => {


    // console.log("btn clicked...")
    // console.log("order detais:", orderDetails)
    // return; 

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

      // data to send at backend
      const body = {
        amount: parseFloat(total.toFixed(2)),
        orderDetails: orderDetails,
        orderInfo: orderInfo
      }

      // Call stripe api endpoint
      const stripe_response = await fetch(`${BASE_URL}/bill/full-bill-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const session = await stripe_response.json()

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: `Something went wrong`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }

    }
    catch (error) {
      console.error("Stripe Payment Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Payment process failed',
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }

  };

  // ----------------------------------------------------
  // handle Network Genius Payment
  const handleN_GeniusPayment = async () => {

    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}/bill/n-genius-payment`, {
        formattedTotal,
        orderID,
        orderDetails,
        orderInfo
      });
      const paymentUrl = response.data?.payment_url;

      // console.log("payment url:", paymentUrl)

      if (paymentUrl) {
        window.location.href = `${paymentUrl}&slim=0`; // redirect user to payment page
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Payment process failed',
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setLoading(false)
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      setLoading(false)
      console.error("Payment Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Payment process failed',
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }


  // ----------------------------------------------------
  // handle airpay payment 

  // const handleAirpayPayment = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${BASE_URL}/bill/airpay-payment`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         orderId: orderID,
  //         amount: formattedTotal,
  //         customerEmail: 'customer@email.com',
  //         customerPhone: '9712343412321',
  //         currency: 'AED',
  //         isocurrency: 'AED',
  //         splitData: "BANKID1^60|BANKID2^40",
  //       }),
  //     });

  //     const data = await res.json();
  //     console.log("Response of Airpay payment:", data);

  //     if (res.status === 400 && data.errors) {
  //       alert("Validation errors: " + Object.values(data.errors).join(", "));
  //       setLoading(false);
  //       return;
  //     }

  //     if (data.paymentUrl) {
  //       const form = document.createElement('form');
  //       form.method = 'POST';
  //       form.action = data.paymentUrl;

  //       const fields = {
  //         mid: data.mid,
  //         data: data.data,
  //         privatekey: data.privatekey,
  //         checksum: data.checksum,
  //       };

  //       Object.entries(fields).forEach(([key, value]) => {
  //         const input = document.createElement('input');
  //         input.type = 'hidden';
  //         input.name = key;
  //         input.value = value;
  //         form.appendChild(input);
  //       });

  //       document.body.appendChild(form);
  //       form.submit();
  //     } else {
  //       alert("Payment initiation failed");
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error occurred during Airpay payment:", error);
  //     alert("Payment initiation failed");
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = () => {
    console.log("Airpay Submit from parent triggered");
    // Put your actual logic here
  };

  // ----------------------------------------------------


  const openPaymentsModal = () => {
    setShowModal(true);
    setShowModalSpinner(true);
    setTimeout(() => {
      setShowModalSpinner(false);
    }, 5000);
  }


  const handleSubmitPayment = (selectedOption = paymentOption) => {
    setShowModalSpinner(true)
    setLoading(true)
    setShowModal(false);

    if (selectedOption === 'stripe') {
      handleStripePayment();
    } else if (selectedOption === 'ngenius') {
      handleN_GeniusPayment();
    } else if (selectedOption === 'airpay') {
      // handleAirpayPayment()
    }
  };


  // handle G-Pay payment using token
  const gpayPayment = async (obj) => {

    const token = obj.paymentMethodData.tokenizationData.token;
    // console.log("token of G pay is:". token)


    // Send token to backend
    try {
      const res = await fetch(`${BASE_URL}/bill/process-gpay-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, orderInfo }),
      });

      const result = await res.json();
      if (result.success) {
        window.location.href = `${FRONTEND_BASE_URL}/quri/menu/orderPlaced`;
      } else {
        window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`;
      }
    } catch (err) {
      console.error('Payment error', err);
      window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`;
    }

  }


  return (
    <div className="p-4 flex flex-col justify-center w-full pb-5">
      {/* Payment Information */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-xl">You pay</h1>
          <p className="text-xs text-gray-400">Inclusive of all taxes & charges</p>
        </div>
        <div className="flex space-x-1 font-bold space-y-3">
          <p className="text-xl font-medium">AED {total != null ? formattedTotal : '00.0'}</p>
        </div>
      </div>

      {/* Payment Buttons */}
      {/*
      <div className="flex gap-4">
        <button onClick={handleStripePayment} className="flex items-center justify-center gap-2 border border-gray-300 text-black py-2 px-4 rounded-full w-full hover:bg-gray-100 active:bg-gray-200 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out">
          <TbCreditCard className="text-2xl" />
          <span className="text-lg "> Pay Bill </span>
        </button>

        
        {loading ? (
          <>
            <p className="my-4">
              Redirecting...
            </p>
          </>
        ) : (
          <button onClick={handleN_GeniusPayment} className="flex items-center justify-center gap-2 border border-gray-300 text-black py-2 px-4 rounded-full w-full hover:bg-gray-100 active:bg-gray-200 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out">
            <TbCreditCard className="text-2xl" />
            <span className="text-lg "> Checkout </span>
          </button>
        )}
      </div>
      */}


      <div>
        {/* Main Button */}

        {loading ?
          <>
            <div className="flex items-center justify-center gap-2 border border-gray-300 text-black py-2 px-4 rounded-full w-full bg-gray-100 cursor-not-allowed">
              <svg className="animate-spin h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="text-lg">Processing...</span>
            </div>
          </>
          :
          <>
            <button
              onClick={openPaymentsModal}
              className="flex items-center justify-center gap-2 border border-gray-300 text-black py-2 px-4 rounded-full w-full hover:bg-gray-100 active:bg-gray-200 active:scale-95 active:shadow-inner transition duration-150"
            >
              <TbCreditCard className="text-2xl" />
              <span className="text-lg">Pay Now</span>
            </button>
          </>
        }


        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
              {showModalSpinner ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="text-blue-600">Loading payment methods...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>


                  <div className="mb-4 text-center">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      {/* <button
                        type="button"
                        className={`w-60 px-4 py-2 rounded font-semibold shadow ${paymentOption === 'stripe'
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-100 text-blue-700'
                          } hover:bg-blue-800 hover:text-white active:bg-blue-900 active:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onClick={() => {
                          const selected = 'stripe';
                          setPaymentOption(selected);
                          handleSubmitPayment(selected);
                        }}
                      >
                        Pay with Stripe
                      </button> */}

                      {/* pay with airpay */}

                      {/* <div>
                        <div className="flex justify-center my-1">
                          <Airpay ref={airpayRef} order_amount={formattedTotal} order_id={orderID} />
                        </div>
                      </div> */}



                      <button
                        type="button"
                        className={`w-60 px-4 py-2 rounded font-semibold shadow ${paymentOption === 'ngenius'
                          ? 'bg-green-700 text-white'
                          : 'bg-green-100 text-green-700'
                          }`}
                        onClick={() => {
                          const selected = 'ngenius';
                          setPaymentOption(selected);
                          handleSubmitPayment(selected);
                        }}
                      >
                        Pay with Card
                      </button>
                    </div>

                    <div className="flex justify-center my-1">
                      <GooglePayButton
                        buttonType="pay"
                        buttonColor="black"
                        buttonSizeMode="fill"
                        buttonLocale="en"
                        environment="TEST"
                        paymentRequest={{
                          apiVersion: 2,
                          apiVersionMinor: 0,
                          allowedPaymentMethods: [
                            {
                              type: 'CARD',
                              parameters: {
                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                              },
                              tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                  gateway: 'example',
                                  gatewayMerchantId: 'exampleGatewayMerchantId',
                                },
                              },
                            },
                          ],
                          merchantInfo: {
                            merchantId: 'BCR2DN4T2735VBRB',
                            merchantName: 'Quri',
                          },
                          transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: formattedTotal,
                            currencyCode: 'AED',
                            countryCode: 'AE',
                          },
                        }}
                        onLoadPaymentData={paymentRequest => {
                          // console.log('load payment data', paymentRequest);
                          gpayPayment(paymentRequest)
                        }}
                      />

                    </div>


                    <div className="flex justify-center my-1">
                      <ApplePayButton amount={formattedTotal} orderInfo={orderInfo} />
                    </div>

                  </div>



                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    {/* <button
                      onClick={handleSubmitPayment}
                      disabled={!paymentOption}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Submit
                    </button> */}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>



    </div>
  );
};

export default NewCardPay;
