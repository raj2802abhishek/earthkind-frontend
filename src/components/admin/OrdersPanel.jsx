import {
  ShoppingBag,
  Truck,
  Clock3,
  CheckCircle2,
  PackageCheck,
  MapPin,
  Phone,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Receipt
} from "lucide-react";

import { useState } from "react";

function OrdersPanel({
  orders,
  updateOrderStatus
}) {

  const [expandedOrder,
    setExpandedOrder
  ] = useState(null);

  const [orderTab,
  setOrderTab
] = useState("active");

  // RECENT ORDERS FIRST
  const filteredOrders =
  orders.filter((order) => {

    if (orderTab === "active") {
      return order.status !== "Delivered";
    }

    return order.status === "Delivered";
  });

const sortedOrders =
  [...filteredOrders].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  const getStatusColor = (status) => {

    switch (status) {

      case "Pending":
        return "#f59e0b";

      case "Shipped":
        return "#3b82f6";

      case "Delivered":
        return "#16a34a";

      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {

    switch (status) {

      case "Pending":
        return <Clock3 size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Delivered":
        return <CheckCircle2 size={16} />;

      default:
        return <ShoppingBag size={16} />;
    }
  };

  // PRINT INVOICE
  const printInvoice = (order) => {

    const gst =
      Math.round(order.totalAmount * 0.18);

    const shipping = 50;

    const subtotal =
      order.totalAmount;

    const finalTotal =
      subtotal +
      gst +
      shipping -
      order.discount;

    const invoiceWindow =
      window.open("", "_blank");

    invoiceWindow.document.write(`

      <html>

        <head>

          <title>
            Earthkind Receipt
          </title>

          <style>

            body {
              font-family: Arial;
              padding: 12px;
              width: 320px;
              color: #111;
            }

            h1 {
              font-size: 22px;
              margin-bottom: 2px;
              color: #123524;
            }

            .subtitle {
              font-size: 12px;
              margin-bottom: 14px;
            }

            .section {
              margin-top: 14px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
              font-size: 13px;
            }

            table {
              width: 100%;
              margin-top: 12px;
              border-collapse: collapse;
            }

            th {
              text-align: left;
              border-bottom: 1px solid #ccc;
              padding-bottom: 6px;
              font-size: 13px;
            }

            td {
              padding: 7px 0;
              font-size: 13px;
              border-bottom: 1px dashed #ddd;
            }

            .total {
              margin-top: 16px;
              border-top: 2px dashed #999;
              padding-top: 12px;
            }

            .final {
              font-size: 18px;
              font-weight: bold;
              color: #123524;
            }

            .center {
              text-align: center;
            }

            @media print {

              body {
                width: 320px;
              }

            }

          </style>

        </head>

        <body>

          <div class="center">

            <h1>
              Earthkind Naturals
            </h1>

            <div class="subtitle">
              Premium Herbal Wellness
            </div>

          </div>

          <hr />

          <div class="section">

            <div class="row">
              <span>Name</span>
              <span>${order.customerName}</span>
            </div>

            <div class="row">
              <span>Phone</span>
              <span>${order.phone}</span>
            </div>

            <div class="row">
              <span>Payment</span>
              <span>${order.paymentMethod}</span>
            </div>

            <div class="row">
              <span>Date</span>

              <span>
                ${new Date(order.createdAt)
                  .toLocaleDateString()}
              </span>
            </div>

            <div class="row">
              <span>Time</span>

              <span>
                ${new Date(order.createdAt)
                  .toLocaleTimeString()}
              </span>
            </div>

          </div>

          <div class="section">

            <strong>
              Address
            </strong>

            <div style="margin-top:6px;font-size:13px;">
              ${order.address}
            </div>

          </div>

          <table>

            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>₹</th>
            </tr>

            ${order.products.map(product => `

              <tr>

                <td>
                  ${product.name}
                </td>

                <td>
                  ${product.quantity}
                </td>

                <td>
                  ${product.price}
                </td>

              </tr>

            `).join("")}

          </table>

          <div class="total">

            <div class="row">
              <span>Subtotal</span>
              <span>₹${subtotal}</span>
            </div>

            <div class="row">
              <span>GST 18%</span>
              <span>₹${gst}</span>
            </div>

            <div class="row">
              <span>Shipping</span>
              <span>₹${shipping}</span>
            </div>

            <div class="row">
              <span>Discount</span>
              <span>₹${order.discount}</span>
            </div>

            <div class="row final">
              <span>Total</span>
              <span>₹${finalTotal}</span>
            </div>

          </div>

          <div
            style="
              margin-top:20px;
              text-align:center;
              font-size:12px;
              color:#666;
            "
          >

            Thank you for shopping
            with Earthkind Naturals 🌿

          </div>

        </body>

      </html>

    `);

    invoiceWindow.document.close();

    invoiceWindow.print();
  };

  return (

    <div>
{/* HEADER */}
<div
  style={{
    marginBottom: "48px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center"
  }}
>

        <h1
  style={{
    fontSize: "58px",

    color: "#123524",

    marginBottom: "16px",

    fontWeight: "800",

    letterSpacing: "-2px",

    display: "flex",

    alignItems: "center",

    gap: "16px",

    fontFamily:
      "'Poppins', sans-serif"
  }}
>

  Customer Orders

  <PackageCheck
    size={44}
    color="#7c3aed"
  />

</h1>
        <p
  style={{
    color: "#6b7280",

    fontSize: "18px",

    maxWidth: "700px",

    lineHeight: "1.7"
  }}
>
  Manage customer purchases,
  invoices, deliveries and
  payment operations from one
  premium control center.
</p>
      </div>

      {/* ORDER SUB TABS */}
<div
  style={{
    display: "flex",

    justifyContent: "center",

    gap: "16px",

    marginBottom: "34px"
  }}
>

  <button
    onClick={() =>
      setOrderTab("active")
    }

    style={{
      padding: "14px 24px",

      borderRadius: "999px",

      border: "none",

      cursor: "pointer",

      background:
        orderTab === "active"
          ? "#123524"
          : "#e5e7eb",

      color:
        orderTab === "active"
          ? "#fff"
          : "#111827",

      fontWeight: "600",

      fontSize: "15px"
    }}
  >
    Active Orders
  </button>

  <button
    onClick={() =>
      setOrderTab("delivered")
    }

    style={{
      padding: "14px 24px",

      borderRadius: "999px",

      border: "none",

      cursor: "pointer",

      background:
        orderTab === "delivered"
          ? "#123524"
          : "#e5e7eb",

      color:
        orderTab === "delivered"
          ? "#fff"
          : "#111827",

      fontWeight: "600",

      fontSize: "15px"
    }}
  >
    Delivered Orders
  </button>

</div>

      {/* ORDERS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >

        {sortedOrders.map((order) => (

          <div
            key={order._id}

            style={{
              background: "#fff",

              borderRadius: "30px",

              padding: "26px",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)"
            }}
          >

           {/* TOP */}
<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "flex-start",

    gap: "20px",

    width: "100%"
  }}
>
             {/* LEFT */}
<div
  style={{
    display: "flex",

    gap: "20px",

    flex: 1,

    minWidth: 0
  }}
>

                {/* ICON */}
                <div
                  style={{
                    width: "74px",
                    height: "74px",

                    borderRadius:
                      "22px",

                    background:
                      "linear-gradient(135deg,#14532d,#1f7a4d)",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    color: "#fff"
                  }}
                >
                  <PackageCheck
                    size={34}
                  />
                </div>

                {/* INFO */}
<div
  style={{
    flex: 1,
    minWidth: 0
  }}
>
                    {order.customerName}
                  

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",

                      gap: "8px",

                      marginTop:
                        "10px",

                      color:
                        "#6b7280"
                    }}
                  >
                    <Phone size={15} />

                    {order.phone}
                  </div>

                  <div
  
  style={{
    display: "flex",
    alignItems: "center",

    gap: "8px",

    marginTop: "10px",

    color: "#6b7280",

    width: "100%",

    maxWidth: "500px",

    overflow: "hidden"
  }}
