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
        padding: "10px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
    <div
  style={{
    textAlign: "center",
    marginTop: "5px",
    marginBottom: "55px"
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
        fontWeight: "500",
        letterSpacing: "-2px",
        lineHeight: "1"
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
      background: "#fff",
      borderRadius: "18px",
      padding: "25px",
      marginTop: "25px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
      border: "1px solid #eee",
      overflow: "visible",
      position: "relative",
zIndex:
  showNoteBox === item._id
    ? 999
    : 1,
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
        alt={item.name}
        style={{
          width: "140px",
          height: "140px",
          objectFit: "contain"
        }}
      />
    </div>

    {/* CONTENT */}
    <div style={{ flex: 1 }}>

      <h2
  onClick={() =>
    navigate("/product-details", {
      state: { product: fullProduct }
    })
  }
      >
        {item.name}
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
        ₹{item.price}
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
          style={actionButton}
        >
          <FiShoppingCart />
          Add to Cart
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

  <h2
    style={{
      color: "#234d2c",
      marginBottom: "25px",
      fontSize: "32px"
    }}
  >
    🌿 Customers also loved
  </h2>

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
      state: { product:product }
    })
  }
        style={{
          minWidth: "220px",
          background: "#fff",
          borderRadius: "18px",
          padding: "20px",
          boxShadow:
            "0 5px 15px rgba(0,0,0,0.05)"
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "contain"
          }}
        />

        <h3
          style={{
            color: "#234d2c",
            marginTop: "15px"
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: "#666",
            marginTop: "8px"
          }}
        >
          ₹{product.price}
        </p>

        <button
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product, e);
  }}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(90deg,#1f4d2e,#2e5f3e)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Add to Cart
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