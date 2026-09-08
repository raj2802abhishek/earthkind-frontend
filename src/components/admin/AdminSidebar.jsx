import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TicketPercent,
  PlusCircle,
  MessageSquare,
  Star,
  LogOut,
  X
} from "lucide-react";

function AdminSidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  products = []
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lowStockCount = (products || []).filter((p) => Number(p.stock || 0) <= 5).length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpanded = isMobile ? true : isHovered;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      id: "products",
      label: "Products",
      icon: <Package size={20} />
    },
    {
      id: "addProduct",
      label: "Add Product",
      icon: <PlusCircle size={20} />
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={20} />
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: <TicketPercent size={20} />
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={20} />
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={20} />
    }
  ];

  // Desktop inline styles (only applied when NOT on mobile to allow CSS media queries to style mobile drawer)
  const desktopStyles = !isMobile ? {
    width: isHovered ? "280px" : "84px",
    minWidth: isHovered ? "280px" : "84px",
    flexShrink: 0,
    position: "fixed",
    top: "20px",
    left: "20px",
    height: "calc(100vh - 40px)",
    maxHeight: "calc(100vh - 40px)",
    overflowX: "hidden",
    overflowY: "auto",
    background:
      "linear-gradient(180deg, #081120 0%, #17263a 52%, #1d4b3b 100%)",
    color: "#ffffff",
    padding: isHovered ? "28px 16px" : "28px 0px",
    borderRadius: "32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: isHovered ? "stretch" : "center",
    boxShadow: isHovered
      ? "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)"
      : "0 24px 60px rgba(2,6,23,0.28), inset 0 1px 0 rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    zIndex: 100,
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
  } : {};

  return (
    <div
      className={`admin-sidebar ${isMobileOpen ? "mobile-open" : ""}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={desktopStyles}
    >
      {/* TOP SECTION */}
      <div style={{ width: "100%" }}>
        {/* LOGO & CLOSE BUTTON */}
        <div
          style={{
            marginBottom: "32px",
            padding: isExpanded ? "0 4px" : "0",
            display: "flex",
            justifyContent: isExpanded ? "space-between" : "center",
            alignItems: "center",
            width: "100%",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: isExpanded ? "12px" : "0", justifyContent: isExpanded ? "flex-start" : "center", width: isExpanded ? "auto" : "100%" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, rgba(163,230,53,0.25), rgba(35,77,44,0.7))",
                border: "1px solid rgba(163,230,53,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: "800",
                fontSize: "15px",
                color: "#a3e635",
                letterSpacing: "0.5px",
                margin: isExpanded ? "0" : "0 auto"
              }}
            >
              EK
            </div>
            {isExpanded && (
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  whiteSpace: "nowrap",
                  margin: 0,
                  color: "#ffffff"
                }}
              >
                Admin Panel
              </p>
            )}
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="sidebar-close-btn"
            style={{
              display: isMobile ? "flex" : "none",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#ffffff",
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: isExpanded ? "stretch" : "center",
            width: "100%"
          }}
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                title={!isExpanded ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  gap: isExpanded ? "14px" : "0px",
                  padding: isExpanded ? "12px 16px" : "0px",
                  width: isExpanded ? "100%" : "48px",
                  height: isExpanded ? "auto" : "48px",
                  minHeight: "48px",
                  borderRadius: "18px",
                  cursor: "pointer",
                  margin: isExpanded ? "0" : "0 auto",
                  transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isActive
                    ? "rgba(255,255,255,0.14)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "1px solid transparent",
                  backdropFilter: isActive ? "blur(12px)" : "none",
                  fontWeight: isActive ? "600" : "500",
                  color: "#ffffff",
                  boxShadow: isActive
                    ? "0 8px 25px rgba(0,0,0,0.22)"
                    : "none",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = isExpanded
                      ? "translateX(4px)"
                      : "scale(1.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0px) scale(1)";
                  }
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isExpanded ? "24px" : "100%",
                    height: "24px"
                  }}
                >
                  {item.icon}
                </div>

                {isExpanded ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, width: "100%" }}>
                    <span style={{ fontSize: "15px", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                    {item.id === "products" && lowStockCount > 0 && (
                      <span
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          boxShadow: "0 2px 6px rgba(220, 38, 38, 0.4)"
                        }}
                      >
                        ⚠️ {lowStockCount}
                      </span>
                    )}
                  </div>
                ) : (
                  item.id === "products" && lowStockCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "#dc2626",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: "800",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {lowStockCount}
                    </span>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <div
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("userChanged"));
          toast.success("Logged out from Admin Panel 👋");
          window.location.href = "/login";
        }}
        style={{
          width: isExpanded ? "100%" : "48px",
          height: isExpanded ? "auto" : "48px",
          minHeight: "48px",
          padding: isExpanded ? "12px 16px" : "0px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "flex-start" : "center",
          gap: isExpanded ? "12px" : "0px",
          marginTop: "auto",
          marginLeft: isExpanded ? "0" : "auto",
          marginRight: isExpanded ? "0" : "auto",
          transition: "all 0.3s ease",
          whiteSpace: "nowrap",
          boxSizing: "border-box"
        }}
        title={!isExpanded ? "Logout" : undefined}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isExpanded ? "24px" : "100%",
            height: "24px"
          }}
        >
          <LogOut size={18} />
        </div>

        {isExpanded && (
          <span
            style={{
              fontWeight: "500",
              fontSize: "15px",
              whiteSpace: "nowrap",
              color: "#ffffff"
            }}
          >
            Logout
          </span>
        )}
      </div>
    </div>
  );
}

export default AdminSidebar;