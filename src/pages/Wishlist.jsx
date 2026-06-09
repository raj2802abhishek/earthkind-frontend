import axios from "axios";
import { FiHeart } from "react-icons/fi";
import React, { useEffect, useState, useRef } from "react";

import {
  FiTrash2,
  FiShare2,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

import { FaStickyNote } from "react-icons/fa";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
const [notes, setNotes] = useState({});
const [showNoteBox, setShowNoteBox] = useState(null);
const [scrollPosition, setScrollPosition] = useState(0);
const carouselRef = useRef();

  const [selectedWeights, setSelectedWeights] =
useState({});

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
  const storedWishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  setWishlist(storedWishlist);

  const savedNotes =
    JSON.parse(localStorage.getItem("wishlistNotes")) || {};

  setNotes(savedNotes);

  fetchProducts();
}, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(
      (item) => item._id !== id
    );

    setWishlist(updated);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
    window.dispatchEvent(new Event("wishlistUpdated"));
  };
  const fetchProducts = async () => {
  try {
    const res = await axios.get(
     `${import.meta.env.VITE_API_URL}/api/products`
    );

    setProducts(res.data);
  } catch (error) {
    console.log(error);
  }
};

const saveNote = (id, value) => {
  const updatedNotes = {
    ...notes,
    [id]: value
  };

  setNotes(updatedNotes);

  localStorage.setItem(
    "wishlistNotes",
    JSON.stringify(updatedNotes)
  );
};

const scrollLeft = () => {
  carouselRef.current.scrollBy({
    left: -300,
    behavior: "smooth"
  });
};

