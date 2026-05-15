import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  // STEP 1 → SEND OTP
  const sendOTP = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/send-otp`,
        { email }
      );

      alert("OTP sent to your email 📩");
      setStep(2);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // STEP 2 → RESET PASSWORD
  const resetPassword = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        {
          email,
          otp,
          newPassword
        }
      );

      alert("Password updated successfully ✅");
      window.location.href = "/login";

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Forgot Password 🔐</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />
          <button onClick={sendOTP}>
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <br /><br />

          <button onClick={resetPassword}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;