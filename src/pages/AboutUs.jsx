import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiAward,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiSmile,
  FiGlobe,
  FiRefreshCw
} from "react-icons/fi";
import { FaLeaf, FaSeedling, FaSun } from "react-icons/fa";

import brandStoryImage from "../assets/home/brand-story.png";
import aboutSectionImage from "../assets/home/about-section.png";
import hero1 from "../assets/Hero/hero1.png";

function AboutUs() {
  const navigate = useNavigate();

  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 1024 : true;

  const wellnessPillars = [
    {
      icon: <FaLeaf className="pillar-icon" />,
      title: "100% Pure & Unadulterated",
      text: "Every product is derived directly from raw herbs and seeds, with zero added sugars, artificial colors, preservatives, or synthetic fillers.",
    },
    {
      icon: <FaSeedling className="pillar-icon" />,
      title: "Ethical Farm Sourcing",
      text: "We collaborate with certified organic farmers across India who practice sustainable agriculture, respecting the soil and natural cycles.",
    },
    {
      icon: <FiShield className="pillar-icon" />,
      title: "Rigorous Quality & Lab Tested",
      text: "Our formulations undergo strict multi-stage lab testing for heavy metals, pesticides, and microbial safety before reaching your home.",
    },
    {
      icon: <FiHeart className="pillar-icon" />,
      title: "Eco-Conscious & Sustainable",
      text: "We prioritize biodegradable, food-grade, and recyclable packaging to minimize our environmental footprint and honor Mother Earth.",
    },
  ];

  const sourcingSteps = [
    {
      step: "01",
      title: "Selective Harvesting",
      desc: "Herbs and seeds are hand-harvested at peak botanical potency from organic Indian soil.",
    },
    {
      step: "02",
      title: "Cold-Milled Processing",
      desc: "Slow, low-temperature milling ensures delicate vitamins, minerals, and antioxidants remain intact.",
    },
    {
      step: "03",
      title: "Certified Lab Audit",
      desc: "Comprehensive purity verification guarantees safety, potency, and uncompromised quality.",
    },
    {
      step: "04",
      title: "Aroma-Lock Fresh Packaging",
      desc: "Packaged in airtight, eco-friendly pouches to seal in peak natural freshness and nutrients.",
    },
  ];

  return (
    <div className="about-page-shell">
      {/* HERO BANNER */}
      <section className="about-hero">
        <div className="about-hero-glow" />
        <div className="container about-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-badge">
              <FaLeaf style={{ color: "#d8ef7f", marginRight: "8px" }} />
              OUR BRAND ESSENCE
            </div>

            <h1 className="about-hero-title">
              Rooted In Nature, <br />
              <span style={{ color: "#d8ef7f", fontStyle: "italic" }}>Crafted For Mindful Living</span>
            </h1>

            <p className="about-hero-subtitle">
              Earthkind Naturals was born from a passion for authentic botanical wellness. 
              We blend ancient Ayurvedic wisdom with modern quality standards to bring you 
              100% pure herbal powders, nutrient-dense seeds, and organic self-care essentials.
            </p>

            <div className="about-hero-cta-group">
              <button onClick={() => navigate("/shop")} className="earth-btn primary-glow">
                Explore Our Collection <FiArrowRight style={{ marginLeft: "8px" }} />
              </button>
              <button onClick={() => navigate("/contact")} className="about-secondary-btn">
                Get In Touch
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BRAND IMPACT STATS COUNTER */}
      <section className="about-stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Happy Wellness Customers</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Pure & Certified Ingredients</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <div className="stat-number">4.9 ★</div>
              <div className="stat-label">Average Community Rating</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <div className="stat-number">0%</div>
              <div className="stat-label">Chemicals, Fillers & Additives</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY & ORIGIN SECTION */}
      <section className="about-section">
        <div className="container">
          <div className="about-split-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="about-story-text"
            >
              <span className="contact-badge centered">OUR STORY & VISION</span>
              <h2 className="about-section-heading">
                A Journey Back To Pure, Honest Botanical Care
              </h2>

              <p className="about-body-text">
                In a market filled with synthetic supplements and diluted formulations, 
                Earthkind Naturals stands as a beacon of transparency and uncompromised purity. 
                We believe that nature has provided everything we need for vibrant health, 
                glowing skin, and inner vitality.
              </p>

              <p className="about-body-text">
                From organic Moringa, Amla, and Rose Peel powders to raw Chia and Flax seeds, 
                every product in our catalog is sourced responsibly, processed gently, 
                and delivered to your doorstep in its cleanest, most potent form.
              </p>

              <div className="about-story-highlights">
                <div className="story-check-item">
                  <FiCheckCircle className="check-icon" />
                  <span>Transparent Sourcing & Zero Hidden Additives</span>
                </div>
                <div className="story-check-item">
                  <FiCheckCircle className="check-icon" />
                  <span>Traditional Sun-Drying & Low-Temp Milling</span>
                </div>
                <div className="story-check-item">
                  <FiCheckCircle className="check-icon" />
                  <span>Empowering Local Farming Communities Across India</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="about-image-wrapper"
            >
              <img
                src={aboutSectionImage}
                alt="About Earthkind Naturals Story"
                className="about-feature-img"
              />
              <div className="about-img-glass-badge">
                🌿 PURE • ELEGANT • TRUSTED
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR FOUR CORE PILLARS */}
      <section className="about-pillars-section">
        <div className="container">
          <div className="about-section-header">
            <span className="contact-badge centered">WHY CHOOSE EARTHKIND</span>
            <h2 className="about-section-heading centered">
              Built On Purity, Quality & Integrity
            </h2>
            <p className="about-section-subhead">
              We hold every batch to the highest standards, ensuring your wellness routine is safe, effective, and deeply nourishing.
            </p>
          </div>

          <div className="pillars-grid">
            {wellnessPillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="pillar-card"
              >
                <div className="pillar-icon-box">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCING & CRAFTING PROCESS */}
      <section className="about-process-section">
        <div className="container">
          <div className="about-section-header">
            <span className="contact-badge centered">OUR CRAFTING PROCESS</span>
            <h2 className="about-section-heading centered">
              From Sacred Soil To Your Daily Ritual
            </h2>
          </div>

          <div className="process-grid">
            {sourcingSteps.map((step, idx) => (
              <div key={idx} className="process-card">
                <div className="process-step-badge">{step.step}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERBAL EXCELLENCE FEATURE DISPLAY */}
      <section className="about-excellence-section">
        <div className="container">
          <div className="excellence-card">
            <div className="excellence-content">
              <span className="excellence-tag">A PREMIUM WELLNESS EXPERIENCE</span>
              <h2>The Earthkind Quality Promise</h2>
              <p>
                We inspect every harvest for aroma, color, particle fine-ness, and biological potency. 
                When you open an Earthkind package, you experience the fresh scent and vibrant natural shade 
                of pure herbs harvested at their absolute peak.
              </p>
              <button onClick={() => navigate("/shop")} className="earth-btn light">
                Discover Pure Products
              </button>
            </div>
            <div className="excellence-image-container">
              <img src={brandStoryImage} alt="Earthkind Excellence" />
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIAL BANNER */}
      <section className="about-testimonial-section">
        <div className="container">
          <div className="about-quote-box">
            <p className="quote-text">
              “Earthkind Naturals has completely transformed my daily wellness routine. 
              The purity of their Moringa and Amla powder is unmatched. You can literally smell and feel the authenticity!”
            </p>
            <div className="quote-author">
              <strong>Priya R.</strong> — Certified Holistic Nutritionist & Earthkind Patron
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Ready To Elevate Your Natural Health?</h2>
            <p>Join thousands of wellness enthusiasts who trust Earthkind Naturals for their everyday health needs.</p>
            <button onClick={() => navigate("/shop")} className="earth-btn primary-glow">
              Shop All Products <FiArrowRight style={{ marginLeft: "8px" }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