const scrollRight = () => {
  carouselRef.current.scrollBy({
    left: 300,
    behavior: "smooth"
  });
};


  const addToCart = (product, event) => {

  const existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  existingCart.push({
    ...product,
    quantity: 1
  });

  localStorage.setItem(
    "cart",
    JSON.stringify(existingCart)
  );

  window.dispatchEvent(new Event("cartUpdated"));
  toast.success("Added to cart");

  /* FLYING ANIMATION */

  const productCard =
  event.currentTarget.closest("[data-product-card]");

const productImage =
  productCard.querySelector("img");

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
    flyingImage.style.width = "160px";
    flyingImage.style.height = "160px";
    flyingImage.style.zIndex = "9999";
    flyingImage.style.transition =
      "all 1.5s cubic-bezier(0.25,1,0.5,1)";
    flyingImage.style.borderRadius = "16px";
    flyingImage.style.boxShadow =
      "0 10px 25px rgba(0,0,0,0.18)";

    document.body.appendChild(flyingImage);

    setTimeout(() => {
      flyingImage.style.left = `${cartRect.left}px`;
      flyingImage.style.top = `${cartRect.top}px`;
      flyingImage.style.width = "40px";
      flyingImage.style.height = "40px";
      flyingImage.style.opacity = "0.2";
      flyingImage.style.transform = "scale(0.3)";
    }, 50);

    setTimeout(() => {
      document.body.removeChild(flyingImage);
    }, 1600);
  }
};

  return (
    <div
  style={{
    padding: "20px",
    width: "100%",
    maxWidth: "1760px",
    margin: "0 auto",
  }}
>
    <div
  style={{
    textAlign: "center",
    marginTop: "5px",
    marginBottom: "50px"
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "14px",
      marginBottom: "14px"
    }}
  >
    <h1
  style={{
    fontSize: "56px",
    color: "#234d2c",
    margin: 0,
    fontFamily: "Georgia, serif",
  }}
>
      Wishlist
    </h1>

    <FiHeart
      style={{
        fontSize: "42px",
        color: "#234d2c",
        strokeWidth: 2.1
      }}
    />
  </div>

  <p
    style={{
      fontSize: "24px",
      color: "#5c5c5c",
      marginTop: "8px",
      marginBottom: "0px",
      fontWeight: "400",
      letterSpacing: "1px",
      fontFamily: "Helvetica, sans-serif",
      textAlign: "center"
    }}
  >
    Your Curated Wellness Favorites
  </p>
</div>

      {wishlist.length === 0 ? (
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
    padding: "40px 20px"
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "30px",
      padding: "60px 50px",
      textAlign: "center",
      maxWidth: "700px",
      width: "100%",
      boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
    }}
  >
    <div
      style={{
        width: "120px",
        height: "120px",
        margin: "0 auto 30px auto",
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#eef7f0,#dceee2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "55px",
        boxShadow:
          "0 10px 25px rgba(31,77,46,0.12)"
      }}
    >
      🤍
    </div>

    <h2
      style={{
        color: "#1f4d2e",
        fontSize: "48px",
        marginBottom: "18px",
        fontWeight: "700"
      }}
    >
      Your Wishlist is Empty
    </h2>

    <p
      style={{
        color: "#666",
        fontSize: "19px",
        lineHeight: "1.9",
        maxWidth: "520px",
        margin: "0 auto"
      }}
    >
      Save your favorite herbal wellness
      products and build your personal
      collection for a healthier lifestyle.
    </p>

    <button
      onClick={() => navigate("/shop")}
      style={{
        marginTop: "40px",
        padding: "18px 40px",
        border: "none",
        borderRadius: "16px",
        background:
          "linear-gradient(90deg,#1f4d2e,#2f6b42)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "17px",
        fontWeight: "600",
        boxShadow:
          "0 10px 25px rgba(31,77,46,0.25)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform =
          "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform =
          "translateY(0)";
      }}
    >
      Explore Products →
    </button>
  </div>
</div>
      ) : (
        wishlist.map((item) => {

const fullProduct =
  products.find(
    (p) => p._id === item._id
  ) || item;

  const currentStock =
  fullProduct.stock ?? item.stock ?? 0;

  
  const productDescription =

item.name === "Moringa Powder"
  ? "Supports daily wellness, energy, immunity, and healthy living naturally."

: item.name === "Beetroot Powder"
  ? "Boosts stamina naturally and supports energy with antioxidant-rich nutrition."

: item.name === "Amla Powder"
  ? "Supports immunity, digestion, and natural vitality for everyday wellness."

: item.name === "Neem Powder"
  ? "Naturally cleanses skin and supports holistic herbal wellness and care."

: item.name === "Multani Mitti"
  ? "Deeply cleanses oily skin and reveals a fresh natural healthy glow."

: item.name === "Orange Peel Powder"
  ? "Brightens skin naturally, reduces tanning, and restores a fresh healthy glow."

: item.name === "Rose Powder"
  ? "Refreshes and soothes skin naturally for a soft radiant healthy appearance."

: item.name === "Mix Face Pack"
  ? "Cleanses, nourishes, and revives skin naturally for a radiant glowing look."

: item.name === "Detox Powder"
  ? "Supports natural body cleansing and promotes balanced daily wellness naturally."

: item.name === "Chia Seeds"
  ? "Rich in fiber and omega-3 for energy and healthy daily nutrition."

: item.name === "Pumpkin Seeds"
  ? "Protein-rich crunchy seeds that support wellness and healthy everyday snacking."

: item.name === "Flax Seeds"
  ? "Loaded with fiber and nutrients for balanced healthy lifestyle support."

: item.name === "Sunflower Seeds"
  ? "Nutrient-packed healthy seeds perfect for mindful daily snacking and wellness."

: item.name === "Seed Mix"
  ? "Balanced super seed blend for nutrition, wellness, and natural daily energy."

: item.name === "Chamomile Infusion"
  ? "Calms the mind naturally and promotes relaxation with soothing herbal goodness."

: item.name === "Rose Infusion"
  ? "Refreshing floral infusion that uplifts senses and promotes natural calmness."

: item.name === "Moringa Hibiscus Blend"
  ? "Antioxidant-rich herbal blend that supports vitality and overall natural wellness."

: item.name === "Tulsi Wellness Blend"
  ? "Supports daily immunity naturally with refreshing traditional herbal wellness goodness."

: item.name === "Ginger Lemongrass Infusion"
  ? "Energizes the body naturally with refreshing citrus and warming ginger flavors."

: item.name === "Kashmiri Kahwa"
  ? "Traditional aromatic wellness brew offering warmth, comfort, and rich natural flavors."

: item.name === "Orange Cinnamon Infusion"
  ? "Refreshing citrus-spice infusion crafted for warmth and soothing wellness moments."

: item.name === "Masala Wellness Blend"
  ? "Traditional spice infusion delivering warmth, comfort, and wellness in every sip."

: item.name === "Premium California Almonds"
  ? "Premium almonds packed with healthy energy and wholesome natural nutrition daily."

: item.name === "Royal Whole Cashews"
  ? "Rich crunchy cashews offering satisfying taste and nourishing healthy snacking goodness."

: item.name === "Premium Walnut Kernels"
  ? "Nutritious walnut kernels rich in healthy fats and wellness-supporting daily nutrition."

: item.name === "Sun-Dried Raisins"
  ? "Naturally sweet raisins packed with energy and wholesome healthy daily nutrition."

: item.name === "Black Pearl Raisins"
  ? "Rich flavorful black raisins offering natural energy and mindful healthy snacking."

: item.name === "Royal Medjool Dates"
  ? "Soft naturally sweet dates providing luxurious taste and instant natural energy."

: item.name === "EarthKind Power Trail Mix"
  ? "Premium trail mix crafted for active lifestyles with healthy delicious nutrition."

: item.name === "Super Seed Nut Fusion"
  ? "Balanced fusion of seeds and nuts supporting wellness and modern healthy living."

: "Premium natural wellness product crafted for mindful nutrition and healthy living."
return (
  <div
    data-product-card
    key={item._id}
    onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-4px)";
  e.currentTarget.style.boxShadow =
    "0 12px 30px rgba(0,0,0,0.08)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0)";
  e.currentTarget.style.boxShadow =
    "0 8px 25px rgba(0,0,0,0.05)";
}}
    style={{
  display: "flex",
  gap: "25px",

  background: "rgba(255,255,255,0.75)",

  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.35)",

  borderRadius: "24px",

  padding: "28px",

  marginTop: "30px",

  boxShadow:
    "0 12px 35px rgba(0,0,0,0.06)",

  overflow: "visible",

  position: "relative",

  transition: "0.35s ease",

  zIndex:
    showNoteBox === item._id
      ? 999
      : 1
}}
  >

    {/* IMAGE */}
    <div
      style={{
        width: "180px",
        height: "180px",
        background: "#f9f9f9",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <img
        src={item.image}
        
        onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "scale(1.08)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "scale(1)";
}}
       style={{
  width: "140px",
  height: "140px",
  objectFit: "contain",

  transition: "0.35s ease",

  cursor: "pointer"
}}
      />
    </div>

   {/* CONTENT */}
