import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStripePayments } from "../../../../../features/payments/paymentSlice";
import PaymentTable from "./PaymentTable";
import { Card } from '@mui/material';
import { Loader } from 'react-feather';

const Payments = () => {

  const name="Payments";

  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments.records);
  const [tableData, setTableData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);


  
  const columns = [
    {
      name: "#",  
      selector: (row, index) => index + 1, 
      sortable: false, 
      width: "60px",  
    },
    {
      name: "ID",  
      selector: row => row.paymentId, 
      sortable: true, 
    },
    {
      name: "Customer Name",
      selector: row => row.customerName,
      sortable: true,
      cell: row => (
        <div style={{ whiteSpace: "normal" }}>
          {row.customerName}
        </div>
      ),
    },    
    {
      name: "Customer Email",  
      selector: row => row.customerEmail,  
      sortable: true,  
      cell: row => (
        <a href={`mailto:${row.customerEmail}`} className="text-blue-500">
          {row.customerEmail}
        </a>  
      ),
    },
    {
      name: "Method", 
      selector: row => row.paymentMethod,  
      sortable: true,  
    },
    {
        name: "Date",
        selector: row => row.createdAt,
        sortable: true,
        cell: row => (
          <div style={{ whiteSpace: "normal" }}>
            {new Date(row.createdAt).toLocaleString()}
          </div>
        ),
    },      
    {
      name: "Amount", 
      selector: row => `${row.amountTotal} AED`, 
      sortable: true,  
    },
    {
      name: "Status",  
      selector: row => row.paymentStatus,  
      sortable: true,  
      cell: row => {
        let color = "";
        if (row.paymentStatus === "paid") color = "#16a34a";  
        else if (row.paymentStatus === "failed") color = "#dc2626";  
        else color = "#ca8a04"; 
  
        return (
          <span
            style={{
              backgroundColor: color,
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {row.paymentStatus || "N/A"}
          </span>
        );
      },
    },
  ];
  
  
  
  const getData = () => {
    setLoading(true);
    let obj = { page: "1", limit: "150", search: "" };
  
    dispatch(getStripePayments(obj))
      .unwrap()
      .then((data) => {
        setTableData(Array.isArray(data.payments) ? data.payments : [data.payments]);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error);
        setLoading(false);
      });
  };
  

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card className="p-2 dark:bg-gray-900">
      {loading ? (
        <Loader />
      ) : (
        <>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <PaymentTable
            columns={columns}
            tableData={tableData}
          />
        </>
      )}
    </Card>
  );
};

export default Payments;
