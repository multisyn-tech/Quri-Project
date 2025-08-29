import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SuperAdminSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  
  const handleSignup = async (event) => {
    event.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/superadmin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          role: userData.role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      const result = await response.json();
      setSuccessMessage(result.message);
      setErrorMessage("");
      setUserData({
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      // Navigate to verification email page and pass email (username) in state
      setTimeout(() => {
        navigate("/admins/VerificationEmail", { state: { email: userData.username } });
      }, 1500);

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
              <h1 className="text-3xl font-semibold">
                Please Create An Account
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form
                onSubmit={handleSignup}
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
                    type="email"
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
                  <p className="text-sm text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="relative">
                  <div className="flex items-center">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                      placeholder="Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Select Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="superadmin">SuperAdmin</option>
                    {/* <option value="restaurant">Restaurant</option> */}
                  </select>
                </div>

                <div>
                  <p className="text-base">
                    If you have an account, please{" "}
                    <Link
                      to="/superadmin/login"
                      className="underline text-blue-600"
                    >
                      Login Now
                    </Link>{" "}
                    here
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded px-6 py-1"
                  >
                    Sign up
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

export default SuperAdminSignUp;