<div
  style={{
    flex: 1,
    position: "relative"
  }}
>
      <h2
  onClick={() =>
    navigate("/product-details", {
      state: { product: fullProduct }
    })
  }
      >
        {item.name}
        <div
  style={{
  position: "absolute",
  top: "0",
  right: "0",

  display: "flex",
  alignItems: "center",
  gap: "8px",

  padding: "8px 16px",

  borderRadius: "999px",

  fontSize: "13px",

  fontWeight: "700",

  background:
  currentStock === 0
    ? "linear-gradient(135deg,#fff5f5,#ffe8e8)"
    : currentStock <= 5
      ? "linear-gradient(135deg,#fff8ec,#fff0d6)"
      : "linear-gradient(135deg,#eefbf2,#dff6e8)",

  border:
    fullProduct.stock=== 0
      ? "1px solid rgba(220,38,38,0.12)"
      : currentStock <= 5
      ? "1px solid rgba(234,88,12,0.12)"
      : "1px solid rgba(22,101,52,0.10)",

  boxShadow:
    "0 4px 14px rgba(0,0,0,0.04)",

  color:
  currentStock === 0
    ? "#dc2626"
    : currentStock <= 5
      ? "#ea580c"
      : "#166534"
}}
>
 {currentStock === 0
  ? "◎ Restocking Soon"
  : currentStock <= 5
  ? "◈ Limited Batch"
  : "✦ Freshly Available"}
</div>
      </h2>

     <p
  style={{
    color: "#666",
    lineHeight: "1.7",
    marginBottom: "15px"
  }}
>
 {productDescription}
 


</p>

      <h3
        style={{
          color: "#1f4d2e",
          marginBottom: "20px"
        }}
      >
        <div
  style={{
    color: "#f5a623",
    marginBottom: "10px",
    fontSize: "18px",
    letterSpacing: "2px"
  }}
>
  ★★★★★
</div>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  }}
>
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      background:
        "linear-gradient(135deg,#eef8ef,#dff0df)",
      color: "#1f4d2e",
      padding: "6px 14px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: "700",
      border:
        "1px solid rgba(31,77,46,0.08)"
    }}
  >
    {item.weight || "Default Weight"}
  </div>

  <span
    style={{
      color: "#1f4d2e",
      fontSize: "32px",
      fontWeight: "700"
    }}
  >
    ₹{item.price}
  </span>
