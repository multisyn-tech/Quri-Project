import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

var Headers=()=>{

    const Token = localStorage.getItem('authToken');
    const resID = localStorage.getItem('RestaurantID');
    if (!Token) {
      throw new Error('No token found');
    }
    if (!resID) {
      throw new Error('No RestaurantID found');
    }


    return {
      "Content-Type": "application/json",
      // "accesstoken": Token && Token.replace(/^"(.*)"$/, "$1"),
      'render':'backend',
      "authorization": `Bearer ${Token && Token.replace(/^"(.*)"$/, "$1")}`,
  }
}

const getManageHOF = async (manageApi) => {
    
    // let resp = await VerifyToken(Headers.accesstoken)
    // console.log('VERIFY:===', resp)
    // console.log('VERIFY:===', Headers)
  
    // const currentTime = new Date().getTime();
  
          // Check if it's time to verify the token
          // if (!lastVerifiedTime || currentTime - lastVerifiedTime > VERIFY_INTERVAL) {
          //     await VerifyToken(data);
          //     lastVerifiedTime = currentTime;
          // }
  
      return axios.get(`${BASE_URL}${manageApi}`,Headers) 
  }


export const getAllOrders = async (payload) => {
    try {

      const response = await getManageHOF(`${BASE_URL}/customers/order?limit=${payload.limit}&page=${payload.page}&search=${payload.search}`);
      // console.log("RESP", response);
      const data = await response.data;
      
      return data;
    } catch (err) {
      console.log("ERROR in manageData USERs", err);
    }
  };