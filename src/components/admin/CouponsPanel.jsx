import {
  TicketPercent,
  CalendarDays,
  BadgePercent,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Search,
  Tag,
  Gift,
  Zap,
  Plus,
  Shuffle,
  Clock,
  UserCheck
} from "lucide-react";
import { useState, useMemo } from "react";

function CouponsPanel({
  couponCode,
  setCouponCode,
  discountAmount,
  setDiscountAmount,
  couponType,
  setCouponType,
  createCoupon,
  coupons = [],
  deleteCoupon
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "percentage", "fixed", "reward"
  const [copiedCode, setCopiedCode] = useState(null);

  // Copy coupon code to clipboard
  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Generate random promo code
  const handleGenerateRandomCode = () => {
    const prefixes = ["EARTH", "NATURE", "ORGANIC", "SPECIAL", "HERBAL", "SAVE", "WELCOME"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(10 + Math.random() * 90);
    setCouponCode(`${randomPrefix}${randomNumber}`);
  };

  // KPI STATS
  const stats = useMemo(() => {
    const total = coupons.length;
    const percentageCount = coupons.filter(c => c.type === "percentage").length;
    const fixedCount = coupons.filter(c => c.type !== "percentage").length;
    const rewardCount = coupons.filter(c => c.rewardCoupon).length;
    return { total, percentageCount, fixedCount, rewardCount };
  }, [coupons]);

  // FILTER & SEARCH LOGIC
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Type Filter
      if (filterType === "percentage" && coupon.type !== "percentage") return false;
      if (filterType === "fixed" && coupon.type === "percentage") return false;
      if (filterType === "reward" && !coupon.rewardCoupon) return false;

      // Search Query
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const codeMatch = (coupon.code || "").toLowerCase().includes(query);
        const discountMatch = String(coupon.discount || "").includes(query);
        const emailMatch = (coupon.ownerEmail || "").toLowerCase().includes(query);
        return codeMatch || discountMatch || emailMatch;
      }

      return true;
    });
  }, [coupons, filterType, searchTerm]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* 1. HEADER BANNER SECTION */}
      <div
        className="coupons-overview-banner"
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
            <div className="coupons-banner-pill" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "999px", backdropFilter: "blur(10px)", marginBottom: "14px", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
              <Sparkles size={14} color="#a3e635" /> PROMOTIONAL CAMPAIGNS
            </div>
            <h1 className="coupons-banner-title" style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Coupons & Special Offers 🎟️
            </h1>
            <p className="coupons-banner-sub" style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Create discount promo codes, manage reward vouchers, and configure customer incentives.
            </p>
          </div>

          {/* Quick Counter Pills */}
          <div className="coupons-banner-stats-wrapper" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div className="coupons-banner-stat-box" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "14px 20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Total Offers</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#a3e635" }}>{stats.total}</span>
            </div>
            <div className="coupons-banner-stat-box" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "14px 20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Percentage (%)</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{stats.percentageCount}</span>
            </div>
            <div className="coupons-banner-stat-box" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "14px 20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Flat Amount (₹)</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{stats.fixedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CREATE NEW COUPON FORM CARD */}
      <div
        className="coupon-create-card"
        style={{
          background: "#fff",
          borderRadius: "30px",
          padding: "32px 36px",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(22, 57, 35, 0.08)",
          marginBottom: "36px"
        }}
      >
        
        {/* Form Title */}
        <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "14px", marginBottom: "26px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #163923, #285b37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(22, 57, 35, 0.2)"
            }}>
              <TicketPercent size={26} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#163923" }}>
                Create New Promo Code
              </h2>
              <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
                Configure a new promotional discount for store checkout
              </p>
            </div>
          </div>

          {/* Quick Random Code Generator */}
          <button
            type="button"
            onClick={handleGenerateRandomCode}
            style={{
              background: "rgba(22, 57, 35, 0.06)",
              color: "#163923",
              border: "1px solid rgba(22, 57, 35, 0.15)",
              padding: "10px 18px",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(22, 57, 35, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(22, 57, 35, 0.06)"}
          >
            <Shuffle size={15} /> Generate Code
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div
          className="coupon-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}
        >
          
          {/* Coupon Code Input */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Coupon Code <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Tag size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="e.g. WELCOME20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 46px",
                  borderRadius: "16px",
                  border: "1.5px solid #e5e7eb",
                  background: "#f9fafb",
                  fontSize: "15px",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  color: "#163923",
                  outline: "none",
                  boxSizing: "border-box",
                  textTransform: "uppercase"
                }}
                onFocus={(e) => {
                  e.target.style.background = "#fff";
                  e.target.style.borderColor = "#163923";
                }}
                onBlur={(e) => {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              />
            </div>
          </div>

          {/* Discount Value Input */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Discount Value <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Zap size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                type="number"
                placeholder={couponType === "percentage" ? "Enter % (e.g. 20)" : "Enter ₹ (e.g. 100)"}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 46px",
                  borderRadius: "16px",
                  border: "1.5px solid #e5e7eb",
                  background: "#f9fafb",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#163923",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.background = "#fff";
                  e.target.style.borderColor = "#163923";
                }}
                onBlur={(e) => {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              />
            </div>
          </div>

          {/* Discount Type Select */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Discount Type
            </label>
            <select
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "16px",
                border: "1.5px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "14px",
                fontWeight: "700",
                color: "#163923",
                outline: "none",
                cursor: "pointer",
                boxSizing: "border-box"
              }}
            >
              <option value="fixed">Flat Amount (₹ Off)</option>
              <option value="percentage">Percentage (% Off)</option>
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <button
          onClick={createCoupon}
          style={{
            marginTop: "24px",
            background: "linear-gradient(135deg, #163923, #285b37)",
            color: "#fff",
            border: "none",
            padding: "16px 32px",
            borderRadius: "18px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 25px rgba(22, 57, 35, 0.25)",
            transition: "all 0.25s ease"
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
          <Plus size={18} /> Create Coupon
        </button>

      </div>

      {/* 3. TOOLBAR (SEARCH + TYPE FILTER PILLS) */}
      <div
        className="coupons-filter-toolbar"
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "18px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(22, 57, 35, 0.06)",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        {/* Search Bar */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Search coupon code or discount value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 46px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: "14px",
              outline: "none"
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#e5e7eb",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "11px",
                color: "#4b5563"
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {[
            { id: "all", label: "All Coupons", count: coupons.length },
            { id: "fixed", label: "Flat (₹)", count: stats.fixedCount },
            { id: "percentage", label: "Percentage (%)", count: stats.percentageCount },
            { id: "reward", label: "Reward Coupons", count: stats.rewardCount }
          ].map((item) => {
            const isActive = filterType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilterType(item.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "14px",
                  border: isActive ? "none" : "1px solid #e5e7eb",
                  background: isActive ? "linear-gradient(135deg, #163923, #285b37)" : "#f9fafb",
                  color: isActive ? "#fff" : "#4b5563",
                  fontWeight: isActive ? "700" : "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
              >
                {item.label}
                <span style={{
                  background: isActive ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
                  color: isActive ? "#fff" : "#6b7280",
                  padding: "2px 6px",
                  borderRadius: "999px",
                  fontSize: "11px"
                }}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. COUPONS LISTING (TICKET STUB CARD DESIGN) */}
      {filteredCoupons.length === 0 ? (
        <div style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "60px 20px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
          border: "1px dashed #cbd5e1"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(22, 57, 35, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px auto",
            color: "#163923"
          }}>
            <Gift size={34} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#163923", margin: "0 0 6px 0" }}>
            No Coupons Found
          </h3>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {searchTerm || filterType !== "all"
              ? "No promo codes match your active search or filter. Try clearing filters."
              : "No coupons have been created yet. Use the form above to add a new promo code."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "22px" }}>
          {filteredCoupons.map((coupon) => {
            const isPercentage = coupon.type === "percentage";
            const formattedDiscount = isPercentage ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`;
            const isReward = coupon.rewardCoupon;

            return (
              <div
                key={coupon._id}
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  border: isReward ? "1.5px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(22, 57, 35, 0.08)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "18px",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 18px 40px rgba(22, 57, 35, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.04)";
                }}
              >
                {/* Decorative Top Accent Bar */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "5px",
                  background: isReward
                    ? "linear-gradient(90deg, #f59e0b, #d97706)"
                    : "linear-gradient(90deg, #163923, #285b37, #a3e635)"
                }} />

                {/* CARD TOP ROW: Discount Badge & Copy Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "18px",
                      background: isReward ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #163923, #285b37)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
                      flexShrink: 0
                    }}>
                      <BadgePercent size={28} />
                    </div>

                    <div>
                      <span style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#163923",
                        display: "block",
                        letterSpacing: "-0.5px"
                      }}>
                        {formattedDiscount}
                      </span>
                      <span style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {isPercentage ? "Percentage Discount" : "Flat Amount Savings"}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    title="Delete Coupon"
                    style={{
                      background: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fee2e2",
                      width: "40px",
                      height: "40px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* CODE PILL BOX WITH CLICK TO COPY */}
                <div
                  onClick={(e) => handleCopyCode(coupon.code, e)}
                  title="Click to copy promo code"
                  style={{
                    background: "#f8faf8",
                    border: "1.5px dashed #163923",
                    borderRadius: "16px",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#6b7280", display: "block", fontWeight: "700" }}>PROMO CODE</span>
                    <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "monospace", color: "#163923", letterSpacing: "1px" }}>
                      {coupon.code}
                    </span>
                  </div>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: copiedCode === coupon.code ? "#dcfce7" : "#fff",
                    color: copiedCode === coupon.code ? "#059669" : "#163923",
                    border: "1px solid #e2e8f0",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    {copiedCode === coupon.code ? (
                      <>
                        <Check size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </div>
                </div>

                {/* CARD FOOTER META */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#6b7280",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "12px",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CalendarDays size={14} color="#9ca3af" />
                    <span>Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "30 days"}</span>
                  </div>

                  {isReward ? (
                    <span style={{
                      background: "#fef3c7",
                      color: "#b45309",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <UserCheck size={12} /> Reward Voucher
                    </span>
                  ) : (
                    <span style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700"
                    }}>
                      Active
                    </span>
                  )}
                </div>

                {/* Personal Reward Email Tag */}
                {coupon.ownerEmail && (
                  <div style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    background: "#f9fafb",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    marginTop: "-8px"
                  }}>
                    Assigned to: <strong>{coupon.ownerEmail}</strong>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default CouponsPanel;