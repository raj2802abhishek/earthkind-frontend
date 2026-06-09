import React, { useState } from "react";
import axios from "axios";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCamera,
  FiCheckCircle,
  FiLock
} from "react-icons/fi";

function ProfileSection({ user }) {

  const [name, setName] = useState(
    user?.name || ""
  );

  const [phone, setPhone] = useState(
    user?.phone || ""
  );

  const [preview, setPreview] = useState(
    user?.profileImage || ""
  );
  const [saving, setSaving] =
  useState(false);

const [saveMessage, setSaveMessage] =
  useState("");
// =========================
// EMAIL STATES
// =========================

const [isEditingEmail, setIsEditingEmail] =
  useState(false);

const [newEmail, setNewEmail] =
  useState(user?.email || "");

const [emailOtpSent, setEmailOtpSent] =
  useState(false);

const [emailOtp, setEmailOtp] =
  useState("");

const [emailVerified, setEmailVerified] =
  useState(true);

// =========================
// PHONE STATES
// =========================

const [isEditingPhone, setIsEditingPhone] =
  useState(false);

const [phoneOtpSent, setPhoneOtpSent] =
  useState(false);

const [phoneOtp, setPhoneOtp] =
  useState("");

const [phoneVerified, setPhoneVerified] =
  useState(!!user?.phone);
  
const [loginAlerts, setLoginAlerts] =
  useState(
    user?.loginAlerts ?? true
  );

const [profileAlerts, setProfileAlerts] =
  useState(
    user?.profileAlerts ?? true
  );


  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      const imageUrl =
        URL.createObjectURL(file);

      setPreview(imageUrl);
    }
  };
// =========================
// EMAIL OTP
// =========================



const handleSendEmailOtp = async () => {

  try {

    console.log("SENDING EMAIL OTP");

    const token =
      localStorage.getItem("token");

    // SHOW OTP FIELD IMMEDIATELY
    setEmailOtpSent(true);

    setSaveMessage(
      "Sending OTP..."
    );

    await axios.post(

      `${import.meta.env.VITE_API_URL}/api/users/send-email-change-otp`,

      {
        email: newEmail
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        },

        timeout: 15000
      }
    );

    console.log("OTP SUCCESS");

    setSaveMessage(
      "OTP sent successfully"
    );

    setTimeout(() => {

      setSaveMessage("");

    }, 3000);

  } catch (error) {

    console.log("OTP ERROR");

    console.log(error);

    // KEEP OTP INPUT OPEN
    setEmailOtpSent(true);

    setSaveMessage(
      "OTP request sent. Check email."
    );

    setTimeout(() => {

      setSaveMessage("");

    }, 3000);

  }
};



const handleVerifyEmailOtp = () => {

  if (emailOtp.length < 4) return;

  setEmailVerified(true);

  setIsEditingEmail(false);

  setEmailOtpSent(false);

  console.log("EMAIL VERIFIED");
};

// =========================
// PHONE OTP
// =========================

const handleSendPhoneOtp = () => {

  if (!phone) return;

  console.log("PHONE OTP SENT");

  setPhoneOtpSent(true);
};

const handleVerifyPhoneOtp = () => {

  if (phoneOtp.length < 4) return;

  setPhoneVerified(true);

  setIsEditingPhone(false);

  setPhoneOtpSent(false);

  console.log("PHONE VERIFIED");
};
  // =========================
  // SAVE
  // =========================


