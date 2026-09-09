import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiShoppingCart, FiArrowRight, FiTrendingUp, FiGrid } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

// Import local images as high quality fallbacks
import moringaImg from "../assets/moringa-powder.png";
import beetrootImg from "../assets/beetroot-powder.png";
import amlaImg from "../assets/amla-powder.png";
import neemImg from "../assets/neem-powder.png";
import multaniImg from "../assets/multani-mitti.png";
import orangeImg from "../assets/orange-peel.png";
import roseImg from "../assets/rose-powder.png";
import facepackImg from "../assets/mix-face-pack.png";
import detoxImg from "../assets/detox-powder.png";

// Comprehensive static product catalog fallback
const DEFAULT_PRODUCTS = [
  {
    _id: "prod-moringa",
    name: "Moringa Powder",
    category: "Herbal Powders",
    price: 149,
    stock: 25,
    image: moringaImg,
    description: "100% Pure cold-milled organic moringa leaf powder."
  },
  {
    _id: "prod-beetroot",
    name: "Beetroot Powder",
    category: "Herbal Powders",
    price: 129,
    stock: 18,
    image: beetrootImg,
    description: "Sun-dried organic beetroot powder for stamina and natural glow."
  },
  {
    _id: "prod-amla",
    name: "Amla Powder",
    category: "Herbal Powders",
    price: 119,
    stock: 30,
    image: amlaImg,
    description: "Pure Indian Gooseberry powder rich in Vitamin C."
  },
  {
    _id: "prod-neem",
    name: "Neem Powder",
    category: "Herbal Powders",
    price: 109,
    stock: 14,
    image: neemImg,
    description: "Antibacterial neem powder for scalp care and clear skin."
  },
  {
    _id: "prod-multani",
    name: "Multani Mitti",
    category: "Herbal Powders",
    price: 99,
    stock: 40,
    image: multaniImg,
    description: "100% natural Fuller's Earth clay for oil control."
  },
  {
    _id: "prod-orange",
    name: "Orange Peel Powder",
    category: "Herbal Powders",
    price: 129,
    stock: 22,
    image: orangeImg,
    description: "Sun-dried orange peel powder for skin brightening."
  },
  {
    _id: "prod-rose",
    name: "Rose Powder",
    category: "Herbal Powders",
    price: 139,
    stock: 19,
    image: roseImg,
    description: "Shade-dried rose petal powder for soothing face packs."
  },
  {
    _id: "prod-facepack",
    name: "Mix Face Pack",
    category: "Herbal Powders",
    price: 149,
    stock: 15,
    image: facepackImg,
    description: "Botanical blend of Multani Mitti, Rose & Neem."
  },
  {
    _id: "prod-detox",
    name: "Detox Powder",
    category: "Herbal Powders",
    price: 159,
    stock: 12,
    image: detoxImg,
    description: "Ayurvedic herb combination for gut health and cleansing."
  },
  {
    _id: "prod-chia",
    name: "Chia Seeds",
    category: "Natural Seeds",
    price: 199,
    stock: 35,
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=500&auto=format&fit=crop&q=80",
    description: "Raw organic chia seeds packed with Omega-3 and fiber."
  },
  {
    _id: "prod-pumpkin",
    name: "Pumpkin Seeds",
    category: "Natural Seeds",
    price: 249,
    stock: 28,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80",
    description: "AAA grade roasted zinc-rich pumpkin seeds."
  },
  {
    _id: "prod-almonds",
    name: "Premium California Almonds",
    category: "Nuts & Dry Fruits",
    price: 349,
    stock: 45,
    image: "https://images.unsplash.com/photo-1508061252966-1701306b3a0a?w=500&auto=format&fit=crop&q=80",
    description: "Crunchy jumbo size California almonds."
  },
  {
    _id: "prod-cashews",
    name: "Royal Whole Cashews",
    category: "Nuts & Dry Fruits",
    price: 389,
    stock: 20,
    image: "https://images.unsplash.com/photo-1536591375315-1b8368731380?w=500&auto=format&fit=crop&q=80",
    description: "Creamy W240 grade whole cashew nuts."
  },
  {
    _id: "prod-chamomile",
    name: "Chamomile Infusion",
    category: "Herbal Tea",
    price: 249,
    stock: 16,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    description: "Calming whole flower Chamomile herbal tea."
  }
];

const TRENDING_SEARCHES = [
  "Moringa Powder",
  "Beetroot Powder",
  "Amla Powder",
  "Multani Mitti",
  "Chia Seeds",
  "Rose Powder"
];

const POPULAR_CATEGORIES = [
  "Herbal Powders",
  "Natural Seeds",
  "Nuts & Dry Fruits",
  "Herbal Tea"
];

