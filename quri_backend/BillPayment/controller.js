const { addPlateNumberService, getPlateNumberRecord } = require("./service.js");

const crypto = require("crypto");
const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const BASE_URL = process.env.BASE_URL;

const https = require("https");
const fs = require("fs");
const path = require("path");

// add platenumber to table
const addPlateNumber = async (orderInfo) => {
  try {
    await addPlateNumberService(orderInfo);
  } catch (err) {
    console.error("Error adding plate number:", err.message);
    throw err;
  }
};

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
        expand: [
          "data.customer",
          "data.payment_intent",
          "data.customer_details",
        ],
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
  const { formattedTotal, orderID, orderDetails, orderInfo } = req.body;

  await addPlateNumber(orderInfo);


  const accessTokenAPIURL_Live =
    "https://api-gateway.ngenius-payments.com/identity/auth/access-token"; // production acount URL
  const accessTokenAPIURL_Test =
    "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token "; // sandbox account URL

  const createOrderAPIURL_Live = `https://api-gateway.ngenius-payments.com/transactions/outlets/${outletRef}/orders`; // production acount URL
  const createOrderAPIURL_Test = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outletRef}/orders`; // sandbox account URL

  if (!formattedTotal) {
    return res.status(400).json({ error: "Missing amount" });
  }

  // console.log("order details: ", orderDetails)

  try {
    const tokenResponse = await fetch(accessTokenAPIURL_Live, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/vnd.ni-identity.v1+json",
      },
    });

    const tokenData = await tokenResponse.json();

    // console.log("Token: ",tokenData)

    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get access token" });
    }

    const accessToken = tokenData.access_token;
    const formattedTotalMinorUnits = Math.round(
      parseFloat(formattedTotal) * 100
    );

    const orderPayload = {
      action: "PURCHASE",
      amount: {
        currencyCode: "AED",
        value: formattedTotalMinorUnits,
      },
      payment: {
        // paymentMethods: ["VISA","MASTERCARD","SAMSUNG_PAY","APPLE_PAY","GOOGLE_PAY"]
        paymentMethods: ["VISA", "MASTERCARD"],
      },
      merchantAttributes: {
        // redirectUrl: `https://fe.quri.co/quri/menu/orderPlaced`,
        redirectUrl: `https://rest.quri.co/quri/menu/orderPlaced`,
        // redirectUrl: `${BASE_URL}/quri/menu/orderPlaced`,
        cancelText: "Order More",
        // cancelUrl: `https://fe.quri.co/quri/menu/home`,
        cancelUrl: `https://rest.quri.co/quri/menu/home`,
        // cancelUrl: `${BASE_URL}/quri/menu/home`,
        paymentAttempts: "3",
        offerOnly: "VISA,MASTERCARD,SAMSUNG_PAY,APPLE_PAY",
      },
      merchantOrderReference: `${orderID}`,
    };

    const orderResponse = await fetch(createOrderAPIURL_Live, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.ni-payment.v2+json",
        Accept: "application/vnd.ni-payment.v2+json",
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderResponse.json();

    // console.log("create order Response: ", orderData)

    const paymentUrl = orderData._links?.payment?.href;

    if (!paymentUrl) {
      return res.status(500).json({ error: "Payment URL not found" });
    }

    res.json({ payment_url: paymentUrl });
  } catch (err) {
    console.error("N-Genius Error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong with N-Genius payment" });
  }
};

//-----------------------------------------------

// airpay payment integration

const Merchant_Name = "FOLKS CAFE";
var merchant_id = "247152";
var username = "1066103";
var password = "yvufcZ5M";
var client_id = "ca9544";
var client_secret = "a44da6e8a5d0e64e461bc6b76fe35872";
const API_KEY = "796XA2V6WAqa9Vaz"; // Used as AES key to decrypt
const TOKEN_URL = "https://uae-payments.airpay.ninja/oauth2/token.php";
const PAYMENT_URL = "https://uae-payments.airpay.ninja/pay/v1/index.php";

const RETURN_URL = "https://fe.quri.co/quri/menu/orderPlaced";
const CANCEL_URL = "https://fe.quri.co/quri/menu/home";



const key = crypto.createHash('md5').update(username + "~:~" + password).digest('hex');
const iv = crypto.randomBytes(8);
// Convert the random bytes buffer to a hexadecimal string
const ivHex = iv.toString('hex');


const handleAirpayPayment = async (req, res) => {
  const dataFromClient = req.body;

  var enc_data = encrypt(JSON.stringify(dataFromClient), key);
  var request = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: 'client_credentials',
    merchant_id: merchant_id
  };

  var encrypteddata = encrypt(JSON.stringify(request), key)
  const msg = {
    encdata: enc_data,
    tokeninput: encrypteddata
  };

  res.json(msg);

}



function encrypt(request, secretKey) {

  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), Buffer.from(ivHex));

  // Update the cipher with the request and finalize
  const raw = Buffer.concat([cipher.update(request, 'utf-8'), cipher.final()]);

  // Combine IV and raw data, then base64 encode
  const data = ivHex + raw.toString('base64');

  return data;
}





//-----------------------------------------------

// handle GPay token with backend

const handleGPayPaymentController = async (req, res) => {
  const { token, orderInfo } = req.body;

  await addPlateNumber(orderInfo);
  console.log("token at backend :", token);
  res.json({ success: true });
};

//-----------------------------------------------

// handle apple pay integration with backend

const handleApplePayPaymentController = async (req, res) => {
  const { validationURL, orderInfo } = req.body;

  await addPlateNumber(orderInfo);


  if (!validationURL) {
    return res.status(400).json({ error: "Missing validationURL" });
  }

  const cert = fs.readFileSync(
    path.join(__dirname, "../certs/merchant_id.pem")
  );
  const key = fs.readFileSync(path.join(__dirname, "../certs/merchant.key"));

  const requestBody = JSON.stringify({
    merchantIdentifier: "merchant.com.quri",
    displayName: "Quri",
    initiative: "web",
    initiativeContext: "https://rest.quri.co",
  });

  const request = https.request(
    validationURL,
    {
      method: "POST",
      cert,
      key,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    },
    (appleRes) => {
      let data = "";

      appleRes.on("data", (chunk) => {
        data += chunk;
      });

      appleRes.on("end", () => {
        try {
          const session = JSON.parse(data);
          res.json(session);
        } catch (err) {
          res
            .status(500)
            .json({ error: "Invalid response from Apple", raw: data });
        }
      });
    }
  );

  request.on("error", (err) => {
    console.error("Apple Pay session error:", err);
    res.status(500).json({ error: "Apple Pay validation failed" });
  });

  request.write(requestBody);
  request.end();
};

//-----------------------------------------------

const getPlateNumbers = async (req, res) => {

  try {
    const plate_numbers = await getPlateNumberRecord();
    // console.log("plate numebr:" ,plate_numbers)
    res.status(200).json({ success: true, data: plate_numbers });
  } catch (error) {
    console.error('Error fetching plate numbers:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}


//-----------------------------------------------

module.exports = {
  billPaymentController,
  getStripePaymentsController,
  splitBillCheckoutController,
  customBillCheckoutController,
  getNGeniusPaymentController,
  handleAirpayPayment,
  handleGPayPaymentController,
  handleApplePayPaymentController,
  getPlateNumbers
};
