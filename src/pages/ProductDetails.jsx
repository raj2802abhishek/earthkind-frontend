import React, {
  useState,
  useEffect
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

function ProductDetails() {

  const location = useLocation();

  const navigate = useNavigate();

  const product =
    location.state?.product;
useEffect(() => {

  if (!product) return;

  let viewedProducts =
    JSON.parse(
      localStorage.getItem(
        "recentlyViewed"
      )
    ) || [];

  viewedProducts =
    viewedProducts.filter(
      (item) =>
        item._id !== product._id
    );

  viewedProducts.unshift(
    product
  );

  viewedProducts =
    viewedProducts.slice(0, 10);

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(
      viewedProducts
    )
  );

}, [product]);
    

  if (!product) {

    return (

      <div
        style={{
          padding: "120px 20px",
          textAlign: "center"
        }}
      >

        <h2 className="section-title">
          Product Not Found
        </h2>

      </div>

    );

  }

  /* ====================================
     MULTIPLE IMAGES
  ==================================== */

 const productImages =
  product.images?.length
    ? product.images
    : [product.image];

  const [selectedImage,
  setSelectedImage] =
  useState(productImages[0]);

useEffect(() => {

  setSelectedImage(
    product.image
  );

}, [product]);

  /* ====================================
     PRODUCT DESCRIPTION
  ==================================== */

  const productDescription =
    "Crafted using carefully selected premium natural ingredients, this wellness product is designed to support modern healthy living while maintaining purity, quality, and luxurious herbal care inspired by nature.";

  /* ====================================
     ADD TO CART
  ==================================== */

  const addToCart = () => {

    let existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingProductIndex =
      existingCart.findIndex(
        (item) =>
          item._id === product._id
      );

    if (
      existingProductIndex !== -1
    ) {

      existingCart[
        existingProductIndex
      ].quantity =
        (
          existingCart[
            existingProductIndex
          ].quantity || 1
        ) + 1;

    } else {

      existingCart.push({
  ...product,
  quantity: 1,
  weight:
    product.weight ||
    product.selectedWeight ||
    "100g",
});

    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    toast.success(
      `${product.name} added to cart`,
      {

      style: {
        borderRadius: "16px",

        background: "#163923",

        color: "#fff",

        padding: "16px 20px"
      }

    });

  };

  return (

    <div
      className="section"

      style={{
        paddingTop: "140px"
      }}
    >

      <div className="container">

        {/* ====================================
           BACK BUTTON
        ==================================== */}

        <button

          className="earth-btn"

          onClick={() =>
            navigate(-1)
          }

          style={{
            marginBottom: "50px"
          }}
        >
          ← Back
        </button>

        {/* ====================================
           TOP PRODUCT SECTION
        ==================================== */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",

            gap:
              window.innerWidth <= 768
                ? "60px"
                : "90px",

            alignItems: "center"
          }}
        >

          {/* ====================================
             LEFT IMAGE SECTION
          ==================================== */}

          <motion.div

            initial={{
              opacity: 0,
              x: -60
            }}

            animate={{
              opacity: 1,
              x: 0
            }}

            transition={{
              duration: 0.8
            }}
          >

            {/* MAIN IMAGE */}
            <div
              className="soft-shadow"

              style={{
                background: "#fff",

                borderRadius: "38px",

                padding:
                  window.innerWidth <= 768
                    ? "30px"
                    : "45px",

                marginBottom: "25px"
              }}
            >

              <motion.img

                key={selectedImage}

                initial={{
                  opacity: 0,
                  scale: 0.95
                }}

                animate={{
                  opacity: 1,
                  scale: 1
                }}

                transition={{
                  duration: 0.5
                }}

                src={selectedImage}

                alt={product.name}

                className="float-animation"

                style={{
                  width: "100%",

                  maxWidth: "520px",

                  margin: "0 auto",

                  objectFit: "contain"
                }}
              />

            </div>

            {/* THUMBNAILS */}
            <div
              style={{
                display: "flex",

                gap: "18px",

                justifyContent: "center",

                flexWrap: "wrap"
              }}
            >

              {productImages.map(
                (img, index) => (

                <div

                  key={index}

                  onClick={() =>
                    setSelectedImage(img)
                  }

                  style={{
                    width:
                      window.innerWidth <= 768
                        ? "70px"
                        : "90px",

                    height:
                      window.innerWidth <= 768
                        ? "70px"
                        : "90px",

                    borderRadius: "20px",

                    overflow: "hidden",

                    cursor: "pointer",

                    background: "#fff",

                    padding: "10px",

                    border:
                      selectedImage === img
                        ? "2px solid #234d2c"
                        : "2px solid transparent",

                    transition: "0.4s ease",

                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.08)"
                  }}
                >

                  <img
                    src={img}

                    alt="thumbnail"

                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />

                </div>

              ))}

            </div>

          </motion.div>

          {/* ====================================
             RIGHT CONTENT SECTION
          ==================================== */}

          <motion.div

            initial={{
              opacity: 0,
              x: 60
            }}

            animate={{
              opacity: 1,
              x: 0
            }}

            transition={{
              duration: 0.8
            }}
          >

            <p className="section-subtitle">
              Premium Herbal Collection
            </p>

            <h1
              className="section-title"

              style={{
                marginBottom: "18px"
              }}
            >
              {product.name}
            </h1>

            <p
              className="section-text"

              style={{
                marginBottom: "20px",

                color: "#234d2c",

                fontWeight: "600"
              }}
            >
              {product.category}
            </p>

            <h2
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",

                fontSize:
                  window.innerWidth <= 768
                    ? "54px"
                    : "72px",

                color: "#163923",

                marginBottom: "28px"
              }}
            >
              ₹{product.price}
            </h2>

            <p
              className="section-text"

              style={{
                marginBottom: "40px"
              }}
            >
              {productDescription}
            </p>

            {/* BENEFITS */}
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",

                gap: "18px",

                marginBottom: "40px"
              }}
            >

              {[
                "🌿 100% Natural",
                "🛡️ Chemical Free",
                "✨ Safe Daily Use",
                "⭐ Premium Quality"
              ].map((item, index) => (

                <div

                  key={index}

                  className="glass-card"

                  style={{
                    padding: "18px",

                    borderRadius: "20px",

                    textAlign: "center",

                    color: "#234d2c",

                    fontWeight: "600"
                  }}
                >
                  {item}
                </div>

              ))}

            </div>

            {/* CENTERED BUTTONS */}
            <div
              style={{
                display: "flex",

                justifyContent:
                  window.innerWidth <= 768
                    ? "center"
                    : "flex-start",

                alignItems: "center",

                gap: "20px",

                flexWrap: "wrap",

                marginTop: "15px"
              }}
            >

              <button

                className="earth-btn"

                onClick={addToCart}
              >
                Add To Cart
              </button>

              <button

                className="earth-btn"

                style={{
                  background:
                    "linear-gradient(135deg,#d8ef7f,#bfdc52)",

                  color: "#163923"
                }}

                onClick={() => {

                  addToCart();

                  navigate("/checkout");

                }}
              >
                Buy Now
              </button>

            </div>

          </motion.div>

        </div>

        {/* ====================================
           PRODUCT STORY
        ==================================== */}

        <section
          className="section"

          style={{
            paddingBottom: "50px"
          }}
        >

          <div
            style={{
              textAlign: "center",

              maxWidth: "950px",

              margin: "0 auto"
            }}
          >

            <p className="section-subtitle">
              Product Story
            </p>

            <h2 className="section-title">
              Crafted With Nature &
              Wellness In Mind
            </h2>

            <div className="section-divider" />

            <p
              className="section-text"

              style={{
                marginTop: "30px"
              }}
            >
              EARTHKIND NATURALS products
              are thoughtfully designed
              to combine traditional
              herbal wisdom with premium
              modern wellness care.
              Every ingredient is selected
              carefully to ensure purity,
              effectiveness, and a luxurious
              wellness experience inspired
              by nature-powered living.
            </p>

          </div>

        </section>

        {/* ====================================
           HOW TO USE + BENEFITS
        ==================================== */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",

            gap: "40px"
          }}
        >

          {/* HOW TO USE */}
          <div
            className="glass-card"

            style={{
              padding:
                window.innerWidth <= 768
                  ? "30px"
                  : "45px",

              borderRadius: "34px"
            }}
          >

            <p className="section-subtitle">
              How To Use
            </p>

            <h2
              className="section-title"

              style={{
                fontSize:
                  window.innerWidth <= 768
                    ? "42px"
                    : "54px",

                marginBottom: "25px"
              }}
            >
              Wellness Routine
            </h2>

            <ul
              style={{
                paddingLeft: "20px",

                color: "#555",

                lineHeight: "2",

                fontSize: "17px"
              }}
            >
              <li>
                Use recommended quantity daily.
              </li>

              <li>
                Store in cool & dry place.
              </li>

              <li>
                Consume consistently for best results.
              </li>

              <li>
                Pair with balanced healthy lifestyle.
              </li>
            </ul>

          </div>

          {/* BENEFITS */}
          <div
            className="glass-card"

            style={{
              padding:
                window.innerWidth <= 768
                  ? "30px"
                  : "45px",

              borderRadius: "34px"
            }}
          >

            <p className="section-subtitle">
              Key Benefits
            </p>

            <h2
              className="section-title"

              style={{
                fontSize:
                  window.innerWidth <= 768
                    ? "42px"
                    : "54px",

                marginBottom: "25px"
              }}
            >
              Premium Wellness
            </h2>

            <ul
              style={{
                paddingLeft: "20px",

                color: "#555",

                lineHeight: "2",

                fontSize: "17px"
              }}
            >
              <li>
                Supports healthy lifestyle.
              </li>

              <li>
                Premium herbal formulation.
              </li>

              <li>
                Naturally wellness focused.
              </li>

              <li>
                Carefully crafted quality.
              </li>
            </ul>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ProductDetails;