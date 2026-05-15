import {
  Package,
  ShoppingCart,
  Clock3,
  TicketPercent,
  IndianRupee,
  Users
} from "lucide-react";

function DashboardOverview({
  products,
  orders,
  coupons,
  setProducts,
  totalUsers
}) {

  const totalSales = orders.reduce(
    (acc, item) =>
      acc + (item.finalAmount || 0),
    0
  );

  const pendingOrders =
    orders.filter(
      (item) =>
        item.status === "Pending"
    ).length;

    const updateStock = async (
  productId,
  type
) => {

  try {

    const product =
      products.find(
        (p) => p._id === productId
      );

    if (!product) return;

    const currentStock =
      product.stock || 0;

    const updatedStock =
      type === "increase"
        ? currentStock + 1
        : Math.max(
            0,
            currentStock - 1
          );

    // SAVE TO DATABASE
    const response =
      await fetch(

        `${import.meta.env.VITE_API_URL}/api/products/stock/${productId}`,

        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            stock: updatedStock
          })
        }
      );

    const updatedProduct =
      await response.json();

    // UPDATE FRONTEND
    setProducts((prev) =>
      prev.map((item) =>
        item._id === productId
          ? updatedProduct
          : item
      )
    );

  } catch (error) {

    console.log(error);

  }

};

  const deliveredOrders =
    orders.filter(
      (item) =>
        item.status === "Delivered"
    ).length;

  const recentOrders =
    [...orders]
      .reverse()
      .slice(0, 4);

      // INVENTORY CATEGORIES

const herbalPowders =
  products.filter(
    (item) =>
      item.category ===
      "Herbal Powders"
  );

const herbalTea =
  products.filter(
    (item) =>
      item.category ===
      "Herbal Tea"
  );

const naturalSeeds =
  products.filter(
    (item) =>
      item.category ===
      "Natural Seeds"
  );

const nutsDryFruits =
  products.filter(
    (item) =>
      item.category ===
      "Nuts & Dry Fruits"
  );

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "38px"
        }}
      >

        <h1
          style={{
            fontSize: "68px",
            fontWeight: "800",
            color: "#123524",
            letterSpacing: "-2px",
            marginBottom: "12px",
            lineHeight: "1"
          }}
        >
          Dashboard ✨
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "19px",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.7"
          }}
        >
          Monitor products, orders,
          revenue and business
          performance from one
          premium control center.
        </p>

      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(190px,1fr))",

          gap: "18px",

          marginBottom: "28px"
        }}
      >

        <Card
          title="Products"
          value={products.length}
          icon={<Package size={22} />}
        />

        <Card
          title="Orders"
          value={orders.length}
          icon={
            <ShoppingCart size={22} />
          }
        />

        <Card
          title="Pending"
          value={pendingOrders}
          icon={<Clock3 size={22} />}
        />

        <Card
          title="Coupons"
          value={coupons.length}
          icon={
            <TicketPercent size={22} />
          }
        />

        <Card
          title="Revenue"
          value={`₹${totalSales}`}
          icon={
            <IndianRupee size={22} />
          }
        />
        <Card
  title="Users"
  value={totalUsers}
  icon={<Users size={22} />}
/>

      </div>


      {/* INVENTORY SECTION */}

<div
  style={{
    marginBottom: "28px"
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "20px"
    }}
  >

    <h2
      style={{
        color: "#123524",
        fontSize: "30px",
        margin: 0
      }}
    >
      Inventory Overview
    </h2>

    <p
      style={{
        color: "#6b7280",
        fontSize: "15px"
      }}
    >
      Live stock tracking
    </p>

  </div>

  <InventoryCategory
    title="Herbal Powders"
    products={herbalPowders}
    updateStock={updateStock}
  />

  <InventoryCategory
    title="Herbal Tea"
    products={herbalTea}
    updateStock={updateStock}
  />

  <InventoryCategory
    title="Natural Seeds"
    products={naturalSeeds}
    updateStock={updateStock}
  />

  <InventoryCategory
    title="Nuts & Dry Fruits"
    products={nutsDryFruits}
    updateStock={updateStock}
  />

