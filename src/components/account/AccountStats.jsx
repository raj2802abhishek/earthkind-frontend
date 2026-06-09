import React from "react";

function AccountStats({
  icon,
  number,
  label
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#ffffff,#f8fbf8)",

        borderRadius: "18px",

        padding: "14px",

        minHeight: "95px",

        border:
          "1px solid rgba(22,57,35,0.08)",

        boxShadow:
          "0 8px 24px rgba(0,0,0,0.04)",

        transition: "all .25s ease",

        cursor: "pointer",

        position: "relative",

        overflow: "hidden"
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-3px)";

        e.currentTarget.style.boxShadow =
          "0 14px 30px rgba(22,57,35,0.12)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.04)";
      }}
    >

      <div
        style={{
          position: "absolute",

          right: "-12px",

          top: "-12px",

          width: "50px",

          height: "50px",

          borderRadius: "50%",

          background:
            "rgba(34,197,94,0.08)"
        }}
      />

      <div
        style={{
          width: "38px",

          height: "38px",

          borderRadius: "12px",

          background:
            "linear-gradient(135deg,#163923,#285b37)",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          color: "#fff",

          fontSize: "16px",

          marginBottom: "10px"
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: 0,

          fontSize: "24px",

          fontWeight: "700",

          color: "#163923"
        }}
      >
        {number}
      </h2>

      <p
        style={{
          marginTop: "4px",

          fontSize: "12px",

          color: "#6b7280",

          fontWeight: "500"
        }}
      >
        {label}
      </p>

    </div>
  );
}

export default AccountStats;