>
  <MapPin
    size={15}
    style={{
      flexShrink: 0
    }}
  />

  <span
    style={{
      whiteSpace: "nowrap",

      overflow: "hidden",

      textOverflow: "ellipsis",

      width: "100%",

      display: "block"
    }}
  >
    {order.address}
  </span>

</div>

                  <div
                    style={{
                      marginTop:
                        "14px",

                      color: "#6b7280",

                      fontSize: "14px"
                    }}
                  >

                    Ordered On:
                    {" "}

                    {new Date(order.createdAt)
                      .toLocaleDateString()}

                    {" • "}

                    {new Date(order.createdAt)
                      .toLocaleTimeString()}

                  </div>

                  <div
                    style={{
                      marginTop:
                        "14px",

                      display: "flex",

                      gap: "12px",

                      flexWrap:
                        "wrap"
                    }}
                  >

                    {/* PAYMENT */}
                    <div
                      style={{
                        background:
                          "#f3f4f6",

                        padding:
                          "8px 14px",

                        borderRadius:
                          "999px",

                        fontSize:
                          "14px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "6px"
                      }}
                    >
                      <CreditCard
                        size={14}
                      />

                      {order.paymentMethod}
                    </div>

                    {/* STATUS */}
                    <div
                      style={{
                        background:
                          `${getStatusColor(order.status)}15`,

                        color:
                          getStatusColor(order.status),

                        padding:
                          "8px 14px",

                        borderRadius:
                          "999px",

                        fontSize:
                          "14px",

                        fontWeight:
                          "600",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "6px"
                      }}
                    >

                      {getStatusIcon(order.status)}

                      {order.status}

                    </div>
                    {/* DELIVERY INSTRUCTIONS */}

