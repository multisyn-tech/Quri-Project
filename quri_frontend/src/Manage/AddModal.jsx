import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import OrderDetails from '../pages/AdminNavigation/views/admin/tables/OrderDetails';

const AddModal = ({ company_id, open, name, setModal, tableData, setTableData }) => {
  const [inputComponent, setInputComponent] = useState(null);

  useEffect(() => {
    if (open) {
      setInputComponent(getModalComponent(name));
    } else {
      setInputComponent(null);
    }
  }, [open, name]);

  const getModalComponent = (modalName) => {
    if (modalName === 'Order Details') {
      return (
        <OrderDetails
          tableData={tableData}
          setTableData={setTableData}
          tableForm={true}
          currentModalName={modalName}
        />
      );
    }
    // Add other modal conditions here if needed
    return null;
  };

  const handleModalClose = () => {
    setModal(false);
  };

  return (
    <Modal
      isOpen={open}
      onClosed={handleModalClose}
      className={
        name === 'Order Details' ? 'modal-xl' :
        name === 'SME' ? 'modal-lg' :
        name === "Package" ? "modal-sm" : ''
      }
    >
      <ModalHeader
        className="position-relative justify-content-center border-bottom"
        toggle={handleModalClose}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'normal' }}>
          {name}
        </h2>
      </ModalHeader>

      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        {inputComponent}
      </ModalBody>
    </Modal>
  );
};

export default AddModal;
