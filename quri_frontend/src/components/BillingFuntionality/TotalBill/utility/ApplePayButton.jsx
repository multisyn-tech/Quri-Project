import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;

const ApplePayButton = ({ amount, orderInfo }) => {
  useEffect(() => {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      document.getElementById("apple-pay-button").style.display = "inline-block";
    } else {
      console.log("Apple Pay not supported in this browser");
    }
  }, []);

  const startApplePay = () => {
    
    const paymentRequest = {
      countryCode: "AE",
      currencyCode: "AED",
      total: {
        label: "Quri",
        amount: amount,
      },
      supportedNetworks: ["visa", "masterCard"],
      merchantCapabilities: ["supports3DS"],
      merchantIdentifier: "merchant.com.quri",
    };

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {
      try {
        const response = await fetch(`${BASE_URL}/bill/handle-applepay-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            validationURL: event.validationURL,
            orderInfo
          }),
        });

        const merchantSession = await response.json();

        if (!merchantSession || merchantSession.error) {
          throw new Error("Invalid merchant session");
        }

        session.completeMerchantValidation(merchantSession);
      } catch (err) {
        console.error("Merchant validation failed:", err);
        session.abort();
        window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`; 
      }
    };

    session.onpaymentauthorized = async (event) => {
      try {
       
        console.log("Apple Pay token:", event.payment.token.paymentData);

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        window.location.href = `${FRONTEND_BASE_URL}/quri/menu/orderPlaced`; 
      } catch (err) {
        console.error("Payment authorization failed:", err);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        window.location.href = `${FRONTEND_BASE_URL}/quri/bill/checkout`; 
      }
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
