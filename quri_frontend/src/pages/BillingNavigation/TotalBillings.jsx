import React from 'react'
import TotalBill from '../../components/BillingFuntionality/TotalBill/TotalBill';
import { useEffect } from 'react';
import storeStage from '../../components/utility/storeStage';
const TotalBillings = () => {

  useEffect(() => {
    storeStage('checkout')
  }, [])

  return (
    <TotalBill />
  )
}

export default TotalBillings;