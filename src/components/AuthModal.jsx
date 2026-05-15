import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import slide1 from "../assets/login/slide1.png";
import slide2 from "../assets/login/slide2.png";
import slide3 from "../assets/login/slide3.png";
import slide4 from "../assets/login/slide4.png";

function AuthModal({ close }) {
  // ---------------- STATES ----------------
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

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
        navigate("/");
      }, 1500);

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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          name,
          email,
          password
        }
      );

      toast.success("Registered successfully");

      setStep(3);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEND PHONE OTP ----------------
  const sendPhoneOTP = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/send-phone-otp`,
        { phone }
      );

      toast.success("OTP sent");

      setStep(2);

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

  // ---------------- VERIFY PHONE OTP ----------------
  const verifyPhoneOTP = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/verify-phone-otp`,
        {
          phone,
          otp
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
        navigate("/");
      }, 1500);

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
                  {step === 4 && "Create Account"}
                  {step === 5 && "Reset Password"}
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

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "24px",
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

                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      style={input}
                    />

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

                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      style={input}
                    />

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
  width: window.innerWidth < 768 ? "92vw" : "100%",
  maxWidth: window.innerWidth < 768 ? "340px" : "980px",

  height: window.innerWidth < 768 ? "auto" : "620px",

  display: "flex",

  flexDirection:
    window.innerWidth < 768 ? "column" : "row",

  borderRadius: "30px",

  overflow: "hidden",

  background: "#ffffff",

  border: "1px solid #ebebeb",

  position: "relative",

  boxShadow:
    "0 25px 70px rgba(0,0,0,0.12)",

  animation: "popup 0.4s ease forwards",

  margin: "auto",

  
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
  background:
    "linear-gradient(to top, rgba(0,0,0,0.28), rgba(0,0,0,0.10))",
  zIndex: 2
};

const right = {
  width: "50%",
  background: "#ffffff",
  padding: "55px 50px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative"
};

const input = {
  width: "100%",
  height: "56px",
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
  height: "56px",
  marginTop: "18px",
  background:
    "linear-gradient(135deg,#234d2c,#2f6b3c)",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  transition: "all 0.3s ease",
  boxShadow:
    "0 10px 25px rgba(35,77,44,0.18)"
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
  fontSize: "16px"
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

    width: 94vw !important;
    max-width: 94vw !important;

    height: 420px !important;

    flex-direction: row !important;

    border-radius: 22px !important;

  }

  .auth-left{

    width: 42% !important;
    height: 100% !important;
    min-height: 100% !important;

  }

  .auth-right{

    width: 58% !important;

    padding:
      20px 18px 18px !important;

  }

}


@media (max-width: 480px){

  .auth-modal{

    width: 255vw !important;
    max-width: 125vw !important;

    height: 360px !important;

    border-radius: 20px !important;

  }

  .auth-left{

    width: 40% !important;
    height: 100% !important;

  }

  .auth-right{

    width: 60% !important;

    padding:
      16px 14px 14px !important;

  }

}

`;