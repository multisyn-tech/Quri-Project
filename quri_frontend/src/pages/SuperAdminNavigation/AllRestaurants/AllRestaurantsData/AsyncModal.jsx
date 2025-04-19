import React from 'react';
import { Modal } from 'antd';

const AsyncModal = ({title, open, handleOk, confirmLoading, handleCancel, children }) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {children}
    </Modal>
  );
};

export default AsyncModal;
