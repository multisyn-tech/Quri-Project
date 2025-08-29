import React from 'react'
import TotalBill from '../../components/BillingFuntionality/TotalBill/TotalBill';
import { useEffect } from 'react';
import storeHelpers from '../../components/utility/storeStage';
const TotalBillings = () => {

  const { storeStage } = storeHelpers;
  useEffect(() => {
    storeStage('checkout')
  }, [])

  return (
    <TotalBill />
  )
}

export default TotalBillings;