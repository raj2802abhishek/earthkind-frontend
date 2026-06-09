import React from "react";

function RecentOrderCard({ lastOrder }) {
  const orderDate = lastOrder?.createdAt
    ? new Date(lastOrder.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "";
console.log(
  lastOrder?.products?.[0]
);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "12px",
        border: "1px solid rgba(0,0,0,0.05)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#222"
          }}
        >
          Recent Order
        </h3>

        <span
          style={{
            fontSize: "13px",
            color: "#2f4f35"
          }}
        >
          View All Orders
        </span>
      </div>

      {lastOrder?.products?.length > 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
         <img

  src={
    lastOrder.products?.[0]?.image ||

    "https://dummyimage.com/80x80/e8e8e8/555555&text=Product"
  }
            alt="product"
            style={{
              width: "56px",
              height: "56px",
              objectFit: "cover",
              borderRadius: "12px",
              background: "#f8f6f1",
              flexShrink: 0
            }}
          />

          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#222",
                lineHeight: 1.1
              }}
            >
              {lastOrder.products?.[0]?.name}
            </h3>

            <p
              style={{
                marginTop: "4px",
                fontSize: "12px",
                color: "#666",
                lineHeight: 1.2
              }}
            >
              Order #{lastOrder._id?.slice(-6)}
            </p>

            <p
              style={{
                marginTop: "3px",
                fontSize: "13px",
                color: "#222",
                lineHeight: 1.2
              }}
            >
              ₹{lastOrder.products?.[0]?.price} • 1 Item
            </p>
          </div>

          <div
            style={{
              textAlign: "right",
              flexShrink: 0
            }}
          >
            <div
              style={{
                color: "#2f7d32",
                fontSize: "12px",
                fontWeight: "700"
              }}
            >
              Delivered ✓
            </div>

            <div
              style={{
                marginTop: "4px",
                fontSize: "12px",
                color: "#777"
              }}
            >
              {orderDate}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
          No recent orders
        </p>
      )}
    </div>
  );
}

export default RecentOrderCard;