</div>

      {/* ANALYTICS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1.5fr 1fr",

          gap: "20px"
        }}
      >

        {/* RECENT ORDERS */}
        <div
          style={{
            background: "#fff",

            borderRadius: "30px",

            padding: "28px",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >

          <h2
            style={{
              marginBottom: "24px",
              color: "#123524"
            }}
          >
            Recent Orders
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >

            {recentOrders.map(
              (order) => (

                <div
                  key={order._id}

                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    paddingBottom:
                      "14px",

                    borderBottom:
                      "1px solid #f1f5f9"
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        color: "#123524"
                      }}
                    >
                      {
                        order.customerName
                      }
                    </h4>

                    <p
                      style={{
                        marginTop: "5px",
                        color: "#6b7280",
                        fontSize: "14px"
                      }}
                    >
                      {
                        order.paymentMethod
                      }
                    </p>

                  </div>

                  <div
                    style={{
                      textAlign: "right"
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                        color: "#123524"
                      }}
                    >
                      ₹
                      {
                        order.finalAmount
                      }
                    </h3>

                    <p
                      style={{
                        fontSize: "13px",
                        color:
                          order.status ===
                          "Delivered"
                            ? "#16a34a"
                            : "#f59e0b"
                      }}
                    >
                      {order.status}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* ORDER STATUS */}
        <div
          style={{
            background: "#fff",

            borderRadius: "30px",

            padding: "28px",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >

          <h2
            style={{
              marginBottom: "24px",
              color: "#123524"
            }}
          >
            Order Analytics
          </h2>

          <AnalyticsRow
            label="Pending"
            value={pendingOrders}
            color="#f59e0b"
          />

          <AnalyticsRow
            label="Delivered"
            value={deliveredOrders}
            color="#16a34a"
          />

          <AnalyticsRow
            label="Total"
            value={orders.length}
            color="#123524"
          />

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  icon
}) {

  return (
    <div
      style={{
        background: "#fff",

        borderRadius: "26px",

        padding: "22px",

        boxShadow:
          "0 10px 24px rgba(0,0,0,0.05)",

        display: "flex",

        flexDirection: "column",

        gap: "16px",

        minHeight: "135px",

        justifyContent:
          "space-between"
      }}
    >

      <div
        style={{
          width: "46px",
          height: "46px",

          borderRadius: "14px",

          background:
            "rgba(18,53,36,0.08)",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          color: "#123524"
        }}
      >
        {icon}
      </div>

      <div>

        <h3
          style={{
            color: "#6b7280",
            marginBottom: "8px",
            fontSize: "15px"
          }}
        >
          {title}
        </h3>

        <h1
          style={{
            fontSize: "38px",
            color: "#123524",
            margin: 0,
            fontWeight: "700"
          }}
        >
          {value}
        </h1>

      </div>

    </div>
  );
}

function InventoryCategory({
  title,
  products,
  updateStock
}) {

  return (

    <div
      style={{
        background: "#fff",

        borderRadius: "26px",

        padding: "22px",

        marginBottom: "18px",

        boxShadow:
          "0 10px 24px rgba(0,0,0,0.05)"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "18px"
        }}
      >

        <h3
          style={{
            margin: 0,
            color: "#123524"
          }}
        >
          {title}
        </h3>

        <span
          style={{
            color: "#6b7280",
            fontSize: "14px"
          }}
        >
          {products.length} products
        </span>

      </div>

      {/* PRODUCTS */}
      <div
        style={{
          display: "flex",

          gap: "16px",

          overflowX: "auto",

          paddingBottom: "8px"
        }}
      >

        {products.map((product) => {

          const lowStock =
            product.stock <= 5;

          return (

            <div
              key={product._id}

              style={{
                minWidth: "210px",

                background:
                  "#f9fafb",

                borderRadius:
                  "20px",

                padding: "14px",

                border:
                  lowStock
                    ? "1px solid #fecaca"
                    : "1px solid #f1f5f9"
              }}
            >

              <img
                src={product.image}

                alt={product.name}

                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "contain",
                  background:"#fff",
                  borderRadius:"14px",
                  borderRadius: "14px",
                  marginBottom: "12px"
                }}
              />

              <h4
                style={{
                  margin: 0,
                  color: "#123524",
                  fontSize: "16px"
                }}
              >
                {product.name}
              </h4>

              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  marginTop: "12px"
                }}
              >

                <div>

  <p
    style={{
      margin: 0,
      color: "#6b7280",
      fontSize: "13px",
      marginBottom: "6px"
    }}
  >
    Stock
  </p>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >

    {/* DECREASE */}
    <button
      onClick={() =>
        updateStock(
          product._id,
          "decrease"
        )
      }

      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "none",
        background: "#fee2e2",
        color: "#dc2626",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px"
      }}
    >
      −
    </button>

    {/* STOCK */}
    <strong
      style={{
        color:
          lowStock
            ? "#dc2626"
            : "#123524",

        minWidth: "16px",
        textAlign: "center"
      }}
    >
      {product.stock}
    </strong>

    {/* INCREASE */}
    <button
      onClick={() =>
        updateStock(
          product._id,
          "increase"
        )
      }

      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "none",
        background: "#dcfce7",
        color: "#15803d",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px"
      }}
    >
      +
    </button>

  </div>

</div>

                <div>

                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                      fontSize: "13px"
                    }}
                  >
                    Sold
                  </p>

                  <strong>
                    {product.sold}
                  </strong>

                </div>

              </div>

              {lowStock && (

                <div
                  style={{
                    marginTop: "12px",

                    background:
                      "#fef2f2",

                    color: "#dc2626",

                    padding:
                      "8px 10px",

                    borderRadius:
                      "12px",

                    fontSize: "12px",

                    fontWeight: "600",

                    textAlign: "center"
                  }}
                >
                  Low Stock
                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );
}

function AnalyticsRow({
  label,
  value,
  color
}) {

  return (

    <div
      style={{
        marginBottom: "22px"
      }}
    >

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          marginBottom: "10px"
        }}
      >

        <span>{label}</span>

        <strong>{value}</strong>

      </div>

      <div
        style={{
          height: "10px",

          background: "#f1f5f9",

          borderRadius: "20px",

          overflow: "hidden"
        }}
      >

        <div
          style={{
            width: `${value * 10}%`,
            height: "100%",
            background: color,
            borderRadius: "20px"
          }}
        />

      </div>

    </div>

  );
}



export default DashboardOverview;