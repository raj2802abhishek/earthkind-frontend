import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${user?.email}`
      );

      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div
    style={{
      padding: "40px",
      maxWidth: "1000px",
      margin: "0 auto"
      
    }}
  >
    <h1 style={{ color: "#234d2c",fontSize: "56px",
          fontFamily: "Georgia, serif", marginBottom:"82px",}}>
      My Orders 📦
    </h1>

    {orders.length === 0 ? (
      <p>No orders yet</p>
    ) : (
      orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: "25px",
            marginTop: "20px",
            borderRadius: "16px",
            background: "#fff",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
          }}
        >
          {/* ORDER HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px"
            }}
          >
            <h3>Order ID: {order._id.slice(-6)}</h3>

            <span
              style={{
                color:
                  order.status === "Delivered"
                    ? "green"
                    : order.status === "Shipped"
                    ? "orange"
                    : "red",
                fontWeight: "600"
              }}
            >
              {order.status}
            </span>
          </div>

          {/* PRODUCTS */}
          <div style={{ marginBottom: "10px" }}>
            {order.products.map((item, i) => (
              <p key={i}>
                {item.name} × {item.quantity}
              </p>
            ))}
          </div>

          {/* DETAILS */}
          <p>💳 Payment: {order.paymentMethod}</p>
          <p>💰 Total: ₹{order.finalAmount}</p>

          <p style={{ fontSize: "13px", color: "#666" }}>
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))
    )}
  </div>
);
}

export default MyOrders;