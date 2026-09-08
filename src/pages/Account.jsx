import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Package,
  Heart,
  Star,
  MapPin,
  Tag,
  Settings,
  LogOut,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  CreditCard
} from "lucide-react";

import ProfileSection from "../components/account/ProfileSection";
import RewardPointsSection from "../components/account/RewardPointsSection";
import MyCouponsSection from "../components/account/MyCouponsSection";
import RecentlyViewedSection from "../components/account/RecentlyViewedSection";
import AccountSettingsSection from "../components/account/AccountSettingsSection";
import SavedAddressCard from "../components/account/SavedAddressCard";
import RecentOrderCard from "../components/account/RecentOrderCard";
import AccountStatus from "../components/account/AccountStatus";

import { useTranslation } from "../utils/useTranslation";

function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "dashboard");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("savedAddresses")) || []
  );
  const [wishlistCount, setWishlistCount] = useState(
    (JSON.parse(localStorage.getItem("wishlist")) || []).length
  );

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    fullName: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  useEffect(() => {
    const handleUserChanged = () => {
      const freshUser = JSON.parse(localStorage.getItem("user"));
      if (freshUser) {
        setUser(freshUser);
      }
    };

    window.addEventListener("userChanged", handleUserChanged);
    return () => {
      window.removeEventListener("userChanged", handleUserChanged);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchRewards();
    fetchLatestOrder();
  }, [user]);

  const fetchRewards = async () => {
    try {
      if (!user?.email) return;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rewards/${user.email}`
      );
      setRewardPoints(res.data?.points || 100);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLatestOrder = async () => {
    try {
      if (!user?.email) return;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${user.email}`
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLastOrder(res.data[0]);
      } else {
        const localLast = JSON.parse(localStorage.getItem("lastPlacedOrder"));
        if (localLast) setLastOrder(localLast);
      }
    } catch (error) {
      console.log(error);
      const localLast = JSON.parse(localStorage.getItem("lastPlacedOrder"));
      if (localLast) setLastOrder(localLast);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    toast.success("Logged out successfully 👋");
    navigate("/");
  };

  // ADDRESS HANDLERS
  const handleSaveAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.phone) {
      toast.error("Please fill all address fields ⚠️");
      return;
    }

    let updatedAddresses = [];
    if (editingId) {
      updatedAddresses = addresses.map((item) =>
        item.id === editingId ? { ...item, ...newAddress } : item
      );
    } else {
      updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
    }

    setAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    setEditingId(null);
    setShowAddressModal(false);
    setNewAddress({
      type: "Home",
      fullName: user?.name || "",
      address: "",
      city: "",
      pincode: "",
      phone: ""
    });
    toast.success("Address saved 📍");
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((item) => item.id !== id);
    setAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    toast.success("Address removed");
  };

  const editAddress = (item) => {
    setEditingId(item.id);
    setNewAddress({
      type: item.type || "Home",
      fullName: item.fullName || "",
      address: item.address || "",
      city: item.city || "",
      pincode: item.pincode || "",
      phone: item.phone || ""
    });
    setShowAddressModal(true);
  };

  if (!user) return null;

  const initialLetter = (user.name || user.email || "C").charAt(0).toUpperCase();

  const menuItems = [
    { id: "dashboard", label: t("dashboard", "Overview"), icon: <User size={18} /> },
    { id: "orders", label: t("myOrders", "My Orders"), icon: <Package size={18} />, action: () => navigate("/my-orders") },
    { id: "profile", label: t("myProfile", "Profile & Info"), icon: <Edit3 size={18} /> },
    { id: "rewardpoints", label: t("rewardPoints", "Reward Points"), icon: <Star size={18} /> },
    { id: "mycoupons", label: t("myCoupons", "My Coupons"), icon: <Tag size={18} /> },
    { id: "recentlyviewed", label: t("recentlyViewed", "Recently Viewed"), icon: <Eye size={18} /> },
    { id: "accountsettings", label: t("accountSettings", "Account Settings"), icon: <Settings size={18} /> }
  ];

  return (
    <div className="account-container">
      {/* LUXURY PROFILE HERO BANNER */}
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          {/* USER INFO */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a3e635, #65a30d)",
                color: "#163923",
                fontSize: "30px",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                border: "3px solid #fff",
                flexShrink: 0,
                overflow: "hidden"
              }}
            >
              {user?.profileImage || user?.profilePic || user?.avatar ? (
                <img
                  src={user.profileImage || user.profilePic || user.avatar}
                  alt={user.name || "profile"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initialLetter
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h1 style={{ margin: 0, fontSize: "clamp(22px, 3vw, 30px)", fontWeight: "800", letterSpacing: "-0.5px" }}>
                  {user.name || "Valued Member"}
                </h1>
                <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={13} /> VERIFIED MEMBER
                </span>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                {user.email} {user.phone && `• Ph: ${user.phone}`}
              </p>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fecdd3",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* QUICK STATS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div onClick={() => navigate("/my-orders")} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", cursor: "pointer" }}>
            <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Orders</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#a3e635" }}>View All ➔</h3>
          </div>
          <div onClick={() => navigate("/wishlist")} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", cursor: "pointer" }}>
            <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Wishlist</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#fff" }}>{wishlistCount} Items</h3>
          </div>
          <div onClick={() => setActiveTab("rewardpoints")} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", cursor: "pointer" }}>
            <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Reward Points</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#a3e635" }}>{rewardPoints} pts</h3>
          </div>
          <div onClick={() => setActiveTab("dashboard")} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 14px", cursor: "pointer" }}>
            <span style={{ fontSize: "11px", opacity: 0.8, fontWeight: "600" }}>Saved Addresses</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#fff" }}>{addresses.length}</h3>
          </div>
        </div>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="account-main-grid">
        {/* SIDEBAR NAVIGATION TABS */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "12px", border: "1px solid rgba(22, 57, 35, 0.08)", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.03)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "none",
                    background: isActive ? "linear-gradient(135deg, #163923, #285b37)" : "transparent",
                    color: isActive ? "#fff" : "#334155",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: isActive ? "#a3e635" : "#163923" }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.4 }} />
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #fecdd3",
                background: "#fef2f2",
                color: "#dc2626",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <LogOut size={16} /> Logout Account
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid rgba(22, 57, 35, 0.08)", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.03)" }}>
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <RecentOrderCard lastOrder={lastOrder} />
              <SavedAddressCard
                user={user}
                addresses={addresses}
                setShowAddressModal={setShowAddressModal}
                deleteAddress={deleteAddress}
                editAddress={editAddress}
              />
              <AccountStatus />
            </div>
          )}

          {activeTab === "profile" && (
            <ProfileSection user={user} setUser={setUser} />
          )}

          {activeTab === "rewardpoints" && <RewardPointsSection />}

          {activeTab === "mycoupons" && <MyCouponsSection />}

          {activeTab === "recentlyviewed" && (
            <RecentlyViewedSection setShowMenu={() => {}} />
          )}

          {activeTab === "accountsettings" && <AccountSettingsSection />}
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "460px", background: "#fff", borderRadius: "24px", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#163923", margin: "0 0 14px 0" }}>
              {editingId ? "Edit Address" : "Add New Delivery Address"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Street Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button type="button" onClick={() => setShowAddressModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
              <button type="button" onClick={handleSaveAddress} style={{ flex: 1.5, padding: "10px", borderRadius: "10px", border: "none", background: "#163923", color: "#fff", fontWeight: "800", cursor: "pointer" }}>Save Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "42px",
  padding: "0 14px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  outline: "none",
  background: "#f8fafc",
  fontSize: "13px",
  boxSizing: "border-box"
};

export default Account;
