
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiCalendar
} from "react-icons/fi";

function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
  useState("last30days");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchOrders();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      setProducts(res.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const getImageForItem = (item) => {

    const matchedProduct =
      products.find(
        (product) =>
          product.name?.trim().toLowerCase() ===
          item.name?.trim().toLowerCase()
      );

    return (
      item.image ||
      item.productImage ||
      item.product?.image ||
      item.images?.[0] ||
      matchedProduct?.image ||
      ""
    );
  };

 const filteredOrders =
  orders.filter((order) => {

    const matchesStatus =
      statusFilter === "All"
        ? true
        : order.status === statusFilter;

    const matchesSearch =
      order._id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      order.products.some((item) =>
        item.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    const orderDate =
      new Date(order.createdAt);

    const currentDate =
      new Date();

    let matchesDate = true;

    if (dateFilter === "last30days") {

      const last30 =
        new Date();

      last30.setDate(
        currentDate.getDate() - 30
      );

      matchesDate =
        orderDate >= last30;
    }

    else if (
      dateFilter === "last3months"
    ) {

      const last3Months =
        new Date();

      last3Months.setMonth(
        currentDate.getMonth() - 3
      );

      matchesDate =
        orderDate >= last3Months;
    }

    else if (
      dateFilter === "thisyear"
    ) {

      matchesDate =
        orderDate.getFullYear() ===
        currentDate.getFullYear();
    }

    else {

      matchesDate =
        orderDate.getFullYear().toString() ===
        dateFilter;
    }

    return (
      matchesStatus &&
      matchesSearch &&
      matchesDate
    );
  });

  return (

    <div
      style={{
        width: "100%",
        maxWidth: "1760px",
        margin: "0 auto",
        padding: "20px",
      }}
    >

      <h1
        style={{
          fontSize: "56px",
          color: "#234d2c",
          margin: 0,
          fontFamily: "Georgia, serif",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        My Orders 📦
      </h1>

      {/* SEARCH + FILTER */}

      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
          marginBottom: "40px",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          padding: "22px",
          borderRadius: "24px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.04)"
        }}
      >

        {/* SEARCH */}

        <div
          style={{
            flex: 1,
            minWidth: "280px",
            position: "relative"
          }}
        >

          <FiSearch
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              left: "18px",
              transform: "translateY(-50%)",
              color: "#777"
            }}
          />

          <input
            type="text"
            placeholder="Search by product or order ID..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "100%",
              height: "58px",
              borderRadius: "18px",
              border:
                "1px solid rgba(0,0,0,0.08)",
              paddingLeft: "50px",
              paddingRight: "20px",
              fontSize: "15px",
              outline: "none",
              background: "#fafafa"
            }}
          />
        </div>


        {/* DATE FILTER */}

<div
  style={{
    position: "relative",
    minWidth: "220px"
  }}
>

  <FiCalendar
    size={17}
    style={{
      position: "absolute",
      top: "50%",
      left: "18px",
      transform: "translateY(-50%)",
      color: "#777",
      zIndex: 2
    }}
  />

  <select
    value={dateFilter}
    onChange={(e) =>
      setDateFilter(e.target.value)
    }
    style={{
      width: "220px",
      height: "58px",
      borderRadius: "18px",
      border:
        "1px solid rgba(0,0,0,0.08)",
      paddingLeft: "48px",
      paddingRight: "18px",
      fontSize: "15px",
      outline: "none",
      background: "#fafafa",
      appearance: "none",
      cursor: "pointer"
    }}
  >

    <option value="last30days">
      Last 30 Days
    </option>

    <option value="last3months">
      Past 3 Months
    </option>

    <option value="thisyear">
      This Year
    </option>

    <option value="2026">
      2026
    </option>

    <option value="2025">
      2025
    </option>

    <option value="2024">
      2024
    </option>

    <option value="2023">
      2023
    </option>

    <option value="2022">
      2022
    </option>

  </select>
</div>

        {/* FILTER */}

        <div
          style={{
            position: "relative",
            minWidth: "220px"
          }}
        >

          <FiFilter
            size={17}
            style={{
              position: "absolute",
              top: "50%",
              left: "18px",
              transform: "translateY(-50%)",
              color: "#777",
              zIndex: 2
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={{
              width: "220px",
              height: "58px",
              borderRadius: "18px",
              border:
                "1px solid rgba(0,0,0,0.08)",
              paddingLeft: "48px",
              paddingRight: "18px",
              fontSize: "15px",
              outline: "none",
              background: "#fafafa",
              appearance: "none",
              cursor: "pointer"
            }}
          >

            <option value="All">
              All Orders
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Shipped">
              Shipped
            </option>

          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (

        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            color: "#666",
          }}
        >
          No matching orders found
        </p>

      ) : (

        filteredOrders.map((order) => (

          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "34px",
              marginTop: "30px",
              borderRadius: "28px",
              background: "#fff",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
              transition: "0.35s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-4px)";

              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";

              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.05)";
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "25px",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  color: "#163923",
                  fontSize: "22px",
                }}
              >
                Order ID: {order._id.slice(-6)}
              </h3>

              <span
                style={{
                  color:
                    order.status === "Delivered"
                      ? "#15803d"
                      : order.status === "Shipped"
                      ? "#d97706"
                      : "#dc2626",

                  fontWeight: "700",

                  background:
                    order.status === "Delivered"
                      ? "rgba(22,163,74,0.10)"
                      : order.status === "Shipped"
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(239,68,68,0.10)",

                  padding: "10px 18px",
                  borderRadius: "999px",
                  fontSize: "14px",
                }}
              >
                {order.status}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                marginTop: "25px",
                marginBottom: "30px",
              }}
            >

              {order.products.map((item, i) => {

                const imageSrc =
                  getImageForItem(item);

                return (

                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      padding: "18px",
                      borderRadius: "24px",
                      background:
                        "linear-gradient(145deg,#ffffff,#f8faf8)",

                      border:
                        "1px solid rgba(22,57,35,0.06)",
                    }}
                  >

                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "22px",
                        overflow: "hidden",
                        background: "#f7f7f7",
                        flexShrink: 0,
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >

                      {imageSrc ? (

                        <img
                          src={imageSrc}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#888",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          No image
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>

                      <h3
                        style={{
                          margin: 0,
                          color: "#163923",
                          fontSize: "24px",
                          fontFamily:
                            "'Cormorant Garamond', serif",

                          marginBottom: "10px",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        style={{
                          color: "#666",
                          marginBottom: "8px",
                          fontSize: "15px",
                        }}
                      >
                        Quantity: {item.quantity}
                      </p>

                      {item.weight && (

                        <p
                          style={{
                            color: "#666",
                            marginBottom: "8px",
                            fontSize: "15px",
                          }}
                        >
                          Weight: {item.weight}
                        </p>
                      )}

                      <p
                        style={{
                          color: "#234d2c",
                          fontWeight: "700",
                          fontSize: "20px",
                          margin: 0,
                        }}
                      >
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                borderTop:
                  "1px solid rgba(0,0,0,0.06)",

                paddingTop: "24px",
              }}
            >

              <p
                style={{
                  marginBottom: "12px",
                  color: "#444",
                  fontSize: "16px",
                }}
              >
                💳 Payment: {order.paymentMethod}
              </p>

              <p
                style={{
                  marginBottom: "14px",
                  color: "#163923",
                  fontWeight: "700",
                  fontSize: "22px",
                }}
              >
                💰 Total: ₹{order.finalAmount}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;

