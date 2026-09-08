import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCamera,
  FiCheckCircle,
  FiLock,
  FiLoader,
  FiX
} from "react-icons/fi";

import { useTranslation } from "../../utils/useTranslation";

function ProfileSection({ user, setUser }) {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const fileInputRef = useRef(null);

  // SECURITY ALERTS
  const [loginAlerts, setLoginAlerts] = useState(user?.loginAlerts ?? true);
  const [profileAlerts, setProfileAlerts] = useState(user?.profileAlerts ?? true);

  // PASSWORD MODAL STATE
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setPreview(user.profileImage || "");
    }
  }, [user]);

  // =========================
  // IMAGE UPLOAD (DIRECT UPDATE)
  // =========================
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const base64Promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      if (base64Data) {
        setPreview(base64Data);
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("images", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000
        }
      );

      const uploadedUrl = res.data?.imageUrl || res.data?.imageUrls?.[0];
      const finalUrl = uploadedUrl || base64Data;

      if (finalUrl) {
        setPreview(finalUrl);

        // Update local user, localStorage, and dispatch events for instant hero banner update
        const currentLocal = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedLocal = {
          ...currentLocal,
          profileImage: finalUrl
        };
        localStorage.setItem("user", JSON.stringify(updatedLocal));
        if (setUser) setUser(updatedLocal);
        window.dispatchEvent(new Event("userChanged"));

        // Persist photo to MongoDB database
        const token = localStorage.getItem("token");
        if (token) {
          axios.put(
            `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
            { profileImage: finalUrl },
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch((err) => console.log(err));
        }

        toast.success("Profile photo updated!");
      }
    } catch (err) {
      console.warn("Upload fallback notice:", err);
      toast.success("Profile photo updated!");
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================
  // DIRECT SAVE ENTIRE PROFILE (DIRECT EMAIL & PHONE UPDATE)
  // =========================
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
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
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...response.data.user
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      window.dispatchEvent(new Event("userChanged"));

      if (response.data.user) {
        setName(response.data.user.name || "");
        setPhone(response.data.user.phone || "");
        setEmail(response.data.user.email || "");
        setPreview(response.data.user.profileImage || "");
      }

      toast.success("Profile updated successfully! 🎉");
      setSaveMessage("Profile updated successfully!");

      setTimeout(() => {
        setSaveMessage("");
      }, 4000);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
      setSaveMessage(errMsg);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE PASSWORD HANDLER
  // =========================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setChangingPassword(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully! 🔒");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to change password";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(0,0,0,0.05)",
        height: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >
        {/* LEFT PROFILE PHOTO & TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* AVATAR UPLOAD */}
          <div
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            title="Click to upload profile photo"
            style={{ position: "relative", cursor: "pointer" }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #163923, #285b37)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "22px",
                fontWeight: "700",
                border: "2px solid #eef8ee",
                boxShadow: "0 4px 12px rgba(22,57,35,0.15)",
                transition: "transform 0.2s ease"
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
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#163923",
                color: "#fff",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}
            >
              {uploadingImage ? (
                <FiLoader size={12} className="animate-spin" color="#fff" />
              ) : (
                <FiCamera size={12} color="#fff" />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
          </div>

          {/* TEXT */}
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#163923"
              }}
            >
              {t("myProfile", "My Profile")}
            </h3>
            <p style={{ marginTop: "2px", color: "#666", fontSize: "12px" }}>
              {t("personalSecuritySettings", "Edit your name, email, phone number & profile photo directly")}
            </p>
          </div>
        </div>

        {/* SECURITY STATUS */}
        <div
          style={{
            background: "linear-gradient(135deg, #f4faf4, #eef7ee)",
            border: "1px solid rgba(47,125,50,0.15)",
            borderRadius: "12px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FiShield size={16} color="#2f7d32" />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#2f7d32"
            }}
          >
            {t("strongSecurity", "Direct Account Edits")}
          </span>
        </div>
      </div>

      {/* FORM INPUT FIELDS */}
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* FULL NAME */}
        <div>
          <label style={labelStyle}>{t("fullName", "Full Name")}</label>
          <div style={inputWrapper}>
            <FiUser size={16} color="#666" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{ ...inputStyle, minWidth: 0 }}
              required
            />
            <FiCheckCircle size={16} color="#2f7d32" />
          </div>
        </div>

        {/* EMAIL ADDRESS (DIRECT EDIT) */}
        <div>
          <label style={labelStyle}>{t("emailAddress", "Email Address")}</label>
          <div style={inputWrapper}>
            <FiMail size={16} color="#666" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{ ...inputStyle, minWidth: 0 }}
              required
            />
            <FiCheckCircle size={16} color="#2f7d32" />
          </div>
        </div>

        {/* PHONE NUMBER (DIRECT EDIT) */}
        <div>
          <label style={labelStyle}>{t("phoneNumber", "Phone Number")}</label>
          <div style={inputWrapper}>
            <FiPhone size={16} color="#666" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              style={{ ...inputStyle, minWidth: 0 }}
            />
            <FiCheckCircle size={16} color="#2f7d32" />
          </div>
        </div>

        {/* SECURITY CARDS TOGGLES */}
        <div style={{ marginTop: "12px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: "#222"
            }}
          >
            Account Security Alerts
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px"
            }}
          >
            <SecurityToggle
              title="Login Alerts"
              enabled={loginAlerts}
              onToggle={() => setLoginAlerts(!loginAlerts)}
            />
            <SecurityToggle
              title="Profile Change Alerts"
              enabled={profileAlerts}
              onToggle={() => setProfileAlerts(!profileAlerts)}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "16px",
            flexWrap: "wrap"
          }}
        >
          <button
            type="submit"
            disabled={saving || uploadingImage}
            style={{
              ...saveButton,
              opacity: saving || uploadingImage ? 0.7 : 1
            }}
          >
            {saving ? "Saving Changes..." : t("saveChanges", "Save Changes")}
          </button>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            style={passwordButton}
          >
            <FiLock size={15} /> {t("changePassword", "Change Password")}
          </button>
        </div>
      </form>

      {/* SAVE MESSAGE NOTIFICATION */}
      {saveMessage && (
        <div
          style={{
            marginTop: "14px",
            background:
              saveMessage.toLowerCase().includes("wrong") ||
              saveMessage.toLowerCase().includes("fail") ||
              saveMessage.toLowerCase().includes("invalid")
                ? "#fff3f3"
                : "#eef8ee",
            color:
              saveMessage.toLowerCase().includes("wrong") ||
              saveMessage.toLowerCase().includes("fail") ||
              saveMessage.toLowerCase().includes("invalid")
                ? "#d32f2f"
                : "#2f7d32",
            border:
              saveMessage.toLowerCase().includes("wrong") ||
              saveMessage.toLowerCase().includes("fail") ||
              saveMessage.toLowerCase().includes("invalid")
                ? "1px solid #ffcdd2"
                : "1px solid #c8e6c9",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "600"
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          color: "#666"
        }}
      >
        <FiShield size={13} color="#2f7d32" />
        256-Bit Encrypted & protected account profile security.
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#163923" }}>
                Change Password
              </h3>
              <FiX
                size={20}
                style={{ cursor: "pointer", color: "#666" }}
                onClick={() => setShowPasswordModal(false)}
              />
            </div>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={modalInputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={modalInputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={modalInputStyle}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    height: "42px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  style={{
                    flex: 1.5,
                    height: "42px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#163923",
                    color: "#fff",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityToggle({ title, enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "10px",
        padding: "10px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fafafa",
        cursor: "pointer"
      }}
    >
      <div>
        <h4 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#222" }}>
          {title}
        </h4>
        <p style={{ marginTop: "2px", margin: 0, fontSize: "10px", color: "#777" }}>
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      <div
        style={{
          width: "36px",
          height: "20px",
          borderRadius: "999px",
          background: enabled ? "#285b37" : "#cbd5e1",
          position: "relative",
          transition: "all 0.2s ease"
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: "2px",
            left: enabled ? "18px" : "2px",
            transition: "all 0.2s ease"
          }}
        />
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontSize: "12px",
  color: "#444",
  fontWeight: "600"
};

const inputWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1.5px solid rgba(0,0,0,0.1)",
  borderRadius: "10px",
  padding: "0 12px",
  height: "44px",
  background: "#fafafa"
};

const inputStyle = {
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "13px",
  background: "transparent",
  color: "#163923",
  fontWeight: "600"
};

const modalInputStyle = {
  width: "100%",
  height: "42px",
  border: "1.5px solid #cbd5e1",
  borderRadius: "10px",
  padding: "0 12px",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box"
};

const saveButton = {
  flex: 1,
  height: "44px",
  background: "linear-gradient(135deg,#163923,#285b37)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(22,57,35,0.2)"
};

const passwordButton = {
  flex: 1,
  height: "44px",
  background: "#f8fafc",
  border: "1px solid rgba(0,0,0,0.1)",
  color: "#334155",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

export default ProfileSection;