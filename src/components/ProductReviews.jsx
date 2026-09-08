import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Plus,
  X,
  Camera,
  MessageSquare,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  // FILTERS & SORTING
  const [filterStar, setFilterStar] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [photosOnly, setPhotosOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  // WRITE REVIEW MODAL
  const [showModal, setShowModal] = useState(false);
  const [canReviewInfo, setCanReviewInfo] = useState(null);
  const [isCheckingCanReview, setIsCheckingCanReview] = useState(false);

  // REVIEW FORM FIELDS
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LIGHTBOX PHOTO VIEW
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // USER LOGGED IN STATE
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userIdentifier = user?.email || "guest_" + (localStorage.getItem("guest_id") || Date.now());

  if (!localStorage.getItem("guest_id") && !user?.email) {
    localStorage.setItem("guest_id", userIdentifier);
  }

  // FETCH REVIEWS
  const fetchReviews = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append("sort", sortBy);
      if (filterStar !== "all") params.append("stars", filterStar);
      if (verifiedOnly) params.append("verifiedOnly", "true");
      if (photosOnly) params.append("photosOnly", "true");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${productId}?${params.toString()}`
      );

      setReviews(res.data.reviews || []);
      setSummary(
        res.data.summary || {
          averageRating: 0,
          totalReviews: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      );
    } catch (error) {
      console.log("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterStar, verifiedOnly, photosOnly]);

  // CHECK CAN REVIEW ELIGIBILITY
  const handleOpenWriteModal = async () => {
    if (!user) {
      toast.error("Please login to submit a verified product review 🔑");
      return;
    }

    setIsCheckingCanReview(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/can-review?email=${encodeURIComponent(
          user.email
        )}&productId=${productId}&productName=${encodeURIComponent(productName || "")}`
      );

      setCanReviewInfo(res.data);
      if (res.data.canReview) {
        setShowModal(true);
      } else {
        toast.error(res.data.reason || "Only verified purchasers can review this product.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to verify purchase history ⚠️");
    } finally {
      setIsCheckingCanReview(false);
    }
  };

  // HANDLE PHOTO UPLOAD FOR REVIEW
  const handlePhotoUpload = (files) => {
    const fileList = Array.from(files || []).slice(0, 3);
    const previews = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === fileList.length) {
          setPhotoPreviews((prev) => [...prev, ...previews].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // SUBMIT REVIEW
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a star rating ⭐");
    if (!title.trim()) return toast.error("Please add a review title");
    if (!comment.trim()) return toast.error("Please write a detailed review");

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/add`, {
        productId,
        userEmail: user.email,
        userName: user.name || user.fullName || user.email.split("@")[0],
        userAvatar: user.profileImage || "",
        rating,
        title,
        comment,
        images: photoPreviews
      });

      toast.success("Thank you! Your review has been published 🎉");
      setShowModal(false);
      setTitle("");
      setComment("");
      setPhotoPreviews([]);
      setRating(5);

      // Refresh reviews list
      fetchReviews();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // HELPFUL VOTE HANDLER
  const handleHelpful = async (reviewId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews/helpful/${reviewId}`,
        { userIdentifier }
      );

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? {
                ...r,
                helpfulCount: res.data.helpfulCount,
                helpfulUsers: res.data.isHelpful
                  ? [...(r.helpfulUsers || []), userIdentifier]
                  : (r.helpfulUsers || []).filter((id) => id !== userIdentifier)
              }
            : r
        )
      );

      if (res.data.isHelpful) {
        toast.success("Thank you for your feedback! 👍");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // STAR RENDER HELPER
  const renderStars = (score, size = 16, interactive = false) => {
    return (
      <div style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive
            ? star <= (hoverRating || rating)
            : star <= Math.round(score);

          return (
            <Star
              key={star}
              size={size}
              fill={filled ? "#f59e0b" : "none"}
              color={filled ? "#f59e0b" : "#cbd5e1"}
              style={{
                cursor: interactive ? "pointer" : "default",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && setRating(star)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="section" style={{ paddingTop: "20px" }}>
      <div className="container">
        
        {/* HEADER & SUMMARY CARD */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "clamp(20px, 4vw, 32px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            border: "1px solid rgba(22, 57, 35, 0.08)",
            marginBottom: "28px"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              alignItems: "center"
            }}
          >
            {/* AVERAGE SCORE BOX */}
            <div style={{ textAlign: "center", paddingRight: "12px", borderRight: "1px solid #f1f5f9" }}>
              <span
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  color: "#163923",
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "6px"
                }}
              >
                {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "5.0"}
              </span>
              <div style={{ marginBottom: "6px" }}>{renderStars(summary.averageRating || 5, 20)}</div>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                Based on {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* RATING BREAKDOWN BARS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.breakdown?.[star] || 0;
                const percentage =
                  summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;

                return (
                  <div
                    key={star}
                    onClick={() => setFilterStar(filterStar === String(star) ? "all" : String(star))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    <span style={{ width: "32px", fontWeight: "700", color: "#163923" }}>{star} ★</span>
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        background: "#e2e8f0",
                        borderRadius: "999px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #163923, #285b37)",
                          borderRadius: "999px",
                          transition: "width 0.4s ease"
                        }}
                      />
                    </div>
                    <span style={{ width: "36px", textAlign: "right", color: "#64748b", fontWeight: "600" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* WRITE REVIEW CTA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "20px",
                background: "#f0fdf4",
                borderRadius: "20px",
                border: "1.5px dashed #bbf7d0",
                textAlign: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#163923", fontWeight: "700", fontSize: "14px" }}>
                <ShieldCheck size={18} color="#059669" /> Verified Buyers Review
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                Have you purchased this product? Share your experience with our community!
              </p>
              <button
                type="button"
                onClick={handleOpenWriteModal}
                disabled={isCheckingCanReview}
                style={{
                  background: "linear-gradient(135deg, #163923, #285b37)",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "999px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 18px rgba(22, 57, 35, 0.2)"
                }}
              >
                <Plus size={16} /> Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* SORT & FILTER BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          {/* FILTER CHIPS */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#163923", display: "flex", alignItems: "center", gap: "4px" }}>
              <Filter size={14} /> Filter:
            </span>

            {["all", "5", "4", "3", "2", "1"].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setFilterStar(val)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: filterStar === val ? "1.5px solid #163923" : "1px solid #cbd5e1",
                  background: filterStar === val ? "#163923" : "#fff",
                  color: filterStar === val ? "#fff" : "#475569",
                  cursor: "pointer"
                }}
              >
                {val === "all" ? "All Stars" : `${val} ★`}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700",
                border: verifiedOnly ? "1.5px solid #059669" : "1px solid #cbd5e1",
                background: verifiedOnly ? "#ecfdf5" : "#fff",
                color: verifiedOnly ? "#047857" : "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <CheckCircle2 size={13} color={verifiedOnly ? "#047857" : "#94a3b8"} /> Verified Only
            </button>

            <button
              type="button"
              onClick={() => setPhotosOnly(!photosOnly)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700",
                border: photosOnly ? "1.5px solid #163923" : "1px solid #cbd5e1",
                background: photosOnly ? "#f0fdf4" : "#fff",
                color: photosOnly ? "#163923" : "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Camera size={13} /> With Photos
            </button>
          </div>

          {/* SORT DROPDOWN */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "12px",
                border: "1.5px solid #cbd5e1",
                background: "#fff",
                fontSize: "12px",
                fontWeight: "700",
                color: "#163923",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* REVIEWS LIST */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#163923", fontWeight: "700" }}>
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "#fff",
              borderRadius: "20px",
              border: "1px dashed #cbd5e1"
            }}
          >
            <MessageSquare size={36} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <h4 style={{ margin: "0 0 6px 0", color: "#163923", fontWeight: "800" }}>No Reviews Found</h4>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
              Be the first verified buyer to leave a review for this product!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map((rev) => {
              const isHelpfulVoted = rev.helpfulUsers?.includes(userIdentifier);

              return (
                <div
                  key={rev._id}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "20px 24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(22, 57, 35, 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  {/* TOP ROW: AUTHOR & BADGE */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #163923, #285b37)",
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "uppercase"
                        }}
                      >
                        {rev.userName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h5 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                            {rev.userName}
                          </h5>
                          {rev.isVerifiedPurchase && (
                            <span
                              style={{
                                background: "#dcfce7",
                                color: "#15803d",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: "800",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px"
                              }}
                            >
                              <CheckCircle2 size={11} /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    <div>{renderStars(rev.rating, 15)}</div>
                  </div>

                  {/* TITLE & COMMENT */}
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "800", color: "#163923" }}>
                      {rev.title}
                    </h4>
                    <p style={{ margin: 0, color: "#334155", fontSize: "13.5px", lineHeight: "1.6" }}>
                      {rev.comment}
                    </p>
                  </div>

                  {/* PHOTOS GALLERY */}
                  {Array.isArray(rev.images) && rev.images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                      {rev.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review attachment"
                          onClick={() => setSelectedPhoto(img)}
                          style={{
                            width: "68px",
                            height: "68px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: "1px solid #e2e8f0"
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* HELPFUL BUTTON */}
                  <div style={{ paddingTop: "8px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => handleHelpful(rev._id)}
                      style={{
                        background: isHelpfulVoted ? "#f0fdf4" : "#f8fafc",
                        border: isHelpfulVoted ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                        color: isHelpfulVoted ? "#15803d" : "#64748b",
                        padding: "6px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <ThumbsUp size={13} color={isHelpfulVoted ? "#15803d" : "#64748b"} />
                      <span>Helpful ({rev.helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* WRITE REVIEW MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "16px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#fff",
              borderRadius: "24px",
              padding: "28px",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={16} />
            </button>

            <div style={{ marginBottom: "18px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", marginBottom: "8px" }}>
                <CheckCircle2 size={13} /> Verified Purchase
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#163923", margin: 0 }}>
                Write a Product Review
              </h3>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0" }}>
                {productName}
              </p>
            </div>

            <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* STAR RATING PICKER */}
              <div style={{ textAlign: "center", background: "#f8faf8", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <span style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#163923", marginBottom: "8px" }}>
                  Overall Rating
                </span>
                {renderStars(rating, 28, true)}
                <span style={{ display: "block", fontSize: "12px", color: "#059669", fontWeight: "700", marginTop: "6px" }}>
                  {rating === 5 && "⭐ Outstanding"}
                  {rating === 4 && "⭐ Very Good"}
                  {rating === 3 && "⭐ Average"}
                  {rating === 2 && "⭐ Poor"}
                  {rating === 1 && "⭐ Terribly Low"}
                </span>
              </div>

              {/* REVIEW TITLE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#163923", marginBottom: "6px" }}>
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure quality & amazing results!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 14px",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* COMMENT */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#163923", marginBottom: "6px" }}>
                  Detailed Review
                </label>
                <textarea
                  placeholder="Tell us what you loved about the product, taste, texture, or results..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "13px",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* ATTACH PHOTOS */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "800", color: "#163923" }}>
                    Attach Photos (Optional)
                  </label>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Max 4 photos</span>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {photoPreviews.map((p, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={p} alt="preview" style={{ width: "56px", height: "56px", borderRadius: "10px", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx))}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "11px"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {photoPreviews.length < 4 && (
                    <label
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "10px",
                        border: "1.5px dashed #cbd5e1",
                        background: "#f9fafb",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#64748b"
                      }}
                    >
                      <Camera size={18} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePhotoUpload(e.target.files)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #163923, #285b37)",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(22, 57, 35, 0.2)"
                }}
              >
                {isSubmitting ? "Submitting..." : "Post Verified Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR REVIEW PHOTO */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            padding: "20px"
          }}
        >
          <img
            src={selectedPhoto}
            alt="Expanded view"
            style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: "16px", objectFit: "contain" }}
          />
        </div>
      )}

    </section>
  );
}

export default ProductReviews;
