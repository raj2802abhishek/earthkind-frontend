import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

function Login() {

  function FeatureItem({
  icon,
  title,
  text
}) {

  return (

    <div
      style={{
        display: "flex",

        alignItems: "flex-start",

        gap: "18px",

        background:
          "rgba(255,255,255,0.08)",

        padding: "18px",

        borderRadius: "22px",

        backdropFilter: "blur(10px)"
      }}
    >

      <div
        style={{
          fontSize: "28px"
        }}
      >
        {icon}
      </div>

      <div>

        <h3
          style={{
            margin: 0,

            marginBottom: "8px",

            fontSize: "18px"
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,

            opacity: 0.8,

            lineHeight: "1.7"
          }}
        >
          {text}
        </p>

      </div>

    </div>
  );
}

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
    window.dispatchEvent(
  new Event("userChanged")
);

    alert("Login successful ✅");

    window.location.href = "/";

  } catch (error) {
    alert(error.response?.data?.message || "Login failed ❌");
  }
};

  return (
  <div
    style={{
      minHeight: "100vh",

      display: "grid",

      gridTemplateColumns:
        window.innerWidth <= 900
          ? "1fr"
          : "1fr 1fr",

      background:
        "#f5f3ee"
    }}
  >

    {/* LEFT SIDE */}
    <div
      style={{
        position: "relative",

        padding:
          window.innerWidth <= 900
            ? "50px 28px"
            : "80px",

        background:
          "linear-gradient(135deg,#163923,#214d31,#2e6a45)",

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

          background:
            "rgba(255,255,255,0.08)",

          top: "-180px",

          right: "-150px",

          filter: "blur(20px)"
        }}
      />

      {/* TOP */}
      <div
        style={{
          position: "relative",
          zIndex: 2
        }}
      >

        <img
          src={logo}
          alt="Earthkind"

          style={{
            width: "150px",

            marginBottom: "60px",

            filter:
              "brightness(0) invert(1)"
          }}
        />

        <h1
          style={{
            fontSize:
              window.innerWidth <= 900
                ? "52px"
                : "72px",

            lineHeight: "1.05",

            marginBottom: "26px",

            fontFamily:
              "Georgia, serif",

            fontWeight: "600"
          }}
        >
          Welcome
          <br />
          Back.
        </h1>

        <p
          style={{
            fontSize: "18px",

            lineHeight: "1.8",

            opacity: 0.9,

            maxWidth: "540px"
          }}
        >
          Access your premium
          wellness account,
          track orders, manage
          wishlist and enjoy
          exclusive Earthkind
          member benefits.
        </p>

      </div>

      {/* FEATURES */}
      <div
        style={{
          position: "relative",
          zIndex: 2,

          display: "grid",

          gap: "18px",

          marginTop: "60px"
        }}
      >

        <FeatureItem
          icon="🌿"
          title="100% Natural Wellness"
          text="Pure ingredients crafted for mindful living."
        />

        <FeatureItem
          icon="🚚"
          title="Fast Delivery"
          text="Premium packaging with quick doorstep delivery."
        />

        <FeatureItem
          icon="🔒"
          title="Secure Shopping"
          text="Protected checkout and trusted account security."
        />

      </div>

    </div>

    {/* RIGHT SIDE */}
    <div
      style={{
        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding:
          window.innerWidth <= 900
            ? "40px 22px"
            : "60px"
      }}
    >

      <div
        style={{
          width: "100%",

          maxWidth: "520px",

          background:
            "rgba(255,255,255,0.75)",

          backdropFilter:
            "blur(22px)",

          WebkitBackdropFilter:
            "blur(22px)",

          border:
            "1px solid rgba(255,255,255,0.45)",

          borderRadius: "36px",

          padding:
            window.innerWidth <= 900
              ? "34px 24px"
              : "52px",

          boxShadow:
            "0 25px 60px rgba(0,0,0,0.08)"
        }}
      >

        {/* TITLE */}
        <div
          style={{
            marginBottom: "34px"
          }}
        >

          <p
            style={{
              color: "#2f7d32",

              fontWeight: "700",

              letterSpacing: "2px",

              fontSize: "13px",

              textTransform: "uppercase",

              marginBottom: "12px"
            }}
          >
            Earthkind Member Access
          </p>

          <h2
            style={{
              margin: 0,

              fontSize: "54px",

              color: "#163923",

              fontFamily:
                "Georgia, serif"
            }}
          >
            Login
          </h2>

        </div>

       {/* EMAIL */}
<div
  style={{
    marginBottom: "20px"
  }}
>

  <label
    style={{
      display: "block",

      marginBottom: "10px",

      color: "#163923",

      fontWeight: "600"
    }}
  >
    Email Address
  </label>

  <div
    style={{
      position: "relative"
    }}
  >

    <Mail
      size={18}

      style={{
        position: "absolute",

        top: "50%",

        left: "18px",

        transform:
          "translateY(-50%)",

        color: "#567"
      }}
    />

    <input
      type="email"

      placeholder="Enter your email"

      value={email}

      onChange={(e) =>
        setEmail(e.target.value)
      }

      style={{
        width: "100%",

        padding: "18px 18px 18px 52px",

        borderRadius: "18px",

        border:
          "1px solid rgba(0,0,0,0.08)",

        background:
          "rgba(255,255,255,0.9)",

        fontSize: "16px",

        outline: "none"
      }}
    />

  </div>

</div>

       {/* PASSWORD */}
<div
  style={{
    marginBottom: "18px"
  }}
>

  <label
    style={{
      display: "block",

      marginBottom: "10px",

      color: "#163923",

      fontWeight: "600"
    }}
  >
    Password
  </label>

  <div
    style={{
      position: "relative"
    }}
  >

    <Lock
      size={18}

      style={{
        position: "absolute",

        top: "50%",

        left: "18px",

        transform:
          "translateY(-50%)",

        color: "#567"
      }}
    />

    <input
      type="password"

      placeholder="Enter password"

      value={password}

      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }

      style={{
        width: "100%",

        padding: "18px 18px 18px 52px",

        borderRadius: "18px",

        border:
          "1px solid rgba(0,0,0,0.08)",

        background:
          "rgba(255,255,255,0.9)",

        fontSize: "16px",

        outline: "none"
      }}
    />

  </div>

