import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiShoppingBag,
  FiHeart,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiStar,
  FiSearch,
  FiCheck
} from "react-icons/fi";
import { FaHeart, FaLeaf, FaSeedling, FaSun, FaSpa } from "react-icons/fa";

// Local image imports for fallbacks
import moringaImg from "../assets/moringa-powder.png";
import beetrootImg from "../assets/beetroot-powder.png";
import amlaImg from "../assets/amla-powder.png";
import neemImg from "../assets/neem-powder.png";
import multaniImg from "../assets/multani-mitti.png";
import orangeImg from "../assets/orange-peel.png";
import roseImg from "../assets/rose-powder.png";
import facepackImg from "../assets/mix-face-pack.png";
import detoxImg from "../assets/detox-powder.png";

function HerbalPowders() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("All");
  const [selectedWeights, setSelectedWeights] = useState({});
  const [activeTab, setActiveTab] = useState("face");
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  // Default Herbal Powders catalog as static fallback if API is empty
  const defaultPowders = [
    {
      _id: "powder-1",
      name: "Moringa Powder",
      category: "Herbal Powders",
      subCategory: "Immunity & Detox",
      price: 149,
      rating: 4.9,
      reviewsCount: 142,
      stock: 25,
      description: "Rich in Vitamin C, Iron, and Amino Acids. Boosts energy and natural immunity.",
      image: moringaImg,
      benefits: ["Superfood Nutrient Boost", "Rich in Antioxidants", "Natural Energy Enhancer"]
    },
    {
      _id: "powder-2",
      name: "Beetroot Powder",
      category: "Herbal Powders",
      subCategory: "Immunity & Detox",
      price: 129,
      rating: 4.8,
      reviewsCount: 98,
      stock: 18,
      description: "Sun-dried organic beetroot powder for stamina, blood circulation, and natural glow.",
      image: beetrootImg,
      benefits: ["Promotes Blood Flow", "Enhances Stamina", "Natural Skin Radiance"]
    },
    {
      _id: "powder-3",
      name: "Amla Powder",
      category: "Herbal Powders",
      subCategory: "Hair & Scalp Care",
      price: 119,
      rating: 4.9,
      reviewsCount: 186,
      stock: 30,
      description: "Pure Indian Gooseberry powder for root strengthening, hair growth, and digestive health.",
      image: amlaImg,
      benefits: ["Strengthens Hair Roots", "High Vitamin C Content", "Supports Digestive Wellness"]
    },
    {
      _id: "powder-4",
      name: "Neem Powder",
      category: "Herbal Powders",
      subCategory: "Hair & Scalp Care",
      price: 109,
      rating: 4.7,
      reviewsCount: 112,
      stock: 14,
      description: "Antibacterial and detoxifying neem powder for clear scalp and acne-free skin.",
      image: neemImg,
      benefits: ["Soothes Scalp Irritation", "Anti-Acne Properties", "Natural Blood Purifier"]
    },
    {
      _id: "powder-5",
      name: "Multani Mitti",
      category: "Herbal Powders",
      subCategory: "Skin & Facial Glow",
      price: 99,
      rating: 4.9,
      reviewsCount: 230,
      stock: 40,
      description: "100% natural Fuller's Earth clay for oil control, deep pore cleansing, and skin tone leveling.",
      image: multaniImg,
      benefits: ["Deep Pore Cleansing", "Absorbs Excess Oil", "Cools & Calms Skin"]
    },
    {
      _id: "powder-6",
      name: "Orange Peel Powder",
      category: "Herbal Powders",
      subCategory: "Skin & Facial Glow",
      price: 129,
      rating: 4.8,
      reviewsCount: 154,
      stock: 22,
      description: "Sun-dried orange peel fine powder rich in natural AHA & Vitamin C for skin brightening.",
      image: orangeImg,
      benefits: ["Brightens Dark Spots", "Natural Skin Exfoliant", "Citrus Antioxidant Boost"]
    },
    {
      _id: "powder-7",
      name: "Rose Powder",
      category: "Herbal Powders",
      subCategory: "Skin & Facial Glow",
      price: 139,
      rating: 4.9,
      reviewsCount: 168,
      stock: 19,
      description: "Fragrant shade-dried rose petal powder for hydrating face packs and soothing skin cooling.",
      image: roseImg,
      benefits: ["Hydrates & Tones Skin", "Natural Fragrant Glow", "Reduces Redness"]
    },
    {
      _id: "powder-8",
      name: "Mix Face Pack",
      category: "Herbal Powders",
      subCategory: "Skin & Facial Glow",
      price: 149,
      rating: 4.9,
      reviewsCount: 210,
      stock: 15,
      description: "Synergistic botanical blend of Multani Mitti, Rose, Sandalwood & Neem for instant glow.",
      image: facepackImg,
      benefits: ["Complete Facial Spa", "Evens Skin Tone", "Reduces Blemishes"]
    },
    {
      _id: "powder-9",
      name: "Detox Powder",
      category: "Herbal Powders",
      subCategory: "Immunity & Detox",
      price: 159,
      rating: 4.8,
      reviewsCount: 95,
      stock: 12,
      description: "Ancient Ayurvedic herb combination for internal cleansing, gut balance, and metabolic health.",
      image: detoxImg,
      benefits: ["Internal Gut Cleansing", "Balances Metabolism", "Restores Vitality"]
    }
  ];

  const powderWeights = {
    "Moringa Powder": ["100g", "200g"],
    "Beetroot Powder": ["100g", "200g"],
    "Amla Powder": ["100g", "200g"],
    "Neem Powder": ["100g", "200g"],
    "Multani Mitti": ["100g", "200g"],
    "Orange Peel Powder": ["100g", "200g"],
    "Rose Powder": ["100g", "200g"],
    "Mix Face Pack": ["100g", "200g"],
    "Detox Powder": ["100g", "200g"]
  };

  const powderPrices = {
    "Moringa Powder": { "100g": 149, "200g": 269 },
    "Beetroot Powder": { "100g": 129, "200g": 239 },
    "Amla Powder": { "100g": 119, "200g": 219 },
    "Neem Powder": { "100g": 109, "200g": 199 },
    "Multani Mitti": { "100g": 99, "200g": 179 },
    "Orange Peel Powder": { "100g": 129, "200g": 229 },
    "Rose Powder": { "100g": 139, "200g": 249 },
    "Mix Face Pack": { "100g": 149, "200g": 269 },
    "Detox Powder": { "100g": 159, "200g": 289 }
  };

  useEffect(() => {
    fetchHerbalPowders();
  }, []);

  const fetchHerbalPowders = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE}/api/products`);
      if (res.data && res.data.length > 0) {
        const filtered = res.data.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase().trim() === "herbal powders"
        );
        if (filtered.length > 0) {
          // Merge API images with fallback benefit tags if needed
          const merged = filtered.map((prod) => {
            const fallbackMatch = defaultPowders.find(
              (dp) => dp.name.toLowerCase() === prod.name.toLowerCase()
            );
            return {
              ...prod,
              subCategory: fallbackMatch?.subCategory || "Daily Wellness",
              rating: fallbackMatch?.rating || 4.8,
              reviewsCount: fallbackMatch?.reviewsCount || 120,
              benefits: fallbackMatch?.benefits || ["100% Pure Organic", "Lab Tested Quality", "Zero Chemicals"]
            };
          });
          setProducts(merged);
        } else {
          setProducts(defaultPowders);
        }
      } else {
        setProducts(defaultPowders);
      }
    } catch (error) {
      console.log("Using fallback Herbal Powders catalog:", error);
      setProducts(defaultPowders);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, event) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedWeight =
      selectedWeights[product._id] ||
      powderWeights[product.name]?.[0] ||
      "100g";

    const dynamicPrice =
      powderPrices[product.name]?.[selectedWeight] || product.price;

    const existingIndex = existingCart.findIndex(
      (item) => item._id === product._id && item.weight === selectedWeight
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex] = {
        ...existingCart[existingIndex],
        quantity: (existingCart[existingIndex].quantity || 1) + 1
      };
    } else {
      existingCart.push({
        ...product,
        weight: selectedWeight,
        price: dynamicPrice,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    // Flying animation effect
    const cardEl = event.target.closest(".herbal-product-card");
    if (cardEl) {
      const imgEl = cardEl.querySelector(".herbal-card-img");
      const cartIcon = document.querySelector(".cart-icon");

      if (imgEl && cartIcon) {
        const clone = imgEl.cloneNode(true);
        const rect = imgEl.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        clone.style.position = "fixed";
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = "160px";
        clone.style.height = "160px";
        clone.style.zIndex = "9999";
        clone.style.transition = "all 1.6s cubic-bezier(0.25, 1, 0.5, 1)";
        clone.style.borderRadius = "16px";
        clone.style.boxShadow = "0 14px 35px rgba(0,0,0,0.18)";
        clone.style.opacity = "1";

        document.body.appendChild(clone);

        setTimeout(() => {
          clone.style.left = `${cartRect.left}px`;
          clone.style.top = `${cartRect.top}px`;
          clone.style.width = "36px";
          clone.style.height = "36px";
          clone.style.opacity = "0.2";
          clone.style.transform = "scale(0.3)";
        }, 50);

        setTimeout(() => {
          if (document.body.contains(clone)) {
            document.body.removeChild(clone);
          }
        }, 1800);
      }
    }

    toast.success(`${product.name} (${selectedWeight}) added to cart!`, {
      style: {
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1f4d2e, #163822)",
        color: "#fff",
        padding: "16px 20px",
        fontWeight: "600"
      },
      iconTheme: { primary: "#d8ef7f", secondary: "#1f4d2e" }
    });
  };

  const toggleWishlist = (product) => {
    let updated = [...wishlist];
    const exists = updated.find((item) => item._id === product._id);

    if (exists) {
      updated = updated.filter((item) => item._id !== product._id);
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      const selectedWeight =
        selectedWeights[product._id] ||
        powderWeights[product.name]?.[0] ||
        "100g";
      const dynamicPrice =
        powderPrices[product.name]?.[selectedWeight] || product.price;

      updated.push({
        ...product,
        weight: selectedWeight,
        price: dynamicPrice
      });
      toast.success("Saved to wishlist!", { icon: "💚" });
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const subCategories = [
    { label: "All Powders", value: "All" },
    { label: "Skin & Facial Glow", value: "Skin & Facial Glow" },
    { label: "Hair & Scalp Care", value: "Hair & Scalp Care" },
    { label: "Immunity & Detox", value: "Immunity & Detox" }
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSub =
      selectedSubCat === "All" ||
      prod.subCategory?.toLowerCase() === selectedSubCat.toLowerCase();
    return matchesSearch && matchesSub;
  });

  return (
    <div className="herbal-powders-page">
      {/* HERO SECTION */}
      <section className="herbal-hero-banner">
        <div className="herbal-hero-glow" />
        <div className="container herbal-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-badge centered">
              <FaLeaf style={{ color: "#d8ef7f", marginRight: "8px" }} />
              100% PURE & COLD-MILLED
            </div>

            <h1 className="herbal-hero-title">
              Pure Herbal Powders <br />
              <span className="herbal-hero-accent">
                Nature's Cleanest Botanical Elixirs
              </span>
            </h1>

            <p className="herbal-hero-subtext">
              Handcrafted from single-origin sun-dried organic leaves, flowers, and roots. 
              Zero added sugars, synthetic colors, or preservatives — raw botanical power 
              for radiant skin, healthy hair, and internal vitality.
            </p>

            {/* QUICK HIGHLIGHT BADGES */}
            <div className="herbal-hero-features">
              <div className="hero-feature-chip">
                <FiCheckCircle style={{ color: "#d8ef7f" }} /> Cold-Milled Below 30°C
              </div>
              <div className="hero-feature-chip">
                <FiShield style={{ color: "#d8ef7f" }} /> NABL Lab Verified
              </div>
              <div className="hero-feature-chip">
                <FaSun style={{ color: "#d8ef7f" }} /> Shade Dried Botanical Potency
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="container herbal-main-shell">
        {/* CATEGORY SEARCH & SUB-CATEGORY FILTER BAR */}
        <div className="herbal-controls-row">
          {/* SEARCH BAR */}
          <div className="herbal-search-box">
            <FiSearch className="herbal-search-icon" />
            <input
              type="text"
              placeholder="Search Moringa, Beetroot, Amla, Multani Mitti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="herbal-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="search-clear-btn"
              >
                ✕
              </button>
            )}
          </div>

          {/* SUB-CATEGORY PILLS */}
          <div className="herbal-pills-wrapper">
            {subCategories.map((subCat) => (
              <button
                key={subCat.value}
                onClick={() => setSelectedSubCat(subCat.value)}
                className={`herbal-sub-pill ${
                  selectedSubCat === subCat.value ? "active" : ""
                }`}
              >
                {subCat.label}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT & STATUS */}
        <div className="herbal-status-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> Pure Herbal Powders</span>
          <span className="status-guarantee">🌿 100% Unadulterated • Direct From Organic Farms</span>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="herbal-loading-skeleton">
            <p>Fetching fresh herbal powder batches...</p>
          </div>
        ) : (
          <div className="herbal-products-grid">
            {filteredProducts.map((product) => {
              const currentWeight =
                selectedWeights[product._id] ||
                powderWeights[product.name]?.[0] ||
                "100g";

              const currentPrice =
                powderPrices[product.name]?.[currentWeight] || product.price;

              const isWishlisted = wishlist.some(
                (item) => item._id === product._id
              );

              return (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="herbal-product-card"
                >
                  {/* TOP BADGE & WISHLIST */}
                  <div className="card-top-row">
                    <span className="stock-tag">
                      {product.stock <= 15 ? "◈ Limited Harvest" : "✦ Fresh Batch"}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="wishlist-icon-btn"
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWishlisted ? (
                        <FaHeart style={{ color: "#e63946" }} />
                      ) : (
                        <FiHeart style={{ color: "#1f4d2e" }} />
                      )}
                    </button>
                  </div>

                  {/* PRODUCT IMAGE CONTAINER */}
                  <div
                    onClick={() =>
                      navigate("/product-details", {
                        state: {
                          product: {
                            ...product,
                            weight: currentWeight,
                            price: currentPrice
                          }
                        }
                      })
                    }
                    className="card-image-wrapper"
                  >
                    <img
                      src={product.image || moringaImg}
                      alt={product.name}
                      className="herbal-card-img"
                    />
                    <div className="img-hover-overlay">
                      <span>View Product Details →</span>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="card-body-content">
                    <div className="subcat-chip">{product.subCategory}</div>
                    <h3 className="product-title">{product.name}</h3>

                    <p className="product-desc">
                      {product.description ||
                        "Pure organic powder cold-milled for max bio-activity and natural benefits."}
                    </p>

                    {/* BENEFIT BULLETS */}
                    <div className="benefit-bullets">
                      {(product.benefits || ["100% Organic", "Lab Verified"]).slice(0, 2).map((b, i) => (
                        <span key={i} className="benefit-tag">
                          <FiCheck className="check-icon" /> {b}
                        </span>
                      ))}
                    </div>

                    {/* WEIGHT SELECTOR & PRICE ROW */}
                    <div className="card-pricing-row">
                      <div className="weight-select-container">
                        <label className="weight-label">Net Wt:</label>
                        <select
                          value={currentWeight}
                          onChange={(e) =>
                            setSelectedWeights({
                              ...selectedWeights,
                              [product._id]: e.target.value
                            })
                          }
                          className="herbal-weight-select"
                        >
                          {(powderWeights[product.name] || ["100g", "200g"]).map(
                            (w) => (
                              <option key={w} value={w}>
                                {w}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="card-price-display">
                        <span className="price-symbol">₹</span>
                        <span className="price-value">{currentPrice}</span>
                      </div>
                    </div>

                    {/* BUTTONS ROW */}
                    <div className="card-btn-group">
                      <button
                        onClick={() =>
                          navigate("/product-details", {
                            state: {
                              product: {
                                ...product,
                                weight: currentWeight,
                                price: currentPrice
                              }
                            }
                          })
                        }
                        className="details-btn"
                      >
                        View Details
                      </button>

                      <button
                        onClick={(e) =>
                          addToCart(
                            {
                              ...product,
                              weight: currentWeight,
                              price: currentPrice
                            },
                            e
                          )
                        }
                        className="add-cart-btn"
                      >
                        <FiShoppingBag style={{ marginRight: "6px" }} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* WHY CHOOSE OUR HERBAL POWDERS SECTION */}
      <section className="herbal-why-section">
        <div className="container">
          <div className="about-section-header">
            <span className="contact-badge centered">THE EARTHKIND STANDARD</span>
            <h2 className="about-section-heading centered">
              Why Our Herbal Powders Stand Apart
            </h2>
            <p className="about-section-subhead">
              From organic farm harvest to airtight glass-grade pouches, we preserve the vibrant living intelligence of nature.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box"><FaLeaf /></div>
              <h3>Cold-Milled Low Temp Processing</h3>
              <p>Milled at ultra-low speeds below 30°C to guarantee heat sensitive Vitamin C and enzymes are never destroyed.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><FaSun /></div>
              <h3>Traditional Shade-Drying</h3>
              <p>Leaves and roots are dried in temperature-controlled shade, protecting natural chlorophyll and natural rich aromas.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><FiShield /></div>
              <h3>Zero Additives or Fillers</h3>
              <p>No added maltodextrin, silica, artificial colors, anti-caking agents, or synthetic fragrance ever used.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><FaSeedling /></div>
              <h3>Certified Farm Direct Sourcing</h3>
              <p>Direct partnerships with smallholder organic farmers in India practice regenerative, chemical-free agriculture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO USE / RITUALS SECTION */}
      <section className="herbal-rituals-section">
        <div className="container">
          <div className="rituals-card">
            <div className="rituals-header">
              <span className="contact-badge">DAILY BOTANICAL RITUALS</span>
              <h2>How To Use Pure Herbal Powders</h2>
              <p>Simple, natural ways to seamlessly incorporate pure herbs into your skin, hair, and nutrition routines.</p>
            </div>

            <div className="rituals-tabs-bar">
              <button
                onClick={() => setActiveTab("face")}
                className={`ritual-tab-btn ${activeTab === "face" ? "active" : ""}`}
              >
                🧖‍♀️ Glow Face Masks
              </button>
              <button
                onClick={() => setActiveTab("hair")}
                className={`ritual-tab-btn ${activeTab === "hair" ? "active" : ""}`}
              >
                💇‍♀️ Hair & Scalp Packs
              </button>
              <button
                onClick={() => setActiveTab("drink")}
                className={`ritual-tab-btn ${activeTab === "drink" ? "active" : ""}`}
              >
                🍵 Daily Wellness Drinks
              </button>
            </div>

            <div className="ritual-tab-content">
              {activeTab === "face" && (
                <div className="ritual-pane">
                  <div className="ritual-step">
                    <span className="step-num">01</span>
                    <div>
                      <h4>Mix 1 tbsp Multani Mitti or Rose Powder</h4>
                      <p>Combine with rose water, raw milk, or yogurt to form a silky smooth paste.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">02</span>
                    <div>
                      <h4>Apply & Relax For 15 Minutes</h4>
                      <p>Spread evenly on clean skin. Allow the botanical AHA & antioxidants to absorb deep into pores.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">03</span>
                    <div>
                      <h4>Rinse With Cool Water</h4>
                      <p>Gently wash off with cool water for instant brightness, tightness, and oil balance.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hair" && (
                <div className="ritual-pane">
                  <div className="ritual-step">
                    <span className="step-num">01</span>
                    <div>
                      <h4>Blend Amla & Neem Powder</h4>
                      <p>Mix 2 tbsp Amla and 1 tbsp Neem powder with coconut oil, curd, or aloe vera juice.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">02</span>
                    <div>
                      <h4>Massage Into Scalp & Roots</h4>
                      <p>Section hair and apply thoroughly to scalp to stimulate roots and eliminate dandruff.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">03</span>
                    <div>
                      <h4>Rinse After 30 Minutes</h4>
                      <p>Wash off with a mild chemical-free shampoo for lustrous, strong, and voluminous hair.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "drink" && (
                <div className="ritual-pane">
                  <div className="ritual-step">
                    <span className="step-num">01</span>
                    <div>
                      <h4>Scoop 1/2 tsp Moringa or Beetroot Powder</h4>
                      <p>Add to warm water, fresh coconut water, or your morning green smoothie.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">02</span>
                    <div>
                      <h4>Stir Thoroughly</h4>
                      <p>Whisk or blend well until completely dissolved for smooth, vibrant green/red elixirs.</p>
                    </div>
                  </div>
                  <div className="ritual-step">
                    <span className="step-num">03</span>
                    <div>
                      <h4>Enjoy Morning Vitality</h4>
                      <p>Drink on an empty stomach to boost energy, improve digestion, and cleanse toxins naturally.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Experience The Purest Herbal Power</h2>
            <p>Elevate your skincare and daily wellness with 100% unadulterated botanical powders.</p>
            <button onClick={() => navigate("/shop")} className="earth-btn primary-glow">
              Explore Complete Collection <FiArrowRight style={{ marginLeft: "8px" }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HerbalPowders;
