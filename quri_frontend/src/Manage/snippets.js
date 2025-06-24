// export const orderStatusOptions = [
//     "Received",
//     "Processing",
//     "Ready for pickup",
//     "Saved",
//     "Completed",
//     "Cancelled",
//     "Paid",
//     "Refunded"
//   ];

import toast from "react-hot-toast";

export const orderStatusOptions = [
  { label: "Received", value: "received" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
  // { label: "Processing", value: "processing" },
  // { label: "Ready for pickup", value: "ready_for_pickup" },
  // { label: "Saved", value: "saved" },
  // { label: "Cancelled", value: "cancelled" },
  // { label: "Paid", value: "paid" },
  // { label: "Refunded", value: "refunded" },

];


export const orderMethodOptions = [
    "Choose Delivery Type",
    "By Self Delivery Man",
    "By Third Party Delivery Service"
  ];

export const deliveryMen = [
    { name: "John Doe", phone: "123-456-7890", image: "https://6valley.6amtech.com/public/assets/back-end/img/placeholder/user.png" },
    { name: "Jane Smith", phone: "987-654-3210", image: "https://6valley.6amtech.com/public/assets/back-end/img/placeholder/user.png" },
    { name: "Mike Johnson", phone: "555-555-5555", image: "https://6valley.6amtech.com/public/assets/back-end/img/placeholder/user.png" }
  ];



  export const myToast = (myPromise) => {

    return toast.promise(myPromise, {
        loading: 'Loading, Please Wait',
        // success: 'Data Inserted Successfully',
        success: (data) => `${data?.payload?.message}`,
        error: (data) => `${data?.payload?.message}`
    },
    {
        success: {
          duration: 3000 // Adjust the duration the success message is displayed
        }
    }
    )
}