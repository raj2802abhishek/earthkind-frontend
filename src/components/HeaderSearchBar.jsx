import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiShoppingCart, FiArrowRight } from "react-icons/fi";
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

function HeaderSearchBar({ navbarScrolled, navTextColor }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  // Auto-focus search input when expanded on mobile
  useEffect(() => {
    if (isExpandedMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpandedMobile]);

  // Fetch products from backend or use fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge with fallbacks if needed so images match
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

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching products
  const matchingProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery("");
    setIsExpandedMobile(false);
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

    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1f4d2e, #163822)",
        color: "#fff",
        padding: "14px 18px",
        fontWeight: "600"
      },
      iconTheme: { primary: "#d8ef7f", secondary: "#1f4d2e" }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && matchingProducts.length > 0) {
      handleSelectProduct(matchingProducts[0]);
    }
  };

  return (
    <div className={`header-search-container ${isExpandedMobile ? "mobile-expanded" : ""}`} ref={searchRef}>
      {/* SEARCH BOX INPUT */}
      <div className={`search-input-wrapper ${navbarScrolled ? "scrolled" : ""}`}>
        <FiSearch className="search-icon" style={{ color: navbarScrolled ? "#d8ef7f" : navTextColor }} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="header-search-input"
          style={{
            color: navbarScrolled ? "#ffffff" : navTextColor,
          }}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="search-clear-btn"
            title="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* MOBILE TOGGLE SEARCH BUTTON */}
      <button
        className="mobile-search-toggle"
        onClick={() => setIsExpandedMobile(!isExpandedMobile)}
        style={{ color: navTextColor }}
        title="Search Products"
      >
        {isExpandedMobile ? <FiX size={22} /> : <FiSearch size={22} />}
      </button>

      {/* LIVE DROPDOWN RESULTS */}
      {isOpen && (
        <div className="search-dropdown-menu">
          <div className="search-dropdown-header">
            <span>
              Available Products ({matchingProducts.length})
            </span>
            {query && (
              <span className="search-query-tag">"{query}"</span>
            )}
          </div>

          {matchingProducts.length === 0 ? (
            <div className="search-no-results">
              <p>No products matching "{query}"</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/shop");
                }}
                className="view-all-btn"
              >
                Browse Shop Collection →
              </button>
            </div>
          ) : (
            <div className="search-results-list">
              {matchingProducts.slice(0, 6).map((product) => (
                <div
                  key={product._id}
                  className="search-result-card"
                  onClick={() => handleSelectProduct(product)}
                >
                  <img
                    src={product.image || moringaImg}
                    alt={product.name}
                    className="result-thumb"
                  />

                  <div className="result-details">
                    <h4 className="result-name">{product.name}</h4>
                    <div className="result-meta">
                      <span className="result-category">{product.category}</span>
                      <span className="result-price">₹{product.price}</span>
                    </div>
                  </div>

                  <button
                    className="result-add-cart-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                    title="Add to Cart"
                  >
                    <FiShoppingCart size={15} />
                    <span className="btn-text">Add</span>
                  </button>
                </div>
              ))}

              {matchingProducts.length > 6 && (
                <div
                  className="search-view-more"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/shop");
                  }}
                >
                  <span>See all {matchingProducts.length} results</span>
                  <FiArrowRight />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderSearchBar;
