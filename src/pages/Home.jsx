import axios from "axios";
import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../components/home/categoryData";
import CategoryCard from "../components/home/CategoryCard";
import AnimatedProducts from "../components/home/AnimatedProducts";
import hero2 from "../assets/Hero/hero2.png";
import hero3 from "../assets/Hero/hero3.png";
import hero1 from "../assets/Hero/hero1.png";

function Home() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const heroSlides = [
  hero1,
  hero2,
  hero3
];

const [currentHero, setCurrentHero] = useState(0);


  const [activeCategory, setActiveCategory] =
useState(null);
const [transitioning, setTransitioning] =
useState(false);

useEffect(() => {

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/products`)

    .then((res) => {
      setProducts(res.data);
    })

    .catch((err) => {
      console.log(err);
    });

}, []);

useEffect(() => {

  const interval = setInterval(() => {

    setCurrentHero((prev) =>
      prev === heroSlides.length - 1
        ? 0
        : prev + 1
    );

  }, 5500);

  return () => clearInterval(interval);

}, []);
  return (

  <div>

   {/* HERO SECTION */}
<div
  style={{
    background: "#f1ede4",

    position: "relative",

    overflow: "hidden",

    borderRadius: "28px",

   padding: "0px",
height: "530px",
display: "flex",
alignItems: "center",
justifyContent: "center",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.04)",

    opacity: 1,

    animation: "heroFade 1.8s ease"
  }}
>

  {/* HERO IMAGE LAYER */}
  {(
    <>
      <img
        src={heroSlides[currentHero]}
        alt="Hero Banner"
        style={{
          position: "absolute",

          top: 0,

          left: 0,

          width: "100%",

          height: "100%",

          objectFit: "cover",

          objectPosition: "center",

          zIndex: 0,

          transition:
            "opacity 1.8s ease-in-out"
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",

          inset: 0,

         background:
  currentHero === 0
    ? "rgba(255,255,255,0.45)"
    : "rgba(0,0,0,0.18)",

          zIndex: 1
        }}
      />
    </>
  )}

  {/* HERO CONTENT */}
<div
  style={{
  position: "relative",
  zIndex: 2,
  width: "100%",
  padding: "80px 40px",
  boxSizing: "border-box"
  }}
>

  {/* SHOW TEXT ONLY ON FIRST HERO */}
  {currentHero === 0 && (
    <>
      <h1
        style={{
          color: "#234d2c",

          fontSize:
  window.innerWidth <= 768
    ? "36px"
    : "58px",

          fontWeight: "500",

          marginBottom: "25px",

          lineHeight: "1.2",

          fontFamily: "Georgia, serif",

          textAlign: "center"
        }}
      >
        Pure Nature, Pure Wellness 🌿
      </h1>

      <p
        style={{
          fontSize:
  window.innerWidth <= 768
    ? "16px"
    : "22px",

          color: "#555",

          maxWidth: "900px",

          margin: "0 auto",

          lineHeight: "1.8",

          fontWeight: "400",

          fontFamily: "Arial, sans-serif",

          textAlign: "center"
        }}
      >
        Premium Herbal Products for Skin Care,
        Wellness, and Natural Living.
        Trusted by customers who believe in
        nature-powered beauty and health.
      </p>
    </>
  )}

  {/* BUTTON FOR ALL HERO SLIDES */}
  <div
    style={{
      textAlign: "center",

      marginTop:
  currentHero === 0
    ? "0px"
    : window.innerWidth <= 768
      ? "120px"
      : "220px"
    }}
  >
    <button
      className="explore-btn"
      onClick={() => navigate("/shop")}
      style={{
        position: "relative",

        marginTop: "45px",

        padding: "20px 54px",

        background:
          "linear-gradient(135deg,#1f4d2e,#163923,#234d2c)",

        color: "#fff",

        border:
          "1px solid rgba(255,255,255,0.08)",

        borderRadius: "18px",

        cursor: "pointer",

        fontSize: "18px",

        fontWeight: "600",

        overflow: "hidden",

        letterSpacing: "0.5px",

        transition: "0.4s ease",

        boxShadow:
          "0 12px 30px rgba(31,77,46,0.28)"
      }}
    >
      <>
        <span
          style={{
            position: "relative",
            zIndex: 3
          }}
        >
          Explore Products
        </span>

        <span className="explore-shine" />
      </>
    </button>
    
  </div>
{/* PREMIUM SLIDER DOTS */}
<div
  style={{
    position: "absolute",
    bottom: "22px",
    left: "50%",
    transform: "translateX(-50%)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: "14px",

    zIndex: 10
  }}
>
  {heroSlides.map((_, index) => {

    const isActive = currentHero === index;

    return (
      <div
        key={index}
        style={{
          width: isActive ? "18px" : "15px",

          height: isActive ? "18px" : "15px",

          borderRadius: "50%",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          transition: "all 0.45s ease",

          background: isActive
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.08)",

          border: isActive
            ? "2px solid #ffffff"
            : "2px solid rgba(255,255,255,0.55)",

          backdropFilter: "blur(8px)",

          boxShadow: isActive
            ? "0 0 14px rgba(255,255,255,0.35)"
            : "0 0 8px rgba(0,0,0,0.18)"
        }}
      >
        <div
          style={{
            width: isActive ? "7px" : "5px",

            height: isActive ? "7px" : "5px",

            borderRadius: "50%",

            background: isActive
              ? "#ffffff"
              : "rgba(255,255,255,0.75)",

            transition: "all 0.45s ease"
          }}
        />
      </div>
    );
  })}
</div>
</div>
</div>
    
   {/* GAP */}
<div
  style={{
    height: "15px",
    display: "flex",
    alignItems: "center"
  }}
/>
    {/* PREMIUM FLOWING TAGLINE STRIP */}
<div
  style={{
    width: "100%",
    overflow: "hidden",
    background: "#edf3ef",
    borderTop: "1px solid rgba(35,77,44,0.08)",
    borderBottom: "1px solid rgba(35,77,44,0.08)",
    padding: "0px",
height: "80px",
display: "flex",
alignItems: "center",
    position: "relative"
  }}
>
  <div
    className="marquee-text"
    style={{
      display: "flex",
      gap: "70px",
      whiteSpace: "nowrap",
      width: "max-content",
      alignItems: "center"
    }}
  >
    {[
      "100% Natural Ingredients 🌿",
      "Chemical Free Wellness ✨",
      "Premium Herbal Care 🍃",
      "Nature Powered Beauty 🌱",
      "Pure Ayurveda Formula 🌼",
      "Trusted By Wellness Lovers 💚",
      "Eco Friendly Products ♻️",
      "Ancient Herbs, Modern Care 🌿"
    ].map((text, index) => (
      <span
        key={index}
        style={{
          fontSize: "32px",
          color: "#234d2c",
          fontWeight: "500",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.5px"
        }}
      >
        {text}
      </span>
    ))}
  </div>
</div>

    {/* CATEGORY SECTION */}
    <div
      style={{
        
        marginTop:"15PX",

        borderRadius: "28px",

        padding:
  window.innerWidth <= 768
    ? "40px 20px"
    : "80px 40px",

        boxShadow:
          "0 8px 20px rgba(0,0,0,0.04)"
      }}
    >

      <h2
        style={{
          color: "#234d2c",
          fontSize: "46px",
          marginBottom: "60px",
          textAlign: "center",
          fontFamily: "Georgia, serif"
        }}
      >
        Discover Wellness Categories ✨
      </h2>

      <div
  style={{
    minHeight: "420px",

    position: "relative"
  }}
>
{!activeCategory ? (

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
  window.innerWidth <= 768
    ? "1fr 1fr"
    : "repeat(2, minmax(0, 1fr))",

gap:
  window.innerWidth <= 768
    ? "16px"
    : "40px",
      maxWidth: "1000px",
      margin: "0 auto"
    }}
  >

    {categories.map((category) => (

      <CategoryCard

        key={category.id}

        category={category}

        active={
          activeCategory?.id === category.id
        }

        onClick={() => {

          setActiveCategory(category);

        }}
      />

    ))}

  </div>

) : (

  <AnimatedProducts
    products={
  products.filter(
    (item) =>
      item.category === activeCategory.title
  )
}
    title={activeCategory.title}

    onBack={() =>
      setActiveCategory(null)
    }

    onViewAll={() => {

      navigate("/shop", {
        state: {
          selectedCategory:
            activeCategory.title
        }
      });

    }}
  />

)}
</div>

    </div>
    

  </div>
);
}

export default Home;