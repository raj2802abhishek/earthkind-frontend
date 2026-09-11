import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

import slide1 from "../assets/login/slide1.png";
import slide2 from "../assets/login/slide2.png";
import slide3 from "../assets/login/slide3.png";
import slide4 from "../assets/login/slide4.png";

function AuthModal({ close, initialStep = 1 }) {
  // ---------------- STATES ----------------
  const [step, setStep] = useState(initialStep);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- SLIDER ----------------
  const slides = [slide1, slide2, slide3, slide4];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- RESET MODAL ----------------
  const resetModal = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setEmail("");
    setPassword("");
    setName("");
    setNewPassword("");
    setOtpSent(false);
    setSuccess(false);
    setTimer(0);
  };

  const handlePostAuthNavigate = (userData) => {
    const redirectPath = location.state?.redirectTo || localStorage.getItem("redirectAfterLogin");
    localStorage.removeItem("redirectAfterLogin");
    if (userData?.isAdmin) {
      navigate("/admin");
    } else if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate("/account");
    }
  };


  // ---------------- EMAIL LOGIN ----------------
  const handleEmailLogin = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email,
          password
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("userChanged"));

      toast.success("Login successful");

      setSuccess(true);

      setTimeout(() => {
        resetModal();
        close();
        handlePostAuthNavigate(res.data.user);
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(
        `${API_BASE}/api/users/register`,
        {
          name,
          email,
          password
        }
      );

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("userChanged"));
      }

      toast.success("Account created & logged in! 🎉");

      setSuccess(true);

      setTimeout(() => {
        resetModal();
        close();
        handlePostAuthNavigate(res.data.user);
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DIRECT PHONE LOGIN / REGISTER (NO OTP REQUIRED) ----------------
  const sendPhoneOTP = async () => {
    if (!phone.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/send-phone-otp`,
        { phone, name: name.trim() || undefined }
      );

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("userChanged"));
      }

      toast.success("Login successful 🎉");
      setSuccess(true);

      setTimeout(() => {
        resetModal();
        close();
        handlePostAuthNavigate(res.data.user);
      }, 1000);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Phone login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY PHONE OTP ----------------
  const verifyPhoneOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/verify-phone-otp`,
        {
          phone,
          otp,
          name: name.trim() || undefined
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("userChanged"));

      toast.success("Login successful");

      setSuccess(true);

      setTimeout(() => {
        resetModal();
        close();
        handlePostAuthNavigate(res.data.user);
      }, 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEND EMAIL OTP ----------------
  const sendEmailOTP = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/send-otp`,
        { email }
      );

      toast.success("OTP sent to email");

      setOtpSent(true);

      setTimer(30);
      setCanResend(false);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const resetPassword = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        {
          email,
          otp,
          newPassword
        }
      );

      toast.success("Password updated");

      setStep(3);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TIMER ----------------
  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return createPortal(
  <>
      <style>{popupAnimation}</style>
      <style>{spinAnimation}</style>
      <style>{responsiveStyles}</style>

      <div style={overlay} onClick={close}>
        <div
          style={modal}
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE BUTTON */}
          <div
            style={closeButton}
            onClick={() => {
              resetModal();
              close();
            }}
          >
            ✕
          </div>

          {/* LEFT IMAGE SLIDER */}
          <div style={leftSlider} className="auth-left">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt="slider"
                style={{
                  ...sliderImage,
                  opacity:
                    currentSlide === index ? 1 : 0
                }}
              />
            ))}

            <div style={sliderOverlay}></div>
          </div>

          {/* RIGHT SECTION */}
          <div style={right} className="auth-right">
            {success && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "42px",
                    color: "#2f6b3c",
                    marginBottom: "10px"
                  }}
                >
                  ✔
                </div>

                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "600"
                  }}
                >
                  Success! Redirecting...
                </p>
              </div>
            )}

            {!success && (
              <>
                {/* LOGO */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "25px"
                  }}
                >
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: window.innerWidth < 600 ? "82px" : "110px"
                    }}
                  />
                </div>

                {/* HEADING */}
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "28px",
                   fontSize: window.innerWidth < 600 ? "22px" : "28px",
                    fontWeight: "800",
                    color: "#1d1d1d",
                    letterSpacing: "-1px"
                  }}
                >
                  {step === 1 && "Login with Phone"}
                  {step === 2 && "Enter OTP"}
                  {step === 3 && "Login with Email"}
                  {step === 4 && "Create Account with Email"}
                  {step === 5 && "Reset Password"}
                  {step === 6 && "Register with Phone"}
                </h2>

                {/* PHONE LOGIN */}
                {step === 1 && (
                  <>
                    <input
                      placeholder="+91 Enter Mobile Number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      style={input}
                    />

                    <button
                      type="button"
                      style={button}
                      onClick={sendPhoneOTP}
                      disabled={loading}
                    >
                      {loading ? (
                        <div style={spinner}></div>
                      ) : (
                        "Continue"
                      )}
                    </button>

                    <p
                      style={smallLink}
                      onClick={() => setStep(6)}
                    >
                      New user? Register with Phone
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "16px"
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: "#ececec"
                        }}
                      />

                      <span
                        style={{
                          margin: "0 12px",
                          color: "#888",
                          fontSize: "13px"
                        }}
                      >
                        OR
                      </span>

                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: "#ececec"
                        }}
                      />
                    </div>

                    <p
                      style={linkText}
                      onClick={() => setStep(3)}
                    >
                      Continue with Email
                    </p>
                  </>
                )}

                {/* PHONE REGISTER */}
                {step === 6 && (
                  <>
                    <input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={input}
                    />

                    <input
                      placeholder="+91 Enter Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={input}
                    />

                    <button
                      type="button"
                      style={button}
                      onClick={() => {
                        if (!name.trim()) {
                          toast.error("Please enter your full name");
                          return;
                        }
                        sendPhoneOTP();
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <div style={spinner}></div>
                      ) : (
                        "Register with Phone Number"
                      )}
                    </button>

                    <p
                      style={smallLink}
                      onClick={() => setStep(1)}
                    >
                      Already have an account? Login with Phone
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "16px"
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: "#ececec"
                        }}
                      />

                      <span
                        style={{
                          margin: "0 12px",
                          color: "#888",
                          fontSize: "13px"
                        }}
                      >
                        OR
                      </span>

                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: "#ececec"
                        }}
                      />
                    </div>

                    <p
                      style={linkText}
                      onClick={() => setStep(4)}
                    >
                      Register with Email
                    </p>
                  </>
                )}

                {/* OTP */}
                {step === 2 && (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value)
                      }
                      style={input}
                    />

                    <button
                      type="button"
                      style={button}
                      onClick={verifyPhoneOTP}
                      disabled={loading}
                    >
                      {loading ? (
                        <div style={spinner}></div>
                      ) : (
                        "Verify"
                      )}
                    </button>

                    <p
                      style={{
                        marginTop: "14px",
                        textAlign: "center",
                        fontSize: "13px"
                      }}
                    >
                      {timer > 0 ? (
                        <>Resend OTP in {timer}s</>
                      ) : (
                        <span
                          style={{
                            color: "#2f6b3c",
                            cursor: "pointer"
                          }}
                          onClick={sendPhoneOTP}
                        >
                          Resend OTP
                        </span>
                      )}
                    </p>
                  </>
                )}

                {/* EMAIL LOGIN */}
                {step === 3 && (
                  <>
                    <input
                      placeholder="Email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      style={input}
                    />

                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        style={{ ...input, paddingRight: "45px" }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#666",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>

                    <button
                      type="button"
                      style={button}
                      onClick={handleEmailLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <div style={spinner}></div>
                      ) : (
                        "Login"
                      )}
                    </button>

                    <p
                      style={smallLink}
                      onClick={() => setStep(5)}
                    >
                      Forgot Password?
                    </p>

                    <p
                      style={smallLink}
                      onClick={() => setStep(4)}
                    >
                      Create Account
                    </p>

                    <p
                      style={smallLink}
                      onClick={() => setStep(1)}
                    >
                      Back to Phone Login
                    </p>
                  </>
                )}

                {/* REGISTER */}
                {step === 4 && (
                  <>
                    <input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      style={input}
                    />

                    <input
                      placeholder="Email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      style={input}
                    />

                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        style={{ ...input, paddingRight: "45px" }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#666",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>

                    <button
                      type="button"
                      style={button}
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? (
                        <div style={spinner}></div>
                      ) : (
                        "Register"
                      )}
                    </button>

                    <p
                      style={smallLink}
                      onClick={() => setStep(3)}
                    >
                      Already have account? Login
                    </p>
                  </>
                )}

                {/* RESET PASSWORD */}
                {step === 5 && (
                  <>
                    {!otpSent && (
                      <>
                        <input
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          style={input}
                        />

                        <button
                          type="button"
                          style={button}
                          onClick={sendEmailOTP}
                          disabled={loading}
                        >
                          {loading ? (
                            <div style={spinner}></div>
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </>
                    )}

                    {otpSent && (
                      <>
                        <input
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value)
                          }
                          style={input}
                        />

                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(
                              e.target.value
                            )
                          }
                          style={input}
                        />

                        <button
                          type="button"
                          style={button}
                          onClick={resetPassword}
                          disabled={loading}
                        >
                          {loading ? (
                            <div style={spinner}></div>
                          ) : (
                            "Reset Password"
                          )}
                        </button>

                        <p
                          style={{
                            marginTop: "12px",
                            textAlign: "center",
                            fontSize: "13px"
                          }}
                        >
                          {timer > 0 ? (
                            <>
                              Resend OTP in {timer}s
                            </>
                          ) : (
                            <span
                              style={{
                                color: "#2f6b3c",
                                cursor: "pointer"
                              }}
                              onClick={sendEmailOTP}
                            >
                              Resend OTP
                            </span>
                          )}
                        </p>
                      </>
                    )}

                    <p
                      style={smallLink}
                      onClick={() => {
                        setStep(3);
                        setOtpSent(false);
                      }}
                    >
                      Back to Login
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
     </>,
  document.body
);
}

export default AuthModal;

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
  zIndex: 999999999
};

const modal = {
  width: "min(92vw, 920px)",
  maxWidth: "920px",
  height: "auto",
  minHeight: "540px",
  display: "flex",
  flexDirection: "row",
  borderRadius: "30px",
  overflow: "hidden",
  background: "#ffffff",
  border: "1px solid #ebebeb",
  position: "relative",
  boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
  animation: "popup 0.4s ease forwards",
  margin: "auto",
  boxSizing: "border-box"
};

const leftSlider = {
  width: "50%",
  position: "relative",
  overflow: "hidden",
  background: "#eef1ed"
};

const sliderImage = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transition: "opacity 0.8s ease"
};

const sliderOverlay = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.28), rgba(0,0,0,0.10))",
  zIndex: 2
};

const right = {
  width: "50%",
  background: "#ffffff",
  padding: "45px 36px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box"
};

const input = {
  width: "100%",
  height: "54px",
  padding: "0 18px",
  marginTop: "14px",
  borderRadius: "16px",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  background: "#ffffff",
  outline: "none",
  transition: "all 0.3s ease",
  boxSizing: "border-box"
};

const button = {
  width: "100%",
  height: "54px",
  marginTop: "18px",
  background: "linear-gradient(135deg,#234d2c,#2f6b3c)",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 25px rgba(35,77,44,0.18)",
  boxSizing: "border-box"
};

const closeButton = {
  position: "absolute",
  top: "14px",
  right: "14px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#ffffff",
  border: "1px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "18px",
  zIndex: 50,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
};

const linkText = {
  textAlign: "center",
  color: "#234d2c",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  marginTop: "12px"
};

const smallLink = {
  marginTop: "14px",
  textAlign: "center",
  cursor: "pointer",
  color: "#555",
  fontSize: "14px"
};

const spinner = {
  width: "18px",
  height: "18px",
  border: "2px solid #fff",
  borderTop: "2px solid transparent",
  borderRadius: "50%",
  margin: "0 auto",
  animation: "spin 1s linear infinite"
};

const popupAnimation = `
@keyframes popup{
  from{
    opacity:0;
    transform:scale(0.94);
  }
  to{
    opacity:1;
    transform:scale(1);
  }
}
`;

const spinAnimation = `
@keyframes spin{
  0%{
    transform:rotate(0deg);
  }
  100%{
    transform:rotate(360deg);
  }
}
`;

const responsiveStyles = `

@media (max-width: 768px){

  .auth-modal{
    width: 92vw !important;
    max-width: 440px !important;
    height: auto !important;
    min-height: auto !important;
    flex-direction: column !important;
    border-radius: 28px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25) !important;
    margin: auto !important;
    box-sizing: border-box !important;
  }

  .auth-left{
    display: none !important;
  }

  .auth-right{
    width: 100% !important;
    padding: 34px 22px 28px !important;
    box-sizing: border-box !important;
  }

  .auth-right h2 {
    font-size: 24px !important;
    margin-bottom: 20px !important;
    letter-spacing: -0.5px !important;
  }

  .auth-right input {
    width: 100% !important;
    height: 52px !important;
    font-size: 15px !important;
    border-radius: 16px !important;
    padding: 0 18px !important;
    margin-top: 10px !important;
    border: 1px solid #e0e0e0 !important;
    box-sizing: border-box !important;
  }

  .auth-right button {
    width: 100% !important;
    height: 52px !important;
    font-size: 16px !important;
    border-radius: 16px !important;
    margin-top: 16px !important;
    background: linear-gradient(135deg,#234d2c,#2f6b3c) !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

}

@media (max-width: 480px){

  .auth-modal{
    width: 94vw !important;
    max-width: 420px !important;
    border-radius: 24px !important;
  }

  .auth-right{
    padding: 28px 18px 24px !important;
    box-sizing: border-box !important;
  }

}

`;