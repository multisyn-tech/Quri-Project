import React, { useState } from 'react';

export default function RestaurantRegisterationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'restaurant',
    restName: 'test',
    address: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role' && key !== 'restName' && !formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phoneNumber && !/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/superAdmin/restaurant-registeration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.status === 200) {
        setApiMessage({ type: 'success', text: data.message || 'Registration successful!' });
        setFormData({
          email: '',
          password: '',
          role: 'restaurant',
          restName: 'test',
          address: '',
          phoneNumber: ''
        });
      } else if (response.status === 400) {
        setApiMessage({ type: 'error', text: data?.message || 'Registration failed. Please check your input.' });
      } else {
        setApiMessage({ type: 'error', text: 'An unexpected error occurred.' });
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">Restaurant Registration</h2>
        </div>
        {apiMessage && (
          <div className={`p-4 rounded-md ${apiMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {apiMessage.text}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter restaurant address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
          <div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}