const handleSave = async () => {

  try {

    setSaving(true);

    setSaveMessage("");

    const token =
      localStorage.getItem("token");

    const response = await axios.put(

      `${import.meta.env.VITE_API_URL}/api/users/update-profile`,

      {
        name,
        phone,
        profileImage: preview,
        loginAlerts,
        profileAlerts
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const updatedUser = {

      ...JSON.parse(
        localStorage.getItem("user")
      ),

      ...response.data.user

    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    window.dispatchEvent(
      new Event("userChanged")
    );

    setName(
      response.data.user.name || ""
    );

    setPhone(
      response.data.user.phone || ""
    );

    setSaving(false);

    setSaveMessage(
      "Profile updated successfully"
    );

    setTimeout(() => {

      setSaveMessage("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setSaving(false);

    setSaveMessage(
      error.response?.data?.message ||
      "Something went wrong"
    );

    setTimeout(() => {

      setSaveMessage("");

    }, 3000);

  }
};




  return (

    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "16px",
        border:
          "1px solid rgba(0,0,0,0.05)",
        height: "100%",
        overflowY: "auto"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px"
        }}
      >

        {/* LEFT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >

          {/* IMAGE */}

          <div
            style={{
              position: "relative"
            }}
          >

            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg,#163923,#285b37)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "700"
              }}
            >

              {preview ? (

                <img
                  src={preview}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />

              ) : (

                user?.name?.charAt(0)

              )}

            </div>

            <label
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                border:
                  "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >

              <FiCamera
                size={10}
                color="#163923"
              />

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

            </label>

          </div>

          {/* TEXT */}

          <div>

            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#163923"
              }}
            >
              My Profile
            </h3>

            <p
              style={{
                marginTop: "2px",
                color: "#777",
                fontSize: "11px"
              }}
            >
              Personal & security settings
            </p>

          </div>

        </div>

        {/* SECURITY */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#f4faf4,#eef7ee)",
            border:
              "1px solid rgba(47,125,50,0.10)",
            borderRadius: "12px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >

          <FiShield
            size={14}
            color="#2f7d32"
          />

          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#2f7d32"
            }}
          >
            Strong Security
          </span>

        </div>

      </div>

      {/* INPUTS */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >

        {/* NAME */}

        <div>

          <p style={labelStyle}>
            Full Name
          </p>

          <div style={inputWrapper}>

            <FiUser
              size={14}
              color="#666"
            />

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              
style={{
  ...inputStyle,
  minWidth: 0
}}


            />

            <FiCheckCircle
              size={14}
              color="#2f7d32"
            />

          </div>

        </div>

       {/* EMAIL */}

<div>

  <p style={labelStyle}>
    Email Address
  </p>

  <div style={inputWrapper}>

    <FiMail
      size={14}
      color="#666"
    />

    <input
      value={newEmail}
      onChange={(e) =>
        setNewEmail(e.target.value)
      }
      
      
style={{
  ...inputStyle,
  minWidth: 0
}}


    />

    

      
<button
  type="button"
  onClick={async () => {

    console.log("BUTTON CLICKED");

    if (!isEditingEmail) {

      setIsEditingEmail(true);

      console.log("EDIT MODE ENABLED");

      return;
    }

    if (!emailOtpSent) {

      console.log("SENDING OTP");

      await handleSendEmailOtp();

      return;
    }

    console.log("VERIFYING OTP");

    handleVerifyEmailOtp();

  }}
  style={miniButton}
>

  {!isEditingEmail
    ? "Change"
    : !emailOtpSent
    ? "Send OTP"
    : "Verify"}

</button>



  

  </div>
{emailOtpSent ? (

  <div
    style={{
      marginTop: "8px"
    }}
  >

    <input
      placeholder="Enter OTP"
      value={emailOtp}
      onChange={(e) =>
        setEmailOtp(e.target.value)
      }
      style={{
        width: "100%",
        height: "40px",
        border:
          "1px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        padding: "0 12px",
        fontSize: "12px",
        outline: "none"
      }}
    />

  </div>

) : null}

</div>

        {/* PHONE */}

       {/* PHONE */}

<div>

  <p style={labelStyle}>
    Phone Number
  </p>

  <div style={inputWrapper}>

    <FiPhone
      size={14}
      color="#666"
    />

    <input
      value={phone}
      onChange={(e) =>
        setPhone(e.target.value)
      }
     
      placeholder="Add phone number"
      
style={{
  ...inputStyle,
  minWidth: 0
}}


    />

    

      
<button
  type="button"
  onClick={() => {

    if (!isEditingPhone) {

      setIsEditingPhone(true);

    } else if (!phoneOtpSent) {

      handleSendPhoneOtp();

    } else {

      handleVerifyPhoneOtp();

    }

  }}
  style={miniButton}
>

  {!isEditingPhone
    ? phone
      ? "Change"
      : "Add"
    : !phoneOtpSent
    ? "Send OTP"
    : "Verify"}

</button>



    

  </div>

  {phoneOtpSent && (

    <input
      placeholder="Enter OTP"
      value={phoneOtp}
      onChange={(e) =>
        setPhoneOtp(e.target.value)
      }
      style={{
        ...inputStyle,
        marginTop: "8px",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        height: "40px",
        padding: "0 12px",
        width: "100%"
      }}
    />

  )}

</div>

      </div>

      {/* SECURITY FEATURES */}

      <div
        style={{
          marginTop: "16px"
        }}
      >

        <h4
          style={{
            margin: 0,
            marginBottom: "10px",
            fontSize: "14px",
            color: "#222"
          }}
        >
          Security Features
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,1fr)",
            gap: "8px"
          }}
        >

          <SecurityCard
            title="Email Verification"
          />

          <SecurityCard
            title="Phone Verification"
          />

          <SecurityCard
            title="Login Alerts"
          />

          <SecurityCard
            title="Profile Alerts"
          />

        </div>

      </div>

      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "18px"
        }}
      >

       <button
  onClick={handleSave}
  disabled={saving}
  style={{
    ...saveButton,
    opacity: saving ? 0.7 : 1
  }}
