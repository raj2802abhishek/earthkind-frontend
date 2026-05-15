import React, { useState } from "react";
import { useLocation } from "react-router-dom";


function ProductDetails() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Product not found</h2>;
  }

  const productImage =
  product.image ||
  "https://via.placeholder.com/500";


      const productDescription =
      
   
  product.name === "Moringa Powder"
    ? "Crafted from premium naturally dried moringa leaves, this nutrient-rich superfood powder supports daily wellness, energy, immunity, and a healthy lifestyle with every serving."

  : product.name === "Beetroot Powder"
    ? "A vibrant natural superfood packed with essential nutrients and antioxidants that helps support stamina, energy, and overall wellness in your daily routine."

  : product.name === "Amla Powder"
    ? "Made from carefully selected Indian gooseberries, this traditional wellness powder supports immunity, digestion, and natural vitality for everyday health."

  : product.name === "Neem Powder"
    ? "Pure herbal neem powder traditionally valued for its natural cleansing and wellness-supporting properties for healthy skin and holistic care."

  : product.name === "Multani Mitti"
    ? "A natural skincare essential known for deeply cleansing the skin, removing excess oil, and helping reveal a fresh, healthy-looking natural glow."

  : product.name === "Orange Peel Powder"
    ? "Prepared from naturally dried orange peels, this refreshing beauty powder helps brighten the skin and supports a radiant, healthy appearance."

  : product.name === "Rose Powder"
    ? "A luxurious botanical beauty powder crafted from premium rose petals to refresh, soothe, and enhance your natural skincare routine."

  : product.name === "Mix Face Pack"
    ? "A carefully blended herbal face pack enriched with natural ingredients that help cleanse, nourish, and revive the skin for a radiant glow."

  : product.name === "Detox Powder"
    ? "A wellness-focused herbal blend designed to support natural cleansing, refresh the body, and promote a balanced healthy lifestyle."

  : product.name === "Chia Seeds"
    ? "Naturally rich in fiber, omega-3, and plant-based nutrition, these super seeds are perfect for supporting energy, wellness, and daily nutrition."

  : product.name === "Pumpkin Seeds"
    ? "Crunchy and nutrient-rich seeds packed with natural protein, minerals, and wellness benefits for healthy everyday snacking."

  : product.name === "Flax Seeds"
    ? "Premium flax seeds loaded with fiber and essential nutrients that support balanced nutrition and a healthy modern lifestyle."

  : product.name === "Sunflower Seeds"
    ? "Wholesome sunflower seeds packed with nutrients and natural goodness, ideal for healthy snacking and daily nutrition support."

  : product.name === "Seed Mix"
    ? "A powerful blend of premium super seeds carefully combined to deliver balanced nutrition, wellness support, and healthy daily energy."

  : product.name === "Chamomile Infusion"
    ? "A soothing herbal infusion crafted to help relax the mind, calm the senses, and create peaceful wellness moments in your daily routine."

  : product.name === "Rose Infusion"
    ? "A delicate floral herbal infusion with a refreshing aroma designed to uplift the senses and bring calmness to your wellness lifestyle."

  : product.name === "Moringa Hibiscus Blend"
    ? "An antioxidant-rich wellness blend combining botanical ingredients traditionally valued for supporting vitality, wellness, and natural balance."

  : product.name === "Tulsi Wellness Blend"
    ? "Inspired by traditional wellness practices, this herbal infusion supports daily immunity and delivers a naturally refreshing experience."

  : product.name === "Ginger Lemongrass Infusion"
    ? "A refreshing herbal blend with warming ginger and citrusy lemongrass crafted to energize the body and refresh the senses naturally."

  : product.name === "Kashmiri Kahwa"
    ? "A luxurious traditional Kashmiri wellness brew infused with aromatic spices and premium ingredients for a rich and comforting experience."

  : product.name === "Orange Cinnamon Infusion"
    ? "A warming citrus-spice infusion crafted with refreshing orange notes and comforting cinnamon flavors for a soothing wellness experience."

  : product.name === "Masala Wellness Blend"
    ? "A rich traditional spice infusion inspired by timeless Indian flavors, crafted to deliver warmth, comfort, and daily wellness in every sip."

  : product.name === "Premium California Almonds"
    ? "Carefully selected premium almonds packed with natural nutrition, healthy energy, and wholesome goodness for smart everyday snacking."

  : product.name === "Royal Whole Cashews"
    ? "Premium quality whole cashews offering a rich taste, satisfying crunch, and naturally nourishing snacking experience."

  : product.name === "Premium Walnut Kernels"
    ? "Naturally nutritious walnut kernels valued for their rich texture, healthy fats, and wellness-supporting everyday nutrition."

  : product.name === "Sun-Dried Raisins"
    ? "Naturally sweet and carefully sun-dried raisins packed with energy, flavor, and wholesome nutrition for healthy daily enjoyment."

  : product.name === "Black Pearl Raisins"
    ? "Premium black raisins known for their rich taste and naturally energizing goodness, perfect for mindful healthy snacking."

  : product.name === "Royal Medjool Dates"
    ? "Soft, naturally sweet premium dates crafted for luxurious healthy indulgence and everyday natural energy."

  : product.name === "EarthKind Power Trail Mix"
    ? "A premium blend of nuts, seeds, and naturally sweet ingredients crafted to fuel active lifestyles with delicious healthy nutrition."

  : product.name === "Super Seed Nut Fusion"
    ? "An expertly balanced fusion of premium seeds and crunchy nuts designed to support wellness, nutrition, and healthy modern living."

  : "Premium natural wellness product thoughtfully crafted to support healthy living, mindful nutrition, and everyday wellness."


   const addToCart = () => {
  const existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  existingCart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(existingCart)
  );

  window.dispatchEvent(new Event("cartUpdated"));

  alert(`${product.name} added to cart 🛒`);
};

  return (
    <div
      style={{
        padding: "50px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "60px",
          flexWrap: "wrap",
          marginTop: "40px"
        }}
      >
        {/* LEFT SIDE IMAGE */}
        <div
          style={{
            flex: 1,
            minWidth: "320px",
            textAlign: "center"
          }}
        >
          <img
            src={productImage}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "380px",
              borderRadius: "20px",
              background: "#f9f9f9",
              padding: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
            }}
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div
          style={{
            flex: 1,
            minWidth: "320px"
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              color: "#234d2c",
              fontFamily: "Georgia, serif",
              marginBottom: "15px"
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#666",
              marginBottom: "20px"
            }}
          >
            {product.category}
          </p>

          <h2
            style={{
              color: "#1f4d2e",
              marginBottom: "25px"
            }}
          >
            ₹{product.price}
          </h2>

          <p
            style={{
              lineHeight: "1.8",
              fontSize: "18px",
              color: "#555",
              marginBottom: "30px"
            }}
          >
            {productDescription}
          </p>
          

           <div style={{ marginTop: "35px" }}>
  <h3
    style={{
      color: "#234d2c",
      marginBottom: "20px",
      fontFamily: "Georgia, serif",
      fontSize: "30px"
    }}
  >
    Key Benefits
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px"
    }}
  >
    <div
      style={{
        background: "#f8f5ef",
        padding: "18px",
        borderRadius: "14px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#234d2c",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
      }}
    >
      🌿 100% Natural
    </div>

    <div
      style={{
        background: "#f8f5ef",
        padding: "18px",
        borderRadius: "14px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#234d2c",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
      }}
    >
      🛡️ Chemicals Free
    </div>

    <div
      style={{
        background: "#f8f5ef",
        padding: "18px",
        borderRadius: "14px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#234d2c",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
      }}
    >
      ✨ Safe Daily Use
    </div>

    <div
      style={{
        background: "#f8f5ef",
        padding: "18px",
        borderRadius: "14px",
        fontSize: "16px",
        fontWeight: "500",
        color: "#234d2c",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
      }}
    >
      ⭐ Premium Quality
    </div>
  </div>
</div>

    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "45px",
    flexWrap: "wrap"
  }}
>
  <button
  onClick={addToCart}
  style={{
      width: "220px",
      height: "64px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      color: "#1f4d2e",
      border: "2px solid #1f4d2e",
      borderRadius: "14px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "600",
      transition: "0.3s ease"
    }}
  onMouseEnter={(e) => {
      e.target.style.background = "#1f4d2e";
      e.target.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "#fff";
      e.target.style.color = "#1f4d2e";
  }}
>
  Add to Cart
</button>
  <button
    style={{
      width: "220px",
      height: "64px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      color: "#1f4d2e",
      border: "2px solid #1f4d2e",
      borderRadius: "14px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "600",
      transition: "0.3s ease"
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "#1f4d2e";
      e.target.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "#fff";
      e.target.style.color = "#1f4d2e";
    }}
  >
    Buy Now
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

