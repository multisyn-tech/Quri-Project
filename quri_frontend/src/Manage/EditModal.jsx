import React, { useState, useEffect } from "react";
import { X } from "react-feather";
import { useDispatch } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import OrderDetails from "../pages/AdminNavigation/views/admin/tables/OrderDetails";
import OrderStatus from "../pages/AdminNavigation/views/admin/tables/OrderStatus";

const EditModal = ({
  open,
  name,
  data,
  handleModal,
  updatedData,
  isUpdated,
  setUpdatedData,
  setIsUpdated,
  tableData,
  setTableData,
  rejectedModalStatus,
  setRejectedModalStatus,

}) => {
  const dispatch = useDispatch();

  const [inputModal, setInputModal] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState("");
  const [inputComponent, setInputComponent] = useState("");

  const handleSidebarClosed = () => {
    setNameModalOpen("");
    setInputModal(false);
    handleModal();
  };

  const handleInputModal = () => {
    setNameModalOpen("");
    setInputModal(!inputModal);
  };

  const getManageInputComponent = (modalName) => {
    setInputModal(true);
    if (modalName === 'Order Details') return <OrderDetails tableData={tableData} setTableData={setTableData} data={data} isUpdated={isUpdated} updatedData={updatedData} setIsUpdated={setIsUpdated} setUpdatedData={setUpdatedData} setNameModalOpen={setNameModalOpen} inputModal={inputModal} setInputModal={setInputModal} rejectedModalStatus={rejectedModalStatus} RejectedModalStatus={setRejectedModalStatus}/>
    if (modalName === 'Order Status') return <OrderStatus tableData={tableData} setTableData={setTableData} data={data} isUpdated={isUpdated} updatedData={updatedData} setIsUpdated={setIsUpdated} setUpdatedData={setUpdatedData} setNameModalOpen={setNameModalOpen} inputModal={inputModal} setInputModal={setInputModal} rejectedModalStatus={rejectedModalStatus} RejectedModalStatus={setRejectedModalStatus}/>
  };

  useEffect(() => {
    if (nameModalOpen !== "") {
      setInputComponent(getManageInputComponent(nameModalOpen));
    }
  }, [nameModalOpen]);

  useEffect(() => {
    if (open) {
      setNameModalOpen(name);
    }
  }, [open]);

  return (
    <>
      <Modal
        isOpen={inputModal}
        onClosed={handleSidebarClosed}
        className={
          name === "Order Details"
            ? "modal-xl"
            : name === "User Permissions"
              ? "modal-xl"
              : ""
        }
      >
        <ModalHeader
          toggle={handleInputModal}
        >
          <h2>
            {name}
          </h2>
        </ModalHeader>

        <ModalBody className="flex-grow-1 pb-sm-0 pb-1">
          {inputComponent}
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditModal;
