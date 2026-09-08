import {
  Search,
  Trash2,
  Package2,
  Pencil,
  Check,
  X,
  Sparkles,
  Layers,
  Box,
  ChevronDown
} from "lucide-react";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

function ProductsTable({
  products = [],
  deleteProduct,
  updateProduct
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = async (id) => {
    if (!editedName.trim() || !editedPrice) {
      toast.error("Name and price cannot be empty");
      return;
    }
    try {
      setIsSaving(true);
      await updateProduct(id, editedName, editedPrice);
      toast.success("Product updated successfully ✅");
      setEditingId(null);
    } catch (e) {
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const lowStockCount = useMemo(() => {
    return products.filter((p) => Number(p.stock || 0) <= 5).length;
  }, [products]);

  // CATEGORIES LIST & COUNTS
  const categoriesWithCounts = useMemo(() => {
    const counts = { All: products.length, "Low Stock ⚠️": lowStockCount };
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products, lowStockCount]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.name || "").toLowerCase().includes(search.toLowerCase());
      if (selectedCategory === "Low Stock ⚠️") {
        return matchesSearch && Number(product.stock || 0) <= 5;
      }
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* 1. HEADER BANNER SECTION */}
      <div
        className="products-overview-banner"
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
              <Sparkles size={14} color="#a3e635" /> STORE INVENTORY MANAGEMENT
            </div>
            <h1 className="products-banner-title" style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Products Catalog 📦
            </h1>
            <p style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Browse, search, edit pricing, and update live store inventory details.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "14px 22px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Total Products</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#a3e635" }}>{products.length}</span>
            </div>
            <div style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "14px 22px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Categories</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>
                {Object.keys(categoriesWithCounts).length - 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTROL TOOLBAR (SEARCH & CATEGORY FILTERS) */}
      <div
        className="products-control-toolbar"
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
        {/* Search Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          
          <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search size={18} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search product by name, code or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(12);
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
            {search && (
              <button
                onClick={() => setSearch("")}
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

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={16} color="#52796f" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(12);
              }}
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
              <option value="All">All Categories ({products.length})</option>
              {Object.keys(categoriesWithCounts).filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({categoriesWithCounts[cat]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Row */}
        <div
          className="products-category-pills"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px"
          }}
        >
          {Object.keys(categoriesWithCounts).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
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
                {cat}
                <span style={{
                  background: isActive ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
                  color: isActive ? "#fff" : "#6b7280",
                  padding: "2px 6px",
                  borderRadius: "999px",
                  fontSize: "11px"
                }}>
                  {categoriesWithCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRODUCT CARDS GRID */}
      {visibleProducts.length === 0 ? (
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
            <Package2 size={34} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#163923", margin: "0 0 6px 0" }}>
            No Products Found
          </h3>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {search || selectedCategory !== "All"
              ? "No products match your active search or filter. Try clearing filters."
              : "No products exist in your inventory yet. Add a new product to publish."}
          </p>
        </div>
      ) : (
        <div
          className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "22px"
          }}
        >
          {visibleProducts.map((product) => {
            const isEditing = editingId === product._id;

            return (
              <div
                key={product._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "26px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isEditing ? "0 15px 35px rgba(22, 57, 35, 0.15)" : "0 10px 30px rgba(0, 0, 0, 0.04)",
                  border: isEditing ? "2px solid #163923" : "1px solid rgba(22, 57, 35, 0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (!isEditing) {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(22, 57, 35, 0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isEditing) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.04)";
                  }
                }}
              >
                {/* PRODUCT IMAGE & CATEGORY BADGE */}
                <div>
                  <div style={{
                    width: "100%",
                    height: isMobile ? "160px" : "210px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "#f4f6f4",
                    marginBottom: "16px",
                    position: "relative"
                  }}>
                    {/* Category Pill Badge */}
                    {product.category && (
                      <div style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(22, 57, 35, 0.88)",
                        backdropFilter: "blur(8px)",
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#fff",
                        zIndex: 1,
                        letterSpacing: "0.5px"
                      }}>
                        {product.category}
                      </div>
                    )}

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#163923"
                      }}>
                        <Box size={40} />
                      </div>
                    )}
                  </div>

                  {/* EDIT MODE FORM OR PRODUCT DISPLAY */}
                  {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" }}>Edit Name</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          style={{
                            width: "100%",
                            border: "1.5px solid #163923",
                            padding: "8px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            outline: "none",
                            background: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" }}>Edit Price (₹)</label>
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          style={{
                            width: "100%",
                            border: "1.5px solid #163923",
                            padding: "8px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            outline: "none",
                            background: "#fff",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: "16px" }}>
                      <h3 style={{
                        margin: "0 0 6px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#163923",
                        lineHeight: "1.3",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {product.name}
                      </h3>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#163923" }}>
                        ₹{(Number(product.price) || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD ACTIONS ROW */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {isEditing ? (
                    <>
                      <button
                        disabled={isSaving}
                        onClick={() => handleEdit(product._id)}
                        style={{
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          height: "44px",
                          borderRadius: "14px",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          gap: "6px"
                        }}
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          background: "#f3f4f6",
                          color: "#4b5563",
                          border: "1px solid #e5e7eb",
                          height: "44px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "600",
                          fontSize: "14px",
                          gap: "6px"
                        }}
                      >
                        <X size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(product._id);
                          setEditedName(product.name);
                          setEditedPrice(product.price);
                        }}
                        style={{
                          background: "#f8fafc",
                          color: "#163923",
                          border: "1px solid #e2e8f0",
                          height: "44px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          gap: "6px",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        style={{
                          background: "#fef2f2",
                          color: "#ef4444",
                          border: "1px solid #fee2e2",
                          height: "44px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          gap: "6px",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. SHOW MORE PAGINATION */}
      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
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
              gap: "8px",
              boxShadow: "0 10px 25px rgba(22, 57, 35, 0.25)"
            }}
          >
            Show More Products ({filteredProducts.length - visibleCount} remaining)
            <ChevronDown size={18} />
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductsTable;