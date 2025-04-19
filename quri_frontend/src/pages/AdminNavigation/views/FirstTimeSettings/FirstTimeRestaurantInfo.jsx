import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Label, FormFeedback, Col, Row, FormGroup, Alert, Spinner } from 'reactstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createOrUpdateSettings, getRestaurantSettings } from '../../../../features/settings/settingSlice';


const FirstTimeRestaurantInfo = () => { 
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
      mode: 'onChange',
      resolver: yupResolver(yup.object().shape({
        restaurantName: yup.string().required('Restaurant Name is required'),
        address: yup.string().required('Address is required'),
        contactNo: yup.string().required('Contact No is required'),
        description: yup.string().required('Description is required'),
        email: yup.string().email('Invalid email format').required('Restaurant Email is required'),
      })),
    });
  
    const loading = useSelector((state) => state.settings.loading);
    const resID = localStorage.getItem('RestaurantID');
  
    useEffect(() => {
      dispatch(getRestaurantSettings())
        .then(({ payload }) => {
          if (payload && Array.isArray(payload)) {
            const settingsMap = payload.reduce((acc, setting) => {
              acc[setting.KeyID] = setting.Value;
              return acc;
            }, {});
  
            reset({
              restaurantName: settingsMap['RestaurantName'] || '',
              address: settingsMap['Address'] || '',
              contactNo: settingsMap['PhoneNumber'] || '',
              description: settingsMap['Description'] || '',
              email: settingsMap['Email'] || ''
            });
          } else {
            console.error('Unexpected payload format:', payload);
          }
        })
        .catch((error) => console.error('Failed to fetch settings: ', error));
    }, [dispatch, reset]);
  
    const onSubmit = (data) => {
      setIsSubmitting(true);
      const settings = [
        { KeyID: 'RestaurantName', Value: data.restaurantName },
        { KeyID: 'Address', Value: data.address },
        { KeyID: 'PhoneNumber', Value: data.contactNo },
        { KeyID: 'Description', Value: data.description },
        { KeyID: 'Email', Value: data.email }
      ];
  
      dispatch(createOrUpdateSettings({ settings, resID }))
        .then(() => {
          setSuccessMessage('Settings updated successfully');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        })
        .catch((error) => alert('Failed to update settings: ' + error.message))
        .finally(() => {
          setTimeout(() => {
            setIsSubmitting(false);
          }, 3000);
        });
    };
  
    return (
      <div className="d-flex w-100">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-4">
          {successMessage && 
            <Alert color="success" toggle={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          }
          <Row>
            <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label for="restaurantName">Restaurant Name *</Label>
                <Controller
                  name="restaurantName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="text" id="restaurantName" placeholder="Enter Restaurant Name" invalid={errors.restaurantName && true} />
                  )}
                />
                {errors.restaurantName && <FormFeedback>{errors.restaurantName.message}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label for="email">Restaurant Email *</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="email" id="email" placeholder="Enter Restaurant Email" invalid={errors.email && true} />
                  )}
                />
                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
              </FormGroup>
            </Col>
            
            <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label for="address">Address *</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="textarea" id="address" placeholder="Enter Address" invalid={errors.address && true} />
                  )}
                />
                {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
              </FormGroup>
            </Col>
  
            <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label for="contactNo">Contact No *</Label>
                <Controller
                  name="contactNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="text" id="contactNo" placeholder="Enter Contact No" invalid={errors.contactNo && true} />
                  )}
                />
                {errors.contactNo && <FormFeedback>{errors.contactNo.message}</FormFeedback>}
              </FormGroup>
            </Col>
  
            <Col lg="6" md="6" sm="12">
              <FormGroup>
                <Label for="description">Description *</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="textarea" id="description" placeholder="Enter Description" invalid={errors.description && true} />
                  )}
                />
                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
              </FormGroup>
            </Col>
  
          </Row>
          <Button color="success" type="submit" className="mt-4" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
          {loading && <p>Loading...</p>}
        </form>
      </div>
    );
  };

export default FirstTimeRestaurantInfo;
