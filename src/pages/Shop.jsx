import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import { FiShoppingBag } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaLeaf,
  FaShieldAlt,
  FaTruck,
  FaCheckCircle,
  FaCreditCard,
  FaBoxOpen
} from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi";
import {
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
useState(
  location.state?.selectedCategory || "All"
);
  const [wishlist, setWishlist] = useState(
    
  JSON.parse(localStorage.getItem("wishlist")) || []
);


const productWeights = {

  // HERBAL POWDERS
  "Moringa Powder": ["100g", "200g"],
  "Beetroot Powder": ["100g", "200g"],
  "Amla Powder": ["100g", "200g"],
  "Neem Powder": ["100g", "200g"],
  "Multani Mitti": ["100g", "200g"],
  "Orange Peel Powder": ["100g", "200g"],
  "Rose Powder": ["100g", "200g"],
  "Mix Face Pack": ["100g", "200g"],
  "Detox Powder": ["100g", "200g"],

  // SEEDS
  "Chia Seeds": ["200g", "500g"],
  "Pumpkin Seeds": ["200g", "500g"],
  "Flax Seeds": ["200g", "500g"],
  "Sunflower Seeds": ["200g", "500g"],
  "Seed Mix": ["250g", "500g"],

  // HERBAL TEA
  "Chamomile Infusion": ["50g"],
  "Rose Infusion": ["50g"],
  "Moringa Hibiscus Blend": ["50g"],
  "Tulsi Wellness Blend": ["50g"],
  "Ginger Lemongrass Infusion": ["50g"],
  "Kashmiri Kahwa": ["50g"],
  "Orange Cinnamon Infusion": ["50g"],
  "Masala Wellness Blend": ["50g"],

  // NUTS & DRY FRUITS
  "Premium California Almonds": ["250g", "500g"],
  "Royal Whole Cashews": ["250g", "500g"],
  "Premium Walnut Kernels": ["200g", "500g"],
  "Sun-Dried Raisins": ["250g", "500g"],
  "Black Pearl Raisins": ["250g", "500g"],
  "Royal Medjool Dates": ["250g", "500g"],
  "EarthKind Power Trail Mix": ["200g", "400g"],
  "Super Seed Nut Fusion": ["200g", "400g"]

};

const productPrices = {

  // HERBAL POWDERS
  "Moringa Powder": {
    "100g": 149,
    "200g": 269
  },

  "Beetroot Powder": {
    "100g": 129,
    "200g": 239
  },

  "Amla Powder": {
    "100g": 119,
    "200g": 219
  },

  "Neem Powder": {
    "100g": 99,
    "200g": 189
  },

  "Multani Mitti": {
    "100g": 79,
    "200g": 149
  },

  "Orange Peel Powder": {
    "100g": 129,
    "200g": 239
  },

  "Rose Powder": {
    "100g": 149,
    "200g": 279
  },

  "Mix Face Pack": {
    "100g": 169,
    "200g": 319
  },

  "Detox Powder": {
    "100g": 199,
    "200g": 379
  },

  // SEEDS
  "Chia Seeds": {
    "200g": 199,
    "500g": 449
  },

  "Pumpkin Seeds": {
    "200g": 249,
    "500g": 599
  },

  "Flax Seeds": {
    "200g": 129,
    "500g": 299
  },

  "Sunflower Seeds": {
    "200g": 169,
    "500g": 399
  },

  "Seed Mix": {
    "250g": 299,
    "500g": 599
  },

  // HERBAL TEA
  "Chamomile Infusion": {
    "50g": 249
  },

  "Rose Infusion": {
    "50g": 229
  },

  "Moringa Hibiscus Blend": {
    "50g": 249
  },

  "Tulsi Wellness Blend": {
    "50g": 199
  },

  "Ginger Lemongrass Infusion": {
    "50g": 219
  },

  "Kashmiri Kahwa": {
    "50g": 299
  },

  "Orange Cinnamon Infusion": {
    "50g": 239
  },

  "Masala Wellness Blend": {
    "50g": 229
  },

  // NUTS & DRY FRUITS
  "Premium California Almonds": {
    "250g": 349,
    "500g": 679
  },

  "Royal Whole Cashews": {
    "250g": 389,
    "500g": 749
  },

  "Sun-Dried Raisins": {
    "250g": 179,
    "500g": 329
  },

  "Black Pearl Raisins": {
    "250g": 229,
    "500g": 429
  },

  "Premium Walnut Kernels": {
    "200g": 399,
    "500g": 949
  },

  "EarthKind Power Trail Mix": {
    "200g": 349,
    "400g": 649
  },

  "Super Seed Nut Fusion": {
    "200g": 379,
    "400g": 699
  },

  "Royal Medjool Dates": {
    "250g": 399,
    "500g": 749
  }

};

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE}/api/products`);
      const list = Array.isArray(res.data) ? res.data : [];
      setProducts(list);
      console.log("PRODUCTS LOADED:", list.length);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const addToCart = (product, event) => {
  let existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex = existingCart.findIndex(
  (item) =>

    item._id === product._id &&

    item.weight === product.weight
);
  if (existingProductIndex !== -1) {

  existingCart[existingProductIndex] = {
    ...existingCart[existingProductIndex],

    image:
      product.image ||

      product.images?.[0] ||

      existingCart[existingProductIndex].image,

    quantity:
      (existingCart[existingProductIndex].quantity || 1) + 1
  };

} else {
   const selectedWeight =

  selectedWeights[
    product._id
  ] ||

  productWeights[
    product.name
  ]?.[0];

const dynamicPrice =

  productPrices[
    product.name
  ]?.[selectedWeight] ||

  product.price;

existingCart.push({

  ...product,

  weight: selectedWeight,

  price: dynamicPrice,

  quantity: 1

});
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(existingCart)
  );

  window.dispatchEvent(new Event("cartUpdated"));

  const productCard =
    event.target.closest("div");

  const productImage =
    productCard.querySelector(".product-image");

  const cartIcon =
    document.querySelector(".cart-icon");

  if (productImage && cartIcon) {
    const flyingImage =
      productImage.cloneNode(true);

    const productRect =
      productImage.getBoundingClientRect();

    const cartRect =
      cartIcon.getBoundingClientRect();

    flyingImage.style.position = "fixed";
    flyingImage.style.left = `${productRect.left}px`;
    flyingImage.style.top = `${productRect.top}px`;
    flyingImage.style.width = "180px";
    flyingImage.style.height = "180px";
    flyingImage.style.zIndex = "9999";
    flyingImage.style.transition =
      "all 1.8s cubic-bezier(0.25, 1, 0.5, 1)";
    flyingImage.style.borderRadius = "16px";
    flyingImage.style.boxShadow =
      "0 12px 30px rgba(0,0,0,0.15)";
    flyingImage.style.opacity = "1";

    document.body.appendChild(flyingImage);

    setTimeout(() => {
      flyingImage.style.left = `${cartRect.left}px`;
      flyingImage.style.top = `${cartRect.top}px`;
      flyingImage.style.width = "40px";
      flyingImage.style.height = "40px";
      flyingImage.style.opacity = "0.2";
      flyingImage.style.transform = "scale(0.4)";
    }, 50);

    setTimeout(() => {
      document.body.removeChild(flyingImage);
    }, 2000);
  }

  toast.success(`${product.name} added to cart`, {

  style: {
    borderRadius: "16px",

    background:
      "linear-gradient(135deg,#1f4d2e,#163822)",

    color: "#fff",

    padding: "16px 18px",

    fontSize: "15px",

    fontWeight: "600",

    boxShadow:
      "0 12px 30px rgba(0,0,0,0.18)"
  },

  iconTheme: {
    primary: "#d8ef7f",

    secondary: "#1f4d2e"
  }
});
};
  const toggleWishlist = (product) => {
  let updatedWishlist = [...wishlist];

  const exists = updatedWishlist.find(
    (item) => item._id === product._id
  );

 if (exists) {

  updatedWishlist = updatedWishlist.filter(
    (item) => item._id !== product._id
  );

  toast("Removed from wishlist", {

    icon: "💔",

    style: {
      borderRadius: "16px",

      background: "#fff",

      color: "#234d2c",

      padding: "14px 18px",

      fontWeight: "600"
    }
  });

} else {

  const selectedWeight =

  selectedWeights[
    product._id
  ] ||

  productWeights[
    product.name
  ]?.[0];

const dynamicPrice =

  productPrices[
    product.name
  ]?.[selectedWeight] ||

  product.price;

updatedWishlist.push({

  ...product,

  weight: selectedWeight,

  price: dynamicPrice

});

  toast.success("Added to wishlist", {

    style: {
      borderRadius: "16px",

      background:
        "linear-gradient(135deg,#1f4d2e,#163822)",

      color: "#fff",

      padding: "16px 18px",

      fontWeight: "600"
    }
  });
}
  setWishlist(updatedWishlist);

  localStorage.setItem(
    
    "wishlist",
    JSON.stringify(updatedWishlist)
  );

  window.dispatchEvent(new Event("wishlistUpdated"));
};

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const [selectedWeights, setSelectedWeights] =
  useState({});

  const shineAnimation = `
