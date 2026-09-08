import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Tag,
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    let apiOrders = [];
    const userEmail = user?.email?.trim().toLowerCase();

    if (userEmail) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${encodeURIComponent(userEmail)}`
        );
        if (Array.isArray(res.data)) {
          apiOrders = res.data;
        }
      } catch (error) {
        console.log("Error fetching API orders:", error);
      }
    }

    // Merge with client localStorage orders (strictly matching current user email)
    const localMyOrders = JSON.parse(localStorage.getItem("my_orders")) || [];
    const lastOrder = JSON.parse(localStorage.getItem("lastPlacedOrder")) || null;

    let combined = [...apiOrders];

    const belongsToCurrentUser = (orderObj) => {
      if (!orderObj) return false;
      if (!userEmail) return true; // Guest user sees guest orders
      const orderEmail = orderObj.email ? String(orderObj.email).trim().toLowerCase() : "";
      return orderEmail === userEmail;
    };

    if (lastOrder && belongsToCurrentUser(lastOrder)) {
      const exists = combined.some(
        (o) =>
          (o._id && lastOrder._id && o._id === lastOrder._id) ||
          (o.createdAt === lastOrder.createdAt && o.finalAmount === lastOrder.finalAmount)
      );
      if (!exists) combined.unshift(lastOrder);
    }

    localMyOrders.forEach((lOrder) => {
      if (belongsToCurrentUser(lOrder)) {
        const exists = combined.some(
          (o) =>
            (o._id && lOrder._id && o._id === lOrder._id) ||
            (o.createdAt === lOrder.createdAt && o.finalAmount === lOrder.finalAmount)
        );
        if (!exists) combined.push(lOrder);
      }
    });

    // Final strict filter: Ensure ONLY orders matching userEmail are shown when logged in
    if (userEmail) {
      combined = combined.filter((o) => {
        const oEmail = o.email ? String(o.email).trim().toLowerCase() : "";
        return oEmail === userEmail;
      });
    }

    // Sort descending by order date
    combined.sort(
      (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
    );

    setOrders(combined);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getImageForItem = (item) => {
    const matchedProduct = products.find(
      (p) => p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );
    return (
      item.image ||
      item.productImage ||
      item.images?.[0] ||
      matchedProduct?.image ||
      matchedProduct?.images?.[0] ||
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300"
    );
  };

  // REORDER ITEM TO CART
  const handleBuyAgain = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const matchedProduct = products.find(
      (p) => p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );

    const cartItem = {
      _id: item._id || matchedProduct?._id || Date.now(),
      name: item.name,
      price: item.price,
      image: getImageForItem(item),
      quantity: 1,
      weight: item.weight || "Standard"
    };

    const existingIndex = existingCart.findIndex((i) => i.name === cartItem.name);
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${item.name} added to cart! 🛒`);
    navigate("/cart");
  };

  // FILTERED ORDERS
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All"
        ? true
        : (order.status || "Pending").toLowerCase() === statusFilter.toLowerCase();

    const cleanSearch = searchTerm.trim().toLowerCase().replace(/^#?ek-?/, "");
    const orderIdStr = order._id ? String(order._id).toLowerCase() : "";
    const formattedRef = order._id
      ? String(order._id).startsWith("EK-")
        ? String(order._id).toLowerCase()
        : `ek-${String(order._id).slice(-6)}`.toLowerCase()
      : "";

    const matchesSearch =
      !cleanSearch ||
      orderIdStr.includes(cleanSearch) ||
      formattedRef.includes(cleanSearch) ||
      order.products?.some((item) =>
        item.name?.toLowerCase().includes(cleanSearch)
      );

    const orderDate = new Date(order.createdAt || Date.now());
    const currentDate = new Date();
    let matchesDate = true;

    if (dateFilter === "last30days") {
      const last30 = new Date();
      last30.setDate(currentDate.getDate() - 30);
      matchesDate = orderDate >= last30;
    } else if (dateFilter === "last3months") {
      const last3Months = new Date();
      last3Months.setMonth(currentDate.getMonth() - 3);
      matchesDate = orderDate >= last3Months;
    } else if (dateFilter === "thisyear") {
      matchesDate = orderDate.getFullYear() === currentDate.getFullYear();
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // STATS CALCULATIONS
  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const activeCount = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.finalAmount || o.totalAmount || 0), 0);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px clamp(16px, 3vw, 32px) 60px clamp(16px, 3vw, 32px)",
        boxSizing: "border-box"
      }}
    >
      {/* LUXURY HERO BANNER */}
      <div
        style={{
          marginBottom: "28px",
          background: "linear-gradient(135deg, rgba(22, 57, 35, 0.96), rgba(33, 77, 49, 0.92))",
          borderRadius: "24px",
          padding: "28px clamp(20px, 4vw, 36px)",
          color: "#fff",
          boxShadow: "0 12px 35px rgba(22, 57, 35, 0.18)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.15)", padding: "4px 12px", borderRadius: "999px", marginBottom: "10px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>
            <Sparkles size={13} color="#a3e635" /> YOUR WELLNESS JOURNEY
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: "800", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            My Orders 📦
          </h1>
          <p style={{ margin: "0 0 24px 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", maxWidth: "540px" }}>
            Track live shipment status, view order history, download tax invoices, and re-order your favorite pure organic herbal products.
          </p>

          {/* STATS OVERVIEW CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(4px)" }}>
              <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Total Orders</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#a3e635" }}>{totalOrdersCount}</h3>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(4px)" }}>
              <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>In Transit</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#fff" }}>{activeCount}</h3>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(4px)" }}>
              <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Delivered</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#a3e635" }}>{deliveredCount}</h3>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(4px)" }}>
              <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Total Spent</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#fff" }}>₹{totalSpent.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          marginBottom: "24px",
          alignItems: "center",
          background: "#fff",
          padding: "16px 20px",
          borderRadius: "20px",
          border: "1px solid rgba(22, 57, 35, 0.08)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.03)"
        }}
      >
        {/* SEARCH INPUT */}
        <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }}
          />
          <input
            type="text"
            placeholder="Search by product name or order reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              border: "1.5px solid #e2e8f0",
              paddingLeft: "42px",
              paddingRight: "14px",
              fontSize: "13px",
              outline: "none",
              background: "#f8fafc",
              fontWeight: "600",
              color: "#0f172a",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* STATUS FILTER */}
        <div style={{ position: "relative", minWidth: "160px" }}>
          <Filter
            size={16}
            style={{
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none"
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              border: "1.5px solid #e2e8f0",
              paddingLeft: "38px",
              paddingRight: "30px",
              fontSize: "13px",
              outline: "none",
              background: "#f8fafc",
              color: "#163923",
              fontWeight: "700",
              cursor: "pointer",
              appearance: "none",
              boxSizing: "border-box"
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending / Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
        </div>

        {/* DATE FILTER */}
        <div style={{ position: "relative", minWidth: "160px" }}>
          <Calendar
            size={16}
            style={{
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none"
            }}
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              border: "1.5px solid #e2e8f0",
              paddingLeft: "38px",
              paddingRight: "30px",
              fontSize: "13px",
              outline: "none",
              background: "#f8fafc",
              color: "#163923",
              fontWeight: "700",
              cursor: "pointer",
              appearance: "none",
              boxSizing: "border-box"
            }}
          >
            <option value="all">All Time</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Past 3 Months</option>
            <option value="thisyear">This Year (2026)</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <Loader2 size={36} className="spin-animation" color="#163923" />
          <p style={{ color: "#163923", fontWeight: "700", fontSize: "14px" }}>Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* EMPTY ORDERS STATE */
        <div style={{ background: "#fff", borderRadius: "24px", padding: "60px 24px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(22, 57, 35, 0.08)" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#163923" }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#163923", margin: "0 0 8px 0" }}>No Orders Found</h2>
          <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            {searchTerm || statusFilter !== "All" || dateFilter !== "all"
              ? "No orders match your current filters. Try resetting your search term or filters."
              : "You haven't placed any orders yet. Explore our pure herbal wellness collection to place your first order!"}
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{ background: "linear-gradient(135deg, #163923, #285b37)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "999px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Explore Shop <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* ORDERS CARDS LIST */
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredOrders.slice(0, visibleCount).map((order) => {
              const isExpanded = expandedOrder === order._id;
              const orderRef = order._id
                ? String(order._id).startsWith("EK-")
                  ? order._id
                  : `#EK-${String(order._id).slice(-6)}`
                : "#EK-92014";

              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "Recent Order";

              const status = order.status || "Pending";

              let statusBg = "#eff6ff";
              let statusColor = "#1d4ed8";
              let statusBorder = "#bfdbfe";

              if (status === "Delivered") {
                statusBg = "#f0fdf4";
                statusColor = "#15803d";
                statusBorder = "#bbf7d0";
              } else if (status === "Shipped") {
                statusBg = "#fffbeb";
                statusColor = "#b45309";
                statusBorder = "#fde68a";
              }

              return (
                <div
                  key={order._id || Math.random()}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    border: "1px solid rgba(22, 57, 35, 0.08)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.03)",
                    overflow: "hidden",
                    transition: "all 0.3s ease"
                  }}
                >
                  {/* CARD HEADER */}
                  <div
                    style={{
                      padding: "18px 24px",
                      background: "#f8faf8",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#163923", display: "flex", alignItems: "center", justifyContent: "center", color: "#a3e635" }}>
                        <Package size={18} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#163923" }}>{orderRef}</h3>
                          <span style={{ fontSize: "11px", background: "#e2e8f0", color: "#475569", padding: "2px 8px", borderRadius: "6px", fontWeight: "700" }}>
                            {order.products?.length || 1} {order.products?.length === 1 ? "Item" : "Items"}
                          </span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Placed on {formattedDate}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ background: statusBg, color: statusColor, border: `1px solid ${statusBorder}`, padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={13} /> {status}
                      </span>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#163923" }}>
                        ₹{Number(order.finalAmount || order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* PROGRESS TRACKER BAR */}
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#ffffff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                      {/* PROGRESS LINE */}
                      <div style={{ position: "absolute", top: "12px", left: "10%", right: "10%", height: "3px", background: "#e2e8f0", zIndex: 1 }} />
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "10%",
                          width: status === "Delivered" ? "80%" : status === "Shipped" ? "50%" : "20%",
                          height: "3px",
                          background: "#163923",
                          zIndex: 2,
                          transition: "width 0.5s ease"
                        }}
                      />

                      {/* STEPS */}
                      <div style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#163923", color: "#fff", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px auto" }}>✓</div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#163923" }}>Placed</span>
                      </div>

                      <div style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: status === "Shipped" || status === "Delivered" ? "#163923" : "#e2e8f0", color: status === "Shipped" || status === "Delivered" ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px auto" }}>
                          {status === "Shipped" || status === "Delivered" ? "✓" : "2"}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: status === "Shipped" || status === "Delivered" ? "#163923" : "#64748b" }}>Packed</span>
                      </div>

                      <div style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: status === "Shipped" || status === "Delivered" ? "#163923" : "#e2e8f0", color: status === "Shipped" || status === "Delivered" ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px auto" }}>
                          {status === "Shipped" || status === "Delivered" ? "✓" : "3"}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: status === "Shipped" || status === "Delivered" ? "#163923" : "#64748b" }}>Shipped</span>
                      </div>

                      <div style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: status === "Delivered" ? "#163923" : "#e2e8f0", color: status === "Delivered" ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px auto" }}>
                          {status === "Delivered" ? "✓" : "4"}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: status === "Delivered" ? "#163923" : "#64748b" }}>Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS LIST */}
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {order.products?.map((item, idx) => {
                      const imgSrc = getImageForItem(item);
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "12px 16px",
                            borderRadius: "16px",
                            background: "#f9fafb",
                            border: "1px solid #f1f5f9",
                            flexWrap: "wrap"
                          }}
                        >
                          <img
                            src={imgSrc}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              objectFit: "contain",
                              background: "#fff",
                              border: "1px solid #e2e8f0",
                              padding: "4px"
                            }}
                          />

                          <div style={{ flex: 1, minWidth: "180px" }}>
                            <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                              {item.name}
                            </h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                              <span>Qty: <strong>{item.quantity || 1}</strong></span>
                              {item.weight && <span>• Weight: <strong>{item.weight}</strong></span>}
                              <span>• Price: <strong>₹{item.price}</strong></span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                              ₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleBuyAgain(item)}
                              style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                color: "#163923",
                                padding: "6px 14px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <RotateCcw size={13} /> Buy Again
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CARD FOOTER INFO */}
                  <div
                    style={{
                      padding: "14px 24px",
                      background: "#f8faf8",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#475569" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <CreditCard size={14} color="#163923" /> Payment: <strong>{order.paymentMethod || "COD"}</strong>
                      </span>
                      {order.address && (
                        <button
                          type="button"
                          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          style={{ background: "none", border: "none", color: "#163923", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <MapPin size={13} /> {isExpanded ? "Hide Address" : "View Shipping Address"}
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      )}
                    </div>

                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#163923" }}>
                      Grand Total: ₹{Number(order.finalAmount || order.totalAmount || 0).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* EXPANDABLE ADDRESS DETAIL */}
                  {isExpanded && order.address && (
                    <div style={{ padding: "14px 24px", background: "#f0fdf4", borderTop: "1.5px dashed #bbf7d0", fontSize: "13px", color: "#163923" }}>
                      <div style={{ fontWeight: "800", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={14} color="#059669" /> Delivery Destination:
                      </div>
                      <p style={{ margin: 0, color: "#334155" }}>
                        <strong>{order.customerName}</strong> ({order.phone}) <br />
                        {order.address}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SHOW MORE BUTTON */}
          {filteredOrders.length > visibleCount && (
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 10)}
                style={{
                  background: "#fff",
                  color: "#163923",
                  border: "2px solid #163923",
                  padding: "12px 32px",
                  borderRadius: "999px",
                  fontWeight: "800",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(22, 57, 35, 0.08)",
                  transition: "all 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                Show More Orders ({filteredOrders.length - visibleCount} Remaining) <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
