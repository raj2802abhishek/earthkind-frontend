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
  Receipt,
  Search,
  Copy,
  Check,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Box
} from "lucide-react";

import { useState, useMemo } from "react";

function OrdersPanel({
  orders = [],
  updateOrderStatus
}) {

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderTab, setOrderTab] = useState("all"); // "all", "active", "pending", "shipped", "delivered"
  const [paymentFilter, setPaymentFilter] = useState("all"); // "all", "COD", "ONLINE"
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleOrders, setVisibleOrders] = useState(10);
  const [copiedId, setCopiedId] = useState(null);

  // Reset pagination when filters change
  const handleTabChange = (tab) => {
    setOrderTab(tab);
    setVisibleOrders(10);
  };

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // KPI STATS COMPUTATION
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const shippedCount = orders.filter(o => o.status === "Shipped").length;
    const deliveredCount = orders.filter(o => o.status === "Delivered").length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.finalAmount || o.totalAmount || 0), 0);
    return { totalCount, pendingCount, shippedCount, deliveredCount, totalRevenue };
  }, [orders]);

  // FILTER & SEARCH LOGIC
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (orderTab === "active" && order.status === "Delivered") return false;
      if (orderTab === "pending" && order.status !== "Pending") return false;
      if (orderTab === "shipped" && order.status !== "Shipped") return false;
      if (orderTab === "delivered" && order.status !== "Delivered") return false;

      // Payment filter
      if (paymentFilter !== "all") {
        const pMethod = (order.paymentMethod || "").toLowerCase();
        if (paymentFilter === "COD" && !pMethod.includes("cod")) return false;
        if (paymentFilter === "ONLINE" && pMethod.includes("cod")) return false;
      }

      // Search term
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const nameMatch = (order.customerName || "").toLowerCase().includes(query);
        const phoneMatch = (order.phone || "").toLowerCase().includes(query);
        const addressMatch = (order.address || "").toLowerCase().includes(query);
        const idMatch = (order._id || "").toLowerCase().includes(query);
        const productMatch = order.products?.some(p => (p.name || "").toLowerCase().includes(query));
        return nameMatch || phoneMatch || addressMatch || idMatch || productMatch;
      }

      return true;
    });
  }, [orders, orderTab, paymentFilter, searchTerm]);

  // SORT RECENT FIRST
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredOrders]);

  const displayedOrders = sortedOrders.slice(0, visibleOrders);
  const hasMoreOrders = sortedOrders.length > visibleOrders;

  const loadMoreOrders = () => {
    setVisibleOrders(prev => prev + 10);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.18))",
          color: "#d97706",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          dotBg: "#f59e0b",
          boxShadow: "0 0 12px rgba(245, 158, 11, 0.25)"
        };
      case "Shipped":
        return {
          bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.18))",
          color: "#2563eb",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          dotBg: "#3b82f6",
          boxShadow: "0 0 12px rgba(59, 130, 246, 0.25)"
        };
      case "Delivered":
        return {
          bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.18))",
          color: "#059669",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          dotBg: "#10b981",
          boxShadow: "0 0 12px rgba(16, 185, 129, 0.25)"
        };
      default:
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          color: "#4b5563",
          border: "1px solid rgba(107, 114, 128, 0.2)",
          dotBg: "#6b7280",
          boxShadow: "none"
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock3 size={15} />;
      case "Shipped":
        return <Truck size={15} />;
      case "Delivered":
        return <CheckCircle2 size={15} />;
      default:
        return <ShoppingBag size={15} />;
    }
  };

  // PRINT INVOICE GENERATOR
  const printInvoice = (order) => {
    const gst = Math.round((order.totalAmount || 0) * 0.05); // 5% GST
    const shipping = (order.totalAmount || 0) >= 499 ? 0 : 50;
    const subtotal = order.totalAmount || 0;
    const discount = order.discount || 0;
    const finalTotal = order.finalAmount || Math.max(subtotal + gst + shipping - discount, 0);

    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order._id?.slice(-8).toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              padding: 24px;
              max-width: 400px;
              margin: 0 auto;
              color: #1a2e22;
              background: #fff;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #163923;
              padding-bottom: 16px;
              margin-bottom: 16px;
            }
            .logo-title {
              font-size: 22px;
              font-weight: 800;
              color: #163923;
              letter-spacing: -0.5px;
              margin: 0;
            }
            .subtitle {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #52796f;
              margin-top: 4px;
              font-weight: 600;
            }
            .order-meta {
              font-size: 12px;
              background: #f4f7f4;
              border-radius: 12px;
              padding: 12px;
              margin-bottom: 16px;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
            }
            .meta-row:last-child { margin-bottom: 0; }
            .meta-label { color: #52796f; font-weight: 500; }
            .meta-val { font-weight: 700; color: #163923; }
            .section-title {
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #163923;
              margin-bottom: 8px;
            }
            .address-box {
              font-size: 12px;
              line-height: 1.5;
              color: #2d4a3e;
              background: #fafdfa;
              border: 1px solid #e1e8e2;
              border-radius: 10px;
              padding: 10px;
              margin-bottom: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
              font-size: 12px;
            }
            th {
              text-align: left;
              border-bottom: 2px solid #163923;
              padding: 8px 4px;
              color: #163923;
              font-weight: 700;
            }
            td {
              padding: 8px 4px;
              border-bottom: 1px solid #e8efe9;
              color: #2d4a3e;
            }
            .summary {
              border-top: 2px dashed #163923;
              padding-top: 12px;
            }
            .sum-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin-bottom: 6px;
              color: #4b6858;
            }
            .sum-row.total {
              font-size: 16px;
              font-weight: 800;
              color: #163923;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #163923;
            }
            .footer {
              text-align: center;
              margin-top: 24px;
              font-size: 11px;
              color: #6b8c7a;
            }
            @media print {
              body { width: 100%; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="logo-title">Earthkind Naturals 🌿</h1>
            <div class="subtitle">Tax Invoice & Order Summary</div>
          </div>

          <div class="order-meta">
            <div class="meta-row">
              <span class="meta-label">Order ID:</span>
              <span class="meta-val">#${order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Date:</span>
              <span class="meta-val">${new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Payment Method:</span>
              <span class="meta-val">${order.paymentMethod || "COD"}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Status:</span>
              <span class="meta-val">${order.status}</span>
            </div>
          </div>

          <div class="section-title">Customer & Delivery Details</div>
          <div class="address-box">
            <strong>${order.customerName}</strong><br/>
            📞 ${order.phone || "N/A"}<br/>
            📍 ${order.address}
          </div>

          <div class="section-title">Itemized Order Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${(order.products || []).map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td style="text-align:center;">${p.quantity}</td>
                  <td style="text-align:right;">₹${p.price * p.quantity}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="summary">
            <div class="sum-row">
              <span>Items Subtotal</span>
              <span>₹${subtotal}</span>
            </div>
            <div class="sum-row">
              <span>Estimated GST (5%)</span>
              <span>₹${gst}</span>
            </div>
            <div class="sum-row">
              <span>Delivery Fee</span>
              <span>${shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            ${discount > 0 ? `
              <div class="sum-row" style="color: #059669; font-weight: 600;">
                <span>Discount Applied</span>
                <span>-₹${discount}</span>
              </div>
            ` : ''}
            <div class="sum-row total">
              <span>Grand Total</span>
              <span>₹${finalTotal}</span>
            </div>
          </div>

          <div class="footer">
            Thank you for choosing Earthkind Naturals!<br/>
            Pure, Mindful & 100% Organic Wellness 🌿
          </div>
        </body>
      </html>
    `);

    invoiceWindow.document.close();
    invoiceWindow.focus();
    setTimeout(() => invoiceWindow.print(), 250);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* 1. HEADER TITLE SECTION */}
      <div
        className="orders-overview-banner"
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
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "999px", backdropFilter: "blur(10px)", marginBottom: "14px", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
              <Sparkles size={14} color="#a3e635" /> ADMIN FULFILLMENT CENTER
            </div>
            <h1 className="orders-banner-title" style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Customer Orders
            </h1>
            <p className="orders-banner-sub" style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Track customer purchases, manage shipping logistics, generate thermal invoices, and oversee order statuses.
            </p>
          </div>

          <div className="orders-banner-badge-wrapper" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="orders-banner-badge" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "16px 24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "right"
            }}>
              <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Total Sales Revenue</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#a3e635" }}>
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI SUMMARY METRIC CARDS */}
      <div
        className="orders-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "32px"
        }}
      >
        {/* Total Orders Card */}
        <div className="orders-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(22, 57, 35, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="orders-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #163923, #285b37)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(22, 57, 35, 0.2)",
            flexShrink: 0
          }}>
            <PackageCheck size={26} />
          </div>
          <div className="orders-kpi-content" style={{ minWidth: 0 }}>
            <span className="orders-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>Total Orders</span>
            <span className="orders-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#163923" }}>{stats.totalCount}</span>
          </div>
        </div>

        {/* Pending Processing */}
        <div className="orders-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="orders-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(245, 158, 11, 0.25)",
            flexShrink: 0
          }}>
            <Clock3 size={26} />
          </div>
          <div className="orders-kpi-content" style={{ minWidth: 0 }}>
            <span className="orders-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>Pending Dispatch</span>
            <span className="orders-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#d97706" }}>{stats.pendingCount}</span>
          </div>
        </div>

        {/* Shipped */}
        <div className="orders-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="orders-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(59, 130, 246, 0.25)",
            flexShrink: 0
          }}>
            <Truck size={26} />
          </div>
          <div className="orders-kpi-content" style={{ minWidth: 0 }}>
            <span className="orders-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>In Transit (Shipped)</span>
            <span className="orders-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#1d4ed8" }}>{stats.shippedCount}</span>
          </div>
        </div>

        {/* Delivered */}
        <div className="orders-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="orders-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #10b981, #047857)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(16, 185, 129, 0.25)",
            flexShrink: 0
          }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="orders-kpi-content" style={{ minWidth: 0 }}>
            <span className="orders-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>Completed (Delivered)</span>
            <span className="orders-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#047857" }}>{stats.deliveredCount}</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROL TOOLBAR (SEARCH + TAB FILTERS) */}
      <div
        className="orders-filter-bar"
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "20px 24px",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(22, 57, 35, 0.06)",
          marginBottom: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        <div className="orders-filter-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          
          {/* SEARCH INPUT */}
          <div className="orders-search-wrapper" style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search size={18} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search by Customer, Phone, Order ID or Product..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleOrders(10);
              }}
              style={{
                width: "100%",
                padding: "14px 18px 14px 48px",
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.background = "#fff";
                e.target.style.borderColor = "#163923";
                e.target.style.boxShadow = "0 0 0 4px rgba(22, 57, 35, 0.08)";
              }}
              onBlur={(e) => {
                e.target.style.background = "#f9fafb";
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#4b5563"
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* PAYMENT METHOD SELECTOR */}
          <div className="orders-payment-select-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CreditCard size={16} color="#52796f" />
            <select
              className="orders-payment-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{
                padding: "12px 18px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "14px",
                fontWeight: "600",
                color: "#163923",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="all">All Payment Methods</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="ONLINE">Prepaid / Online</option>
            </select>
          </div>
        </div>

        {/* STATUS FILTER PILLS */}
        <div
          className="orders-tabs-scroll"
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "4px"
          }}
        >
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "active", label: "Active Orders", count: orders.filter(o => o.status !== "Delivered").length },
            { id: "pending", label: "Pending", count: stats.pendingCount },
            { id: "shipped", label: "Shipped", count: stats.shippedCount },
            { id: "delivered", label: "Delivered", count: stats.deliveredCount }
          ].map((tab) => {
            const isActive = orderTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`order-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "16px",
                  border: isActive ? "none" : "1px solid #e5e7eb",
                  background: isActive ? "linear-gradient(135deg, #163923, #285b37)" : "#f9fafb",
                  color: isActive ? "#fff" : "#4b5563",
                  fontWeight: isActive ? "700" : "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                  boxShadow: isActive ? "0 8px 18px rgba(22, 57, 35, 0.2)" : "none"
                }}
              >
                {tab.label}
                <span style={{
                  background: isActive ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
                  color: isActive ? "#fff" : "#6b7280",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: "700"
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ORDERS LISTING */}
      {displayedOrders.length === 0 ? (
        <div style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "60px 20px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
          border: "1px dashed #cbd5e1"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(22, 57, 35, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            color: "#163923"
          }}>
            <Box size={38} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#163923", margin: "0 0 8px 0" }}>
            No Orders Found
          </h3>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0, maxWidth: "400px", margin: "0 auto" }}>
            {searchTerm || orderTab !== "all" || paymentFilter !== "all"
              ? "No orders match your active filter or search criteria. Try resetting filters."
              : "There are currently no customer orders placed in the system."}
          </p>
          {(searchTerm || orderTab !== "all" || paymentFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setOrderTab("all");
                setPaymentFilter("all");
              }}
              style={{
                marginTop: "20px",
                background: "#163923",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {displayedOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const badge = getStatusBadgeStyle(order.status);
            const shortId = order._id ? order._id.slice(-8).toUpperCase() : "N/A";

            return (
              <div
                key={order._id}
                className="order-card"
                style={{
                  background: "#fff",
                  borderRadius: "28px",
                  padding: "26px 30px",
                  boxShadow: isExpanded
                    ? "0 20px 45px rgba(22, 57, 35, 0.12)"
                    : "0 10px 30px rgba(0, 0, 0, 0.04)",
                  border: isExpanded
                    ? "1px solid rgba(22, 57, 35, 0.25)"
                    : "1px solid rgba(22, 57, 35, 0.06)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {/* CARD HEADER ROW */}
                <div
                  className="order-card-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap"
                  }}
                >
                  
                  {/* LEFT: Customer Avatar & Details */}
                  <div className="order-customer-col" style={{ display: "flex", gap: "20px", flex: 1, minWidth: "280px" }}>
                    
                    {/* Customer Initials Avatar */}
                    <div
                      className="order-avatar"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #163923, #2e6a45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "800",
                        fontSize: "22px",
                        flexShrink: 0,
                        boxShadow: "0 8px 20px rgba(22, 57, 35, 0.18)"
                      }}
                    >
                      {order.customerName ? order.customerName.charAt(0).toUpperCase() : <User size={24} />}
                    </div>

                    <div className="order-details-wrapper" style={{ flex: 1, minWidth: 0 }}>
                      
                      {/* ORDER ID & STATUS BADGE BAR */}
                      <div className="order-badges-bar" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
                        
                        {/* Order ID Pill with Copy button */}
                        <div
                          className="order-id-pill"
                          onClick={(e) => handleCopyId(order._id, e)}
                          title="Click to copy Order ID"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#f3f4f6",
                            padding: "4px 12px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontFamily: "monospace",
                            fontWeight: "700",
                            color: "#374151",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                        >
                          #{shortId}
                          {copiedId === order._id ? (
                            <Check size={13} color="#059669" />
                          ) : (
                            <Copy size={13} color="#6b7280" />
                          )}
                        </div>

                        {/* Status Badge */}
                        <div
                          className="order-status-badge"
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: badge.border,
                            padding: "5px 14px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: badge.boxShadow
                          }}
                        >
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: badge.dotBg }} />
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>

                        {/* Payment Method Badge */}
                        <div
                          className="order-payment-badge"
                          style={{
                            background: order.paymentMethod?.toLowerCase().includes("cod")
                              ? "rgba(107, 114, 128, 0.1)"
                              : "rgba(124, 58, 237, 0.1)",
                            color: order.paymentMethod?.toLowerCase().includes("cod") ? "#4b5563" : "#7c3aed",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <CreditCard size={12} />
                          {order.paymentMethod || "COD"}
                        </div>
                      </div>

                      {/* Customer Name */}
                      <h3 className="order-customer-name" style={{ margin: "4px 0", color: "#163923", fontSize: "20px", fontWeight: "700" }}>
                        {order.customerName || "Customer"}
                      </h3>

                      {/* Phone & Date */}
                      <div className="order-meta-info" style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginTop: "6px", color: "#6b7280", fontSize: "13px" }}>
                        {order.phone && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#374151", fontWeight: "600" }}>
                            <Phone size={14} color="#163923" /> {order.phone}
                          </span>
                        )}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} color="#9ca3af" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                          {" • "}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Delivery Address */}
                      {order.address && (
                        <div
                          className="order-address-box"
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            marginTop: "10px",
                            color: "#4b5563",
                            fontSize: "13px",
                            background: "#f9fafb",
                            padding: "10px 14px",
                            borderRadius: "14px",
                            border: "1px solid #f3f4f6"
                          }}
                        >
                          <MapPin size={15} color="#163923" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span style={{ lineHeight: "1.4" }}>{order.address}</span>
                        </div>
                      )}

                      {/* Delivery Instructions Pill */}
                      {order.deliveryInstruction && (
                        <div
                          className="order-note-box"
                          style={{
                            marginTop: "12px",
                            background: "linear-gradient(135deg, #f0fdf4, #e8f5e9)",
                            border: "1px solid #c8e6c9",
                            borderRadius: "16px",
                            padding: "12px 16px"
                          }}
                        >
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#1b5e20", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
                            📋 Special Delivery Note
                          </span>
                          <p style={{ margin: 0, color: "#2e7d32", fontSize: "13px", lineHeight: "1.5" }}>
                            {order.deliveryInstruction}
                          </p>
                          {(order.saturdayDelivery || order.sundayDelivery) && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                              {order.saturdayDelivery && (
                                <span style={{ background: "#fff", color: "#163923", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", border: "1px solid #a5d6a7" }}>
                                  Saturday Delivery
                                </span>
                              )}
                              {order.sundayDelivery && (
                                <span style={{ background: "#fff", color: "#163923", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", border: "1px solid #a5d6a7" }}>
                                  Sunday Delivery
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* RIGHT: Price & Actions */}
                  <div
                    className="order-action-col"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: "14px"
                    }}
                  >
                    <div className="order-price-wrapper" style={{ textAlign: "right" }}>
                      <span className="order-price-label" style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Order Total</span>
                      <div className="order-price-value" style={{ fontSize: "28px", fontWeight: "800", color: "#163923", letterSpacing: "-0.5px" }}>
                        ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="order-price-count" style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {order.products?.length || 0} item{(order.products?.length || 0) > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="order-buttons-wrapper" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Print Invoice Button */}
                      <button
                        className="order-btn-secondary"
                        onClick={() => printInvoice(order)}
                        title="Print Customer Receipt / Invoice"
                        style={{
                          background: "#f3f4f6",
                          color: "#163923",
                          border: "1px solid #e5e7eb",
                          padding: "10px 16px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                        }}
                      >
                        <Receipt size={16} />
                        Invoice
                      </button>

                      {/* Expand Details Button */}
                      <button
                        className="order-btn-primary"
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        style={{
                          background: isExpanded ? "#163923" : "linear-gradient(135deg, #163923, #285b37)",
                          color: "#fff",
                          border: "none",
                          padding: "10px 18px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          boxShadow: "0 4px 14px rgba(22, 57, 35, 0.25)",
                          transition: "all 0.25s ease"
                        }}
                      >
                        {isExpanded ? "Collapse" : "Manage Order"}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                  </div>

                </div>

                {/* EXPANDED SECTION */}
                {isExpanded && (
                  <div
                    className="order-expanded-section"
                    style={{
                      marginTop: "24px",
                      paddingTop: "24px",
                      borderTop: "1px solid #f1f5f9"
                    }}
                  >
                    
                    {/* STATUS UPDATE TOOLBAR */}
                    <div
                      className="order-status-toolbar"
                      style={{
                        background: "linear-gradient(135deg, #f8faf8, #f0fdf4)",
                        borderRadius: "20px",
                        padding: "18px 24px",
                        border: "1px solid #dcfce7",
                        marginBottom: "22px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <RefreshCw size={18} color="#163923" />
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#163923" }}>
                          Fulfillment Action:
                        </span>
                      </div>

                      <div className="order-status-select-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#4b5563" }}>Update Order Status:</span>
                        <select
                          className="order-status-select"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{
                            padding: "10px 18px",
                            borderRadius: "14px",
                            border: "1.5px solid #163923",
                            background: "#fff",
                            color: "#163923",
                            fontWeight: "700",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(22, 57, 35, 0.08)"
                          }}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* PRODUCT ITEMS TITLE */}
                    <h4
                      className="order-products-title"
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#163923",
                        marginBottom: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <ShoppingBag size={18} color="#163923" /> Itemized Purchased Products ({order.products?.length || 0})
                    </h4>

                    {/* PRODUCT ITEMS LIST */}
                    <div className="order-products-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {(order.products || []).map((product, idx) => (
                        <div
                          key={idx}
                          className="order-product-item"
                          style={{
                            background: "#f9fafb",
                            borderRadius: "16px",
                            padding: "14px 18px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: "1px solid #f1f5f9",
                            flexWrap: "wrap",
                            gap: "12px"
                          }}
                        >
                          <div className="order-product-info" style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "200px" }}>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="order-product-img"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "12px",
                                  objectFit: "cover",
                                  border: "1px solid #e2e8f0"
                                }}
                              />
                            ) : (
                              <div
                                className="order-product-img"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "12px",
                                  background: "rgba(22, 57, 35, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#163923"
                                }}
                              >
                                <ShoppingBag size={20} />
                              </div>
                            )}

                            <div>
                              <h5 className="order-product-name" style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#163923" }}>
                                {product.name}
                              </h5>
                              {product.weight && (
                                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                                  Weight: {product.weight}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="order-product-meta" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            <span
                              className="order-product-qty"
                              style={{
                                background: "#fff",
                                padding: "4px 12px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#4b5563",
                                border: "1px solid #e2e8f0"
                              }}
                            >
                              Qty: {product.quantity}
                            </span>
                            <span className="order-product-price" style={{ fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                              ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FINANCIAL SUMMARY TABLE FOOTER */}
                    <div
                      className="order-financial-summary"
                      style={{
                        marginTop: "18px",
                        background: "#f8faf8",
                        borderRadius: "16px",
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "30px",
                        fontSize: "13px",
                        color: "#4b5563"
                      }}
                    >
                      <div>Subtotal: <strong>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
                      {order.discount > 0 && (
                        <div style={{ color: "#059669" }}>Discount: <strong>-₹{order.discount}</strong></div>
                      )}
                      <div>Final Total: <strong style={{ color: "#163923", fontSize: "15px" }}>₹{(order.finalAmount || order.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* 5. SEE MORE PAGINATION */}
      {hasMoreOrders && (
        <div className="orders-pagination-wrapper" style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
          <button
            className="orders-load-more-btn"
            onClick={loadMoreOrders}
            style={{
              background: "linear-gradient(135deg, #163923, #285b37)",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              borderRadius: "20px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px rgba(22, 57, 35, 0.25)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 30px rgba(22, 57, 35, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(22, 57, 35, 0.25)";
            }}
          >
            Show More Orders ({sortedOrders.length - visibleOrders} remaining)
            <ChevronDown size={18} />
          </button>
        </div>
      )}

    </div>
  );
}

export default OrdersPanel;