import { motion } from "framer-motion";

function CategoryCard({
  category,
  active,
  onClick
}) {
  return (
    <motion.div
    layout
      whileHover={{
        y: -10,
        scale:1.025
      }}

      whileTap={{
        scale: 0.98
      }}

      onClick={onClick}

      style={{
  position: "relative",
   transition:"0.35s ease",
  height:
  window.innerWidth <= 768
    ? "185px"
    : "340px",

  width: "100%",

  borderRadius: "28px",

  overflow: "hidden",

  cursor: "pointer",

  background: "transparent",

  display: "flex",

  boxShadow: active
  ? "0 25px 50px rgba(31,77,46,0.22)"
  : "0 12px 28px rgba(0,0,0,0.06)"
}}
    >

      {/* IMAGE */}
      <motion.div
      whileHover={{
    scale: 1.04
  }}
        style={{
          position: "absolute",

          inset: 0,

          backgroundImage: `url(${category.image})`,

          backgroundSize: "cover",

          backgroundPosition: "center",

          backgroundRepeat: "no-repeat",
          filter: "brightness(1.02) saturate(1.05)",

          zIndex: 2
        }}
      />

     

      {active && (

  <>
  
    {/* PARTICLES */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        pointerEvents: "none"
      }}
    >

      {[...Array(8)].map((_, i) => (

        <div
          key={i}

          style={{
            position: "absolute",

            width: "14px",
            height: "14px",

            borderRadius: "50%",

            background:
  "rgba(216,239,127,0.9)",

            left: "50%",
            top: "50%",

            animation:
              "particleBurst 1.1s ease-out forwards",

            animationDelay:
              `${i * 0.05}s`,

            transform:
              `rotate(${i * 45}deg)
               translateY(-20px)`
          }}
        />

      ))}

    </div>

    {/* PREMIUM GLOW */}
    <motion.div

      initial={{
        opacity: 0
      }}

      animate={{
        opacity: 1
      }}

      style={{
        position: "absolute",

        inset: 0,

        background:
          "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 60%)",

        zIndex: 3
      }}
    />

  </>

)}
      

    </motion.div>
  );
}

export default CategoryCard;