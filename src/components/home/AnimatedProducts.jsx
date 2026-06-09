import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AnimatedProducts({ products, title, onBack }) {
  const navigate = useNavigate();
  const scrollRef = useRef();

  const addToCart = (product, event) => {
    toast.success(`${product.name} added to cart`, {
      style: {
        borderRadius: "16px",
        background: "#163923",
        color: "#fff",
        padding: "16px 20px",
        fontSize: "15px",
      },
    });

    let existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity =
        (existingCart[existingProductIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    const productCard = event.currentTarget.closest(
      ".animated-product-card"
    );
    const productImage = productCard?.querySelector(
      ".animated-product-image"
    );
    const cartIcon = document.querySelector(".cart-icon");

    if (productImage && cartIcon) {
      const flyingImage = productImage.cloneNode(true);
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      flyingImage.style.position = "fixed";
      flyingImage.style.left = `${buttonRect.left}px`;
      flyingImage.style.top = `${buttonRect.top}px`;
      flyingImage.style.width = "120px";
      flyingImage.style.height = "120px";
      flyingImage.style.objectFit = "cover";
      flyingImage.style.zIndex = "9999";
      flyingImage.style.borderRadius = "20px";
      flyingImage.style.pointerEvents = "none";
      flyingImage.style.transition =
        "all 1.2s cubic-bezier(0.22,1,0.36,1)";
      flyingImage.style.boxShadow =
        "0 15px 35px rgba(0,0,0,0.18)";

      document.body.appendChild(flyingImage);

      requestAnimationFrame(() => {
        flyingImage.style.left = `${cartRect.left}px`;
        flyingImage.style.top = `${cartRect.top}px`;
        flyingImage.style.width = "28px";
        flyingImage.style.height = "28px";
        flyingImage.style.opacity = "0.1";
        flyingImage.style.transform = "scale(0.2) rotate(20deg)";
      });

      setTimeout(() => {
        flyingImage.remove();

        cartIcon.classList.add("cart-bounce");

        setTimeout(() => {
          cartIcon.classList.remove("cart-bounce");
        }, 600);
      }, 1200);
    }
  };

  const scrollByAmount = (amount) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        position: "relative",
        paddingBottom: "20px",
      }}
    >
      {/* HEADER */}
<div
  style={{
    marginBottom: "60px",
  }}
>
  {/* TOP ROW */}
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "28px",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
    {/* BACK BUTTON */}
    <button
      onClick={onBack}
      className="earth-btn"
      style={{
        marginTop: "6px",
        flexShrink: 0,
      }}
    >
      ← Back
    </button>

    {/* SUBTITLE */}
    <p
      className="section-subtitle"
      style={{
        margin: 0,
        textAlign: "right",
      }}
    >
      Premium Herbal Collection
    </p>
  </div>

  {/* TITLE */}
  <div
    style={{
      textAlign: "center",
    }}
  >
    <h2 className="section-title">{title}</h2>

    <p
      className="section-text"
      style={{
        maxWidth: "760px",
        margin: "22px auto 0",
      }}
    >
      Discover carefully selected wellness essentials crafted with
      premium ingredients inspired by nature-powered healthy living.
    </p>
  </div>
</div>

      {/* SLIDER BUTTONS */}
      <button
        onClick={() => scrollByAmount(-520)}
        aria-label="Scroll products left"
        style={{
          position: "absolute",
          left: "-10px",
          top: "55%",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.95)",
          cursor: "pointer",
          fontSize: "24px",
          zIndex: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        ←
      </button>

      <button
        onClick={() => scrollByAmount(520)}
        aria-label="Scroll products right"
        style={{
          position: "absolute",
          right: "-10px",
          top: "55%",
          transform: "translateY(-50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.95)",
          cursor: "pointer",
          fontSize: "24px",
          zIndex: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        →
      </button>

      {/* PRODUCT ROW */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "30px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id || index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{ y: -10 }}
            className="animated-product-card"
            style={{
              minWidth: "min(920px, 92vw)",
              background:
                "linear-gradient(145deg, #ffffff 0%, #f8f6f1 100%)",
              borderRadius: "38px",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "stretch",
              gap: "34px",
              padding: "34px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(35,77,44,0.06)",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                width: "320px",
                minWidth: "320px",
                height: "320px",
                background:
                  "linear-gradient(145deg, #f8f6f1 0%, #eef5ef 100%)",
                borderRadius: "30px",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid rgba(35,77,44,0.08)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
              }}
            >
              <img
                className="animated-product-image"
                src={product.image}
                alt={product.name}
                onClick={() =>
                  navigate("/product-details", {
                    state: { product },
                  })
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "22px",
                  cursor: "pointer",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>

            {/* CONTENT */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "8px 4px",
              }}
            >
              <p
                style={{
                  color: "#234d2c",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                Wellness Selection
              </p>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(42px, 5vw, 62px)",
                  color: "#163923",
                  lineHeight: "0.95",
                  marginBottom: "18px",
                }}
              >
                {product.name}
              </h3>

              <p
                className="section-text"
                style={{
                  maxWidth: "780px",
                  marginBottom: "28px",
                }}
              >
                Premium wellness product thoughtfully crafted using
                nature-inspired ingredients designed for healthy modern
                living.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginTop: "auto",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#6b6b6b",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      fontSize: "11px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    Starting From
                  </p>

                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(34px, 4vw, 48px)",
                      color: "#163923",
                      lineHeight: "1",
                    }}
                  >
                    ₹{product.price}
                  </h4>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="earth-btn"
                    onClick={(e) => addToCart(product, e)}
                  >
                    Add To Cart
                  </button>

                  <button
                    className="earth-btn"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8f6f1, #edf3ef)",
                      color: "#163923",
                      border: "1px solid rgba(35,77,44,0.14)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    }}
                    onClick={() =>
                      navigate("/product-details", {
                        state: { product },
                      })
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default AnimatedProducts;