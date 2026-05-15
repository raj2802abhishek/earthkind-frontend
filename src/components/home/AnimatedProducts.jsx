import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";


function AnimatedProducts(
  
  {

  products,
  title,
  onBack
}) {
const navigate = useNavigate();
const scrollRef = useRef();
const addToCart = (product, event) => {

  toast.success(`${product.name} added to cart`, {

  style: {
    borderRadius: "14px",

    background: "#1f4d2e",

    color: "#fff",

    padding: "16px 18px",

    fontSize: "15px",

    fontWeight: "500"
  },

  iconTheme: {
    primary: "#d8ef7f",

    secondary: "#1f4d2e"
  }
});

  let existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex =
    existingCart.findIndex(
      (item) => item._id === product._id
    );

  if (existingProductIndex !== -1) {

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
      quantity: 1
    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(existingCart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  const productCard =
    event.currentTarget.closest(
      ".animated-product-card"
    );

  const productImage =
    productCard.querySelector(
      ".animated-product-image"
    );

  const cartIcon =
    document.querySelector(
      ".cart-icon"
    );

  if (productImage && cartIcon) {

    const flyingImage =
      productImage.cloneNode(true);

    const buttonRect =
  event.currentTarget.getBoundingClientRect();

    const cartRect =
      cartIcon.getBoundingClientRect();

    flyingImage.style.position =
      "fixed";

    flyingImage.style.left =
  `${buttonRect.left}px`;

flyingImage.style.top =
  `${buttonRect.top}px`;

    flyingImage.style.width =
      "120px";

    flyingImage.style.height =
      "120px";

    flyingImage.style.objectFit =
      "cover";

    flyingImage.style.zIndex =
      "9999";

    flyingImage.style.transition =
      "all 1.3s cubic-bezier(0.22,1,0.36,1)";

    flyingImage.style.borderRadius =
      "18px";
      flyingImage.style.pointerEvents =
  "none";

flyingImage.style.backdropFilter =
  "blur(4px)";

    flyingImage.style.boxShadow =
      "0 20px 45px rgba(0,0,0,0.18)";

    document.body.appendChild(
      flyingImage
    );

    requestAnimationFrame(() => {

      flyingImage.style.left =
        `${cartRect.left}px`;

      flyingImage.style.top =
        `${cartRect.top}px`;

      flyingImage.style.width =
        "28px";

      flyingImage.style.height =
        "28px";

      flyingImage.style.opacity =
        "0.15";

      flyingImage.style.transform =
        "scale(0.25) rotate(18deg)";
    });

    setTimeout(() => {

      flyingImage.remove();

      cartIcon.classList.add(
        "cart-bounce"
      );

      setTimeout(() => {

        cartIcon.classList.remove(
          "cart-bounce"
        );

      }, 600);

    }, 1300);
  }
};
  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 60
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      transition={{
        duration: 0.7
      }}

      style={{
        marginTop: "70px"
      }}
    >
<div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "55px",

    position: "relative"
  }}
>

  {/* LEFT SIDE */}
 {/* LEFT SIDE */}
<div
  style={{
  width: "100%",

  position: "relative",

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  justifyContent: "center",

  marginBottom: "70px"
}}
>

  {/* BACK BUTTON */}
  <button

    onClick={onBack}

    style={{
      position: "absolute",

      left: 0,

      top: "10px",

      border: "none",

      background: "rgba(255,255,255,0.75)",

      backdropFilter: "blur(10px)",

      padding: "12px 20px",

      borderRadius: "999px",

      cursor: "pointer",

      color: "#234d2c",

      fontSize: "15px",

      fontWeight: "600",

      boxShadow:
        "0 8px 20px rgba(0,0,0,0.06)"
    }}
  >
    ← Back to Categories
  </button>

  {/* TITLE + TAGLINE */}
  <div
    style={{
      textAlign: "center",
      width:"100%"
    }}
  >

    <h2
      style={{
        fontSize: "54px",

        color: "#234d2c",

        fontFamily:
          "'Cormorant Garamond', serif",

        margin: 0,

        lineHeight: "1"
      }}
    >
      {title}
    </h2>

    <p
      style={{
        color: "#7a746d",

        fontSize: "20px",

        marginTop: "18px",

        fontWeight: "500",

        letterSpacing: "0.3px"
      }}
    >
      Crafted By Nature ✨
      
    </p>
    

  </div>
  

</div>

</div>



{/* LEFT ARROW */}
<button

  onClick={() => {

  const container =
    scrollRef.current;

  const card =
    container.querySelector(".animated-product-card");
  if (!card) return;

  const cardWidth =
    card.offsetWidth + 30;

  container.scrollBy({
    left: -cardWidth,
    behavior: "smooth"
  });

}}

  style={{
    position: "absolute",

    left: "-25px",

    top: "58%",

    transform: "translateY(-50%)",

    width: "60px",
    height: "60px",

    borderRadius: "50%",

    border: "none",

    background: "rgba(255,255,255,0.92)",

    backdropFilter: "blur(10px)",

    cursor: "pointer",

    fontSize: "26px",

    zIndex: 20,

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.12)"
  }}
