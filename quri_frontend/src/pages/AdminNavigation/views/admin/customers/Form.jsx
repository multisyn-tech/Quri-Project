import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';

const Form = ({ onClose, onSave, fields, title, initialData }) => {
  const [formState, setFormState] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormState({
        CustomerName: initialData.Name || '',
        Email: initialData.Email || '',
        PhoneNumber: initialData.PhoneNumber || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Prevent body scroll when the modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable body scroll when the modal is closed
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (name, value) => {
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear errors on change
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSave(formState);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    fields.forEach((field) => {
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formState[field.name])) {
          errors[field.name] = 'Invalid email address';
        }
      }

      if (field.required && !formState[field.name]) {
        errors[field.name] = 'This field is required';
      }
    });

    return errors;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
       <div className="bg-white rounded-lg p-6 w-full max-w-lg  overflow-y-auto relative">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose} className="hover:bg-gray-300 rounded-full p-1 text-black">
            <X size={20} />
          </button>
        </div>
        {fields.map((field) => (
          <div key={field.name} className="mb-4 text-black">
            <label className="block mb-2 font-medium text-black">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full p-2 border rounded"
                value={formState[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <input
                type={field.type}
                className="w-full p-2 border rounded"
                value={formState[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                {...(field.type === 'number' && { min: 0 })}
              />
            )}
            {errors[field.name] && <div className="text-red-500 text-sm mt-1">{errors[field.name]}</div>}
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
