import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Filter
} from "lucide-react";

function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // SEARCH & FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/admin/all`
      );
      setReviews(res.data || []);
    } catch (error) {
      console.log("Error fetching admin reviews:", error);
      toast.error("Failed to fetch reviews ❌");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // TOGGLE STATUS (Approved / Hidden)
  const handleToggleStatus = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Hidden" : "Approved";
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reviews/admin/status/${reviewId}`,
        { status: newStatus }
      );

      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
      );

      toast.success(`Review ${newStatus.toLowerCase()} ✅`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status ❌");
    }
  };

  // DELETE REVIEW
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/admin/${reviewId}`
      );

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted 🗑️");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review ❌");
    }
  };

  // FILTERED REVIEWS
  const filteredReviews = reviews.filter((rev) => {
    const matchesStatus =
      statusFilter === "all" ? true : rev.status === statusFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      rev.userName?.toLowerCase().includes(query) ||
      rev.userEmail?.toLowerCase().includes(query) ||
      rev.title?.toLowerCase().includes(query) ||
      rev.comment?.toLowerCase().includes(query) ||
      rev.productId?.name?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const hiddenCount = reviews.filter((r) => r.status === "Hidden").length;
  const avgStoreRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  return (
    <div>
      {/* HEADER TITLE & STATS CARDS */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#163923", margin: "0 0 16px 0" }}>
          Product Reviews Management ⭐
        </h2>

        {/* METRICS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={metricCardStyle}>
            <span style={metricLabelStyle}>Total Store Reviews</span>
            <span style={metricValueStyle}>{totalReviews}</span>
          </div>

          <div style={metricCardStyle}>
            <span style={metricLabelStyle}>Average Store Rating</span>
            <span style={{ ...metricValueStyle, color: "#f59e0b" }}>{avgStoreRating} ★</span>
          </div>

          <div style={metricCardStyle}>
            <span style={metricLabelStyle}>Approved Reviews</span>
            <span style={{ ...metricValueStyle, color: "#15803d" }}>{approvedCount}</span>
          </div>

          <div style={metricCardStyle}>
            <span style={metricLabelStyle}>Hidden Reviews</span>
            <span style={{ ...metricValueStyle, color: "#dc2626" }}>{hiddenCount}</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "16px 20px",
          marginBottom: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        {/* SEARCH INPUT */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "240px", background: "#f8fafb", padding: "0 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by customer, email, title, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", height: "40px", border: "none", outline: "none", background: "transparent", fontSize: "13px" }}
          />
        </div>

        {/* STATUS FILTER BUTTONS */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "Approved", "Hidden"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "700",
                border: statusFilter === st ? "1.5px solid #163923" : "1px solid #cbd5e1",
                background: statusFilter === st ? "#163923" : "#fff",
                color: statusFilter === st ? "#fff" : "#475569",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS LIST TABLE / CARDS */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", fontWeight: "700", color: "#163923" }}>
          Loading reviews data...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", textAlign: "center", border: "1px dashed #cbd5e1" }}>
          <MessageSquare size={36} color="#94a3b8" style={{ marginBottom: "10px" }} />
          <h4 style={{ margin: "0 0 6px 0", color: "#163923", fontWeight: "800" }}>No Reviews Found</h4>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Try adjusting your search query or filter.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: rev.status === "Hidden" ? "1.5px solid #fecdd3" : "1px solid rgba(22, 57, 35, 0.08)",
                opacity: rev.status === "Hidden" ? 0.75 : 1
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
                {/* PRODUCT & REVIEWER INFO */}
                <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "260px" }}>
                  {rev.productId?.image && (
                    <img
                      src={rev.productId.image}
                      alt={rev.productId.name}
                      style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                    />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                      {rev.productId?.name || "Product"}
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      By: <strong>{rev.userName}</strong> ({rev.userEmail})
                    </span>
                    {rev.isVerifiedPurchase && (
                      <span style={{ marginLeft: "8px", background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "800" }}>
                        VERIFIED BUYER
                      </span>
                    )}
                  </div>
                </div>

                {/* RATING & DATE */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= rev.rating ? "#f59e0b" : "none"} color={s <= rev.rating ? "#f59e0b" : "#cbd5e1"} />
                    ))}
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#163923", marginLeft: "4px" }}>
                      {rev.rating}.0
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* TITLE & CONTENT */}
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                <h5 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#163923" }}>
                  "{rev.title}"
                </h5>
                <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
                  {rev.comment}
                </p>
              </div>

              {/* ATTACHED PHOTOS */}
              {Array.isArray(rev.images) && rev.images.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  {rev.images.map((img, i) => (
                    <img key={i} src={img} alt="review attachment" style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
                  ))}
                </div>
              )}

              {/* BOTTOM ACTIONS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "800",
                    background: rev.status === "Approved" ? "#dcfce7" : "#fee2e2",
                    color: rev.status === "Approved" ? "#15803d" : "#dc2626"
                  }}
                >
                  STATUS: {rev.status.toUpperCase()}
                </span>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(rev._id, rev.status)}
                    style={{
                      background: rev.status === "Approved" ? "#fef3c7" : "#dcfce7",
                      color: rev.status === "Approved" ? "#92400e" : "#15803d",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {rev.status === "Approved" ? <EyeOff size={13} /> : <Eye size={13} />}
                    {rev.status === "Approved" ? "Hide Review" : "Approve Review"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev._id)}
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// METRIC STYLES
const metricCardStyle = {
  background: "#fff",
  borderRadius: "18px",
  padding: "16px 20px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
  border: "1px solid rgba(22, 57, 35, 0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const metricLabelStyle = {
  fontSize: "12px",
  color: "#64748b",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const metricValueStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#163923"
};

export default ReviewsPanel;
