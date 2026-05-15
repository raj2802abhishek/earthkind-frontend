import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import ProtectedRoute from "./ProtectedRoute";
import logo from "./assets/logo.png";
import {
  FiShoppingCart,
  FiUser,
  FiHeart
} from "react-icons/fi";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";
import AuthModal from "./components/AuthModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wishlist from "./pages/Wishlist";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";




function App() {

const navigate = useNavigate();



const [lastOrder, setLastOrder] = useState(null);
const [showAuth, setShowAuth] = useState(false);
 
const [showMenu, setShowMenu] = useState(false);
const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user"))
);

const [cartCount, setCartCount] = useState(0);
const [wishlistCount, setWishlistCount] = useState(0);

useEffect(() => {
  const updateUser = () => {
    setUser(JSON.parse(localStorage.getItem("user")));
  };

  window.addEventListener("userChanged", updateUser);

  return () => {
    window.removeEventListener("userChanged", updateUser);
  };
}, []);

useEffect(() => {
  if (!user) return;

  const fetchLastOrder = async () => {
    try {
      const res = await fetch(
        `https://earthkind-backend.onrender.com/api/orders/my-orders/${user.email}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setLastOrder(data[0]); // latest order
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchLastOrder();
}, [user]);

useEffect(() => {
  const updateCartCount = () => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
   const totalItems = savedCart.reduce(
  (total, item) =>
    total + Number(item.quantity || 1),
  0
);

setCartCount(totalItems);
  };

  updateCartCount();

  window.addEventListener(
    "cartUpdated",
    updateCartCount
  );
  return () => {
    window.removeEventListener(
      "cartUpdated",
      updateCartCount
    );
  };
}, []);

useEffect(() => {
  const updateWishlistCount = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlistCount(savedWishlist.length);
  };

  updateWishlistCount();

  window.addEventListener(
    "wishlistUpdated",
    updateWishlistCount
  );

  return () => {
    window.removeEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );
  };
}, []);

useEffect(() => {
  const handleClickOutside = () => {
    setShowMenu(false);
  };

  window.addEventListener("click", handleClickOutside);

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, []);

  const dropdownAnimation = `
@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

  return (
    
    <>
    <ScrollToTop />

    <style>{dropdownAnimation}</style>

    <style>{dropdownAnimation}</style>

      <nav
  style={{
  background:
    "linear-gradient(90deg, #1f4d2e, #0f2f1c, #1f4d2e)",
  padding: "1px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "20px",
  marginBottom: "30px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  position: "sticky",
top: "0",
zIndex: "1000",
  
}}
  

  
>
<NavLink to="/">
  <img
    src={logo}
    alt="Earthkind Naturals"
    style={{
      width: "160px",
      objectFit: "contain",
      filter: "brightness(0) invert(1)",
      cursor: "pointer"
    }}
  />
</NavLink>

  <div
    style={{
      display: "flex",
      gap: "30px",
      alignItems: "center"
    }}
  >
    <NavLink
  to="/"
  style={({ isActive }) => ({
    color: "#fff",
    textDecoration: isActive ? "underline" : "none",
    textUnderlineOffset: "8px",
    textDecorationThickness: "2px",
    fontWeight: "600",
    fontSize: "18px"
  })}
>
  Home
</NavLink>

    <NavLink
  to="/shop"
  style={({ isActive }) => ({
    color: "#fff",
    textDecoration: isActive ? "underline" : "none",
    textUnderlineOffset: "8px",
    textDecorationThickness: "2px",
    fontWeight: "600",
    fontSize: "18px"
  })}
>
  Shop
</NavLink>

  

    {user?.isAdmin && (

  <NavLink
    to="/admin"
    style={({ isActive }) => ({
      color: "#fff",
      textDecoration: isActive
        ? "underline"
        : "none",

      textUnderlineOffset: "8px",

      textDecorationThickness: "2px",

      fontWeight: "600",

      fontSize: "18px"
    })}
  >
    Admin
  </NavLink>

)}
  

<div
  style={{
    position: "relative",
    cursor: "pointer"
  }}
>
  <FiHeart
    onClick={() => navigate("/wishlist")}
    style={{
      fontSize: "26px",
      color: "#fff"
    }}
  />

  <span
    style={{
      position: "absolute",
      top: "-8px",
      right: "-10px",
      background: "#fff",
      color: "#1f4d2e",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "11px",
      fontWeight: "700"
    }}
  >
    {wishlistCount}
  </span>
</div>


   <div
  style={{
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginLeft: "10px"
  }}
>
  <div
    style={{
      position: "relative",
      cursor: "pointer"
    }}
  >
    <NavLink to="/cart">
      <FiShoppingCart
        className="cart-icon"
        style={{
          fontSize: "28px",
          color: "#fff"
        }}
      />
    </NavLink>

    <span
      style={{
        position: "absolute",
        top: "-8px",
        right: "-10px",
        background: "#fff",
        color: "#1f4d2e",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "700",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
      }}
    >
      {cartCount}
    </span>
  </div>
</div>

  
    <div style={{ position: "relative" }}>
  <FiUser
  onClick={(e) => {
    e.stopPropagation(); 
    if (user) {
      setShowMenu(!showMenu); // show dropdown
    } else {
      setShowAuth(true); // open login popup
    }
  }}
  style={{
    color: "#ffffff",
    fontSize: "26px",
    cursor: "pointer"
  }}
/>

 {showMenu && (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "absolute",
      right: "0",
      top: "58px",
      width: "360px",
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.35)",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow:
        "0 20px 60px rgba(0,0,0,0.18)",
      zIndex: 1000,
      animation: "dropdownFade 0.3s ease"
    }}
  >

    {/* TOP PREMIUM HEADER */}
    <div
      style={{
        padding: "26px",
        background:
          "linear-gradient(135deg,#163d26,#295c3b)",
        position: "relative"
      }}
    >

      {/* GLOW */}
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          background:
            "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          top: "-90px",
          right: "-70px"
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 2
        }}
      >

        {/* AVATAR */}
        <div
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.14)",
            border:
              "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "24px",
            fontWeight: "700",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.18)"
          }}
        >
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        {/* USER INFO */}
        <div>
          {user ? (
            <>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: "600",
                  letterSpacing: "0.3px"
                }}
              >
                Hello, {user.name}
              </h3>

              <p
                style={{
                  margin: "5px 0 0 0",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "14px",
                  fontWeight: "400"
                }}
              >
                Welcome back to your account
              </p>
            </>
          ) : (
            <>
              <h3
                style={{
                  margin: 0,
                  color: "#fff"
                }}
              >
                Welcome
              </h3>

              <p
                style={{
                  margin: "4px 0 0 0",
                  color:
                    "rgba(255,255,255,0.7)",
                  fontSize: "13px"
                }}
              >
                Sign in to continue
              </p>
            </>
          )}
        </div>
      </div>
    </div>

    {/* SIGN IN BUTTON */}
    {!user && (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => {
            setShowAuth(true);
            setShowMenu(false);
          }}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(90deg,#1f4d2e,#2e6b44)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow:
              "0 10px 25px rgba(31,77,46,0.2)",
            transition: "0.3s"
          }}
        >
          Sign In
        </button>
      </div>
    )}

    {/* BODY */}
    <div
      style={{
        padding: "24px"
      }}
    >

      {/* SECTION TITLE */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "1.5px",
          color: "#8b8b8b",
          marginBottom: "18px",
          textTransform: "uppercase"
        }}
      >
        Your Account
      </p>

      {/* MENU ITEMS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >

        {/* ORDERS */}
        <div
          onClick={() => navigate("/my-orders")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#f4f8f5";

            e.currentTarget.style.transform =
              "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";

            e.currentTarget.style.transform =
              "translateX(0)";
          }}
          style={premiumItem}
        >
          Your Orders
        </div>

        {/* SETTINGS */}
        <div
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#f4f8f5";

            e.currentTarget.style.transform =
              "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";

            e.currentTarget.style.transform =
              "translateX(0)";
          }}
          style={premiumItem}
        >
          Account Settings
        </div>

        {/* ADDRESS */}
        <div
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#f4f8f5";

            e.currentTarget.style.transform =
              "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";

            e.currentTarget.style.transform =
              "translateX(0)";
          }}
          style={premiumItem}
        >
          Addresses
        </div>

        {/* EXPLORE */}
        <div
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#f4f8f5";

            e.currentTarget.style.transform =
              "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";

            e.currentTarget.style.transform =
              "translateX(0)";
          }}
          style={premiumItem}
        >
          Explore Products
        </div>

      </div>

      {/* LOGOUT */}
      {user && (
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.dispatchEvent(
              new Event("userChanged")
            );

            setShowMenu(false);
          }}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "15px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(90deg,#fff0f0,#ffe6e6)",
            color: "#c0392b",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "15px",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
          }}
        >
          Logout
        </button>
      )}
    </div>
  </div>
)}
</div>

