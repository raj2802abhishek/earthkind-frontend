import {
  Package,
  ShoppingCart,
  Clock3,
  TicketPercent,
  IndianRupee,
  Users,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ArrowUpRight
} from "lucide-react";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

function DashboardOverview({
  products = [],
  orders = [],
  coupons = [],
  setProducts,
  totalUsers = 0
}) {
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => Number(p.stock || 0) <= 5);
  }, [products]);

  const setStockValue = async (productId, newStock) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/stock/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: Math.max(0, newStock) })
        }
      );

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((item) => (item._id === productId ? updatedProduct : item))
      );
      toast.success("Stock updated successfully! 📦");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const totalSales = useMemo(() => {
    return orders.reduce((acc, item) => acc + Number(item.finalAmount || item.totalAmount || 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((item) => item.status === "Pending").length;
  }, [orders]);

  const shippedOrders = useMemo(() => {
    return orders.filter((item) => item.status === "Shipped").length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((item) => item.status === "Delivered").length;
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const updateStock = async (productId, type) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const currentStock = product.stock || 0;
      const updatedStock = type === "increase" ? currentStock + 1 : Math.max(0, currentStock - 1);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/stock/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: updatedStock })
        }
      );

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((item) => (item._id === productId ? updatedProduct : item))
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  // CATEGORY LISTS
  const categories = ["All", "Herbal Powders", "Herbal Tea", "Natural Seeds", "Nuts & Dry Fruits"];

  const filteredInventoryProducts = useMemo(() => {
    if (activeCategoryTab === "All") return products;
    return products.filter((p) => p.category === activeCategoryTab);
  }, [products, activeCategoryTab]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* 1. HEADER BANNER SECTION */}
      <div
        className="dashboard-overview-banner"
        style={{
          marginBottom: "36px",
          background: "linear-gradient(135deg, rgba(22, 57, 35, 0.95), rgba(33, 77, 49, 0.9), rgba(46, 106, 69, 0.95))",
          borderRadius: "32px",
          padding: "36px 40px",
          color: "#fff",
          boxShadow: "0 20px 50px rgba(22, 57, 35, 0.22)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.15)"
        }}
      >
        {/* Glow ambient circle */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-80px",
          width: "320px",
          height: "320px",
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.25) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div className="dashboard-banner-pill" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "999px", backdropFilter: "blur(10px)", marginBottom: "14px", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
              <Sparkles size={14} color="#a3e635" /> BUSINESS PERFORMANCE HUB
            </div>
            <h1 className="dashboard-banner-title" style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Dashboard Overview ✨
            </h1>
            <p className="dashboard-banner-sub" style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Monitor live sales revenue, order fulfillment, stock levels, and store analytics in real time.
            </p>
          </div>

          <div className="dashboard-banner-badge-wrapper" style={{ display: "flex", gap: "12px" }}>
            <div className="dashboard-banner-badge" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "16px 24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "right"
            }}>
              <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Total Sales Revenue</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#a3e635" }}>
                ₹{totalSales.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS GRID */}
      <div
        className="dashboard-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "36px"
        }}
      >
        <MetricCard
          title="Total Revenue"
          value={`₹${totalSales.toLocaleString("en-IN")}`}
          subtitle="Lifetime Gross Sales"
          icon={<IndianRupee size={24} />}
          gradient="linear-gradient(135deg, #0d3b1e 0%, #1b5e32 50%, #2e7d32 100%)"
          glowColor="rgba(163, 230, 53, 0.18)"
          shadowColor="rgba(27, 94, 50, 0.35)"
          iconColor="#a3e635"
          badge="+18.4%"
          badgeBg="#ecfdf5"
          badgeColor="#047857"
          badgeBorder="#a7f3d0"
        />

        <MetricCard
          title="Total Orders"
          value={orders.length}
          subtitle="Processed Customer Orders"
          icon={<ShoppingCart size={24} />}
          gradient="linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)"
          glowColor="rgba(99, 102, 241, 0.18)"
          shadowColor="rgba(67, 56, 202, 0.35)"
          iconColor="#e0e7ff"
          badge="Live"
          badgeBg="#e0e7ff"
          badgeColor="#3730a3"
          badgeBorder="#c7d2fe"
        />

        <MetricCard
          title="Pending Dispatch"
          value={pendingOrders}
          subtitle="Action Required"
          icon={<Clock3 size={24} />}
          gradient="linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)"
          glowColor="rgba(245, 158, 11, 0.18)"
          shadowColor="rgba(180, 83, 9, 0.35)"
          iconColor="#fffbeb"
          badge="⚡ Urgent"
          badgeBg="#fef3c7"
          badgeColor="#92400e"
          badgeBorder="#fde68a"
        />

        <MetricCard
          title="Total Products"
          value={products.length}
          subtitle="Live Active Catalog"
          icon={<Package size={24} />}
          gradient="linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)"
          glowColor="rgba(16, 185, 129, 0.18)"
          shadowColor="rgba(4, 120, 87, 0.35)"
          iconColor="#ecfdf5"
          badge="Catalog"
          badgeBg="#f0fdf4"
          badgeColor="#15803d"
          badgeBorder="#bbf7d0"
        />

        <MetricCard
          title="Active Coupons"
          value={coupons.length}
          subtitle="Promo Discount Offers"
          icon={<TicketPercent size={24} />}
          gradient="linear-gradient(135deg, #881337 0%, #be123c 50%, #f43f5e 100%)"
          glowColor="rgba(244, 63, 94, 0.18)"
          shadowColor="rgba(190, 18, 60, 0.35)"
          iconColor="#fff1f2"
          badge="Promo"
          badgeBg="#ffe4e6"
          badgeColor="#9f1239"
          badgeBorder="#fecdd3"
        />

        <MetricCard
          title="Low Stock Alert ⚠️"
          value={lowStockProducts.length}
          subtitle={lowStockProducts.length === 0 ? "Stock Healthy" : "Action Required"}
          icon={<AlertTriangle size={24} />}
          gradient={lowStockProducts.length > 0
            ? "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)"
            : "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)"}
          glowColor="rgba(239, 68, 68, 0.2)"
          shadowColor="rgba(185, 28, 28, 0.35)"
          iconColor="#fef2f2"
          badge={lowStockProducts.length > 0 ? "⚠️ Alert" : "Healthy"}
          badgeBg={lowStockProducts.length > 0 ? "#fee2e2" : "#f0fdf4"}
          badgeColor={lowStockProducts.length > 0 ? "#991b1b" : "#15803d"}
          badgeBorder={lowStockProducts.length > 0 ? "#fca5a5" : "#bbf7d0"}
        />

        <MetricCard
          title="Registered Users"
          value={totalUsers}
          subtitle="Customer Accounts"
          icon={<Users size={24} />}
          gradient="linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)"
          glowColor="rgba(56, 189, 248, 0.18)"
          shadowColor="rgba(2, 132, 199, 0.35)"
          iconColor="#f0f9ff"
          badge="Verified"
          badgeBg="#e0f2fe"
          badgeColor="#0369a1"
          badgeBorder="#bae6fd"
        />
      </div>

      {/* PROMINENT LOW STOCK ALERT WARNING BANNER */}
      {lowStockProducts.length > 0 && (
        <div
          style={{
            marginBottom: "36px",
            background: "linear-gradient(135deg, #fff5f5, #fef2f2)",
            borderRadius: "28px",
            padding: "26px",
            border: "1.5px solid #fca5a5",
            boxShadow: "0 12px 36px rgba(220, 38, 38, 0.1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#dc2626", color: "#fff", padding: "12px", borderRadius: "16px", display: "flex", alignItems: "center", boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#991b1b" }}>
                  Low Stock Warning ({lowStockProducts.length} Items Need Restocking) ⚠️
                </h3>
                <p style={{ margin: "3px 0 0 0", fontSize: "13px", color: "#b91c1c", fontWeight: "500" }}>
                  The following items have 5 or fewer units left in inventory. Adjust or restock instantly below.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                lowStockProducts.forEach((p) => setStockValue(p._id, 15));
              }}
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)"
              }}
            >
              ⚡ Restock All Low Items to 15 Units
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
            {lowStockProducts.map((prod) => {
              const isZero = Number(prod.stock || 0) === 0;
              return (
                <div
                  key={prod._id}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "16px",
                    border: isZero ? "1.5px solid #f87171" : "1px solid #fecdd3",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8fafc", overflow: "hidden", flexShrink: 0, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <Package size={20} color="#64748b" />
                      )}
                    </div>

                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "700", color: "#163923", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {prod.name}
                      </h4>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        color: isZero ? "#dc2626" : "#b45309",
                        background: isZero ? "#fee2e2" : "#fef3c7",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        display: "inline-block"
                      }}>
                        {isZero ? "OUT OF STOCK ❌" : `Only ${prod.stock} Left ⚠️`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setStockValue(prod._id, (prod.stock || 0) + 5)}
                      style={{
                        flex: 1,
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "1px solid #fca5a5",
                        padding: "8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      +5 Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockValue(prod._id, (prod.stock || 0) + 10)}
                      style={{
                        flex: 1,
                        background: "#163923",
                        color: "#fff",
                        border: "none",
                        padding: "8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      +10 Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RECENT ORDERS & ANALYTICS DUAL GRID */}
      <div
        className="dashboard-dual-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "36px"
        }}
      >
        
        {/* RECENT ORDERS WIDGET */}
        <div
          className="dashboard-widget-card"
          style={{
            background: "#fff",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(22, 57, 35, 0.08)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#163923" }}>
                Recent Orders 🛍️
              </h3>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Latest customer transactions</span>
            </div>
            <span style={{
              background: "#f0fdf4",
              color: "#163923",
              border: "1px solid #bbf7d0",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700"
            }}>
              Live Feed
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recentOrders.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                No recent orders recorded yet.
              </p>
            ) : (
              recentOrders.map((order) => {
                const isDelivered = order.status === "Delivered";
                const isPending = order.status === "Pending";

                return (
                  <div
                    key={order._id}
                    className="dashboard-recent-order-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      background: "#f9fafb",
                      border: "1px solid #f1f5f9",
                      transition: "transform 0.2s ease"
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "700", color: "#163923" }}>
                        {order.customerName || "Customer"}
                      </h4>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {order.paymentMethod || "COD"} • {new Date(order.createdAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#163923" }}>
                        ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString("en-IN")}
                      </div>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: isDelivered ? "#059669" : isPending ? "#d97706" : "#2563eb",
                        background: isDelivered ? "#dcfce7" : isPending ? "#fef3c7" : "#dbeafe",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        display: "inline-block",
                        marginTop: "2px"
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FULFILLMENT ANALYTICS WIDGET */}
        <div
          className="dashboard-widget-card"
          style={{
            background: "#fff",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(22, 57, 35, 0.08)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#163923" }}>
                Order Fulfillment Status 📊
              </h3>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Logistics & delivery distribution</span>
            </div>
            <TrendingUp size={20} color="#163923" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ProgressStatRow
              label="Pending Dispatch"
              value={pendingOrders}
              total={orders.length}
              color="linear-gradient(90deg, #f59e0b, #d97706)"
              textColor="#d97706"
            />

            <ProgressStatRow
              label="In Transit (Shipped)"
              value={shippedOrders}
              total={orders.length}
              color="linear-gradient(90deg, #3b82f6, #1d4ed8)"
              textColor="#1d4ed8"
            />

            <ProgressStatRow
              label="Completed (Delivered)"
              value={deliveredOrders}
              total={orders.length}
              color="linear-gradient(90deg, #10b981, #047857)"
              textColor="#047857"
            />
          </div>

          {/* Quick Summary Pill Footer */}
          <div style={{
            marginTop: "24px",
            background: "#f0fdf4",
            border: "1px solid #dcfce7",
            borderRadius: "18px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <CheckCircle2 size={24} color="#059669" />
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#163923" }}>Fulfillment Efficiency</span>
              <p style={{ margin: 0, fontSize: "12px", color: "#047857" }}>
                {orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}% of all customer orders successfully delivered.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. LIVE INVENTORY MANAGEMENT SECTION */}
      <div
        className="dashboard-inventory-section"
        style={{
          background: "#fff",
          borderRadius: "30px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(22, 57, 35, 0.08)"
        }}
      >
        
        {/* Section Header & Category Filter Tabs */}
        <div className="inventory-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#163923" }}>
              Live Stock & Inventory Controls 📦
            </h3>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Quickly adjust product stock quantities in real time</span>
          </div>

          {/* Category Tabs */}
          <div className="inventory-category-tabs" style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
            {categories.map((cat) => {
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "14px",
                    border: isActive ? "none" : "1px solid #e5e7eb",
                    background: isActive ? "linear-gradient(135deg, #163923, #285b37)" : "#f9fafb",
                    color: isActive ? "#fff" : "#4b5563",
                    fontWeight: isActive ? "700" : "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Stock Cards */}
        {filteredInventoryProducts.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "30px 0" }}>
            No products found in this category.
          </p>
        ) : (
          <div
            className="inventory-stock-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "18px"
            }}
          >
            {filteredInventoryProducts.map((product) => {
              const isLowStock = (product.stock || 0) <= 5;

              return (
                <div
                  key={product._id}
                  className="inventory-stock-card"
                  style={{
                    background: "#f9fafb",
                    borderRadius: "20px",
                    padding: "16px",
                    border: isLowStock ? "1.5px solid #fca5a5" : "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                    position: "relative"
                  }}
                >
                  {/* Image */}
                  <div
                    className="inventory-card-img-wrapper"
                    style={{
                      width: "100%",
                      height: "120px",
                      borderRadius: "14px",
                      background: "#fff",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <Package size={32} color="#163923" />
                    )}
                  </div>

                  {/* Title */}
                  <h4
                    className="inventory-card-title"
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#163923",
                      lineHeight: "1.3",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {product.name}
                  </h4>

                  {/* Stock Quick Adjustment */}
                  <div
                    className="stock-adjust-bar"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#fff",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Stock:</span>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => updateStock(product._id, "decrease")}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#fee2e2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontWeight: "800",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Minus size={13} />
                      </button>

                      <span style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: isLowStock ? "#dc2626" : "#163923",
                        minWidth: "20px",
                        textAlign: "center"
                      }}>
                        {product.stock || 0}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateStock(product._id, "increase")}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#dcfce7",
                          color: "#15803d",
                          cursor: "pointer",
                          fontWeight: "800",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Low Stock Warning Pill */}
                  {isLowStock && (
                    <div style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}>
                      <AlertTriangle size={12} /> Low Stock Alert
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}

// METRIC CARD COMPONENT
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  glowColor,
  shadowColor,
  iconColor = "#ffffff",
  badge,
  badgeBg = "#f3f4f6",
  badgeColor = "#374151",
  badgeBorder = "transparent"
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="dashboard-metric-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #faf8f5 100%)",
        borderRadius: "26px",
        padding: "24px",
        boxShadow: isHovered
          ? "0 22px 45px rgba(22, 57, 35, 0.12), 0 6px 14px rgba(0, 0, 0, 0.04)"
          : "0 10px 30px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)",
        border: isHovered
          ? "1px solid rgba(22, 57, 35, 0.2)"
          : "1px solid rgba(22, 57, 35, 0.07)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "160px",
        position: "relative",
        overflow: "hidden",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        minWidth: 0,
        boxSizing: "border-box"
      }}
    >
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "140px",
          height: "140px",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          transition: "transform 0.4s ease",
          transform: isHovered ? "scale(1.3)" : "scale(1)"
        }}
      />

      {/* Top Header: Icon & Badge */}
      <div
        className="metric-card-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
          width: "100%",
          minWidth: 0
        }}
      >
        <div
          className="metric-icon-box"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "18px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            boxShadow: `0 10px 22px ${shadowColor}, inset 0 1px 1px rgba(255, 255, 255, 0.3)`,
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.3s ease",
            flexShrink: 0
          }}
        >
          {icon}
        </div>

        {badge && (
          <span
            className="metric-badge"
            style={{
              background: badgeBg,
              color: badgeColor,
              border: `1px solid ${badgeBorder}`,
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              flexShrink: 0
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Metric Content */}
      <div className="metric-card-content" style={{ position: "relative", zIndex: 2, marginTop: "16px", width: "100%", minWidth: 0, overflow: "hidden" }}>
        <span
          className="metric-title"
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            display: "block",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {title}
        </span>
        <div
          className="metric-value"
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#163923",
            letterSpacing: "-0.5px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {value}
        </div>
        <span
          className="metric-subtitle"
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "2px",
            display: "block",
            fontWeight: "500",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

// PROGRESS ROW COMPONENT
function ProgressStatRow({ label, value, total, color, textColor }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", fontWeight: "600" }}>
        <span style={{ color: "#374151" }}>{label}</span>
        <span style={{ color: textColor, fontWeight: "700" }}>{value} orders ({percentage}%)</span>
      </div>
      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{
          width: `${percentage}%`,
          height: "100%",
          background: color,
          borderRadius: "999px",
          transition: "width 0.5s ease"
        }} />
      </div>
    </div>
  );
}

export default DashboardOverview;