{order.deliveryInstruction && (

  <div
    style={{
      width: "100%",

      marginTop: "18px",

      background:
        "linear-gradient(145deg,#f8faf8,#eef7f0)",

      border:
        "1px solid #dfe7df",

      borderRadius: "18px",

      padding: "18px"
    }}
  >

    <h4
      style={{
        margin: 0,

        color: "#123524",

        marginBottom: "10px",

        fontSize: "15px",

        fontWeight: "700"
      }}
    >
      Delivery Instructions
    </h4>

    <p
      style={{
        margin: 0,

        color: "#4b5563",

        lineHeight: "1.6",

        marginBottom: "10px"
      }}
    >
      {order.deliveryInstruction}
    </p>

    <div
      style={{
        display: "flex",

        gap: "10px",

        flexWrap: "wrap"
      }}
    >

      <div
        style={{
          background: "#fff",

          border:
            "1px solid #dfe7df",

          padding: "8px 14px",

          borderRadius: "999px",

          fontSize: "13px",

          fontWeight: "600",

          color: "#123524"
        }}
      >
        Saturday Delivery:
        {" "}
        {order.saturdayDelivery
          ? "Yes"
          : "No"}
      </div>

      <div
        style={{
          background: "#fff",

          border:
            "1px solid #dfe7df",

          padding: "8px 14px",

          borderRadius: "999px",

          fontSize: "13px",

          fontWeight: "600",

          color: "#123524"
        }}
      >
        Sunday Delivery:
        {" "}
        {order.sundayDelivery
          ? "Yes"
          : "No"}
      </div>

    </div>

  </div>

)}

                  </div>

                </div>

              </div>

              {/* RIGHT */}
<div
  style={{
    textAlign: "right",

    minWidth: "170px",

    flexShrink: 0
  }}
>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280"
                  }}
                >
                  Final Amount
                </p>

                <h1
                  style={{
                    color: "#123524",
                    marginTop: "8px"
                  }}
                >
                  ₹{order.finalAmount}
                </h1>

                <div
                  style={{
                    display: "flex",

                    gap: "10px",

                    marginTop:
                      "16px",

                    justifyContent:
                      "flex-end"
                  }}
                >

                  {/* DETAILS */}
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder ===
                        order._id
                          ? null
                          : order._id
                      )
                    }

                    style={{
                      background:
                        "#123524",

                      color: "#fff",

                      border: "none",

                      padding:
                        "12px 18px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "8px"
                    }}
                  >

                    {expandedOrder ===
                    order._id ? (
                      <ChevronUp
                        size={18}
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                      />
                    )}

                    Details

                  </button>

                </div>

              </div>

            </div>

            {/* EXPANDED */}
            {expandedOrder ===
              order._id && (

                

              <div
              
                style={{
                  marginTop: "28px",

                  borderTop:
                    "1px solid #e5e7eb",

                  paddingTop:
                    "28px"
                }}
              >
                

                <h3
                  style={{
                    marginBottom:
                      "20px"
                  }}
                >
                  Ordered Products
                </h3>


                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",

                    gap: "16px"
                  }}
                >

                  {order.products.map(
                    (
                      product,
                      index
                    ) => (

                      <div
                        key={index}

                        style={{
                          background:
                            "#f9fafb",

                          borderRadius:
                            "18px",

                          padding:
                            "18px",

                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          flexWrap:
                            "wrap",

                          gap: "12px"
                        }}
                      >

                        <div>

                          <h4
                            style={{
                              margin: 0
                            }}
                          >
                            {product.name}
                          </h4>

                          <p
                            style={{
                              marginTop:
                                "6px",

                              color:
                                "#6b7280"
                            }}
                          >
                            Qty:
                            {" "}
                            {product.quantity}
                          </p>

                        </div>

                        <h3>
                          ₹{product.price}
                        </h3>

                      </div>

                    )
                  )}

                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",

                    gap: "14px",

                    marginTop:
                      "24px",

                    flexWrap:
                      "wrap"
                  }}
                >

                  {/* STATUS */}
                  <select
                    value={
                      order.status
                    }

                    onChange={(
                      e
                    ) =>
                      updateOrderStatus(
                        order._id,
                        e.target.value
                      )
                    }

                    style={{
                      padding:
                        "14px 18px",

                      borderRadius:
                        "16px",

                      border:
                        "1px solid #d1d5db",

                      outline:
                        "none"
                    }}
                  >

                    <option>
                      Pending
                    </option>

                    <option>
                      Shipped
                    </option>

                    <option>
                      Delivered
                    </option>

                  </select>

                  {/* PRINT */}
                  <button
                    onClick={() =>
                      printInvoice(order)
                    }

                    style={{
                      background:
                        "#123524",

                      color: "#fff",

                      border: "none",

                      padding:
                        "14px 20px",

                      borderRadius:
                        "16px",

                      display: "flex",

                      alignItems:
                        "center",

                      gap: "8px",

                      cursor: "pointer"
                    }}
                  >

                    <Receipt size={18} />

                    Print Invoice

                  </button>

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default OrdersPanel;