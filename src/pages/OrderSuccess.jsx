import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {

  const navigate = useNavigate();

  return (

    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        background:
          "linear-gradient(180deg, #f7f5ef 0%, #ffffff 100%)"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#ffffff",
          borderRadius: "34px",
          padding: "70px 50px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "0 25px 60px rgba(15,47,28,0.10)",
          border: "1px solid #edf1ed"
        }}
      >

        {/* TOP GLOW */}

        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-100px",
            width: "280px",
            height: "280px",
            background:
              "radial-gradient(circle, rgba(35,77,44,0.12) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* RIGHT GLOW */}

        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-100px",
            width: "260px",
            height: "260px",
            background:
              "radial-gradient(circle, rgba(29,107,67,0.10) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* SUCCESS ICON */}

        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 35px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#123524,#1d6b43)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "54px",
            color: "#fff",
            boxShadow:
              "0 20px 40px rgba(18,53,36,0.25)"
          }}
        >
          ✓
        </div>

        {/* TITLE */}

        <h1
          style={{
            color: "#123524",
            fontSize: "54px",
            fontWeight: "700",
            marginBottom: "20px",
            lineHeight: "1.2",
            fontFamily: "Georgia, serif"
          }}
        >
          Order Placed Successfully!
        </h1>

        {/* SUBTITLE */}

        <p
          style={{
            color: "#5b6470",
            fontSize: "21px",
            lineHeight: "1.8",
            maxWidth: "560px",
            margin: "0 auto"
          }}
        >
          Thank you for shopping with
          {" "}
          <span
            style={{
              color: "#123524",
              fontWeight: "700"
            }}
          >
            Earthkind Naturals
          </span>
          {" "}
          🌿
          <br />

          Your premium wellness products are being prepared with care.
        </p>

        {/* PREMIUM INFO CARD */}

        <div
          style={{
            marginTop: "40px",
            background: "#f8faf8",
            border: "1px solid #e6eee6",
            borderRadius: "22px",
            padding: "28px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "24px"
          }}
        >

          <div>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "8px",
                fontSize: "15px"
              }}
            >
              Order Status
            </p>

            <h3
              style={{
                color: "#123524",
                fontSize: "18px"
              }}
            >
              Confirmed ✅
            </h3>
          </div>

          <div>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "8px",
                fontSize: "15px"
              }}
            >
              Payment
            </p>

            <h3
              style={{
                color: "#123524",
                fontSize: "18px"
              }}
            >
              Successful 💳
            </h3>
          </div>

          <div>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "8px",
                fontSize: "15px"
              }}
            >
              Delivery
            </p>

            <h3
              style={{
                color: "#123524",
                fontSize: "18px"
              }}
            >
              Processing 📦
            </h3>
          </div>

        </div>

        {/* BUTTONS */}

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            flexWrap: "wrap"
          }}
        >

          {/* CONTINUE SHOPPING */}

          <button
            onClick={() => navigate("/shop")}
            style={{
              padding: "18px 42px",
              background:
                "linear-gradient(90deg,#123524,#1d6b43)",
              color: "#fff",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              fontSize: "17px",
              fontWeight: "600",
              boxShadow:
                "0 14px 30px rgba(18,53,36,0.18)",
              transition: "0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform =
                "translateY(-4px)";

              e.target.style.boxShadow =
                "0 18px 35px rgba(18,53,36,0.28)";
            }}

            onMouseLeave={(e) => {
              e.target.style.transform =
                "translateY(0px)";

              e.target.style.boxShadow =
                "0 14px 30px rgba(18,53,36,0.18)";
            }}
          >
            Continue Shopping
          </button>

          {/* MY ORDERS */}

          <button
            onClick={() => navigate("/my-orders")}
            style={{
              padding: "18px 38px",
              background: "#fff",
              color: "#123524",
              border: "1px solid #123524",
              borderRadius: "16px",
              cursor: "pointer",
              fontSize: "17px",
              fontWeight: "600",
              transition: "0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "#123524";

              e.target.style.color = "#fff";

              e.target.style.transform =
                "translateY(-4px)";
            }}

            onMouseLeave={(e) => {
              e.target.style.background =
                "#fff";

              e.target.style.color =
                "#123524";

              e.target.style.transform =
                "translateY(0px)";
            }}
          >
            View My Orders
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;