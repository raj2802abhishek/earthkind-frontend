import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ProductReviews from "../components/ProductReviews";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX
} from "react-icons/fi";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  useEffect(() => {
    if (!product) return;

    let viewedProducts =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    viewedProducts = viewedProducts.filter(
      (item) => item._id !== product._id
    );

    viewedProducts.unshift(product);
    viewedProducts = viewedProducts.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(viewedProducts));
  }, [product]);

  // Construct image list (showing ONLY images uploaded by admin)
  const resolveImages = () => {
    if (!product) return [];
    
    let imagesList = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      imagesList = [...product.images];
    }
    
    if (product.image && !imagesList.includes(product.image)) {
      imagesList.unshift(product.image);
    }

    imagesList = imagesList.filter(Boolean);

    return imagesList;
  };

  const productImages = resolveImages();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  const selectedImage = productImages[selectedImageIndex] || productImages[0] || product?.image;

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    if (productImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    if (productImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productImages.length]);

  if (!product) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center" }}>
        <h2 className="section-title">Product Not Found</h2>
      </div>
    );
  }

  const productDescription =
    product.description ||
    "Crafted using carefully selected premium natural ingredients, this wellness product is designed to support modern healthy living while maintaining purity, quality, and luxurious herbal care inspired by nature.";

  const addToCart = () => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity =
        (existingCart[existingProductIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        weight: product.weight || product.selectedWeight || "100g",
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${product.name} added to cart`, {
      style: {
        borderRadius: "16px",
        background: "#163923",
        color: "#fff",
        padding: "16px 20px",
      },
    });
  };

  return (
    <div className="section pd-page-section">
      <div className="container">
        {/* BACK BUTTON */}
        <button className="earth-btn pd-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* TOP PRODUCT GRID */}
        <div className="pd-main-grid">
          {/* LEFT MULTI-IMAGE GALLERY */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* MAIN IMAGE BOX */}
            <div className="pd-main-img-box soft-shadow">
              {/* TOP ACTIONS (Badge, Counter, Zoom) */}
              <div className="pd-img-top-actions">
                <span className="pd-img-badge">
                  {selectedImageIndex === 0 ? "Main View" : `View ${selectedImageIndex + 1}`}
                </span>

                <div className="pd-img-counter-zoom">
                  <span className="pd-counter-tag">
                    {selectedImageIndex + 1} / {productImages.length}
                  </span>
                  <button
                    className="pd-zoom-btn"
                    title="Fullscreen Lightbox"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <FiMaximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* OVERLAY ARROWS (IF MULTIPLE IMAGES) */}
              {productImages.length > 1 && (
                <>
                  <button
                    className="pd-gallery-nav-btn prev"
                    onClick={handlePrevImage}
                    title="Previous Image"
                  >
                    <FiChevronLeft size={22} />
                  </button>

                  <button
                    className="pd-gallery-nav-btn next"
                    onClick={handleNextImage}
                    title="Next Image"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}

              {/* MAIN IMAGE WITH ANIMATION */}
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={selectedImage}
                alt={product.name}
                className="pd-main-img float-animation"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>

            {/* THUMBNAILS CAROUSEL ROW */}
            {productImages.length > 1 && (
              <div className="pd-thumbnails-row">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`pd-thumb-item ${
                      selectedImageIndex === index ? "active" : ""
                    }`}
                  >
                    <img src={img} alt={`${product.name} angle ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="pd-info-content"
          >
            <p className="section-subtitle">Premium Herbal Collection</p>

            <h1 className="section-title pd-product-title">{product.name}</h1>

            <p className="section-text pd-category-badge">{product.category}</p>

            <h2 className="pd-product-price">₹{product.price}</h2>

            <p className="section-text pd-description-text">{productDescription}</p>

            {/* BENEFITS PILLS */}
            <div className="pd-benefits-grid">
              {[
                "🌿 100% Natural",
                "🛡️ Chemical Free",
                "✨ Safe Daily Use",
                "⭐ Premium Quality",
              ].map((item, index) => (
                <div key={index} className="glass-card pd-benefit-card">
                  {item}
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pd-actions-row">
              <button className="earth-btn" onClick={addToCart}>
                Add To Cart
              </button>

              <button
                className="earth-btn pd-buy-now-btn"
                onClick={() => {
                  addToCart();
                  navigate("/checkout");
                }}
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* PRODUCT STORY */}
        <section className="section pd-story-section">
          <div className="pd-story-container">
            <p className="section-subtitle">Product Story</p>

            <h2 className="section-title">
              Crafted With Nature & Wellness In Mind
            </h2>

            <div className="section-divider" />

            <p className="section-text pd-story-text">
              {product.story ||
                "EARTHKIND NATURALS products are thoughtfully designed to combine traditional herbal wisdom with premium modern wellness care. Every ingredient is selected carefully to ensure purity, effectiveness, and a luxurious wellness experience inspired by nature-powered living."}
            </p>
          </div>
        </section>

        {/* HOW TO USE + BENEFITS */}
        <div className="pd-extra-grid">
          {/* HOW TO USE */}
          <div className="glass-card pd-extra-card">
            <p className="section-subtitle">How To Use</p>

            <h2 className="section-title pd-extra-card-title">
              Wellness Routine
            </h2>

            <ul className="pd-extra-list">
              {(product.howToUse && product.howToUse.length > 0
                ? product.howToUse
                : [
                    "Use recommended quantity daily.",
                    "Store in cool & dry place.",
                    "Consume consistently for best results.",
                    "Pair with balanced healthy lifestyle.",
                  ]
              ).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>

          {/* KEY BENEFITS */}
          <div className="glass-card pd-extra-card">
            <p className="section-subtitle">Key Benefits</p>

            <h2 className="section-title pd-extra-card-title">
              Premium Wellness
            </h2>

            <ul className="pd-extra-list">
              {(product.benefits && product.benefits.length > 0
                ? product.benefits
                : [
                    "Supports healthy lifestyle.",
                    "Premium herbal formulation.",
                    "Naturally wellness focused.",
                    "Carefully crafted quality.",
                  ]
              ).map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <ProductReviews productId={product._id} productName={product.name} />
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pd-lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* CLOSE BUTTON */}
            <button
              className="pd-lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
              title="Close (Esc)"
            >
              <FiX size={24} />
            </button>

            {/* PREV/NEXT LIGHTBOX ARROWS */}
            {productImages.length > 1 && (
              <>
                <button
                  className="pd-lightbox-arrow prev"
                  onClick={handlePrevImage}
                  title="Previous"
                >
                  <FiChevronLeft size={30} />
                </button>
                <button
                  className="pd-lightbox-arrow next"
                  onClick={handleNextImage}
                  title="Next"
                >
                  <FiChevronRight size={30} />
                </button>
              </>
            )}

            {/* LIGHTBOX MAIN CONTENT */}
            <div className="pd-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={selectedImage}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt={product.name}
                className="pd-lightbox-img"
              />
            </div>

            {/* CAPTION INFO */}
            <div className="pd-lightbox-caption" onClick={(e) => e.stopPropagation()}>
              <h4 className="pd-lightbox-title">{product.name}</h4>
              <span className="pd-lightbox-count">
                {selectedImageIndex + 1} of {productImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY PURCHASE BAR */}
      <div className="pd-mobile-sticky-bar">
        <div className="pd-sticky-info">
          <p className="pd-sticky-title">{product.name}</p>
          <p className="pd-sticky-price">₹{product.price}</p>
        </div>
        <div className="pd-sticky-btns">
          <button className="pd-sticky-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
          <button
            className="pd-sticky-buy-btn"
            onClick={() => {
              addToCart();
              navigate("/checkout");
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;