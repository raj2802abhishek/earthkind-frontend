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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="category-card-wrapper"
    >
      {/* IMAGE CARD */}
      <div
        className={`category-card-img-container ${active ? "active" : ""}`}
      >
        <motion.img
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.8 }}
          src={category.image}
          alt={category.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* FLOATING PREMIUM ICON */}
        <div className="category-card-icon-badge">
          <Icon className="category-icon" strokeWidth={1.6} color="#234d2c" />
        </div>
      </div>

      {/* TITLE ROW */}
      <div className="category-card-title-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="category-card-title">
            {category.title}
          </h3>
          <div className="category-card-divider" />
        </div>

        <motion.button
          type="button"
          whileHover={{ x: 6 }}
          aria-label={`Explore ${category.title}`}
          className="category-card-action-btn"
        >
          →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default CategoryCard;