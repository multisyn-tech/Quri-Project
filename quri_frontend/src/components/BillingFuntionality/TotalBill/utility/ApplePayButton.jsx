import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;

const ApplePayButton = ({ amount }) => {
  useEffect(() => {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      document.getElementById("apple-pay-button").style.display = "inline-block";
    } else {
      console.log("Apply Pay Not supported in this Browser")
    }
  }, []);

  const startApplePay = () => {
    const paymentRequest = {
      countryCode: "AE", // Change if needed
      currencyCode: "AED",
      total: {
        label: "Quri",
        amount: amount,
      },
      supportedNetworks: ["visa", "masterCard"],
      merchantCapabilities: ["supports3DS"],
      merchantIdentifier: "merchant.com.quri", // Your real merchant ID
    };

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {


      try {
        const response = await fetch(`${BASE_URL}/bill/handle-applypay-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            validationURL: event.validationURL,
          }),
        });

        const merchantSession = await response.json();
        session.completeMerchantValidation(merchantSession);

        if (merchantSession.success) {
          window.location.href = `${FRONTEND_BASE_URL}/quri/menu/orderPlaced`;
        } else {
          window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`;
        }
        
      } catch (err) {
        console.error("Merchant validation failed", err);
        session.abort();
        window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`;
      }

    };

    session.onpaymentauthorized = (event) => {
      console.log("Payment authorized (not processed):", event.payment);
      session.completePayment(ApplePaySession.STATUS_SUCCESS);
    };

    session.begin();
  };

  return (
    <div
      id="apple-pay-button"
      onClick={startApplePay}
      style={{
        display: "none",
        width: "240px",
        height: "44px",
        backgroundColor: "black",
        color: "white",
        fontSize: "17px",
        fontWeight: "bold",
        borderRadius: "10px",
        textAlign: "center",
        lineHeight: "44px",
        cursor: "pointer",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
       Pay
    </div>
  );
};

export default ApplePayButton;