</div>

        {/* FORGOT */}
<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "28px"
  }}
>

  <label
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      fontSize: "14px",

      color: "#555"
    }}
  >

    <input type="checkbox" />

    Remember me

  </label>

  <span
    onClick={() =>
      window.location.href =
        "/forgot-password"
    }

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

        {/* BUTTON */}
        <button
          type="button"

          onClick={handleLogin}

          style={{
            width: "100%",

            padding: "18px",

            border: "none",

            borderRadius: "20px",

            background:
              "linear-gradient(135deg,#163923,#285b37)",

            color: "#fff",

            fontWeight: "700",

            fontSize: "16px",

            cursor: "pointer",

            boxShadow:
              "0 14px 30px rgba(22,57,35,0.2)",

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

  Login To Account

  <ArrowRight size={18} />

</div>
        </button>
        <div
  style={{
    marginTop: "26px",

    padding: "16px",

    borderRadius: "18px",

    background:
      "rgba(35,77,44,0.06)",

    display: "flex",

    alignItems: "center",

    gap: "14px"
  }}
>

  <ShieldCheck
    size={22}

    color="#2f7d32"
  />

  <div>

    <p
      style={{
        margin: 0,

        fontWeight: "700",

        color: "#163923",

        fontSize: "14px"
      }}
    >
      Secure Encrypted Login
    </p>

    <p
      style={{
        margin: 0,

        marginTop: "4px",

        color: "#666",

        fontSize: "13px"
      }}
    >
      Your information is securely protected.
    </p>

  </div>

</div>

        {/* CREATE */}
        <p
          style={{
            textAlign: "center",

            marginTop: "30px",

            color: "#666",

            fontSize: "15px"
          }}
        >
          New to Earthkind?{" "}

          <span
            onClick={() =>
              window.location.href =
                "/register"
            }

            style={{
              color: "#163923",

              cursor: "pointer",

              fontWeight: "700"
            }}
          >
            Create Account
          </span>

        </p>

      </div>

    </div>

  </div>
);
}

export default Login;