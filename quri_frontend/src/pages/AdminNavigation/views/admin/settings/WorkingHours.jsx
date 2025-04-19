import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button, Input, Label, FormFeedback, Col, Row, FormGroup, Alert } from 'reactstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateWorkingHours, clearSuccess, fetchWorkingHours } from '../../../../../features/settings/settingSlice';
import { AiOutlineClose } from 'react-icons/ai';

const daysOfWeek = [
  { day: 'Monday', key: 'monday' },
  { day: 'Tuesday', key: 'tuesday' },
  { day: 'Wednesday', key: 'wednesday' },
  { day: 'Thursday', key: 'thursday' },
  { day: 'Friday', key: 'friday' },
  { day: 'Saturday', key: 'saturday' },
  { day: 'Sunday', key: 'sunday' },
];

const WorkingHours = () => {
  const dispatch = useDispatch();
  const RestaurantID = localStorage.getItem('RestaurantID');
  const { loading, error, success, workingHours } = useSelector(state => state.settings);

  const schema = yup.object().shape({
    workingHours: yup.array().of(
      yup.object().shape({
        day: yup.string().required(),
        open: yup.string().required('Opening time is required'),
        close: yup.string().required('Closing time is required'),
      })
    )
  });

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      workingHours: daysOfWeek.map(day => ({ day: day.key, open: '', close: '' })),
    }
  });

  const { fields } = useFieldArray({
    control,
    name: 'workingHours',
  });

  useEffect(() => {
    if (RestaurantID) {
      dispatch(fetchWorkingHours({ RestaurantID }));
    }
  }, [dispatch, RestaurantID]);

  useEffect(() => {
    if (workingHours && Object.keys(workingHours).length > 0) {
      daysOfWeek.forEach((day, index) => {
        setValue(`workingHours[${index}].open`, workingHours[day.key]?.open || '');
        setValue(`workingHours[${index}].close`, workingHours[day.key]?.close || '');
      });
    }
  }, [workingHours, setValue]);

  const onSubmit = async (data) => {
    await dispatch(updateWorkingHours({ RestaurantID, workingHours: data.workingHours }));
    dispatch(fetchWorkingHours({ RestaurantID }));
    reset({ workingHours: daysOfWeek.map(day => ({ day: day.key, open: '', close: '' })) });
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 5000);
    }
  }, [success, dispatch]);

  return (
    <div>
      {success && (
        <Alert color="success" className="d-flex align-items-center">
          {success}
          <Button color="link" onClick={() => dispatch(clearSuccess())} className="ms-auto">
            <AiOutlineClose />
          </Button>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-4">
        <Row>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Col lg="5" md="6" sm="12">
                <FormGroup>
                  <Label>{daysOfWeek[index].day}</Label>
                  <Controller
                    name={`workingHours[${index}].open`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="time" placeholder="Opening Time" invalid={!!errors.workingHours?.[index]?.open} />
                    )}
                  />
                  {errors.workingHours?.[index]?.open && <FormFeedback>{errors.workingHours[index].open.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col lg="5" md="6" sm="12">
                <FormGroup>
                  <Label>&nbsp;</Label>
                  <Controller
                    name={`workingHours[${index}].close`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="time" placeholder="Closing Time" invalid={!!errors.workingHours?.[index]?.close} />
                    )}
                  />
                  {errors.workingHours?.[index]?.close && <FormFeedback>{errors.workingHours[index].close.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <Button color="success" type="submit" className="mt-4" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default WorkingHours;