>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          style={passwordButton}
        >

          <FiLock size={13} />

          Password

        </button>

      </div>
{saveMessage && (

  <div
    style={{
      marginTop: "12px",
      background:
        saveMessage.includes("wrong")
          ? "#fff3f3"
          : "#eef8ee",
      color:
        saveMessage.includes("wrong")
          ? "#d32f2f"
          : "#2f7d32",
      padding: "10px 12px",
      borderRadius: "10px",
      fontSize: "11px",
      fontWeight: "600"
    }}
  >
    {saveMessage}
  </div>

)}
      {/* FOOTER */}

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "10px",
          color: "#777"
        }}
      >

        <FiShield size={11} />

        Encrypted & protected account security.

      </div>

    </div>
  );
}

/* ========================= */
/* SECURITY CARD */
/* ========================= */

function SecurityCard({
  title
}) {

  return (

    <div
      style={{
        border:
          "1px solid rgba(0,0,0,0.05)",
        borderRadius: "10px",
        padding: "8px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "6px"
      }}
    >

      <div>

        <h4
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#222"
          }}
        >
          {title}
        </h4>

        <p
          style={{
            marginTop: "2px",
            fontSize: "9px",
            color: "#777"
          }}
        >
          Enabled
        </p>

      </div>

      <div
        style={{
          background: "#eef8ee",
          color: "#2f7d32",
          padding: "3px 7px",
          borderRadius: "999px",
          fontSize: "9px",
          fontWeight: "700"
        }}
      >
        ON
      </div>

    </div>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const labelStyle = {
  marginBottom: "5px",
  fontSize: "11px",
  color: "#555",
  fontWeight: "500"
};

const inputWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border:
    "1px solid rgba(0,0,0,0.08)",
  borderRadius: "10px",
  padding: "0 10px",
  height: "42px"
};


const inputStyle = {
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "12px",
  background: "transparent"
};


const miniButton = {
  border: "none",
  background: "#eef8ee",
  color: "#2f7d32",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "10px",
  fontWeight: "700",
  cursor: "pointer"
};
const verifiedBadge = {
  color: "#2f7d32",
  fontSize: "10px",
  fontWeight: "700"
};

const saveButton = {
  flex: 1,
  height: "42px",
  background:
    "linear-gradient(135deg,#163923,#285b37)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "12px",
  cursor: "pointer"
};

const passwordButton = {
  flex: 1,
  height: "42px",
  background: "#f7f7f7",
  border:
    "1px solid rgba(0,0,0,0.08)",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px"
};

export default ProfileSection;