function HeaderSearchBar({ navbarScrolled, navTextColor }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [addedProductId, setAddedProductId] = useState(null);

  // Auto-focus input when modal opens & handle body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Fetch products from backend or use fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const merged = res.data.map((prod) => {
            const fallbackMatch = DEFAULT_PRODUCTS.find(
              (dp) => dp.name.toLowerCase() === prod.name.toLowerCase()
            );
            return {
              ...prod,
              image: prod.image || fallbackMatch?.image || moringaImg,
              description: prod.description || fallbackMatch?.description || "100% natural herbal product."
            };
          });
          setProducts(merged);
        }
      } catch (err) {
        console.log("Using local products for search:", err);
      }
    };

    fetchProducts();
  }, []);

  // Filter matching products
  const matchingProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectProduct = (product) => {
    setIsModalOpen(false);
    setQuery("");
    navigate("/product-details", {
      state: {
        product: {
          ...product,
          weight: product.weight || "100g",
          price: product.price
        }
      }
    });
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity =
        (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        ...product,
        weight: product.weight || "100g",
        price: product.price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 1800);

    toast.success(`${product.name} added to cart!`, {
      duration: 2500,
      style: {
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1f4d2e, #163822)",
        color: "#fff",
        padding: "14px 18px",
        fontWeight: "600",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        zIndex: 999999999
      },
      iconTheme: { primary: "#d8ef7f", secondary: "#1f4d2e" }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCloseModal();
    } else if (e.key === "Enter" && matchingProducts.length > 0) {
      handleSelectProduct(matchingProducts[0]);
    }
  };

  return (
    <>
      {/* NAVBAR SEARCH TRIGGER BUTTON / BAR */}
      <div
        className="header-search-container"
        onClick={() => setIsModalOpen(true)}
      >
        {/* DESKTOP SEARCH TRIGGER BAR */}
        <div
          className={`search-input-wrapper ${navbarScrolled ? "scrolled" : ""}`}
        >
          <FiSearch
            className="search-icon"
            style={{ color: navbarScrolled ? "#d8ef7f" : navTextColor }}
          />
          <input
            type="text"
            readOnly
            placeholder="Search products..."
            className="header-search-input"
            style={{
              color: navbarScrolled ? "#ffffff" : navTextColor,
              cursor: "pointer"
            }}
          />
        </div>

        {/* MOBILE SEARCH TRIGGER ICON BUTTON */}
        <button
          className="mobile-search-toggle"
          style={{ color: navTextColor }}
          aria-label="Open Search Popup"
          title="Search Products"
        >
          <FiSearch size={22} />
        </button>
      </div>

      {/* POPUP SEARCH SCREEN MODAL - PORTALED TO DOCUMENT.BODY */}
      {isModalOpen &&
        createPortal(
          <div
            className="search-popup-overlay"
            onClick={handleCloseModal}
          >
            <div
              className="search-popup-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* POPUP TOP BAR / HEADER */}
              <div className="search-popup-header">
                <div className="search-popup-input-box">
                  <FiSearch className="search-popup-input-icon" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search herbal powders, seeds..."
                    className="search-popup-input"
                  />
                  {query && (
                    <button
                      className="search-popup-clear-btn"
                      onClick={() => setQuery("")}
                      title="Clear search"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>

                <button
                  className="search-popup-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close search"
                >
                  <FiX size={22} />
                  <span className="close-text">Cancel</span>
                </button>
              </div>

              {/* POPUP BODY CONTENT */}
              <div className="search-popup-body">
                {!query.trim() ? (
                  /* DEFAULT VIEW: TRENDING & CATEGORIES */
                  <div className="search-popup-default-view">
                    <div className="search-popup-section">
                      <h4 className="section-title">
                        <FiTrendingUp className="title-icon" />
                        Trending Searches
                      </h4>
                      <div className="trending-chips-grid">
                        {TRENDING_SEARCHES.map((item, idx) => (
                          <button
                            key={idx}
                            className="trending-chip"
                            onClick={() => setQuery(item)}
                          >
                            <FiSearch size={13} />
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="search-popup-section">
                      <h4 className="section-title">
                        <FiGrid className="title-icon" />
                        Browse Popular Categories
                      </h4>
                      <div className="category-chips-grid">
                        {POPULAR_CATEGORIES.map((cat, idx) => (
                          <button
                            key={idx}
                            className="category-chip"
                            onClick={() => {
                              setQuery(cat);
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* LIVE RESULTS VIEW */
                  <div className="search-popup-results-view">
                    <div className="search-results-summary">
                      <span>
                        Matching Products ({matchingProducts.length})
                      </span>
                      <span className="query-highlight">"{query}"</span>
                    </div>

                    {matchingProducts.length === 0 ? (
                      <div className="search-popup-no-results">
                        <div className="no-results-icon">🌿</div>
                        <h3>No products found</h3>
                        <p>We couldn't find any products matching "{query}"</p>
                        <button
                          className="browse-shop-btn"
                          onClick={() => {
                            handleCloseModal();
                            navigate("/shop");
                          }}
                        >
                          Explore All Products in Shop →
                        </button>
                      </div>
                    ) : (
                      <div className="search-popup-results-grid">
                        {matchingProducts.map((product) => (
                          <div
                            key={product._id}
                            className="search-popup-card"
                            onClick={() => handleSelectProduct(product)}
                          >
                            <img
                              src={product.image || moringaImg}
                              alt={product.name}
                              className="card-thumb"
                            />
                            <div className="card-info">
                              <span className="card-cat">{product.category}</span>
                              <h4 className="card-name">{product.name}</h4>
                              <p className="card-desc">{product.description}</p>
                              <div className="card-bottom">
                                <span className="card-price">₹{product.price}</span>
                                <button
                                  className={`card-add-btn ${addedProductId === product._id ? "added" : ""}`}
                                  onClick={(e) => handleAddToCart(product, e)}
                                >
                                  {addedProductId === product._id ? (
                                    <span>Added ✓</span>
                                  ) : (
                                    <>
                                      <FiShoppingCart size={15} />
                                      <span>Add</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchingProducts.length > 0 && (
                      <div
                        className="search-popup-footer-action"
                        onClick={() => {
                          handleCloseModal();
                          navigate("/shop");
                        }}
                      >
                        <span>View all products in shop</span>
                        <FiArrowRight />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default HeaderSearchBar;


