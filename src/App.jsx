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
import AccountPanel from "./components/account/AccountPanel";



function App() {

const navigate = useNavigate();



const [lastOrder, setLastOrder] = useState(null);
const [showAuth, setShowAuth] = useState(false);
 
const [showMenu, setShowMenu] = useState(false);
const [navbarScrolled, setNavbarScrolled] = useState(false);
const [mobileNav, setMobileNav] = useState(false);
const navTextColor = navbarScrolled ? "#fff" : "#163923";
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

  const fetchLatestOrder = async () => {

    try {

      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!currentUser?.email) {

        setLastOrder(null);

        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${currentUser.email}`
      );

      const data = await res.json();

      setLastOrder(
        data?.[0] || null
      );

    } catch (err) {

      console.log(err);

    }

  };

  // INITIAL FETCH
  fetchLatestOrder();

  // REALTIME ORDER UPDATE
  const handleOrderPlaced = () => {

  setTimeout(() => {

    fetchLatestOrder();

  }, 1200);

};

  window.addEventListener(
    "orderPlaced",
    handleOrderPlaced
  );

  return () => {

    window.removeEventListener(
      "orderPlaced",
      handleOrderPlaced
    );

  };

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
useEffect(() => {

  const handleScroll = () => {

    if (window.scrollY > 40) {
      setNavbarScrolled(true);
    } else {
      setNavbarScrolled(false);
    }

  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );

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
  className={`earth-navbar ${
    navbarScrolled ? "scrolled" : ""
  }`}
>

  <div
  className="nav-inner"
  style={{
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}
>

  {/* LOGO */}
  <NavLink to="/">
    <img
      src={logo}
      alt="Earthkind Naturals"
      style={{
        width:
          window.innerWidth <= 768
            ? "140px"
            : "170px",

        objectFit: "contain",

        filter: navbarScrolled
          ? "brightness(0) invert(1)"
          : "brightness(0) saturate(100%) sepia(22%) hue-rotate(85deg)"
      }}
    />
  </NavLink>

  {/* NAV LINKS */}
  <div
    className={`nav-links ${
      mobileNav ? "active" : ""
    }`}
  >

    <NavLink
      to="/"
      className="nav-link"
      style={{ color: navTextColor }}
      onClick={() =>
        setMobileNav(false)
      }
    >
      Home
    </NavLink>

    <NavLink
      to="/shop"
      className="nav-link"
      style={{ color: navTextColor }}
      onClick={() =>
        setMobileNav(false)
      }
    >
      Shop
    </NavLink>

<div
  className="nav-link"
  style={{
    color: navTextColor,
    cursor: "pointer",
  }}
  onClick={() => {

    setMobileNav(false);

    if (window.location.pathname !== "/") {

      navigate("/");

      setTimeout(() => {

        const section =
          document.getElementById("categories");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }

      }, 300);

    } else {

      const section =
        document.getElementById("categories");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }

    }

  }}
>
  Categories
</div>
   <div
  className="nav-link"
  style={{
    color: navTextColor,
    cursor: "pointer",
  }}
  onClick={() => {

    setMobileNav(false);

    if (window.location.pathname !== "/") {

      navigate("/");

      setTimeout(() => {

        const section =
          document.getElementById("wellness");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }

      }, 300);

    } else {

      const section =
        document.getElementById("wellness");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }

    }

  }}
>
  Wellness
</div>

<div
  className="nav-link"
  style={{
    color: navTextColor,
    cursor: "pointer",
  }}
  onClick={() => {

    setMobileNav(false);

    if (window.location.pathname !== "/") {

      navigate("/");

      setTimeout(() => {

        const section =
          document.getElementById("about");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }

      }, 300);

    } else {

      const section =
        document.getElementById("about");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }

    }

  }}
>
  About
</div>
  </div>

  {/* RIGHT SIDE */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap:
        window.innerWidth <= 768
          ? "14px"
          : "20px"
    }}
  >

    {/* WISHLIST */}
    <div
      style={{
        position: "relative",
        cursor: "pointer"
      }}
    >
      <FiHeart
        onClick={() =>
          navigate("/wishlist")
        }
        style={{
          fontSize:
            window.innerWidth <= 768
              ? "22px"
              : "25px",

          color: navTextColor
        }}
      />

      <span
        style={{
          position: "absolute",

          top: "-8px",

          right: "-10px",

          background: "#d8ef7f",

          color: "#163923",

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

    {/* CART */}
    <div
      style={{
        position: "relative"
      }}
    >
      <NavLink to="/cart">

        <FiShoppingCart
          className="cart-icon"
          style={{
            fontSize:
              window.innerWidth <= 768
                ? "24px"
                : "27px",

            color: navTextColor
          }}
        />

      </NavLink>

      <span
        style={{
          position: "absolute",

          top: "-8px",

          right: "-10px",

          background: "#d8ef7f",

          color: "#163923",

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
        {cartCount}
      </span>
    </div>
    {/* ADMIN BUTTON */}

{user?.isAdmin && (

  <button

    onClick={() => navigate("/admin")}

    style={{

      padding:
        window.innerWidth <= 768
          ? "8px 12px"
          : "10px 16px",

      borderRadius: "12px",

      border: "none",

      background: "#163923",

      color: "#fff",

      fontWeight: "600",

      fontSize:
        window.innerWidth <= 768
          ? "13px"
          : "14px",

      cursor: "pointer",

      transition: "0.3s ease"

    }}

  >
    Admin
  </button>

)}

    {/* USER */}
    <div
      style={{
        position: "relative"
      }}
    >

      <FiUser
        onClick={(e) => {

          e.stopPropagation();

          if (user) {
            setShowMenu(!showMenu);
          } else {
            setShowAuth(true);
          }

        }}

        style={{
          fontSize:
            window.innerWidth <= 768
              ? "24px"
              : "26px",

          color: navTextColor,

          cursor: "pointer"
        }}
      />
      {showMenu && (
  <AccountPanel
    user={user}
    lastOrder={lastOrder}
    setShowMenu={setShowMenu}
  />
)}

     

    </div>

    {/* MOBILE MENU BUTTON */}
    <div
      className="mobile-menu-btn"

      onClick={() =>
        setMobileNav(!mobileNav)
      }
    >
      <span />
      <span />
      <span />
    </div>

  </div>

</div>

</nav>  
<div
  style={{
    height:
      window.innerWidth <= 768
        ? "82px"
        : "150px"
  }}
/>
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

  
   <footer className="earth-footer">

  <div className="container">

    <div className="footer-grid">

      {/* BRAND */}
      <div>

        <img
          src={logo}
          alt="Earthkind Naturals"

          style={{
            width: "190px",

            marginBottom: "26px",

            filter:
              "brightness(0) invert(1)"
          }}
        />

        <p className="footer-text">
          Premium herbal wellness
          products crafted with
          nature-inspired ingredients
          designed for healthy,
          mindful modern living.
        </p>

      </div>

     {/* LINKS */}
<div>

  <h3 className="footer-title">
    Quick Links
  </h3>

  {/* HOME */}
  <div
    className="footer-link"
    style={{ cursor: "pointer" }}
    onClick={() => {

  navigate("/");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

}}
  >
    Home
  </div>

  {/* SHOP */}
  <div
    className="footer-link"
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/shop")}
  >
    Shop
  </div>

  {/* CATEGORIES */}
  <div
    className="footer-link"
    style={{ cursor: "pointer" }}
    onClick={() => {

      if (window.location.pathname !== "/") {

        navigate("/");

        setTimeout(() => {

          const section =
            document.getElementById("categories");

          if (section) {
            section.scrollIntoView({
              behavior: "smooth",
            });
          }

        }, 300);

      } else {

        const section =
          document.getElementById("categories");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }

      }

    }}
  >
    Categories
  </div>

  {/* ABOUT */}
  <div
    className="footer-link"
    style={{ cursor: "pointer" }}
    onClick={() => {

      if (window.location.pathname !== "/") {

        navigate("/");

        setTimeout(() => {

          const section =
            document.getElementById("about");

          if (section) {
            section.scrollIntoView({
              behavior: "smooth",
            });
          }

        }, 300);

      } else {

        const section =
          document.getElementById("about");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }

      }

    }}
  >
    About
  </div>

</div>
     {/* CONTACT */}
<div>

  <h3 className="footer-title">
    Contact
  </h3>

  {/* EMAIL */}
  <a
    href="mailto:support@earthkindnaturals.com"
    className="footer-text"
    style={{
      display: "block",
      textDecoration: "none",
      color: "#fff",
      transition: "0.3s ease",
    }}
  >
    support@earthkindnaturals.com
  </a>

  {/* PHONE */}
  <a
    href="tel:+919027186252"
    className="footer-text"
    style={{
      display: "block",
      marginTop: "12px",
      textDecoration: "none",
      color: "#fff",
      transition: "0.3s ease",
    }}
  >
    +91 9027186252
  </a>

  {/* INSTAGRAM */}
  <a
    href="https://instagram.com/earthkind_naturals"
    target="_blank"
    rel="noreferrer"
    className="footer-text"
    style={{
      display: "block",
      marginTop: "12px",
      textDecoration: "none",
      color: "#fff",
      transition: "0.3s ease",
    }}
  >
    Instagram: @earthkind_naturals
  </a>

</div>
{/* WELLNESS */}
<div>

  <h3 className="footer-title">
    Wellness
  </h3>

  {/* HERBAL POWDERS */}
  <p
    className="footer-text"
    onClick={() =>
      navigate("/shop", {
        state: {
          selectedCategory: "Herbal Powders"
        }
      })
    }

    style={{
      cursor: "pointer"
    }}
  >
    Pure Herbal Powders
  </p>

  {/* SEEDS */}
  <p
    className="footer-text"

    onClick={() =>
      navigate("/shop", {
        state: {
          selectedCategory: "Natural Seeds"
        }
      })
    }

    style={{
      marginTop: "12px",
      cursor: "pointer"
    }}
  >
    Premium Seeds
  </p>

  {/* DRY FRUITS */}
  <p
    className="footer-text"

    onClick={() =>
      navigate("/shop", {
        state: {
          selectedCategory: "Nuts & Dry Fruits"
        }
      })
    }

    style={{
      marginTop: "12px",
      cursor: "pointer"
    }}
  >
    Luxury Dry Fruits
  </p>

  {/* HERBAL TEA */}
  <p
    className="footer-text"

    onClick={() =>
      navigate("/shop", {
        state: {
          selectedCategory: "Herbal Tea"
        }
      })
    }

    style={{
      marginTop: "12px",
      cursor: "pointer"
    }}
  >
    Wellness Blends
  </p>

</div>
    </div>

    <div className="footer-bottom">

      © 2026 EARTHKIND NATURALS —
      Crafted With Nature 🌿

    </div>

  </div>

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