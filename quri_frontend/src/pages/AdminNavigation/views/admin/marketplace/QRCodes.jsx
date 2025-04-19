// QRCodes.jsx
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables } from '../../../../../features/tables/tableSlice';



const QRCodes = ({ value, size }) => {

  return <QRCode value={value} size={size} />;
};

export default QRCodes;
