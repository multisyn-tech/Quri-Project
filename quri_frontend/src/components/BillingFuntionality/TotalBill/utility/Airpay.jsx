import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { sha256 } from 'js-sha256';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import md5 from 'md5';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;


//loads data from config.json
import customData from './config.json';

const Airpay = forwardRef(({ order_amount, order_id }, ref) => {

    const [formData, setFormData] = useState({
        formStatus: true,
        buyerEmail: '',
        buyerPhone: '',
        buyerFirstName: '',
        buyerLastName: '',
        buyerAddress: '',
        buyerCity: '',
        buyerState: '',
        buyerCountry: '',
        buyerPincode: '',
        orderid: '',
        amount: '',
        customvar: '',
        chmod: '',
        wallet: '',
        upi_intent: '',
        currency: '784',
        isocurrency: 'AED',
        success_url: 'http://localhost'
    });

    const [validationErrors, setValidationErrors] = useState({});

    // useEffect to retrieve formData from localStorage when the component mounts
    useEffect(() => {
        const storedFormData = localStorage.getItem("formData");
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
        }
    }, []);

    // to update a specific field in the form data.
    // const updateFormData = (fieldName, newValue) => {
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         [fieldName]: newValue,
    //     }));
    // };

    // to send data to the server.
    const sendData = async (data1) => {

        var data = {
            buyer_email: data1.buyerEmail,
            buyer_firstname: data1.buyerFirstName,
            buyer_lastname: data1.buyerLastName,
            buyer_address: data1.buyerAddress,
            buyer_city: data1.buyerCity,
            buyer_state: data1.buyerState,
            buyer_country: data1.buyerCountry,
            amount: data1.amount,
            orderid: data1.orderid,
            buyer_phone: data1.buyerPhone,
            buyer_pinCode: data1.buyerPinCode,
            iso_currency: data1.isocurrency,
            currency_code: data1.currency,
            merchant_id: customData.mercid,
            mer_dom: btoa(`${BASE_URL}`)
        };

        console.log("form data:",data)


        const dataToSend = data;

        try {
            const response = await fetch(`${BASE_URL}/bill/airpay-payment-sendData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });
            const responseData = await response.json();



            return responseData;

        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    }
    // to get an access token.
    const getToken = async (encr) => {
        var request = {
            client_id: customData.client_id,
            client_secret: customData.client_secret,
            grant_type: 'client_credentials',
            merchant_id: customData.mercid
        };
        var secretKey = md5(customData.username + "~:~" + customData.password);
        var requestData = {
            merchant_id: request.merchant_id,
            encdata: encr,
            checksum: await calculateChecksum(request)
        };
        const tokenurl = customData.tokenUrl;
        const access_token = await sendPostData(tokenurl, requestData);
        const decryptedData = await decrypt(JSON.parse(access_token), secretKey);
        const y = decryptedData

        const match = y.match(/"data"\s*:\s*\{[^}]*\}/);
        let nestedObjectString
        if (match) {
            nestedObjectString = match[0];

        } else {
            console.error('No match found for "nested" key.');
        }

        let token = JSON.parse("{" + nestedObjectString + "}")

        let accesstoken = token.data.access_token;

        return accesstoken;
    }
    // to send POST data.
    const sendPostData = async (tokenurl, postData) => {
        try {
            const response = await fetch(tokenurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(postData),
            });

            const responseData = await response.text();
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    //for SHA encryption.
    const encryptSha = (data, salt) => {
        // Build a 256-bit key which is a SHA256 hash of salt and data.
        var key = sha256(salt + '@' + data);
        return key;
    }
    //for data decryption.
    const decrypt = async (responsedata, secretKey) => {
        try {
            // Ensure the browser supports the Web Crypto API
            if (!window.crypto.subtle) {
                throw new Error('Web Crypto API is not supported in this browser.');
            }


            let data = responsedata.response;

            // Hash the data using SHA-256
            const encoder = new TextEncoder();
            const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));

            // Use a portion of the hash as the IV (e.g., the first 16 bytes)
            const iv = new Uint8Array(hashBuffer.slice(0, 16));

            // Convert base64-encoded string to ArrayBuffer
            const base64Data = data.slice(16);
            const encryptedArrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;

            // Import the secret key
            const importedKey = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secretKey),
                { name: 'AES-CBC' },
                false,
                ['decrypt']
            );

            // Decrypt using AES-CBC
            const decryptedArrayBuffer = await crypto.subtle.decrypt(
                { name: 'AES-CBC', iv: iv },
                importedKey,
                encryptedArrayBuffer
            );

            // Convert ArrayBuffer to string
            const decryptedText = new TextDecoder().decode(decryptedArrayBuffer);

            return decryptedText;
        } catch (error) {
            console.error('Decryption error:', error);
            throw error; // Re-throw for proper handling
        }
    }

    const calculateChecksum = async (postData) => {
        const sortedData = Object.keys(postData).sort().map(key => postData[key]).join('');

        return calculateChecksumHelper(sortedData + getCurrentDate());
    }

    const getCurrentDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    }

    const padZero = (num) => {
        return num.toString().padStart(2, '0');
    }

    const calculateChecksumHelper = (data) => {
        return sha256(data);
    }




    // const validateForm = () => {
    //     const errors = {};

    //     // Validate Buyer Email
    //     if (!formData.buyerEmail) {
    //         errors.buyerEmail = 'Buyer Email is required';
    //     }
    //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
    //         errors.buyerEmail = 'Please enter a valid email address.';
    //     }

    //     // Validate Buyer First Name
    //     if (!formData.buyerFirstName.trim()) {
    //         errors.buyerFirstName = 'Buyer First Name is required';
    //     }

    //     // Validate Buyer Last Name
    //     if (!formData.buyerLastName.trim()) {
    //         errors.buyerLastName = 'Buyer Last Name is required';
    //     }

    //     // Validate Mobile Number
    //     if (!formData.buyerPhone.trim() || !/^[0-9]+$/.test(formData.buyerPhone) || formData.buyerPhone.length < 8 || formData.buyerPhone.length > 15) {
    //         errors.buyerPhone = 'Please enter a valid Phone number.';
    //     }

    //     // Validate Order ID
    //     if (!formData.orderid.trim()) {
    //         errors.orderid = 'Order ID is required';
    //     }

    //     // Validate Amount
    //     if (!formData.amount.trim() || !/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
    //         errors.amount = 'Please enter a valid Amount.';
    //     }

    //     // Update state with validation errors
    //     setValidationErrors(errors);

    //     // Return true if there are no errors, false otherwise
    //     return Object.keys(errors).length === 0;
    // };






    // to handle form submission.


    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
    }));


    const handleSubmit = async (event) => {
        event.preventDefault();


        const buyerEmail = "test@gmail.com";
        const buyerPhone = "97123341";
        const buyerFirstName = "test";
        const buyerLastName = "test";
        const orderid = String(order_id);
        const amount = parseFloat(order_amount).toFixed(2);
        const currency = '784';
        const isocurrency = 'AED';



        const params = {
            'buyerEmail': buyerEmail,
            'buyerPhone': buyerPhone,
            'buyerFirstName': buyerFirstName,
            'buyerLastName': buyerLastName,
            'buyerAddress': '',
            'buyerCity': '',
            'buyerState': '',
            'buyerCountry': '',
            'buyerPinCode': '',
            // 'orderid': orderid,
            'orderid': "1",
            // 'amount': amount,
            'amount': "1.9",
            'customvar': '',
            'txnsubtype': '',
            'mercid': customData.mercid,
            'chmod': '',
            'currency': currency,
            'isocurrency': isocurrency,
            'mer_dom': base64_encode('https://fe.quri.co')
        };


        var responseData = await sendData(params);
        // return;
        const token = await getToken(responseData.tokeninput);


        var url = customData.url;
        var url = url + '?token=' + token;
        var privatekey = await encryptSha(customData.username + ":|:" + customData.password, customData.secret);
        var checksumReq = await calculateChecksum(params);

        var hid_dat = {
            privatekey: privatekey,
            encdata: responseData.encdata,
            checksum: checksumReq,
            chmod: '',
            merchant_id: customData.mercid
        };

        const secretKey = md5(`${customData.username}~:~${customData.password}`);

        console.log("hid_dat---->:", hid_dat)
        console.log("url---->:", url)
  



        const form = document.createElement('form');
        form.setAttribute('id', 'myForm');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', url);


        for (var key in hid_dat) {


            const hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', key);
            hiddenInput.setAttribute('value', hid_dat[key]);
            form.appendChild(hiddenInput);
        }

        const submitButton = document.createElement('input');
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('value', 'Submit');
        form.appendChild(submitButton);

        // Attach form to the document
        document.body.appendChild(form);


        // Direct submission
        form.submit();

        localStorage.setItem('formData', JSON.stringify(formData));

    };
    return (
        <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
            Pay with Airpay
        </button>
    );
});


export default Airpay;


