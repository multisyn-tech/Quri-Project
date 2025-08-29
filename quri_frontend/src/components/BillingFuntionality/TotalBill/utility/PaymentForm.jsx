// src/components/PaymentForm.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const PaymentForm = ({ formattedTotal, orderID, orderDetails, orderInfo }) => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://paypage.sandbox.ngenius-payments.com/hosted-sessions/sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('N-Genius SDK loaded successfully');
      if (window.NI) {
        setSdkReady(true);
      } else {
        console.error('NI object not found after load');
      }
    };
    script.onerror = () => {
      console.error('Failed to load N-Genius SDK. Check network or URL.');
    };
    document.body.appendChild(script);

    const checkNI = setInterval(() => {
      if (window.NI) {
        setSdkReady(true);
        clearInterval(checkNI);
      }
    }, 500);

    return () => {
      document.body.removeChild(script);
      clearInterval(checkNI);
    };
  }, []);

  const mountPaymentForm = () => {

    const apiKey = "YWUwZjBiM2UtODhkZi00ZDdiLTkyMjktN2JkODRhZTE2YzY2OjVkOGExMjY1LTYyY2YtNGU4OS1iYmUxLWI5OGRlYzNiZWJiZA==";
    const outletRef = "95518459-7efd-407a-9708-b452ce50efbd";



    // if (window.NI && iframeRef.current && apiKey) {
    if (!iframeRef.current.dataset.mounted) {
      window.NI.mountCardInput({
        apiKey: apiKey, // Test with apiKey if needed
        outletRef: outletRef,
        language: 'en',
        style: { base: { color: '#000', fontSize: '16px' } },
        multiplePaymentMethods: true,
        orderDetails: { amount: { currencyCode: 'AED', value: Math.round(parseFloat(formattedTotal) * 100) } },
        onSuccess: () => {
          console.log('Payment form mounted');
          iframeRef.current.dataset.mounted = true;
        },
        onFail: (error) => console.error('Mount failed:', error),
        onChangePaymentMethod: (method) => console.log('Method:', method),
        onChangeValidStatus: (status) => {
          console.log('Valid:', status);
          setIsFormValid(status.isCVVValid && status.isExpiryValid && status.isNameValid && status.isPanValid);
        },
      }, document.getElementById("ngenius-card-frame"));
    } else {
      console.error('NI not available, iframe ref not set, or API key missing');
    }
  };

  useEffect(() => {
    if (sdkReady && iframeRef.current) {
      setTimeout(mountPaymentForm, 500); // Delay for SDK and env readiness
    }
  }, [formattedTotal, sdkReady]);

  const handleN_GeniusPayment = async () => {
    setLoading(true);
    if (!window.NI || !sdkReady || !isFormValid) {
      alert('Please enter valid card details or refresh if SDK is not loaded.');
      setLoading(false);
      return;
    }
    try {
      // const response = await window.NI.generateSessionId({ mountId: iframeRef.current.id });
      const response = await window.NI.generateSessionId({ mountId: 'ngenius-card-frame' });
      console.log('Session ID:', response.session_id);
      const sessionId = response.session_id;

      const paymentResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bill/n-genius-payment`, {
        sessionId,
        amount: Math.round(parseFloat(formattedTotal) * 100),
        orderID,
      }).catch(err => {
        console.error('Axios Error:', err.response?.data || err.message);
        throw new Error('Network or API error');
      });

      console.log('Payment Response Data:', paymentResponse.data);
      const { status, error } = await window.NI.handlePaymentResponse(paymentResponse.data);
      if (status === window.NI.paymentStates.CAPTURED || status === window.NI.paymentStates.AUTHORISED) {
        window.location.href = `/success?reference=${orderID}&status=success`;
      } else if (status) {
        alert('Payment failed: ' + (error || 'status: ' + status));
      } else {
        alert('Invalid response from payment gateway');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment process failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* <div id="payment-iframe" ref={iframeRef}></div> */}
      <div id="ngenius-card-frame" ref={iframeRef}></div>
      <button onClick={handleN_GeniusPayment} disabled={loading || !isFormValid}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentForm;