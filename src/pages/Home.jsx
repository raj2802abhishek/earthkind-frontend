import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { categories } from "../components/home/categoryData";
import CategoryCard from "../components/home/CategoryCard";
import AnimatedProducts from "../components/home/AnimatedProducts";

import hero1 from "../assets/Hero/hero1.png";
import hero2 from "../assets/Hero/hero2.png";
import hero3 from "../assets/Hero/hero3.png";
import brandStoryImage from "../assets/home/brand-story.png";
import aboutSectionImage from "../assets/home/about-section.png";
import {
  Leaf,
  Sprout,
  Nut,
  CupSoda,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentHero, setCurrentHero] = useState(0);

  const heroSlides = [hero1, hero2, hero3];

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1440;

  const isDesktop = viewportWidth >= 1200;
  const isMedium = viewportWidth >= 900;

  const pageShellStyle = {
    maxWidth: "1760px",
    margin: "0 auto",
    paddingLeft: "20px",
    paddingRight: "20px",
  };

  const sectionPadding = isDesktop ? "120px 0" : "84px 0";

  const featuredHighlights = [
    {
      title: "Pure Herbal Powders",
      text: "Carefully crafted blends designed for daily wellness and balanced living.",
    },
    {
      title: "Natural Seeds",
      text: "Premium seed collections made for mindful nutrition and everyday nourishment.",
    },
    {
      title: "Luxury Dry Fruits",
      text: "Rich, wholesome selections that bring natural taste and premium quality together.",
    },
    {
      title: "Herbal Tea Blends",
      text: "Soothing infusions inspired by traditional wellness and modern comfort.",
    },
  ];

  const wellnessPillars = [
    {
      title: "100% Natural",
      text: "Built around clean ingredients and nature-first wellness.",
    },
    {
      title: "Premium Quality",
      text: "Selected with care for a refined and trustworthy experience.",
    },
    {
      title: "Chemical Free",
      text: "Simple, honest products made with thoughtful purity.",
    },
    {
      title: "Everyday Wellness",
      text: "Designed to fit into modern routines with ease and consistency.",
    },
  ];

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
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5500);

    return () => clearInterval(interval);
  }, []);

 const categoryGridColumns =
  viewportWidth >= 1200
    ? "repeat(4, minmax(0, 1fr))"
    : "repeat(2, minmax(0, 1fr))";

  const storyGridColumns = isDesktop ? "0.92fr 1.08fr" : "1fr";

const featuredGridColumns =
  viewportWidth >= 768
    ? "repeat(2, minmax(0, 1fr))"
    : "1fr";

 const pillarGridColumns =
  viewportWidth >= 1200
    ? "repeat(4, minmax(0, 1fr))"
    : "repeat(2, minmax(0, 1fr))";

  const categoryIntroColumns = isDesktop ? "1.08fr 0.92fr" : "1fr";

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.img
          key={currentHero}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6 }}
          src={heroSlides[currentHero]}
          alt="Earthkind Naturals hero"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
            style={{
              color: "#d8ef7f",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            PURE • HERBAL • WELLNESS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hero-title"
          >
            Nature’s Luxury <br />
            For Everyday Wellness
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="hero-text"
          >
            Premium herbal powders, wellness blends, seeds, dry fruits, and
            natural essentials crafted to elevate healthy living through
            nature-powered care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
           <button
  className="earth-btn hero-shine-btn"
  onClick={() => navigate("/shop")}
>
  Explore Collection
</button>
          </motion.div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "14px",
            zIndex: 10,
          }}
        >
          {heroSlides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentHero(index)}
              style={{
                width: currentHero === index ? "36px" : "12px",
                height: "12px",
                borderRadius: "999px",
                background:
                  currentHero === index
                    ? "#d8ef7f"
                    : "rgba(255,255,255,0.5)",
                transition: "0.4s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee-wrapper">
        <div className="marquee-track">
          {[
            "100% Natural Ingredients 🌿",
            "Premium Herbal Wellness ✨",
            "Chemical Free Lifestyle 🍃",
            "Luxury Organic Care 🌱",
            "Nature Powered Nutrition 🌼",
            "Ancient Ayurveda • Modern Living",
          ].map((item, index) => (
            <div key={index} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      
     
     {/* BRAND STORY SECTION */}
<section
  className="section"
  id="wellness"
  style={{ padding: sectionPadding }}
>
  <div style={pageShellStyle}>
    <div
      style={{
        display: "grid",
       gridTemplateColumns: "1fr 1fr",
gap: isDesktop ? "84px" : "52px",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "760px" }}>
        <p className="section-subtitle">Herbal Excellence</p>

        <h2 className="section-title">
          A Premium Wellness Experience Rooted In Nature
        </h2>

        <p
          className="section-text"
          style={{
            marginTop: "26px",
            maxWidth: "700px",
          }}
        >
          Earthkind Naturals brings together traditional herbal wisdom,
          modern presentation, and premium quality selection. Every
          product is designed to feel refined, trustworthy, and naturally
          aligned with healthy living.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: featuredGridColumns,
            gap: "18px",
            marginTop: "34px",
          }}
        >
          {featuredHighlights.map((item, index) => (
            <motion.div
  key={index}
  whileHover={{
    y: -8,
    scale: 1.015,
  }}
  transition={{ duration: 0.35 }}
  className="product-card"
  style={{
    padding: "30px",
    minHeight: "220px",
    borderRadius: "30px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,246,241,0.98))",
    border: "1px solid rgba(35,77,44,0.05)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  {/* TOP GLOW */}
  <div
    style={{
      position: "absolute",
      top: "-80px",
      right: "-80px",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      background: "rgba(216,239,127,0.12)",
      filter: "blur(30px)",
    }}
  />

  {/* TOP ROW */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "26px",
      position: "relative",
      zIndex: 2,
    }}
  >
    <div
  style={{
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(247,245,239,0.95))",
    border: "1px solid rgba(35,77,44,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
  }}
>
  {index === 0 && (
    <Leaf
      size={28}
      strokeWidth={1.7}
      color="#35593f"
    />
  )}

  {index === 1 && (
    <Sprout
      size={28}
      strokeWidth={1.7}
      color="#35593f"
    />
  )}

  {index === 2 && (
    <Nut
      size={28}
      strokeWidth={1.7}
      color="#35593f"
    />
  )}

  {index === 3 && (
    <CupSoda
      size={28}
      strokeWidth={1.7}
      color="#35593f"
    />
  )}
</div>

    <div
      style={{
        color: "#234d2c",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "2px",
      }}
    >
      0{index + 1}
    </div>
  </div>

  {/* TITLE */}
  <h3
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "28px",
      color: "#163923",
      lineHeight: "1.1",
      marginBottom: "16px",
      position: "relative",
      zIndex: 2,
    }}
  >
    {item.title}
  </h3>

  {/* DESCRIPTION */}
  <p
    style={{
      color: "rgba(22,57,35,0.72)",
      lineHeight: "1.9",
      fontSize: "15px",
      position: "relative",
      zIndex: 2,
    }}
  >
    {item.text}
  </p>
</motion.div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
         src={brandStoryImage}
          alt="Earthkind Naturals wellness"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            height: "990px",
            objectFit: "cover",
            borderRadius: "42px",
            boxShadow: "0 35px 80px rgba(0,0,0,0.12)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "absolute",
           left: "48px",
top: "355px",
width: "390px",
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "38px",
              padding: "30px 30px",
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))",
                zIndex: 1,
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <p
                style={{
                  color: "#234d2c",
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "28px",
                }}
              >
                Crafted For Modern Living
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "1px solid rgba(35,77,44,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#234d2c",
                    fontSize: "18px",
                  }}
                >
                  🌿
                </div>

                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(35,77,44,0.12)",
                  }}
                />
              </div>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "58px",
                  lineHeight: "0.88",
                  color: "#163923",
                  marginBottom: "28px",
                  letterSpacing: "-2px",
                }}
              >
                Pure.
                <br />
                Elegant.
                <br />
                Trusted.
              </h3>

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(35,77,44,0.14)",
                  marginBottom: "28px",
                }}
              />

              <p
                style={{
                  color: "rgba(22,57,35,0.86)",
                  lineHeight: "1.8",
                  fontSize: "15px",
                  marginBottom: "26px",
                }}
              >
                Premium wellness presentation crafted with refined herbal
                aesthetics, elegant visual identity, and modern natural
                luxury.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  {
                    number: "100%",
                    label: "Natural",
                    icon: "🌿",
                  },
                  {
                    number: "24+",
                    label: "Products",
                    icon: "🛡️",
                  },
                  {
                    number: "4.9★",
                    label: "Trusted",
                    icon: "⭐",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.icon}
                    </div>

                    <h4
                      style={{
                        color: "#163923",
                        fontSize: "28px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      {item.number}
                    </h4>

                    <p
                      style={{
                        color: "rgba(22,57,35,0.72)",
                        fontSize: "12px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</section>

      {/* CATEGORIES SECTION */}
      <section className="section" id="categories" style={{ padding: sectionPadding }}>
        <div style={pageShellStyle}>
          {!activeCategory ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: categoryIntroColumns,
                  gap: "30px",
                  alignItems: "end",
                  marginBottom: "52px",
                }}
              >
                <div style={{ maxWidth: "760px" }}>
                  <p className="section-subtitle">Herbal Collections</p>
                  <h2 className="section-title">
                    Discover Wellness Categories
                  </h2>
                </div>

                <p
                  className="section-text"
                  style={{
                    maxWidth: isDesktop ? "540px" : "100%",
                    marginLeft: "auto",
                  }}
                >
                  Explore premium herbal essentials carefully crafted to support
                  wellness, beauty, nutrition, and healthy modern living.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: categoryGridColumns,
                  gap: "30px",
                  alignItems: "stretch",
                }}
              >
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    active={activeCategory?.id === category.id}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
              </div>
            </>
          ) : (
            <AnimatedProducts
              products={products.filter(
                (item) => item.category === activeCategory.title
              )}
              title={activeCategory.title}
              onBack={() => setActiveCategory(null)}
            />
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" id="about" style={{ padding: sectionPadding }}>
        <div style={pageShellStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: isDesktop ? "74px" : "48px",
              alignItems: "stretch",
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              <p className="section-subtitle">Our Story</p>

              <h2 className="section-title">
                Crafted With Nature, Designed With Care
              </h2>

              <p
                className="section-text"
                style={{
                  marginTop: "26px",
                  maxWidth: "700px",
                }}
              >
                Earthkind Naturals is built on a simple idea: premium wellness
                should feel pure, elegant, and easy to trust. We focus on
                quality ingredients, clean presentation, and a calm visual
                identity that reflects the brand itself.
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "18px",
                  marginTop: "34px",
                }}
              >
                {wellnessPillars.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 6 }}
                    className="product-card"
                    style={{
                      padding: "20px 22px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #234d2c, #163923)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "28px",
                          color: "#163923",
                          lineHeight: "1",
                          marginBottom: "8px",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p className="section-text">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                className="earth-btn"
                style={{ marginTop: "34px" }}
                onClick={() => navigate("/shop")}
              >
                Explore Products
              </button>
            </div>

            <div
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
  }}
>
             <img
src={aboutSectionImage}
  alt="About Earthkind Naturals"
  style={{
    width: "100%",
    height: "100%",
    minHeight: "980px",
    objectFit: "cover",
    borderRadius: "34px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
  }}
/>

              <div
                style={{
                  position: "absolute",
                  top: "22px",
                  right: "22px",
                  background: "rgba(35,77,44,0.92)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "14px 20px",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Herbal • Premium • Natural
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="section" style={{ padding: sectionPadding }}>
        <div style={pageShellStyle}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "54px",
            }}
          >
            <p className="section-subtitle">Featured Selection</p>
            <h2 className="section-title">Best Loved Wellness Picks</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: pillarGridColumns,
              gap: "28px",
              alignItems: "stretch",
            }}
          >
           {categories.map((category, index) => {

  const featuredProduct = products.find(
    (item) => item.category === category.title
  );

  if (!featuredProduct) return null;

  return (

    <motion.div
      key={featuredProduct._id || index}
      whileHover={{
        y: -12,
      }}
      transition={{
        duration: 0.4,
      }}
      className="product-card"
      style={{
        overflow: "hidden",
        borderRadius: "34px",
        background:
          "linear-gradient(145deg, #ffffff 0%, #f7f4ee 100%)",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.06)",
        border:
          "1px solid rgba(35,77,44,0.05)",
      }}
    >

      {/* IMAGE */}
      <div
        style={{
          position: "relative",
          height: "320px",
          overflow: "hidden",
          background:
            "linear-gradient(145deg,#f7f4ee,#eef4ef)",
        }}
      >

        <motion.img
          whileHover={{
            scale: 1.06,
          }}
          transition={{
            duration: 0.7,
          }}
          src={featuredProduct.image}
          alt={featuredProduct.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "24px",
          }}
        />

        {/* CATEGORY BADGE */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: "999px",
            padding: "10px 16px",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: "700",
            color: "#163923",
          }}
        >
          {category.title}
        </div>

      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "28px",
        }}
      >

        <h3
          style={{
            fontFamily:
              "'Cormorant Garamond', serif",
            fontSize: "40px",
            lineHeight: "1",
            color: "#163923",
            marginBottom: "14px",
          }}
        >
          {featuredProduct.name}
        </h3>

        <p
          className="section-text"
          style={{
            marginBottom: "22px",
            minHeight: "58px",
          }}
        >
          Premium wellness crafted with
          nature-inspired ingredients for
          refined healthy living.
        </p>

        {/* PRICE + BUTTON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >

          <h4
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize: "38px",
              color: "#163923",
            }}
          >
            ₹{featuredProduct.price}
          </h4>

          <button
            className="earth-btn"
            style={{
              padding: "14px 22px",
            }}
            onClick={() =>
              navigate("/product-details", {
                state: {
                  product: featuredProduct,
                },
              })
            }
          >
            View Product
          </button>

        </div>

      </div>

    </motion.div>

  );
})}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="section" style={{ padding: sectionPadding }}>
        <div style={pageShellStyle}>
          <div
            className="product-card"
            style={{
              padding: "60px 40px",
              textAlign: "center",
              background:
                "linear-gradient(145deg, #f7f4ee 0%, #edf3ef 100%)",
            }}
          >
            <p className="section-subtitle">Customer Love</p>
            <h2
  className="section-title"
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
  }}
>
  Trusted By Wellness Lovers
</h2>

            <p
              className="section-text"
              style={{
                maxWidth: "900px",
                margin: "24px auto 0",
                fontSize: "clamp(18px, 2vw, 22px)",
              }}
            >
              “Earthkind Naturals feels premium from the first look itself. The
              product presentation, natural identity, and thoughtful design make
              the brand feel genuinely refined and trustworthy.”
            </p>

            <div
              style={{
                marginTop: "28px",
                color: "#234d2c",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              — Earthkind Naturals Customer
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section" style={{ padding: sectionPadding }}>
        <div style={pageShellStyle}>
          <div
  style={{
    position: "relative",

    overflow: "hidden",

    borderRadius: "30px",

    padding: "84px 44px",

    background: `
      radial-gradient(
        circle at top center,
        rgba(216,239,127,0.12),
        transparent 28%
      ),

      radial-gradient(
        circle at bottom left,
        rgba(255,255,255,0.05),
        transparent 30%
      ),

      linear-gradient(
        135deg,
        #0f2a19 0%,
        #163923 35%,
        #1d4d2d 70%,
        #234d2c 100%
      )
    `,

    color: "#fff",

    textAlign: "center",

    border: "1px solid rgba(255,255,255,0.06)",

    boxShadow: `
      0 25px 70px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.05)
    `,
  }}
>
<div
  style={{
    position: "absolute",

    width: "420px",

    height: "420px",

    borderRadius: "50%",

    background: "rgba(216,239,127,0.08)",

    filter: "blur(90px)",

    top: "-120px",

    left: "50%",

    transform: "translateX(-50%)",
  }}
/>
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#d8ef7f",
                marginBottom: "16px",
              }}
            >
              Start Your Wellness Journey
            </p>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 6vw, 5.4rem)",
                lineHeight: "1",
                marginBottom: "18px",
              }}
            >
              Choose Natural. Choose Earthkind.
            </h2>

            <p
              style={{
                maxWidth: "780px",
                margin: "0 auto 30px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.85)",
                fontSize: "clamp(16px, 2vw, 20px)",
              }}
            >
              Discover a calm, premium wellness experience with products made
              to fit modern lifestyles and natural living.
            </p>

            <button className="earth-btn" onClick={() => navigate("/shop")}>
              Shop Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;