</div>
      </h3>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >

        {/* ADD TO CART */}
       <button
  disabled={currentStock === 0}
  onClick={(e) => addToCart(item,e)}
          onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-4px)";
  e.currentTarget.style.boxShadow =
    "0 12px 30px rgba(0,0,0,0.08)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0)";
  e.currentTarget.style.boxShadow =
    "0 8px 25px rgba(0,0,0,0.05)";
}}
        style={{
  ...actionButton,

  background:
    currentStock === 0
      ? "#d1d5db"
      : "linear-gradient(90deg,#1f4d2e,#2e5f3e)",

  cursor:
    currentStock === 0
      ? "not-allowed"
      : "pointer",

  opacity:
    currentStock === 0
      ? 0.7
      : 1
}}
        >
         <FiShoppingCart />

{currentStock === 0
  ? "Out Of Stock"
  : "Add to Cart"}
        </button>

        {/* NOTE */}
       <div style={{ position: "relative" }}>

  
    <button
  onClick={() =>
    setShowNoteBox(
      showNoteBox === item._id
        ? null
        : item._id
    )
  }
  style={{
    ...secondaryButton,
    background: notes[item._id]
      ? "#edf7ed"
      : "#fff",
    border: notes[item._id]
      ? "1px solid #b7dfb9"
      : "1px solid #ddd",
    color: notes[item._id]
      ? "#1f4d2e"
      : "#333",
    fontWeight: "600"
  }}
>
  <FaStickyNote />

  {notes[item._id]
    ? "View Note"
    : "Add Note"}
</button>
  {showNoteBox === item._id && (
    <div
      style={{
        position: "absolute",
        top: "55px",
        left: 0,
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.12)",
        zIndex:9999 
      }}
    >
      <textarea
        autoFocus
        placeholder="Write note..."
        value={notes[item._id] || ""}
        onChange={(e) =>
  saveNote(item._id, e.target.value)
}

onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    setShowNoteBox(null);
  }
}}
        style={{
          width: "220px",
          height: "90px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          resize: "none",
          outline: "none"
        }}
      />
    </div>
    
  )}
</div>


        {/* SHARE */}
        <button
         onClick={() => {
  if (navigator.share) {
    navigator.share({
      title: item.name,
      text: `${item.name} - ₹${item.price}`,
      url: window.location.origin + "/shop"
    });
  } else {
    alert("Sharing not supported");
  }
}}
          style={secondaryButton}
        >
          <FiShare2 />
        </button>

        {/* REMOVE */}
        <button
  onClick={(e) => {

    e.currentTarget.innerHTML = "💔";

    e.currentTarget.style.transform =
      "scale(1.3)";

    setTimeout(() => {
      removeFromWishlist(item._id);
    }, 250);
  }}
          style={removeButton}
        >
          <FiTrash2 />
        </button>

      </div>
    </div>
  </div>
);
        })
  )}

  <div style={{ marginTop: "70px" }}>

  <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "15px"
  }}
>
  <div>
    <div
      style={{
       
        marginBottom: "6px"
      }}
    >
      <p
  className="section-subtitle"
  style={{
    marginBottom: "12px"
  }}
>
  Community Favorites
</p>
      

      <h2 className="section-title">
  Customers Also Loved
</h2>
    </div>

   <p
  style={{
    marginTop: "10px",

    color: "#6b7280",

    fontSize: "18px",

    lineHeight: "1.8",

    letterSpacing: "0.3px",

    
  }}
>
  Handpicked wellness favorites loved by our community
</p>
  </div>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  }}
>
  <button
    onClick={scrollLeft}
    style={arrowButton}
  >
    <FiChevronLeft />
  </button>

  <button
    onClick={scrollRight}
    style={arrowButton}
  >
    <FiChevronRight />
  </button>
