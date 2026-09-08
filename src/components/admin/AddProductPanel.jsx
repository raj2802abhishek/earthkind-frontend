import {
  UploadCloud,
  PlusCircle,
  PackagePlus,
  Sparkles,
  ImagePlus,
  Tag,
  Package,
  Layers,
  FileText,
  CheckCircle2,
  ListOrdered,
  Leaf,
  Trash2,
  Plus
} from "lucide-react";

import { useState, useEffect } from "react";

function AddProductPanel({
  name,
  setName,
  price,
  setPrice,
  stock,
  setStock,
  category,
  setCategory,
  story,
  setStory,
  benefits = [""],
  setBenefits,
  howToUse = [""],
  setHowToUse,
  ingredients = [""],
  setIngredients,
  images = [],
  setImages,
  imagePreviews = [],
  setImage,
  uploadImage,
  addProduct
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const previewSources = [
    ...(Array.isArray(images) ? images : []),
    ...(Array.isArray(imagePreviews) ? imagePreviews : [])
  ].filter(Boolean);

  const updateArrayField = (setter, index, value, currentArray) => {
    const updated = [...currentArray];
    updated[index] = value;
    setter(updated);
  };

  const addArrayField = (setter, currentArray) => {
    setter([...currentArray, ""]);
  };

  const removeArrayField = (setter, index, currentArray) => {
    if (currentArray.length === 1) {
      setter([""]);
    } else {
      setter(currentArray.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* 1. HEADER BANNER SECTION */}
      <div style={{
        marginBottom: "36px",
        background: "linear-gradient(135deg, rgba(22, 57, 35, 0.95), rgba(33, 77, 49, 0.9), rgba(46, 106, 69, 0.95))",
        borderRadius: "32px",
        padding: "36px 40px",
        color: "#fff",
        boxShadow: "0 20px 50px rgba(22, 57, 35, 0.22)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.15)"
      }}>
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
              <Sparkles size={14} color="#a3e635" /> STORE MANAGEMENT CONSOLE
            </div>
            <h1 style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Add New Product 🌿
            </h1>
            <p style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Create, customize and publish premium natural products to your Earthkind store catalog.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "16px 24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Upload Status</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: previewSources.length > 0 ? "#a3e635" : "#fff" }}>
                {previewSources.length} Image{previewSources.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FORM SHELL */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* SECTION 1: GENERAL INFORMATION */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}><Tag size={22} /></div>
            <div>
              <h3 style={sectionTitleStyle}>1. Basic Details & Pricing</h3>
              <p style={sectionSubStyle}>Specify the product name, pricing, stock levels, and store category</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
            {/* PRODUCT NAME */}
            <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={labelStyle}>Product Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="text"
                className="add-product-input"
                placeholder="e.g. Pure Organic Ashwagandha Powder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                className="add-product-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Select Category</option>
                <option value="Herbal Powders">Herbal Powders</option>
                <option value="Natural Seeds">Natural Seeds</option>
                <option value="Herbal Tea">Herbal Tea</option>
                <option value="Nuts & Dry Fruits">Nuts & Dry Fruits</option>
                <option value="Wellness Oils">Wellness Oils</option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label style={labelStyle}>Product Price (₹) <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="number"
                className="add-product-input"
                placeholder="e.g. 499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* STOCK */}
            <div>
              <label style={labelStyle}>Stock Quantity</label>
              <input
                type="number"
                className="add-product-input"
                placeholder="e.g. 50"
                value={stock || ""}
                onChange={(e) => setStock(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT STORY & DESCRIPTION */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}><FileText size={22} /></div>
            <div>
              <h3 style={sectionTitleStyle}>2. Storytelling & Description</h3>
              <p style={sectionSubStyle}>Provide an engaging description highlighting quality, origin, and wellness benefits</p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Product Story / Description</label>
            <textarea
              className="add-product-textarea"
              placeholder="Write compelling storytelling for your customers about purity, sourcing, and benefits..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              style={{
                ...inputStyle,
                minHeight: "160px",
                padding: "16px 20px",
                resize: "vertical",
                lineHeight: "1.6"
              }}
            />
          </div>
        </div>

        {/* SECTION 3: BENEFITS, HOW TO USE & INGREDIENTS */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}><CheckCircle2 size={22} /></div>
            <div>
              <h3 style={sectionTitleStyle}>3. Product Features & Guidance</h3>
              <p style={sectionSubStyle}>Add key health benefits, step-by-step usage instructions, and pure ingredients</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* BENEFITS */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <label style={labelStyle}><CheckCircle2 size={16} color="#163923" /> Health Benefits</label>
                <button
                  type="button"
                  onClick={() => addArrayField(setBenefits, benefits)}
                  style={addButtonStyle}
                >
                  <Plus size={15} /> Add Benefit
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={indexBadgeStyle}>{index + 1}</span>
                    <input
                      type="text"
                      className="add-product-input"
                      placeholder={`e.g. Boosts immunity & energy levels`}
                      value={benefit}
                      onChange={(e) => updateArrayField(setBenefits, index, e.target.value, benefits)}
                      style={{ ...inputStyle, margin: 0, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(setBenefits, index, benefits)}
                      style={removeButtonStyle}
                      title="Remove Benefit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* HOW TO USE */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <label style={labelStyle}><ListOrdered size={16} color="#163923" /> How To Use (Step-by-Step)</label>
                <button
                  type="button"
                  onClick={() => addArrayField(setHowToUse, howToUse)}
                  style={addButtonStyle}
                >
                  <Plus size={15} /> Add Step
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {howToUse.map((step, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={indexBadgeStyle}>Step {index + 1}</span>
                    <input
                      type="text"
                      className="add-product-input"
                      placeholder={`e.g. Mix 1 tsp with warm milk or honey`}
                      value={step}
                      onChange={(e) => updateArrayField(setHowToUse, index, e.target.value, howToUse)}
                      style={{ ...inputStyle, margin: 0, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(setHowToUse, index, howToUse)}
                      style={removeButtonStyle}
                      title="Remove Step"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* INGREDIENTS */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <label style={labelStyle}><Leaf size={16} color="#163923" /> Ingredients</label>
                <button
                  type="button"
                  onClick={() => addArrayField(setIngredients, ingredients)}
                  style={addButtonStyle}
                >
                  <Plus size={15} /> Add Ingredient
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ingredients.map((ingredient, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={indexBadgeStyle}>#</span>
                    <input
                      type="text"
                      className="add-product-input"
                      placeholder={`e.g. 100% Pure Organic Ashwagandha Root`}
                      value={ingredient}
                      onChange={(e) => updateArrayField(setIngredients, index, e.target.value, ingredients)}
                      style={{ ...inputStyle, margin: 0, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(setIngredients, index, ingredients)}
                      style={removeButtonStyle}
                      title="Remove Ingredient"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: MEDIA UPLOAD GALLERY */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}><ImagePlus size={22} /></div>
            <div>
              <h3 style={sectionTitleStyle}>4. Product Images & Gallery</h3>
              <p style={sectionSubStyle}>Upload high-res product photos to showcase in the store</p>
            </div>
          </div>

          <div
            className="image-upload-area"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setImage(e.dataTransfer.files);
            }}
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "28px",
              padding: "45px 24px",
              textAlign: "center",
              background: "linear-gradient(180deg, #fafafa, #f1f5f9)",
              transition: "border-color 0.3s ease",
              position: "relative"
            }}
          >
            <div style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #163923, #285b37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              boxShadow: "0 10px 22px rgba(22, 57, 35, 0.2)",
              color: "#fff"
            }}>
              <ImagePlus size={36} />
            </div>

            <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "#163923" }}>
              Drag & Drop Product Images Here
            </h4>
            <p style={{ margin: "0 0 20px 0", color: "#6b7280", fontSize: "14px" }}>
              Supports High Quality PNG, JPG, and WEBP files
            </p>

            <label style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#163923",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: "16px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 8px 20px rgba(22, 57, 35, 0.25)"
            }}>
              <ImagePlus size={18} /> Browse File System
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => {
                  setImage(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {/* GALLERY PREVIEW */}
            {previewSources.length > 0 && (
              <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px dashed #cbd5e1" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#163923", display: "block", marginBottom: "14px" }}>
                  Selected Product Images ({previewSources.length})
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
                  {previewSources.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      style={{
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "2px solid #163923",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                      }}
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        style={{ width: "100px", height: "100px", objectFit: "cover", display: "block" }}
                      />
                      {index === 0 && (
                        <span style={{
                          position: "absolute",
                          bottom: "4px",
                          left: "4px",
                          right: "4px",
                          background: "rgba(22, 57, 35, 0.9)",
                          color: "#a3e635",
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "2px 4px",
                          borderRadius: "6px",
                          textAlign: "center"
                        }}>
                          PRIMARY
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (setImages) {
                            setImages((Array.isArray(images) ? images : []).filter((url) => url !== src));
                          }
                        }}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "rgba(239, 68, 68, 0.9)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PUBLISH & UPLOAD ACTIONS TOOLBAR */}
        <div style={{
          display: "flex",
          gap: "18px",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          background: "#fff",
          borderRadius: "28px",
          padding: "24px 32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          border: "1px solid rgba(22, 57, 35, 0.08)"
        }}>
          {/* UPLOAD IMAGE BUTTON */}
          <button
            type="button"
            className="action-btn"
            onClick={uploadImage}
            style={{
              background: "#f3f4f6",
              color: "#163923",
              border: "1.5px solid #e5e7eb",
              padding: "16px 28px",
              borderRadius: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              transition: "all 0.2s ease"
            }}
          >
            <UploadCloud size={18} /> Upload Image File
          </button>

          {/* PUBLISH PRODUCT BUTTON */}
          <button
            type="button"
            className="action-btn"
            onClick={addProduct}
            style={{
              background: "linear-gradient(135deg, #163923, #285b37)",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              borderRadius: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              boxShadow: "0 10px 25px rgba(22, 57, 35, 0.25)",
              transition: "all 0.25s ease"
            }}
          >
            <PlusCircle size={20} /> Publish Product to Catalog
          </button>
        </div>

        {/* BOTTOM HELP FOOTER */}
        <div style={{
          background: "#163923",
          color: "#fff",
          padding: "24px 32px",
          borderRadius: "28px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          boxShadow: "0 14px 35px rgba(22, 57, 35, 0.15)"
        }}>
          <PackagePlus size={36} color="#a3e635" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700" }}>
              Catalog Best Practices
            </h4>
            <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "13px", lineHeight: "1.5" }}>
              Ensure high-resolution images, accurate pricing, and clear health benefits for higher customer conversions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// STYLES
const sectionCardStyle = {
  background: "#fff",
  borderRadius: "30px",
  padding: "32px 36px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(22, 57, 35, 0.08)"
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "26px",
  paddingBottom: "18px",
  borderBottom: "1px solid #f1f5f9"
};

const sectionIconStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #163923, #285b37)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  boxShadow: "0 6px 16px rgba(22, 57, 35, 0.2)"
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "800",
  color: "#163923"
};

const sectionSubStyle = {
  margin: "4px 0 0 0",
  fontSize: "13px",
  color: "#6b7280"
};

const labelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  fontWeight: "700",
  color: "#374151",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  height: "52px",
  padding: "0 18px",
  borderRadius: "16px",
  border: "1.5px solid #e5e7eb",
  outline: "none",
  background: "#f9fafb",
  fontSize: "14px",
  color: "#0f172a",
  fontWeight: "600",
  boxSizing: "border-box",
  transition: "all 0.2s ease"
};

const addButtonStyle = {
  background: "rgba(22, 57, 35, 0.06)",
  color: "#163923",
  border: "1px solid rgba(22, 57, 35, 0.15)",
  padding: "8px 16px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px"
};

const removeButtonStyle = {
  background: "#fef2f2",
  color: "#ef4444",
  border: "1px solid #fee2e2",
  width: "44px",
  height: "44px",
  borderRadius: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const indexBadgeStyle = {
  background: "#f1f5f9",
  color: "#163923",
  borderRadius: "10px",
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "700",
  minWidth: "28px",
  textAlign: "center",
  flexShrink: 0
};

export default AddProductPanel;