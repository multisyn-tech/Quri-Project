const {
  addPlateNumberService,
} = require("./service.js");

const crypto = require("crypto");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const BASE_URL = process.env.BASE_URL;

// add platenumber to table
const addPlateNumber = async (orderInfo) => {
  try {
    await addPlateNumberService(orderInfo);
  } catch (err) {
    console.error("Error adding plate number:", err.message);
    throw err;
  }
}

// full bill pay
const billPaymentController = async (req, res) => {
  const { amount, orderDetails, orderInfo } = req.body;


  await addPlateNumber(orderInfo);


  const lineItems = [
    ...orderDetails.map((item) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.ItemName,
          description: item.ItemDescription,
        },
        unit_amount: Math.round(parseFloat(item.Price) * 100),
      },
      quantity: item.Quantity,
    })),
    {
      price_data: {
        currency: "aed",
        product_data: {
          name: "Service Fee",
          description: "Quri service charges",
        },
        unit_amount: Math.round(
          (amount -
            orderDetails.reduce(
              (total, item) => total + parseFloat(item.Price) * item.Quantity,
              0
            )) *
          100
        ),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    // success_url: `${BASE_URL}/quri/bill/success`,
    success_url: `${BASE_URL}/quri/menu/orderPlaced`,
  });

  res.status(200).send({
    message: "Payment received",
    amount,
    orderDetails: orderDetails,
    id: session.id,
  });
};

// split bill equally ( amount divided on orderitems shown at stripe page )
// const splitBillCheckoutController = async (req, res) => {
//   const { amount, noOfPerson, orderDetails } = req.body;

//   try {
//     if (!amount || !noOfPerson || noOfPerson <= 0) {
//       return res
//         .status(400)
//         .json({ error: "Invalid amount or number of persons" });
//     }

//     const sessions = [];

//     // Calculate the total price of all products
//     const totalProductPrice = orderDetails.reduce((total, item) => {
//       return total + parseFloat(item.Price) * item.Quantity;
//     }, 0);

//     // Divide total product price by the number of people
//     const perPersonProductPrice = totalProductPrice / noOfPerson;

//     // Round the per-person product price to 2 decimal places before converting to fils
//     const roundedPerPersonProductPrice = Math.round(
//       perPersonProductPrice * 100
//     ); // This gives the amount in fils (AED * 100)

//     for (let i = 1; i <= noOfPerson; i++) {
//       const lineItems = [
//         ...orderDetails.map((item) => ({
//           price_data: {
//             currency: "aed",
//             product_data: {
//               name: item.ItemName,
//               description: item.ItemDescription,
//             },
//             unit_amount: Math.round(
//               (parseFloat(item.Price) * 100) / noOfPerson
//             ), // Divide product price by number of people and round to fils
//           },
//           quantity: item.Quantity,
//         })),
//       ];

//       // Now include the total amount for this person (product price + other costs if any)
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: lineItems,
//         mode: "payment",
//         success_url: `${BASE_URL}/quri/bill/success`,
//       });

//       sessions.push({
//         person: `Person ${i}`,
//         sessionId: session.id,
//         paymentLink: session.url, // Optional if you want to use URL instead
//         amountToPay: (roundedPerPersonProductPrice / 100).toFixed(2), // Convert fils back to AED and round to 2 decimal places
//       });
//     }

//     res.json({ sessions });
//   } catch (error) {
//     console.error("Stripe error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// split bill equally - 2
const splitBillCheckoutController = async (req, res) => {
  const { amount, noOfPerson, orderDetails } = req.body;

  try {
    if (!amount || !noOfPerson || noOfPerson <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid amount or number of persons" });
    }

    const sessions = [];

    const roundedAmount = Math.round(parseFloat(amount) * 100);

    for (let i = 1; i <= noOfPerson; i++) {
      const lineItems = [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "Splited Bill Amount",
              description: "Split bill total payment",
            },
            unit_amount: roundedAmount,
          },
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${BASE_URL}/quri/bill/success`,
      });

      sessions.push({
        person: `Person ${i}`,
        sessionId: session.id,
        paymentLink: session.url,
        amountToPay: (roundedAmount / 100).toFixed(2),
      });
    }

    res.json({ sessions });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const customBillCheckoutController = async (req, res) => {
  const { amount, orderDetails } = req.body;

  const lineItems = [
    {
      price_data: {
        currency: "aed",
        product_data: {
          name: "Custom Bill Payment",
          description: "Quri custom payment",
        },
        unit_amount: Math.round(parseFloat(amount) * 100),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${BASE_URL}/quri/bill/success`,
  });

  res.status(200).send({
    message: "Payment session created",
    amount,
    id: session.id,
  });
};

// get records from stripe dashboard using webhook
const getStripePaymentsController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const allPaidSessions = [];
    let hasMore = true;
    let startingAfter = null;

    while (allPaidSessions.length < limit && hasMore) {
      const params = {
        limit: 100,
        expand: ["data.customer", "data.payment_intent", "data.customer_details"],
      };

      if (startingAfter) {
        params.starting_after = startingAfter;
      }

      const sessions = await stripe.checkout.sessions.list(params);

      const paid = sessions.data.filter((s) => s.payment_status === "paid");
      allPaidSessions.push(...paid);

      hasMore = sessions.has_more;
      startingAfter = sessions.data[sessions.data.length - 1]?.id;
    }


    const paginated = allPaidSessions.slice(0, limit).map((session) => ({
      paymentId: `${session.id.slice(0, 6)}...${session.id.slice(-4)}`,
      customerId: session.customer?.id || "N/A",
      customerEmail: session.customer_details?.email || "N/A",
      customerName: session.customer_details?.name || "N/A",
      amountTotal: session.amount_total / 100,
      paymentStatus: session.payment_status,
      paymentMethod: session.payment_intent?.payment_method_types?.[0] || "N/A",
      createdAt: new Date(session.created * 1000),
    }));

    res.status(200).json({ payments: paginated });
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch payment data" });
  }
};

