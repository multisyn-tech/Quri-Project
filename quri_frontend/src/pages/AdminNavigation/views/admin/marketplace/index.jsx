import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'reactstrap';
import { FaTrashAlt, FaPrint } from 'react-icons/fa';
import QRCodes from './QRCodes';
import Pagination from './Pagination';
import { addTable, fetchTables, removeTable } from '../../../../../features/tables/tableSlice';
import { FaCar, FaUtensils } from "react-icons/fa"
import PrintModal from './PrintModal';

const BASE_URL = import.meta.env.VITE_QR_URL;

const Tables = () => {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.tables.tables);
  const loading = useSelector((state) => state.tables.loading);
  const error = useSelector((state) => state.tables.error);

  // console.log('BASE_URL', BASE_URL)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const printRef = useRef();

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const handleDelete = (tableId) => {
    dispatch(removeTable(tableId)).then(() => {
      dispatch(fetchTables());
    });

  };

  const handleAddTable = () => {
    setShowModal(true);
    // const newTable = {
    //   RestaurantID: 101, // Replace with actual logic to get RestaurantID
    //   QRCode: `QR${Math.floor(1000 + Math.random() * 9000)}` // Generate a random QR code
    // };

    // //  console.log('newTable', newTable)
    // dispatch(addTable(newTable)).then(() => {
    //   dispatch(fetchTables());
    // });
  };

  const handleConfirm = () => {
    if (!selectedType) return;

    const newTable = {
      RestaurantID: 101,
      QRCode: `QR${Math.floor(1000 + Math.random() * 9000)}`,
      Type: selectedType,
    };


    dispatch(addTable(newTable)).then(() => {
      dispatch(fetchTables());
    });

    setShowModal(false);
    setSelectedType(null);
  };

  const handlePrint = (qrCode) => {
    setSelectedQRCode(qrCode);
    setIsModalOpen(true);
  };

  const handleDownload = () => {
    const canvas = printRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedQRCode}.png`;
      link.click();
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentTables = tables.slice(indexOfFirstPost, indexOfLastPost);

  const handlePrintModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="flex mb-3">
        <Button color="info" onClick={handleAddTable} className="w-2/3 font-bold whitespace-nowrap" disabled={loading}>
          Generate New QR Code
        </Button>

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999, // ensure it stays on top
            }}
          >
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "500px",       // wider modal
                maxWidth: "90%",      // responsive on small screens
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)", // make it pop
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Select Table Type</h2>
              <div style={{ margin: "20px 0" }}>
                <button
                  onClick={() => setSelectedType("dine-in")}
                  style={{
                    marginRight: "15px",
                    backgroundColor: selectedType === "dine-in" ? "#a5a5a8ff" : "#f0f0f0",
                    color: selectedType === "dine-in" ? "white" : "black",
                    padding: "12px 20px",
                    fontSize: "1rem",
                    borderRadius: "6px",
                  }}
                >
                  <FaUtensils title="Dine-in" className="inline-block text-green-600 text-lg" />
                  <br></br>
                  <span>Dine-in</span>
                </button>
                <button
                  onClick={() => setSelectedType("take-away")}
                  style={{
                    backgroundColor: selectedType === "take-away" ? "#a5a5a8ff" : "#f0f0f0",
                    color: selectedType === "take-away" ? "white" : "black",
                    padding: "12px 20px",
                    fontSize: "1rem",
                    borderRadius: "6px",
                  }}
                >
                  <FaCar title="Take-away" className="inline-block text-blue-500 text-lg" />
                  <br></br>
                  <span>Take-away</span>
                </button>
              </div>
              <div>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedType}
                  style={{
                    marginRight: "15px",
                    padding: "10px 18px",
                    fontSize: "0.95rem",
                    borderRadius: "5px",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 18px",
                    fontSize: "0.95rem",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {error && <div className="text-red-500">{error}</div>}
      <Table className="dark:bg-gray-800 dark:text-white">
        <thead>
          <tr>
            <th className="dark:bg-gray-900">TableID</th>
            <th className="dark:bg-gray-900">QRCode</th>
            <th className="dark:bg-gray-900">Scan QR Code</th>
            <th className="dark:bg-gray-900">Type</th>
            <th className="dark:bg-gray-900">Delete</th>
            <th className="dark:bg-gray-900">Print</th>
          </tr>
        </thead>
        <tbody>
          {currentTables.map((table, index) => (
            <tr key={index} className="dark:bg-gray-800">
              <th scope="row" className="dark:bg-gray-800">{table.TableID}</th>
              <td className="dark:bg-gray-800">{table.QRCode}</td>
              <td className="dark:bg-gray-800" ref={printRef}>
                {/* <QRCodes value={table.QRCode} size={64} /> */}
                <QRCodes value={`${BASE_URL}/${table.QRCode}`} size={64} />
              </td>
              <td className="dark:bg-gray-800 text-start ">
                {table.Type === "take-away" ? (
                  <FaCar title="Take-away" className="inline-block text-blue-500 text-lg" />
                ) : (
                  <FaUtensils title="Dine-in" className="inline-block text-green-600 text-lg" />
                )}
              </td>
              <td className="dark:bg-gray-800 ">
                <FaTrashAlt
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => handleDelete(table.TableID)}
                  size={20}
                />
              </td>
              <td className="dark:bg-gray-800 ">
                <FaPrint
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => handlePrint(`${BASE_URL}/${table.QRCode}`)}
                  size={20}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        totalPosts={tables.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <PrintModal
        ref={printRef}
        isOpen={isModalOpen}
        toggle={handlePrintModalClose}
        qrCodeValue={selectedQRCode}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default Tables;