@keyframes shine {
  0% {
    left: -120%;
  }

  100% {
    left: 140%;
  }
}
`;

const scrollReviews = (direction) => {
  const container = document.getElementById("reviews-slider");
  if (!container) return;

  const scrollAmount = container.clientWidth;

  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth"
  });
};

  const filteredProducts = (products || [])
    .filter((product) =>
      (product.name || "").toLowerCase().includes((search || "").toLowerCase().trim())
    )
    .filter((product) =>
      selectedCategory === "All"
        ? true
        : (product.category || "").toLowerCase().trim() === selectedCategory.toLowerCase().trim() ||
          (product.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
    );

  return (
  <div className="shop-page-container">

    <style>
  {shineAnimation}
</style>
   <div className="shop-title-header">
  <h1 className="shop-main-title">
    Shop Collection
  </h1>

  <FiShoppingBag className="shop-bag-icon" />
</div>

<p className="shop-subtitle-text">
  Pure Herbal & Wellness Essentials
</p>

    {/* SEARCH & FILTER CONTROLS */}
    <div className="shop-controls-wrapper">
      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="shop-search-input"
      />

      {/* CATEGORY SELECT DROPDOWN */}
      <div className="shop-category-select-box">
        <div className="shop-select-shine" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="shop-category-select"
        >
          <option value="All">All Categories</option>
          <option value="Herbal Powders">Herbal Powders</option>
          <option value="Natural Seeds">Natural Seeds</option>
          <option value="Herbal Tea">Herbal Tea</option>
          <option value="Nuts & Dry Fruits">Nuts & Dry Fruits</option>
        </select>
      </div>
    </div>

    {/* HORIZONTAL CATEGORY PILLS FOR QUICK TOUCH SELECTION */}
    <div className="shop-category-pills">
      {[
        { label: "All", value: "All" },
        { label: "Herbal Powders", value: "Herbal Powders" },
        { label: "Natural Seeds", value: "Natural Seeds" },
        { label: "Herbal Tea", value: "Herbal Tea" },
        { label: "Nuts & Dry Fruits", value: "Nuts & Dry Fruits" },
      ].map((cat) => (
        <button
          key={cat.value}
          onClick={() => setSelectedCategory(cat.value)}
          className={`category-pill-btn ${selectedCategory === cat.value ? "active" : ""}`}
        >
          {cat.label}
        </button>
      ))}
    </div>

    {/* RESPONSIVE PRODUCT GRID */}
    <div className="shop-product-grid">
      {filteredProducts.length === 0 ? (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "80px 20px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
          }}
        >
          <h3 style={{ fontSize: "22px", color: "#163923", marginBottom: "10px" }}>
            No products found 🌿
          </h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Try selecting "All Categories" or adjusting your search term.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              background: "#163923",
              color: "#fff",
              border: "none",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Show All Products
          </button>
        </div>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className="shop-product-card"
          >
  <img
  className="product-image"
  src={
    product.image ||
    "https://via.placeholder.com/300x200?text=Product"
  }
  alt={product.name}

  onClick={() =>
  navigate("/product-details", {
    state: {
      product: {
        ...product,
        weight:
          selectedWeights[product._id] ||
          productWeights[product.name]?.[0],
        price:
          productPrices[product.name]?.[
            selectedWeights[product._id] ||
            productWeights[product.name]?.[0]
          ] || product.price,
      },
    },
  })
}

  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "scale(1.04)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "scale(1)";
  }}

  style={{
    width: "100%",
    height: "250px",
    objectFit: "contain",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "12px",
    marginBottom: "15px",

    cursor: "pointer",
    transition: "0.4s ease"
  }}
/>
   <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  }}
>

  {/* WEIGHT SELECTOR */}
  <select

    value={
      selectedWeights[product._id] ||

      productWeights[product.name]?.[0] ||

      ""
    }

    onChange={(e) =>
      setSelectedWeights({
        ...selectedWeights,

        [product._id]:
          e.target.value
      })
    }

    style={{
      padding: "7px 12px",

      borderRadius: "10px",

      border: "1px solid #d6e4d6",

      background:
        "linear-gradient(135deg,#f8fff8,#eef8ef)",

      color: "#234d2c",

      fontWeight: "800",

      fontSize: "13px",

      outline: "none",

      cursor: "pointer",

      boxShadow:
        "0 4px 12px rgba(35,77,44,0.06)"
    }}
  >

    {(productWeights[
      product.name
    ] || ["100g"]).map(
      (weight) => (

        <option
          key={weight}
          value={weight}
        >
          {weight}
        </option>

      )
    )}

  </select>

  {/* WISHLIST */}
  {wishlist.find(
    (item) =>
      item._id === product._id
  ) ? (

    <FaHeart
      onClick={() =>
        toggleWishlist(product)
      }

      style={{
        fontSize: "22px",
        cursor: "pointer",
        color: "red"
      }}
    />

  ) : (

    <FiHeart
      onClick={() =>
        toggleWishlist(product)
      }

      style={{
        fontSize: "22px",
        cursor: "pointer",
        color: "#234d2c"
      }}
    />

  )}

</div>
          <h3 className="product-card-title">{product.name}</h3>
        <div
  className="product-card-stock"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",

    marginBottom: "8px",

    padding: "5px 12px",

    borderRadius: "999px",

    fontSize: "11px",

    fontWeight: "700",

    background:
      product.stock === 0
        ? "linear-gradient(135deg,#fff5f5,#ffe8e8)"
        : product.stock <= 5
        ? "linear-gradient(135deg,#fff8ec,#fff0d6)"
        : "linear-gradient(135deg,#eefbf2,#dff6e8)",

    border:
      product.stock === 0
        ? "1px solid rgba(220,38,38,0.12)"
        : product.stock <= 5
        ? "1px solid rgba(234,88,12,0.12)"
        : "1px solid rgba(22,101,52,0.10)",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.03)",

    color:
      product.stock === 0
        ? "#dc2626"
        : product.stock <= 5
        ? "#ea580c"
        : "#166534"
  }}
>
  {product.stock === 0
    ? "◎ Restocking Soon"
    : product.stock <= 5
    ? "◈ Limited Batch"
    : "✦ Freshly Available"}
</div>
          <p
  className="product-card-price"
  style={{
    fontSize: "22px",
    fontWeight: "800",
    color: "#163923",
    marginBottom: "4px"
  }}
>
  ₹{

    productPrices[
      product.name
    ]?.[

      selectedWeights[
        product._id
      ] ||

      productWeights[
        product.name
      ]?.[0]

    ] ||

    product.price

  }
</p>
          <p className="product-card-category">{product.category}</p>
          
         <button
  className="product-card-details-btn"
  onClick={() =>
  navigate("/product-details", {
    state: {
      product: {
        ...product,
        weight:
          selectedWeights[product._id] ||
          productWeights[product.name]?.[0],
        price:
          productPrices[product.name]?.[
            selectedWeights[product._id] ||
            productWeights[product.name]?.[0]
          ] || product.price,
      },
    },
  })
}

  onMouseEnter={(e) => {

    e.currentTarget.style.background =
      "#123524";

    e.currentTarget.style.color =
      "#fff";

    e.currentTarget.style.transform =
      "translateY(-2px)";

    e.currentTarget.style.boxShadow =
      "0 10px 24px rgba(18,53,36,0.25)";
  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.background =
      "transparent";

    e.currentTarget.style.color =
      "#123524";

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =
      "none";
  }}

  style={{
    width: "100%",
    padding: "8px 10px",
    background: "#fff",
    color: "#2d5a27",
    border: "1.5px solid #2d5a27",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "6px",
    fontWeight: "bold",
    fontSize: "13px",

    transition:
      "all 0.35s ease",

    position: "relative",

    overflow: "hidden"
  }}
>
  View Details
</button>

  

<button
  className="product-card-add-btn"
  disabled={product.stock === 0}
  onClick={(e) =>
  addToCart(
    {
      ...product,

      weight:
        selectedWeights[
          product._id
        ] ||

        productWeights[
          product.name
        ]?.[0],

      price:
        productPrices[
          product.name
        ]?.[
          selectedWeights[
            product._id
          ] ||

          productWeights[
            product.name
          ]?.[0]
        ] ||

        product.price
    },

    e
  )
}
  style={{
  marginTop: "4px",

  background:
    product.stock === 0
      ? "#d1d5db"
      : "#1f4d2e",

  color: "#fff",

  border:
    product.stock === 0
      ? "1.5px solid #d1d5db"
      : "1.5px solid #1f4d2e",

  padding: "10px 14px",

  borderRadius: "8px",

  cursor:
    product.stock === 0
      ? "not-allowed"
      : "pointer",

  opacity:
    product.stock === 0
      ? 0.7
      : 1,

  fontWeight: "600",
  fontSize: "13px",

  transition: "0.3s ease"
}}
  onMouseEnter={(e) => {
    e.target.style.background = "#fff";
    e.target.style.color = "#1f4d2e";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "#1f4d2e";
    e.target.style.color = "#fff";
  }}
>
  {product.stock === 0
  ? "Out Of Stock"
  : "Add to Cart"}
</button>
        </div>
      ))
    )}
</div>
<div
  className="shop-why-banner"
  style={{
    marginTop: "100px",
    padding: "80px 55px",
    borderRadius: "42px",
    background:
      "linear-gradient(135deg,#f7fbf8,#edf7f1)",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden"
  }}
>

  {/* BACKGROUND GLOW */}
  <div
    style={{
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background:
        "rgba(34,197,94,0.08)",
      filter: "blur(70px)"
    }}
  ></div>

  <div
    style={{
      position: "absolute",
      bottom: "-100px",
      left: "-100px",
      width: "250px",
      height: "250px",
      borderRadius: "50%",
      background:
        "rgba(16,185,129,0.06)",
      filter: "blur(70px)"
    }}
  ></div>

 <div
  style={{
    textAlign: "center",
    marginBottom: "65px",
    position: "relative",
    zIndex: 2,

    display: "flex",
    flexDirection: "column",
   alignItems: "flex-start"
  }}
>
 <p
  className="section-subtitle"
  style={{
    width: "220px",
    textAlign: "left",
    margin: "0"
  }}
>
    Premium Wellness
  </p>

 <h2
  className="section-title shop-why-title"
  style={{
    textAlign: "center",
    width: "100%",
    margin: "0 auto",

    fontSize: "clamp(32px, 4vw, 80px)"
  }}
>
  Why Choose Earthkind Naturals
</h2>

  <p
  className="section-text"
  style={{
    maxWidth: "760px",
    textAlign: "center",
    margin: "18px auto 0 auto"
  }}
>
    Premium wellness products crafted with purity,
    authenticity and nature’s finest ingredients.
  </p>
</div>

 

  <div
    className="shop-why-grid"
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(3, 1fr)",
      gap: "30px",
      position: "relative",
      zIndex: 2
    }}
  >

    {[
      {
        title: "100% Natural",
        icon: <FaLeaf />,
        desc:
          "Pure ingredients sourced carefully from nature for maximum wellness benefits."
      },

      {
        title: "Chemical Free",
        icon: <FaShieldAlt />,
        desc:
          "No harmful chemicals or artificial additives — only authentic natural goodness."
      },

      {
        title: "Lab Tested",
        icon: <FaCheckCircle />,
        desc:
          "Every product undergoes strict quality testing for purity and safety."
      },

      {
        title: "Eco Packaging",
      icon: <HiOutlineCube />,
        desc:
          "Sustainable packaging designed to protect both products and the environment."
      },

      {
        title: "Fast Delivery",
        icon: <FaTruck />,
        desc:
          "Quick and secure delivery experience with carefully packed wellness products."
      },

      {
        title: "Secure Payments",
        icon: <FaCreditCard />,
        desc:
          "Trusted and encrypted payment systems ensuring complete checkout security."
      }

    ].map((item, index) => (

      <div
        key={index}
        className="shop-why-card"

        style={{
          background:
            "rgba(255,255,255,0.82)",

          border:
            "1px solid rgba(18,53,36,0.05)",

          borderRadius: "34px",

          padding: "42px 34px",

          textAlign: "center",

          transition: "all 0.4s ease",

          boxShadow:
            "0 14px 40px rgba(0,0,0,0.05)",

          backdropFilter: "blur(14px)"
        }}

        onMouseEnter={(e) => {

          e.currentTarget.style.transform =
            "translateY(-10px)";

          e.currentTarget.style.boxShadow =
            "0 24px 50px rgba(16,185,129,0.12)";

          e.currentTarget.style.background =
            "#ffffff";
        }}

        onMouseLeave={(e) => {

          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 14px 40px rgba(0,0,0,0.05)";

          e.currentTarget.style.background =
            "rgba(255,255,255,0.82)";
        }}
      >

        <div
          style={{
            width: "86px",
            height: "86px",
            margin: "0 auto 28px auto",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg,#dcfce7,#ecfdf5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            color: "#15803d",
            boxShadow:
              "0 10px 25px rgba(34,197,94,0.15)"
          }}
        >
          {item.icon}
        </div>

        <h3
          style={{
            fontSize: "28px",
            marginBottom: "18px",
            color: "#123524",
            fontWeight: "800"
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            color: "#6b7280",
            lineHeight: "2",
            fontSize: "15px"
          }}
        >
          {item.desc}
        </p>

      </div>

    ))}

  </div>

</div>
<div
  className="shop-reviews-section"
  style={{
    marginTop: "110px",
    position: "relative"
  }}
>

 <div
  style={{
    textAlign: "center",
    marginBottom: "60px",

    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  }}
>
 <p
  className="section-subtitle"
  style={{
    width: "220px",
    textAlign: "left",
    margin: "0"
  }}
>
    Customer Love
  </p>

 <h2
  className="section-title"
  style={{
    textAlign: "center",
    width: "100%",
    margin: "0 auto"
  }}
>
  Customer Reviews 💚
</h2>

  <p
  className="section-text"
  style={{
    maxWidth: "760px",
    textAlign: "center",
    margin: "18px auto 0 auto"
  }}
>
    Real stories from our wellness community.
  </p>
</div>

  {/* LEFT BUTTON */}
  <button
    className="shop-review-nav-btn shop-review-left"
    onClick={() =>
      scrollReviews("left")
    }

    style={{
      position: "absolute",
      left: "-10px",
      top: "58%",
      transform: "translateY(-50%)",
      width: "54px",
      height: "54px",
      borderRadius: "50%",
      border: "none",
      background: "#fff",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.08)",
      cursor: "pointer",
      zIndex: 5,
      fontSize: "18px",
      color: "#123524",
      transition: "0.3s ease"
    }}
  >
    <FaChevronLeft />
  </button>

  {/* RIGHT BUTTON */}
  <button
    className="shop-review-nav-btn shop-review-right"
    onClick={() =>
      scrollReviews("right")
    }

    style={{
      position: "absolute",
      right: "-10px",
      top: "58%",
      transform: "translateY(-50%)",
      width: "54px",
      height: "54px",
      borderRadius: "50%",
      border: "none",
      background: "#fff",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.08)",
      cursor: "pointer",
      zIndex: 5,
      fontSize: "18px",
      color: "#123524",
      transition: "0.3s ease"
    }}
  >
    <FaChevronRight />
  </button>

  {/* REVIEWS SLIDER */}
  <div
    id="reviews-slider"
    className="shop-reviews-slider"

    style={{
      display: "flex",
      gap: "28px",
      overflowX: "auto",
      scrollBehavior: "smooth",
      paddingBottom: "10px",
      scrollbarWidth: "none"
    }}
  >

    {[
      {
  name: "Priya Sharma",
  rating: 5.0,
  review:
    "Honestly didn’t expect the Moringa Powder to be this fresh. Packaging was neat and the quality genuinely felt premium."
},

{
  name: "Rahul Verma",
  rating: 4.2,
  review:
    "Tried the Chia Seeds and they were super clean and crunchy. Definitely feels better than local store products."
},

{
  name: "Sneha Kapoor",
  rating: 4.8,
  review:
    "Delivery was surprisingly quick and the Herbal Tea smells amazing. My parents loved it too."
},

{
  name: "Aman Gupta",
  rating: 3.8,
  review:
    "I’ve ordered twice already. The products feel authentic and not overly commercial like many brands online."
},

{
  name: "Neha Joshi",
  rating: 5.0,
  review:
    "Really loved the eco-friendly packaging. Everything arrived safely and looked professionally packed."
},

{
  name: "Karan Malhotra",
  rating: 3.4,
  review:
    "The Detox Powder mixes well and tastes natural. Can actually feel the freshness in the ingredients."
},

{
  name: "Ritika Mehra",
  rating: 4.7,
  review:
    "Customer support was polite and responsive. Overall shopping experience felt smooth and trustworthy."
},

{
  name: "Vikas Arora",
  rating: 3.9,
  review:
    "The quality honestly exceeded my expectations. Will definitely try more wellness products from here."
},

{
  name: "Pooja Singh",
  rating: 5.0,
  review:
    "Loved the premium feel of the products. Even the unboxing experience looked elegant and clean."
}

    ].map((item, index) => (

      <div
        key={index}
        className="shop-review-card"

        style={{
          minWidth: "320px",
          maxWidth: "320px",
          height: "320px",

          background:
            "rgba(255,255,255,0.82)",

          border:
            "1px solid rgba(18,53,36,0.05)",

          padding: "30px",

          borderRadius: "34px",

          boxShadow:
            "0 14px 35px rgba(0,0,0,0.05)",

          backdropFilter: "blur(12px)",

          transition: "0.4s ease",

          flexShrink: 0,

          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}

        onMouseEnter={(e) => {

          e.currentTarget.style.transform =
            "translateY(-8px)";

          e.currentTarget.style.boxShadow =
            "0 24px 45px rgba(16,185,129,0.10)";
        }}

        onMouseLeave={(e) => {

          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 14px 35px rgba(0,0,0,0.05)";
        }}
      >

        {/* TOP CONTENT */}
        <div>

  <div
    style={{
      color: "#f59e0b",
      fontSize: "20px",
      marginBottom: "20px",
      textAlign: "center",
      fontWeight: "700"
    }}
  >
    {"★".repeat(Math.round(item.rating))}
    {"☆".repeat(5 - Math.round(item.rating))}

    <span
      style={{
        marginLeft: "8px",
        color: "#6b7280",
        fontSize: "14px"
      }}
    >
      {item.rating}
    </span>
  </div>

  <p
    style={{
      color: "#4b5563",
      lineHeight: "1.9",
      fontSize: "15px",
      textAlign: "center"
    }}
  >
    {item.review}
  </p>

</div>

        {/* FIXED BOTTOM USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginTop: "20px"
          }}
        >

          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#dcfce7,#bbf7d0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#15803d",
              fontWeight: "700",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            {item.name.charAt(0)}
          </div>

          <div>

            <h4
              style={{
                color: "#123524",
                marginBottom: "4px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              {item.name}
            </h4>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px"
              }}
            >
              Verified Customer
            </p>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>
    
  </div>
);
}

export default Shop;