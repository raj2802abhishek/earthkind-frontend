import { motion } from "framer-motion";
import { Coffee, Leaf, Nut, Sprout } from "lucide-react";

const iconMap = {
  leaf: Leaf,
  sprout: Sprout,
  coffee: Coffee,
  nut: Nut,
};

function CategoryCard({ category, active, onClick }) {
  const Icon = iconMap[category.iconKey] || Leaf;


  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.5,
      }}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* IMAGE CARD */}
      <div
        style={{
          position: "relative",
          height:
  window.innerWidth <= 768
    ? "280px"
    : "600px",
          borderRadius:
  window.innerWidth <= 768
    ? "18px"
    : "28px",
          overflow: "hidden",
          background: "#f4f0e8",
          boxShadow: active
            ? "0 18px 40px rgba(23,59,43,0.12)"
            : "0 14px 32px rgba(0,0,0,0.06)",
        }}
      >
        <motion.img
          whileHover={{
            scale: 1.04,
          }}
          transition={{
            duration: 0.8,
          }}
          src={category.image}
          alt={category.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* FLOATING PREMIUM ICON */}
        <div
          style={{
            position: "absolute",
          left:
  window.innerWidth <= 768
    ? "12px"
    : "22px",

bottom:
  window.innerWidth <= 768
    ? "12px"
    : "22px",
            
           width:
  window.innerWidth <= 768
    ? "38px"
    : "54px",

height:
  window.innerWidth <= 768
    ? "38px"
    : "54px",
            borderRadius: "50%",
            background: "rgba(248,246,239,0.96)",
            border: "1px solid rgba(23,59,43,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Icon
  size={
    window.innerWidth <= 768
      ? 18
      : 26
  } strokeWidth={1.6} color="#234d2c" />
        </div>
      </div>

    {/* TITLE ROW */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap:
  window.innerWidth <= 768
    ? "8px"
    : "16px",
    padding: "0 6px",
    marginTop: "-2px",
  }}
>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize:
  window.innerWidth <= 768
    ? "22px"
    : "34px",
              lineHeight: "1",
              color: "#163923",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {category.title}
          </h3>

          <div
            style={{
              width:
  window.innerWidth <= 768
    ? "40px"
    : "72px",
              height: "1px",
              background: "rgba(22,57,35,0.16)",
              marginTop: "10px",
            }}
          />
        </div>

        <motion.button
          type="button"
          whileHover={{
            x: 6,
          }}
          aria-label={`Explore ${category.title}`}
          style={{
         width:
  window.innerWidth <= 768
    ? "34px"
    : "44px",

height:
  window.innerWidth <= 768
    ? "34px"
    : "44px",
            borderRadius: "50%",
            border: "1px solid rgba(22,57,35,0.08)",
            background: "#fff",
            color: "#163923",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize:
  window.innerWidth <= 768
    ? "14px"
    : "20px",
            flexShrink: 0,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default CategoryCard;