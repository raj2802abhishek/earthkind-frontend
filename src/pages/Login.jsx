import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

function Login() {

  const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#234d2c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
 console.log("LOGIN CLICKED");
 console.log(email, password); // 👈 ADD THIS
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      {
        email,
        password
      }
    );

    // 🔥 STORE BOTH TOKEN + USER
    console.log("LOGIN RESPONSE:", res.data); // 👈 ADD THIS
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login successful ✅");

    window.location.href = "/";

  } catch (error) {
    alert(error.response?.data?.message || "Login failed ❌");
  }
};

  return (
  <div
    style={{
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5"
    }}
  >
    {/* LOGO */}
   <img
  src={logo}
  alt="Earthkind Naturals"
  style={{
    width:
  window.innerWidth <= 768
    ? "95px"
    : "120px",
    marginBottom: "20px"
  }}
/>
    {/* CARD */}
    <div
      style={{
        width:
  window.innerWidth <= 768
    ? "90%"
    : "350px",

maxWidth: "350px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login</h2>

      <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={inputStyle}
/>

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={inputStyle}
/>
     <button
  type="button"
  onClick={handleLogin}
  style={buttonStyle}
>
  Login
</button>
<p style={{ fontSize: "14px", marginTop: "10px" }}>
  <span
    onClick={() => window.location.href="/forgot-password"}
    style={{ color: "#234d2c", cursor: "pointer" }}
  >
    Forgot Password?
  </span>
</p>

      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        New user?{" "}
        <span
          onClick={() => window.location.href="/register"}
          style={{ color: "#234d2c", cursor: "pointer" }}
        >
          Create account
        </span>
      </p>
    </div>
  </div>
);
}

export default Login;