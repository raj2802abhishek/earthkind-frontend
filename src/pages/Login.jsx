import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  LogIn,
  Phone,
  Smartphone,
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react";

function FeatureItem({ icon, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "18px",
        background: "rgba(255,255,255,0.08)",
        padding: "18px",
        borderRadius: "22px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div>
        <h3 style={{ margin: 0, marginBottom: "8px", fontSize: "18px", color: "#ffffff" }}>
          {title}
        </h3>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: "1.7", color: "#e2e8f0", fontSize: "14px" }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function Login({ defaultMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine mode from route path or prop
  const isRegisterRoute = location.pathname === "/register" || defaultMode === "register";
  const [mode, setMode] = useState(isRegisterRoute ? "register" : "login");
  const [authMethod, setAuthMethod] = useState("phone"); // 'phone' | 'email'

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  // Handle Direct Phone Login / Register (No OTP step)
  const handleSendPhoneOTP = async (e) => {
    if (e) e.preventDefault();
    if (mode === "register" && !name.trim()) {
      toast.error("Please enter your full name ⚠️");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your mobile number ⚠️");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/users/send-phone-otp`, {
        phone: phone.trim(),
        name: mode === "register" ? name.trim() : undefined
      });

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("userChanged"));
      }

      const msg = mode === "register"
        ? "Registered & Logged in successfully! Welcome to Earthkind 🎉"
        : "Login successful! Welcome back 🎉";

      toast.success(res.data.message || msg);

      handlePostAuthNavigate(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Phone login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP Verify
  const handleVerifyPhoneOTP = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP ⚠️");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/users/verify-phone-otp`, {
        phone: phone.trim(),
        otp: otp.trim(),
        name: mode === "register" ? name.trim() : undefined
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("userChanged"));

      const msg = mode === "register"
        ? "Registered & Logged in successfully! Welcome to Earthkind 🎉"
        : "Login successful! Welcome back 🎉";

      toast.success(res.data.message || msg);

      handlePostAuthNavigate(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Login & Register
  const handleAuth = async (e) => {
    if (e) e.preventDefault();

    if (mode === "register" && !name.trim()) {
      toast.error("Please enter your full name ⚠️");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address ⚠️");
      return;
    }
    if (!password) {
      toast.error("Please enter your password ⚠️");
      return;
    }
    if (mode === "register" && password.length < 6) {
      toast.error("Password must be at least 6 characters long ⚠️");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      toast.error("Passwords do not match ⚠️");
      return;
    }

    try {
      setLoading(true);

      const endpoint = mode === "register" 
        ? `${API_BASE}/api/users/register`
        : `${API_BASE}/api/users/login`;

      const payload = mode === "register"
        ? { name: name.trim(), email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), password };

      const res = await axios.post(endpoint, payload);

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Store Auth Token and User Details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("userChanged"));

      const successMsg = mode === "register" 
        ? "Account created & logged in! Welcome to Earthkind 🎉" 
        : "Login successful! Welcome back 🎉";

      toast.success(res.data.message || successMsg);

      handlePostAuthNavigate(res.data.user);

    } catch (error) {
      toast.error(error.response?.data?.message || (mode === "register" ? "Registration failed ❌" : "Login failed ❌"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 900 ? "1fr" : "1fr 1fr",
        background: "#f5f3ee"
      }}
    >
      {/* LEFT SIDE - BRANDING */}
      <div
        style={{
          position: "relative",
          padding: window.innerWidth <= 900 ? "50px 28px" : "80px",
          background: "linear-gradient(135deg,#163923,#214d31,#2e6a45)",
          color: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* GLOW */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            top: "-180px",
            right: "-150px",
            filter: "blur(20px)"
          }}
        />

        {/* TOP */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <img
            src={logo}
            alt="Earthkind"
            style={{
              width: "150px",
              marginBottom: "60px",
              filter: "brightness(0) invert(1)"
            }}
          />

          <h1
            style={{
              fontSize: window.innerWidth <= 900 ? "48px" : "68px",
              lineHeight: "1.08",
              marginBottom: "26px",
              fontFamily: "Georgia, serif",
              fontWeight: "600"
            }}
          >
            {mode === "register" ? "Begin Your\nWellness Journey." : "Welcome\nBack."}
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              opacity: 0.9,
              maxWidth: "540px",
              whiteSpace: "pre-line"
            }}
          >
            {mode === "register"
              ? "Join Earthkind Naturals to receive 100 welcome reward points, track live orders, and enjoy exclusive member benefits."
              : "Access your premium wellness account, track orders, manage wishlist, and enjoy exclusive member rewards."}
          </p>
        </div>

        {/* FEATURES */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gap: "18px",
            marginTop: "40px"
          }}
        >
          <FeatureItem
            icon="🌿"
            title="100% Natural Formulations"
            text="Pure, ethically harvested herbal ingredients crafted for holistic living."
          />
          <FeatureItem
            icon="🎁"
            title="Reward Points & Offers"
            text="Earn reward points on signup & daily logins to redeem on natural products."
          />
          <FeatureItem
            icon="🚚"
            title="Fast Doorstep Shipping"
            text="Eco-friendly packaging with real-time SMS & email tracking updates."
          />
        </div>
      </div>

      {/* RIGHT SIDE - CARD & FORMS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: window.innerWidth <= 900 ? "40px 22px" : "60px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "36px",
            padding: window.innerWidth <= 900 ? "34px 24px" : "50px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.08)"
          }}
        >
          {/* AUTH MODE TOGGLE TABS */}
          <div
            style={{
              display: "flex",
              background: "rgba(22, 57, 35, 0.08)",
              padding: "5px",
              borderRadius: "20px",
              marginBottom: "30px"
            }}
          >
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "16px",
                background: mode === "login" ? "#163923" : "transparent",
                color: mode === "login" ? "#ffffff" : "#163923",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "16px",
                background: mode === "register" ? "#163923" : "transparent",
                color: mode === "register" ? "#ffffff" : "#163923",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <UserCheck size={16} /> Register
            </button>
          </div>

          {/* AUTH METHOD SELECTOR */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "22px" }}>
            <button
              type="button"
              onClick={() => { setAuthMethod("phone"); setOtpSent(false); }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "14px",
                border: authMethod === "phone" ? "2px solid #163923" : "1px solid #e0e0e0",
                background: authMethod === "phone" ? "rgba(22, 57, 35, 0.08)" : "#ffffff",
                color: "#163923",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Smartphone size={15} /> Phone & OTP
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "14px",
                border: authMethod === "email" ? "2px solid #163923" : "1px solid #e0e0e0",
                background: authMethod === "email" ? "rgba(22, 57, 35, 0.08)" : "#ffffff",
                color: "#163923",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Mail size={15} /> Email Address
            </button>
          </div>

          {/* CARD HEADER */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                color: "#2f7d32",
                fontWeight: "700",
                letterSpacing: "2px",
                fontSize: "12px",
                textTransform: "uppercase",
                marginBottom: "8px"
              }}
            >
              {mode === "register" ? "Instant Membership Account" : "Earthkind Member Access"}
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: window.innerWidth <= 900 ? "32px" : "40px",
                color: "#163923",
                fontFamily: "Georgia, serif"
              }}
            >
              {mode === "register"
                ? authMethod === "phone" ? "Register with Phone" : "Create Account"
                : authMethod === "phone" ? "Log In with Phone" : "Log In"}
            </h2>
          </div>

          {authMethod === "phone" ? (
            <form onSubmit={handleSendPhoneOTP}>
              {/* FULL NAME (Only in Register mode) */}
              {mode === "register" && (
                <div style={{ marginBottom: "18px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#163923",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={18}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "18px",
                        transform: "translateY(-50%)",
                        color: "#567"
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "register"}
                      style={{
                        width: "100%",
                        padding: "16px 16px 16px 52px",
                        borderRadius: "18px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.9)",
                        fontSize: "15px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* PHONE NUMBER */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#163923",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  Mobile Number
                </label>
                <div style={{ position: "relative" }}>
                  <Phone
                    size={18}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "18px",
                      transform: "translateY(-50%)",
                      color: "#567"
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="+91 Enter Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 16px 16px 52px",
                      borderRadius: "18px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.9)",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "18px",
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg,#163923,#285b37)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 14px 30px rgba(22,57,35,0.2)",
                  transition: "0.3s ease"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  {loading
                    ? mode === "register" ? "Creating Account..." : "Logging In..."
                    : mode === "register" ? "Register with Phone Number" : "Sign In To Account"}
                  <ArrowRight size={18} />
                </div>
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth}>
              {/* FULL NAME (Only in Register mode) */}
              {mode === "register" && (
                <div style={{ marginBottom: "18px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#163923",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={18}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "18px",
                        transform: "translateY(-50%)",
                        color: "#567"
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "register"}
                      style={{
                        width: "100%",
                        padding: "16px 16px 16px 52px",
                        borderRadius: "18px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.9)",
                        fontSize: "15px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#163923",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "18px",
                      transform: "translateY(-50%)",
                      color: "#567"
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 16px 16px 52px",
                      borderRadius: "18px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.9)",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#163923",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "18px",
                      transform: "translateY(-50%)",
                      color: "#567"
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "register" ? "Password (min 6 chars)" : "Enter password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "16px 45px 16px 52px",
                      borderRadius: "18px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.9)",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#567",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              {/* CONFIRM PASSWORD (Only in Register mode) */}
              {mode === "register" && (
                <div style={{ marginBottom: "22px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#163923",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={18}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "18px",
                        transform: "translateY(-50%)",
                        color: "#567"
                      }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={mode === "register"}
                      style={{
                        width: "100%",
                        padding: "16px 45px 16px 52px",
                        borderRadius: "18px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.9)",
                        fontSize: "15px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "18px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#567",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                </div>
              )}

              {/* FORGOT & REMEMBER (Only in Login mode) */}
              {mode === "login" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#555",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>

                  <span
                    onClick={() => navigate("/forgot-password")}
                    style={{
                      color: "#163923",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    Forgot Password?
                  </span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "18px",
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg,#163923,#285b37)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 14px 30px rgba(22,57,35,0.2)",
                  transition: "0.3s ease"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  {loading
                    ? mode === "register"
                      ? "Creating Account & Logging In..."
                      : "Logging In..."
                    : mode === "register"
                    ? "Create Account & Sign In"
                    : "Sign In To Account"}
                  <ArrowRight size={18} />
                </div>
              </button>
            </form>
          )}

          {/* SECURITY FOOTER */}
          <div
            style={{
              marginTop: "24px",
              padding: "14px 16px",
              borderRadius: "18px",
              background: "rgba(35,77,44,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}
          >
            <ShieldCheck size={22} color="#2f7d32" />
            <div>
              <p style={{ margin: 0, fontWeight: "700", color: "#163923", fontSize: "13px" }}>
                100% Encrypted & Instant Access
              </p>
              <p style={{ margin: 0, marginTop: "2px", color: "#666", fontSize: "12px" }}>
                New accounts are auto-authenticated immediately.
              </p>
            </div>
          </div>

          {/* TOGGLE PROMPT */}
          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#666",
              fontSize: "14px"
            }}
          >
            {mode === "login" ? (
              <>
                New to Earthkind?{" "}
                <span
                  onClick={() => setMode("register")}
                  style={{ color: "#163923", cursor: "pointer", fontWeight: "700" }}
                >
                  Create Account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setMode("login")}
                  style={{ color: "#163923", cursor: "pointer", fontWeight: "700" }}
                >
                  Log In Now
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;