</div>

  <div
  ref={carouselRef}
  style={{
    display: "flex",
      gap: "20px",
      overflow: "hidden",
      paddingBottom: "10px"
    }}
  >
  {products.slice(0, 8).map((product) => (

  <div
    data-product-card
    key={product._id}

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
              ] || product.price
          }
        }
      })
    }

    style={{
      minWidth: "280px",
      maxWidth: "280px",
      border: "1px solid #ddd",
      borderRadius: "18px",
      padding: "20px",
      background: "#fff",
      textAlign: "center",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      boxShadow:
        "0 5px 15px rgba(0,0,0,0.05)",
      transition: "0.35s ease"
    }}

    onMouseEnter={(e) => {

      e.currentTarget.style.transform =
        "translateY(-5px)";

      e.currentTarget.style.boxShadow =
        "0 14px 28px rgba(0,0,0,0.08)";
    }}

    onMouseLeave={(e) => {

      e.currentTarget.style.transform =
        "translateY(0px)";

      e.currentTarget.style.boxShadow =
        "0 5px 15px rgba(0,0,0,0.05)";
    }}
  >

    {/* IMAGE */}
    <img
      src={product.image}
      alt={product.name}

      style={{
        width: "100%",
        height: "250px",
        objectFit: "contain",
        backgroundColor: "#f9f9f9",
        padding: "10px",
        borderRadius: "12px",
        marginBottom: "15px"
      }}
    />

    {/* TOP BAR */}
   <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "18px",
    minHeight: "36px"
  }}
>

      {/* WEIGHT */}
      <select
      onClick={(e) => e.stopPropagation()}

        value={
          selectedWeights[product._id] ||

          productWeights[product.name]?.[0] ||

          ""
        }

        onChange={(e) => {

          e.stopPropagation();

          setSelectedWeights({
            ...selectedWeights,

            [product._id]:
              e.target.value
          });
        }}

       style={{
  width: "78px",
  minWidth: "78px",
  height: "30px",

  padding: "0 10px",

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

     <div
 style={{
  height: "30px",

  minWidth: "128px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  padding: "0 14px",

  borderRadius: "999px",

  whiteSpace: "nowrap",

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
    </div>

    {/* PRODUCT NAME */}
    <h3
      style={{
  color: "#234d2c",
  marginTop: "0px",
  minHeight: "56px",
  lineHeight: "1.35",
  fontSize: "20px",
  fontWeight: "700",
  textAlign: "center",
justifyContent: "center",
  display: "flex",
  alignItems: "flex-start"
}}
    >
      {product.name}
    </h3>
    

    {/* PRICE */}
    <p
      style={{
        fontSize: "25px",
        fontWeight: "700",
        color: "#66a473",
        marginBottom: "8px",
        textAlign: "center"
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

    {/* CATEGORY */}
    <p
      style={{
        color: "#666",
        marginBottom: "18px",
        fontSize: "15px",
        textAlign: "center"
      }}
    >
      {product.category}
    </p>

    {/* VIEW DETAILS */}
    <button
      onClick={(e) => {

        e.stopPropagation();

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
                ] || product.price
            }
          }
        });
      }}

      style={{
        width: "100%",
        padding: "10px",
        background: "#fff",
        color: "#2d5a27",
        border: "2px solid #2d5a27",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "12px",
        fontWeight: "bold",
        transition: "all 0.35s ease"
      }}
    >
      View Details
    </button>

    {/* ADD TO CART */}
   <button
  disabled={product.stock === 0}
  onClick={(e) => {
        e.stopPropagation();

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
        );
      }}

     style={{
  marginTop: "auto",

  background:
    product.stock === 0
      ? "#d1d5db"
      : "#1f4d2e",

  color: "#fff",

  border:
    product.stock === 0
      ? "2px solid #d1d5db"
      : "2px solid #1f4d2e",

  padding: "12px 18px",

  borderRadius: "10px",

  cursor:
    product.stock === 0
      ? "not-allowed"
      : "pointer",

  opacity:
    product.stock === 0
      ? 0.75
      : 1,

  fontWeight: "600",

  transition: "0.3s ease"
}}

      onMouseEnter={(e) => {

        e.currentTarget.style.background =
          "#fff";

        e.currentTarget.style.color =
          "#1f4d2e";
      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.background =
          "#1f4d2e";

        e.currentTarget.style.color =
          "#fff";
      }}
    >
     {product.stock === 0
  ? "Out Of Stock"
  : "Add to Cart"}
    </button>

  </div>
))}
    
  </div>
</div>
    </div>
  );
}
const actionButton = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  background:
    "linear-gradient(90deg,#1f4d2e,#2e5f3e)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600"
};

const secondaryButton = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontWeight: "500"
};

const removeButton = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 15px",
  borderRadius: "10px",
  border: "1px solid #ffdddd",
  background: "#fff5f5",
  color: "#c0392b",
  cursor: "pointer"
};
const arrowButton = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  border: "none",
  background:
    "linear-gradient(90deg,#1f4d2e,#2e5f3e)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "22px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow:
    "0 5px 15px rgba(0,0,0,0.15)"
};
export default Wishlist;