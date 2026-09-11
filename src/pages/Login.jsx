import React from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

function Login() {
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #163923 0%, #0d2315 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <AuthModal close={handleClose} initialStep={1} />
    </div>
  );
}

export default Login;
