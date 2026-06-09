import React from "react";
import { FiHeadphones, FiCheckCircle, FiPackage } from "react-icons/fi";

function AccountStatus() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "12px",
        border: "1px solid rgba(0,0,0,0.05)"
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "15px",
          color: "#222"
        }}
      >
        Account Status
      </h3>

      <div
        style={{
          marginTop: "12px",
          padding: "12px",
          borderRadius: "12px",
          background: "linear-gradient(135deg,#eef8ee,#f6fff6)",
          border: "1px solid rgba(47,125,50,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#edf7ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2f7d32",
              flexShrink: 0
            }}
          >
            <FiCheckCircle size={15} />
          </div>

          <div>
            <h4
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#2f7d32"
              }}
            >
              Account Verified
            </h4>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#4f4f4f",
                lineHeight: 1.35
              }}
            >
              You are enjoying free shipping on all orders!
            </p>
          </div>
        </div>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b58a4d",
            flexShrink: 0
          }}
        >
          <FiPackage size={20} />
        </div>
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: "#555",
          lineHeight: 1.3,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <FiHeadphones size={14} />
        <span>
          Need help? Contact our <strong style={{ color: "#2f4f35" }}>support team</strong>
        </span>
      </div>
    </div>
  );
}

export default AccountStatus;