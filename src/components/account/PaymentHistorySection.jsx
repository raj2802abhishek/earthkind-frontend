import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistorySection() {
  const [orders, setOrders] = useState([]);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("user"));

    if (!user?.email) return;

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${user.email}`
    );

    setOrders(
  [...res.data].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
);

  } catch (error) {
    console.log(error);
  }
};

  const filteredOrders = orders.filter((order) => {
    const orderMatch =
      searchOrderId === "" ||
      order._id?.toLowerCase().includes(
        searchOrderId.toLowerCase()
      );

    const dateMatch =
      selectedDate === "" ||
      new Date(order.createdAt)
        .toISOString()
        .split("T")[0] === selectedDate;

    return orderMatch && dateMatch;
  });

  return (
    <div>
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px"
        }}
      >
        <h2
          style={{
            color: "#123524",
            fontSize: "28px",
            margin: 0
          }}
        >
          Payment History
        </h2>
      </div>

      {/* FILTERS */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "22px",
          flexWrap: "wrap"
        }}
      >
        <input
          type="text"
          placeholder="Search Order ID"
          value={searchOrderId}
          onChange={(e) =>
            setSearchOrderId(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />
      </div>

      {/* PAYMENT CARDS */}

      <div
  style={{
    maxHeight: "500px",
    overflowY: "auto",
    paddingRight: "6px"
  }}
>
  {filteredOrders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "30px",
            textAlign: "center",
            border: "1px solid #eee"
          }}
        >
          <h3
            style={{
              color: "#123524"
            }}
          >
            No Payment History Found
          </h3>

          <p
            style={{
              color: "#6b7280"
            }}
          >
            Your completed payments will appear here.
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "15px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "12px"
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#123524"
                  }}
                >
                  Order #
                  {order._id?.slice(-8)}
                </h3>

                <p
                  style={{
                    color: "#777",
                    marginTop: "5px"
                  }}
                >
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div
  style={{
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",

    background:
      order.paymentMethod === "ONLINE"
        ? "#eefbf2"
        : "#fff7ed",

    color:
      order.paymentMethod === "ONLINE"
        ? "#15803d"
        : "#ea580c"
  }}
>
  {order.paymentMethod === "ONLINE"
    ? "UPI / Card Payment"
    : "Cash On Delivery"}
</div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#555"
                  }}
                >
                  Payment Status
                </p>

               <span
  style={{
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",

    background:
      order.status === "Delivered"
        ? "#eefbf2"
        : "#fff7ed",

    color:
      order.status === "Delivered"
        ? "#15803d"
        : "#ea580c"
  }}
>
  {order.status}
</span>
              </div>

              <h2
                style={{
                  color: "#123524",
                  margin: 0
                }}
              >
                ₹{order.finalAmount}
              </h2>
            </div>
          </div>
        ))
          )}
</div>
    </div>
  );
}

export default PaymentHistorySection;