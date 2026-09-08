import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Truck, Calendar, MapPin, ShieldCheck, Sparkles } from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve order details from state or localStorage fallback
  const order =
    location.state?.order ||
    JSON.parse(localStorage.getItem("lastPlacedOrder")) ||
    null;

  const orderId = order?._id ? (order._id.toString().startsWith("EK-") ? order._id : `#EK-${String(order._id).slice(-6)}`) : `#EK-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

  const products = order?.products || [];

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #f7f5ef 50%, #ffffff 100%)"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "#ffffff",
          borderRadius: "32px",
          padding: "50px clamp(20px, 5vw, 60px)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(15, 47, 28, 0.08)",
          border: "1px solid rgba(22, 57, 35, 0.1)"
        }}
      >
        {/* TOP BACKGROUND GLOWS */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-80px",
            width: "260px",
            height: "260px",
            background: "radial-gradient(circle, rgba(163, 230, 53, 0.25) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-80px",
            width: "260px",
            height: "260px",
            background: "radial-gradient(circle, rgba(22, 57, 35, 0.12) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* HERO BADGE ICON */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 20px auto",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #163923 0%, #285b37 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#a3e635",
              boxShadow: "0 18px 40px rgba(22, 57, 35, 0.28)",
              border: "4px solid #fff"
            }}
          >
            <CheckCircle2 size={56} strokeWidth={2.4} />
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#dcfce7",
              color: "#15803d",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "12px"
            }}
          >
            <Sparkles size={14} /> ORDER CONFIRMED & VERIFIED
          </div>

          <h1
            style={{
              color: "#163923",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: "800",
              margin: "0 0 10px 0",
              letterSpacing: "-0.5px"
            }}
          >
            Order Placed Successfully! 🎉
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
              lineHeight: "1.6",
              maxWidth: "540px",
              margin: "0 auto"
            }}
          >
            Thank you for shopping with <strong style={{ color: "#163923" }}>Earthkind Naturals</strong> 🌿.
            Your order reference is <span style={{ color: "#163923", fontWeight: "800" }}>{orderId}</span>.
          </p>
        </div>

        {/* STATUS PILLS GRID */}
        <div
          style={{
            background: "#f8faf8",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            marginBottom: "28px"
          }}
        >
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Order Reference</span>
            <h4 style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "800", color: "#163923" }}>{orderId}</h4>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Order Date</span>
            <h4 style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "800", color: "#163923" }}>{orderDate}</h4>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Payment Mode</span>
            <h4 style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "800", color: "#059669" }}>
              {order?.paymentMethod || "COD (Verified)"}
            </h4>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Total Paid</span>
            <h4 style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "800", color: "#163923" }}>
              ₹{order?.finalAmount ? Number(order.finalAmount).toLocaleString("en-IN") : "0"}
            </h4>
          </div>
        </div>

        {/* PURCHASED ITEMS LIST (IF AVAILABLE) */}
        {products.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#163923", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Package size={18} color="#163923" /> Items Purchased ({products.length})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
              {products.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    background: "#f8fafb",
                    border: "1px solid #f1f5f9"
                  }}
                >
                  <img
                    src={item.image || item.images?.[0] || ""}
                    alt={item.name}
                    style={{ width: "44px", height: "44px", borderRadius: "10px", objectFit: "contain", background: "#fff", border: "1px solid #e2e8f0" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#163923" }}>{item.name}</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Qty: {item.quantity || 1} • {item.weight || "Standard"}</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#163923" }}>
                    ₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHIPPING DETAILS CARD */}
        {order?.address && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "18px", padding: "16px 20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#163923", marginBottom: "6px" }}>
              <MapPin size={16} color="#059669" />
              <span style={{ fontSize: "13px", fontWeight: "800" }}>Shipping Destination</span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
              <strong>{order.customerName}</strong> ({order.phone}) <br />
              {order.address}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #163923, #285b37)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(22, 57, 35, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            Continue Shopping <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            style={{
              padding: "14px 28px",
              background: "#fff",
              color: "#163923",
              border: "1.5px solid #163923",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            View My Orders <Package size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;