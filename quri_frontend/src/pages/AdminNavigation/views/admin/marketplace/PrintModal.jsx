import React, { forwardRef } from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import QRCodes from './QRCodes';

const PrintModal = forwardRef(({ isOpen, toggle, qrCodeValue, handleDownload }, ref) => (
  <Modal isOpen={isOpen} toggle={toggle} ref={ref} centered>
    <ModalBody className="text-center">
    <div id="qrCodeContainer" ref={ref} className="flex items-center justify-center mb-4">
        <QRCodes value={qrCodeValue} size={256}  />
      </div>
      <div className='flex items-center justify-evenly'>
      <Button color="primary" onClick={toggle} className="m-2">
        Close
      </Button>
      <Button color="success" onClick={handleDownload} className="m-2">
        Download
      </Button>
      </div>
    </ModalBody>
  </Modal>
));

export default PrintModal;
