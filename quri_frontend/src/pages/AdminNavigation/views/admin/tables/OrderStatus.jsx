import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { Col, Form, Row, Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { myToast, orderStatusOptions } from '../../../../../Manage/snippets'
import ManageSelect from '../../../../../Manage/ManageSelect'
import { getOrders, updateOrderStatus } from '../../../../../features/orders/orderSlice'
import { CropLandscapeOutlined } from '@mui/icons-material'


const OrderStatus = (props) => {

    const modalName = props.modalName
    const formData1 = props.data
    const updatedData = props.updatedData
    const setUpdatedData = props.setUpdatedData
    const tableData = props.tableData
    const setIsUpdated = props.setIsUpdated
    const tableForm = props.tableForm
    const setTableData = props.setTableData

    const isRejectedItemsAdded = useSelector((state) => state.orders.isRejectedItemsAdded);
    // console.log("isRejectedItemsAdded", isRejectedItemsAdded)

    const dataAvaliable = formData1 !== undefined

    // console.log('modalName==', formData1)

    const SignupSchema = yup.object().shape({

        // name: yup.string().min(3,' Name must be at least 3 characters').max(30, 'Name must be at most 30 characters').required(),
        // // mobile_number: yup.string().min(3,' Description must be at least 3 characters').max(2000, 'Description must be at most 2000 characters').required(),
        // email: yup.string().required("Please enter your email"),
    })

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema) })


    const [status, setStatus] = useState(dataAvaliable ? formData1.status : '')
    const [errorMessage, setErrorMessage] = useState("")

    const dispatch = useDispatch()

    const handleTimeoutAlert = (obj) => {
        const myPromise = new Promise(async (resolve, reject) => {
            dispatch(updateOrderStatus(obj, dataAvaliable && formData1.OrderID))
                .unwrap()  // Use unwrap to handle errors properly
                .then((response) => {
                    const result = response;
                    // console.log('RESULT==', result);

                    if (tableForm) {
                        const data = JSON.parse(JSON.stringify(tableData));
                        const newObj = {
                            id: result.id,
                            sn: data.length + 1,
                            status: obj.status
                        };
                        data.unshift(newObj);
                        setTableData(data);
                        props.setInputModal(false);
                    }

                    setIsUpdated(true);
                    props.setInputModal(false);

                    let obj = {
                        page: '1',
                        limit: '10',
                        search: ''
                    };
                    console.log('called');


                    // console.log("isRejectedItemsAdded", isRejectedItemsAdded)
                    // if (isRejectedItemsAdded) {
                        dispatch(getOrders(obj));
                    // }

                    resolve(result);
                })
                .catch((err) => {
                    setErrorMessage(err.message); // Set error message on failure
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 3000);
                    reject(err);
                });
        });

        return myToast(myPromise);
    };

    const onSubmit = () => {
        let obj = {
            newStatus: status,
        };
        console.log('OJJ', obj);

        props.RejectedModalStatus(obj);

        if (obj.newStatus == '') {
            setErrorMessage('status');
            toast.error('Select Status to Proceed');
        } else {
            setErrorMessage("");
        }

        if (errorMessage == "" && obj.newStatus !== '') {
            if (dataAvaliable) {
                const updatedObj = Object.assign(obj, { OrderID: formData1.OrderID });
                console.log("updated obj", updatedObj)
                setUpdatedData(updatedObj);
            }

            handleTimeoutAlert(obj); // promise to update order status'

            // console.log("isRejectedItemsAdded: ", isRejectedItemsAdded)
            // if (isRejectedItemsAdded) {
            //     handleTimeoutAlert(obj); // promise to update order status'
            // }

        }
    };



    return (
        <div>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col className='mb-1' lg='12' md='12' sm="12" xl="12">
                        {/* <InputContainer style={{height:'46px',justifyContent:"space-between",alignItems:"center"}}> */}
                        <ManageSelect
                            width="100%"
                            type='group'
                            id='op_status'
                            label='Select Status *'
                            defaultValue={dataAvaliable &&
                                (formData1.Status === "received" || formData1.Status === "Received" ?
                                    orderStatusOptions.find(x => x.value === "received") :
                                    formData1.Status === "processing" || formData1.Status === "Processing" ?
                                        orderStatusOptions.find(x => x.value === "processing") :
                                        formData1.Status === "ready for pickup" || formData1.Status === "Ready for pickup" ?
                                            orderStatusOptions.find(x => x.value === "ready_for_pickup") :
                                            formData1.Status === "saved" || formData1.Status === "Saved" ?
                                                orderStatusOptions.find(x => x.value === "saved") :
                                                formData1.Status === "completed" || formData1.Status === "Completed" ?
                                                    orderStatusOptions.find(x => x.value === "completed") :
                                                    formData1.Status === "cancelled" || formData1.Status === "Cancelled" ?
                                                        orderStatusOptions.find(x => x.value === "cancelled") :
                                                        formData1.Status === "paid" || formData1.Status === "Paid" ?
                                                            orderStatusOptions.find(x => x.value === "paid") :
                                                            formData1.Status === "refunded" || formData1.Status === "Refunded" ?
                                                                orderStatusOptions.find(x => x.value === "refunded") :
                                                                formData1.Status === "accepted" || formData1.Status === "Accepted" ?
                                                                    orderStatusOptions.find(x => x.value === "accepted") :
                                                                    formData1.Status === "rejected" || formData1.Status === "Rejected" ?
                                                                        orderStatusOptions.find(x => x.value === "rejected") :
                                                                        orderStatusOptions.find(x => x.value === "select"))
                            }

                            options={orderStatusOptions}
                            // value="Select Status *"
                            errorStyle={errorMessage === "status"}
                            // loadingCondition={provinceLoading}
                            onChange={(e) => {
                                setStatus(e.label)
                                // setValue(-1)
                                // setProvinceName(e.label)
                            }}
                        />
                        {/* </InputContainer> */}
                    </Col>

                </Row>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Button className=" mb-1" color="primary" type="submit" style={{ float: 'right' }}>
                        {dataAvaliable ? 'Update' : 'Add'}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default OrderStatus