</div>

 
</nav>
<div style={{ height: "12px" }} />

      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>
  <Route path="/shop" element={<Shop />} />
  <Route
  path="/product-details"
  element={<ProductDetails />}
/>
<Route
  path="/cart"
  element={<Cart />}
/>
<Route
  path="/checkout"
  element={<Checkout />}
/>
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/my-orders" element={<MyOrders />} />
<Route path="/wishlist" element={<Wishlist />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
</Routes>

  
   <footer
  style={{
    marginTop: "40px",
    background:
      "linear-gradient(90deg, #4eae6e, #74a588, #4eae6e)",
    color: "#fff",
    padding: "15px 30px",
    borderRadius: "18px",
    textAlign: "center"
  }}
>
  <img
    src={logo}
    alt="Earthkind Naturals"
    style={{
      width: "180px",
      height: "auto",
      objectFit: "contain",
      marginBottom: "0px",
      filter: "brightness(0) invert(1)"
    }}
  />

  <div
    style={{
      width: "220px",
      height: "1px",
      background: "rgba(255,255,255,0.3)",
      margin: "20px auto 30px auto"
    }}
  />

  <p style={{ fontSize: "20px", marginBottom: "30px" }}>
    Premium Herbal Products for Natural Wellness
  </p>

  <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "35px",
    flexWrap: "wrap",
    marginBottom: "30px",
    fontSize: "18px"
  }}
>
  <p style={{ margin: 0 }}>
    Instagram: @earthkind_naturals
  </p>

  <p style={{ margin: 0 }}>
    Email: support@earthkindnaturals.com
  </p>

  <p style={{ margin: 0 }}>
    WhatsApp: +91 9027186252
  </p>
</div>

  <p
    style={{
      fontSize: "15px",
      opacity: 0.9
    }}
  >
    © 2026 EARTHKIND NATURALS. All Rights Reserved.
  </p>
</footer>
<ToastContainer position="top-right" autoClose={2000} />

<Toaster
  position="top-right"
  reverseOrder={false}
/>

{showAuth && (
  <AuthModal close={() => setShowAuth(false)} />
)}
   </> 
  );
  
}
const itemStyle = {
  padding: "6px 8px",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#444",
  textAlign: "left",
  lineHeight: "1.4",
  whiteSpace: "nowrap"
};
const premiumItem = {
  padding: "14px 16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "500",
  color: "#333",
  transition: "all 0.25s ease"
};

export default App;