>
  ←
</button>

{/* RIGHT ARROW */}
<button

  onClick={() => {

  const container =
    scrollRef.current;

  const card =
   container.querySelector(".animated-product-card");
  if (!card) return;

  const cardWidth =
    card.offsetWidth + 30;

  container.scrollBy({
    left: cardWidth,
    behavior: "smooth"
  });

}}
  style={{
    position: "absolute",

    right: "-25px",

    top: "58%",

    transform: "translateY(-50%)",

    width: "60px",
    height: "60px",

    borderRadius: "50%",

    border: "none",

    background: "rgba(255,255,255,0.92)",

    backdropFilter: "blur(10px)",

    cursor: "pointer",

    fontSize: "26px",

    zIndex: 20,

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.12)"
  }}
>
  →
</button>

      {/* PRODUCTS ROW */}
      <div

  ref={scrollRef}

  style={{
  display: "flex",
  scrollSnapType: "x mandatory",

  gap: "28px",

  overflowX: "auto",

  paddingBottom: "10px",

  scrollBehavior: "smooth",

  scrollbarWidth: "none",

  msOverflowStyle: "none"
}}
      >

        {products.map((product, index) => (

          <motion.div

            key={index}

            initial={{
              opacity: 0,
              scale: 0.7,
              y: 80
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}

            transition={{
              delay: index * 0.15,
              duration: 0.6
            }}

            whileHover={{
              y: -10,
              scale: 1.03
            }}
className="animated-product-card"
            style={{
  minWidth: "760px",
  scrollSnapAlign: "center",

  background: "#fff",

  borderRadius: "32px",

  overflow: "hidden",

  boxShadow:
    "0 15px 35px rgba(0,0,0,0.06)",

  flexShrink: 0,

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  padding: "28px",

  gap: "30px"
}}
          >
              
               
            {/* IMAGE */}
          <div
  style={{
    width: "280px",

    height: "280px",

    borderRadius: "26px",

    background: "#f8f6f1",

    overflow: "hidden",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0
  }}
>
  <img
  className="animated-product-image"
  src={product.image}
  alt={product.name}

  onClick={() =>
    navigate("/product-details", {
      state: { product }
    })
  }

  style={{
    width: "100%",

    height: "100%",

    objectFit: "contain",

    padding: "12px",

    cursor: "pointer",

    transition: "0.4s ease"
  }}

  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "scale(1.06)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "scale(1)";
  }}
/>
</div>

            {/* CONTENT */}
            <div
  style={{
  flex: 1,

  display: "flex",

  flexDirection: "column",

  justifyContent: "center"
}}
>

              <h3
  style={{
    fontSize: "52px",

    color: "#234d2c",

    marginBottom: "14px",

    fontFamily:
      "'Cormorant Garamond', serif"
  }}
>
  {product.name}
</h3>
                

             <p
  style={{
    fontSize: "18px",

    lineHeight: "1.7",

    color: "#6b6b6b",

    maxWidth: "520px",

    marginBottom: "28px"
  }}
>
{
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
}
</p>

              <div
  style={{
  width: "100%",

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  marginTop: "30px"
}}
>
<h4
  style={{
    color: "#1f4d2e",

    fontSize: "38px",

    fontWeight: "700",

    fontFamily:
      "'Cormorant Garamond', serif",

    margin: 0
  }}
>
  ₹{product.price}
</h4>

<button

  onClick={(e) =>
    addToCart(product, e)
  }

  style={{

    background:
      "linear-gradient(90deg,#1f4d2e,#0f2f1c)",

    color: "#fff",

    border: "none",

    padding: "16px 30px",

    borderRadius: "14px",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: "600",

    width: "fit-content",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    boxShadow:
      "0 10px 25px rgba(31,77,46,0.25)"
  }}
>
  Add To Cart
</button>
              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </motion.div>

  );
}

export default AnimatedProducts;