// payment integration of n-genius gateway
const getNGeniusPaymentController = async (req, res) => {
  const apiKey = process.env.N_GENIUS_API_KEY;
  const outletRef = process.env.OUTLET_REFERENCE;
  const { formattedTotal, orderID, orderDetails } = req.body;

  const accessTokenAPIURL_Live = "https://api-gateway.ngenius-payments.com/identity/auth/access-token"; // production acount URL
  const accessTokenAPIURL_Test = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token "; // sandbox account URL

  const createOrderAPIURL_Live = `https://api-gateway.ngenius-payments.com/transactions/outlets/${outletRef}/orders`;  // production acount URL
  const createOrderAPIURL_Test = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outletRef}/orders`; // sandbox account URL


  if (!formattedTotal) {
    return res.status(400).json({ error: 'Missing amount' });
  }

  // console.log("order details: ", orderDetails)

  try {

    const tokenResponse = await fetch(accessTokenAPIURL_Test, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/vnd.ni-identity.v1+json'
      }
    });

    const tokenData = await tokenResponse.json();

    // console.log("Token: ",tokenData)

    if (!tokenData.access_token) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    const accessToken = tokenData.access_token;

    const formattedTotalMinorUnits = Math.round(parseFloat(formattedTotal) * 100);


    const orderPayload = {
      action: "PURCHASE",
      amount: {
        currencyCode: "AED",
        value: formattedTotalMinorUnits
      },
      payment: {
        // paymentMethods: ["VISA","MASTERCARD","SAMSUNG_PAY","APPLE_PAY","GOOGLE_PAY"]
        paymentMethods: ["VISA", "MASTERCARD"]
      },
      merchantAttributes: {
        redirectUrl: `https://fe.quri.co/quri/menu/orderPlaced`,
        // redirectUrl: `${BASE_URL}/quri/menu/orderPlaced`, 
        cancelText: "Order More",
        cancelUrl: `https://fe.quri.co/quri/menu/home`,
        // cancelUrl: `${BASE_URL}/quri/menu/home`, 
        paymentAttempts: "3",
        offerOnly: "VISA,MASTERCARD,SAMSUNG_PAY,APPLE_PAY"
      },
      merchantOrderReference: `${orderID}`,

    };



    const orderResponse = await fetch(createOrderAPIURL_Test, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        'Accept': 'application/vnd.ni-payment.v2+json',
      },
      body: JSON.stringify(orderPayload)
    });

    const orderData = await orderResponse.json();

    // console.log("create order Response: ", orderData)

    const paymentUrl = orderData._links?.payment?.href;

    if (!paymentUrl) {
      return res.status(500).json({ error: 'Payment URL not found' });
    }

    res.json({ payment_url: paymentUrl });

  } catch (err) {
    console.error('N-Genius Error:', err);
    res.status(500).json({ error: 'Something went wrong with N-Genius payment' });
  }
};

//-----------------------------------------------
// airpay payment integration 

const MERCHANT_ID = "your_merchant_id";
const USER_ID = "your_user_id";
const PASSWORD = "your_password";
const SALT_KEY = "your_salt_key";
const VENDOR_ID = "your_vendor_id";
const AGGREGATOR_ID = "your_aggregator_id"; 


const RETURN_URL = "https://fe.quri.co/quri/menu/orderPlaced";
const CANCEL_URL = "https://fe.quri.co/quri/menu/home";


const getAirpayController = async (req, res) => {
  try {
    const { orderDetails, orderId, amount } = req.body;

    //  Vendor 1 gets 100% split
    const SPLIT_DATA = `${VENDOR_ID}^100^^Y`; // replace VENDOR123 with actual vendor ID


    const paymentData = {
      MERCHANT_ID,
      USER_ID,
      PASSWORD,
      TXN_AMOUNT: amount,
      CURRENCY: "AED",
      ORDER_ID: orderId,
      RETURN_URL,
      CANCEL_URL,
      AGGREGATOR_ID,
      SPLIT_DATA,
    };

    // Generate checksum
    const keys = Object.keys(paymentData).sort();
    const checksumStr = keys.map(k => paymentData[k]).join("|") + "|" + SALT_KEY;
    const CHECKSUM = crypto.createHash("sha256").update(checksumStr).digest("hex");

    // Final payment URL
    const baseUrl = "https://payments.airpay.co.in/index.php";
    const params = new URLSearchParams({ ...paymentData, CHECKSUM });
    const paymentUrl = `${baseUrl}?${params.toString()}`;

    return res.json({ paymentUrl });

  } catch (error) {
    console.error("Airpay payment error:", error);
    return res.status(500).json({ error: "Failed to generate payment URL" });
  }
};


//-----------------------------------------------


// handle GPay token with backend

const handleGPayPaymentController = async(req, res)=>{

  const { token } = req.body;

  console.log("token at backend :", token)
  res.json({ success: true });

}


//-----------------------------------------------



module.exports = {
  billPaymentController,
  getStripePaymentsController,
  splitBillCheckoutController,
  customBillCheckoutController,
  getNGeniusPaymentController,
  getAirpayController,
  handleGPayPaymentController
};
