import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminVerifyOtp = () => {
  const [counter, setCounter] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    const storedCounter = Number(localStorage.getItem("resendCounter")) || 0;
    const storedTime = Number(localStorage.getItem("resendStartTime")) || 0;
    const currentTime = Date.now();

    // Calculate time difference
    const timePassed = Math.floor((currentTime - storedTime) / 1000); // in seconds

    if (storedCounter > 0 && timePassed < storedCounter) {
      // If time has not passed the entire countdown, calculate remaining time
      setCounter(storedCounter - timePassed);
    } else {
      // If time passed exceeds countdown, allow resend
      setCounter(0);
      localStorage.removeItem("resendCounter");
      localStorage.removeItem("resendStartTime");
    }
  }, []);

  useEffect(() => {
    if (counter === 0) {
      setIsDisabled(false);
      return;
    }

    setIsDisabled(true);

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("resendCounter");
          localStorage.removeItem("resendStartTime");
          clearInterval(timer);
          return 0;
        } else {
          localStorage.setItem("resendCounter", prev - 1);
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleResend = async () => {
    try {
      const countdown = 30;
      setCounter(countdown);
      localStorage.setItem("resendCounter", countdown);
      localStorage.setItem("resendStartTime", Date.now());
      setIsDisabled(true);

      const response = await fetch(`${BASE_URL}/admin/resendVerificationEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend verification email.");
      }

      const result = await response.json();
      console.log(result.message); // Can display a success message if needed
    } catch (error) {
      console.error("Error resending email:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-100 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Verify Your Email</h2>
      <p className="text-gray-600 mb-8 text-lg whitespace-break-spaces">
        Please verify your email. If you didn’t receive an email, you can resend the mail.
      </p>

      {/* Disabled input field displaying the email */}
      <input
        type="email"
        value={email}
        disabled
        className="mb-6 px-4 py-2 border rounded-lg text-center bg-gray-100 border-gray-300 text-gray-700 w-72 text-lg"
      />

      <button
        className={`${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        } text-white font-semibold text-lg py-3 px-8 rounded-lg shadow-md transition-all duration-300`}
        onClick={handleResend}
        disabled={isDisabled}
      >
        {isDisabled ? `Resend Email in ${counter}s` : "Resend Email"}
      </button>
    </div>
  );
};

export default AdminVerifyOtp;
