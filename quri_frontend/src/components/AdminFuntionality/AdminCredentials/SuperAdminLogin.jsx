/* eslint-disable */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SuperAdminLogin = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/superadmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const result = await response.json();
      // console.log('Login result:', result);
      // console.log('Token received:', result.token);
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('RestaurantID', result.restaurantId);
      // localStorage.setItem('QRCode', '');
      //   localStorage.setItem('role', result.role.toLowerCase());

      //  // Check the role and navigate accordingly
      // if (result.role.toLowerCase() === "admin") {  // SuperAdmin
      //   navigate("/superadmin/manage/dashboard");
      // } else if (result.role.toLowerCase() === "restaurant") {  // Normal restaurant admin
      //   navigate("/admin/default");
      // }
      navigate("/superadmin/manage/dashboard");

      setSuccessMessage(result.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <small className="font-semibold">Super-Admin</small>
              <h1 className="text-3xl font-semibold">Login to Dashboard</h1>
            </div>

            <div className="divide-y divide-gray-200">
              <form
                onSubmit={handleLogin}
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && (
                  <p className="text-green-500">{successMessage}</p>
                )}
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={userData.username}
                    onChange={handleChange}
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={userData.password}
                      onChange={handleChange}
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-base mt-1">
                    Don't have an account? Click here{" "}
                    <Link to="/superadmin/signup" className="underline text-blue-600">
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded px-6 py-1">
                    Login
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
