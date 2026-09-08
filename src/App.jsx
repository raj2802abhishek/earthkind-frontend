import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
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
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaPinterestP,
  FaYoutube
} from "react-icons/fa";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Account from "./pages/Account";
import ForgotPassword from "./pages/ForgotPassword";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import HerbalPowders from "./pages/HerbalPowders";
import AuthModal from "./components/AuthModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wishlist from "./pages/Wishlist";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import AccountPanel from "./components/account/AccountPanel";
import LiveChatWidget from "./components/LiveChatWidget";
import HeaderSearchBar from "./components/HeaderSearchBar";
import toast from "react-hot-toast";
import { useTranslation } from "./utils/useTranslation";
import { setLanguage } from "./utils/translations";

function App() {
  const { lang, t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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

      {/* MOBILE NAV BACKDROP OVERLAY */}
      <div
        className={`mobile-nav-backdrop ${mobileNav ? "active" : ""}`}
        onClick={() => setMobileNav(false)}
      />

      {!isAdminRoute && (
        <nav
          className={`earth-navbar ${navbarScrolled ? "scrolled" : ""
            }`}
        >

        <div
          className="nav-inner"
        >

          {/* LOGO */}
          <NavLink to="/">
            <img
              src={logo}
              alt="Earthkind Naturals"
              className="nav-logo"
              style={{
                filter: navbarScrolled
                  ? "brightness(0) invert(1)"
                  : "brightness(0) saturate(100%) sepia(22%) hue-rotate(85deg)"
              }}
            />
          </NavLink>

          {/* NAV LINKS DRAWER */}
          <div
            className={`nav-links ${mobileNav ? "active" : ""
              }`}
          >
            <div className="mobile-drawer-header">
              <img src={logo} alt="Earthkind" style={{ height: "46px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>

            {/* MOBILE DRAWER USER PROFILE CARD */}
            <div
              className="mobile-drawer-user-profile"
              onClick={() => {
                setMobileNav(false);
                if (user) {
                  navigate("/account");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  setShowAuth(true);
                }
              }}
            >
              {user ? (
                <>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User Profile"
                      className="mobile-drawer-avatar"
                    />
                  ) : (
                    <div className="mobile-drawer-avatar-placeholder">
                      <FiUser size={20} />
                    </div>
                  )}
                  <div className="mobile-drawer-user-info">
                    <div className="mobile-drawer-user-name">
                      {user.name || user.fullName || user.firstName || user.email?.split("@")[0] || "User Account"}
                    </div>
                    <div className="mobile-drawer-user-sub">
                      {t("viewAccount", "View Account & Profile →")}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mobile-drawer-avatar-placeholder">
                    <FiUser size={20} />
                  </div>
                  <div className="mobile-drawer-user-info">
                    <div className="mobile-drawer-user-name">
                      {t("signInRegister", "Sign In / Register")}
                    </div>
                    <div className="mobile-drawer-user-sub">
                      {t("accessAccount", "Access orders & settings")}
                    </div>
                  </div>
                </>
              )}
            </div>

            <NavLink
              to="/"
              className="nav-link"
              style={{ color: navTextColor }}
              onClick={() => setMobileNav(false)}
            >
              {t("home", "Home")}
            </NavLink>

            <NavLink
              to="/shop"
              className="nav-link"
              style={{ color: navTextColor }}
              onClick={() => setMobileNav(false)}
            >
              {t("shop", "Shop")}
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
                    const section = document.getElementById("categories");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                } else {
                  const section = document.getElementById("categories");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {t("categories", "Categories")}
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
                    const section = document.getElementById("wellness");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                } else {
                  const section = document.getElementById("wellness");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {t("wellness", "Wellness")}
            </div>

            <NavLink
              to="/about"
              className="nav-link"
              style={{ color: navTextColor }}
              onClick={() => setMobileNav(false)}
            >
              {t("about", "About")}
            </NavLink>

            <NavLink
              to="/contact"
              className="nav-link"
              style={{ color: navTextColor }}
              onClick={() => setMobileNav(false)}
            >
              {t("contact", "Contact")}
            </NavLink>

            {/* MOBILE DRAWER QUICK ACTIONS */}
            <div className="mobile-drawer-footer">
              <NavLink
                to="/wishlist"
                className="mobile-drawer-btn"
                onClick={() => setMobileNav(false)}
              >
                <FiHeart size={18} /> {t("wishlist", "Wishlist")} ({wishlistCount})
              </NavLink>
              <NavLink
                to="/cart"
                className="mobile-drawer-btn primary"
                onClick={() => setMobileNav(false)}
              >
                <FiShoppingCart size={18} /> {t("cart", "Cart")} ({cartCount})
              </NavLink>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-actions">
            {/* SEARCH BAR */}
            <HeaderSearchBar
              navbarScrolled={navbarScrolled}
              navTextColor={navTextColor}
            />

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
                  fontSize: "24px",
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
                    fontSize: "25px",
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

                className="nav-admin-btn"

              >
                Admin
              </button>

            )}

            {/* USER PROFILE / LOGIN */}
            <div
              className="header-user-profile-wrapper"
              style={{
                position: "relative"
              }}
            >
              {user ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/account");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: navbarScrolled ? "rgba(255,255,255,0.18)" : "rgba(22, 57, 35, 0.08)",
                    border: navbarScrolled ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(22, 57, 35, 0.15)",
                    color: navTextColor,
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="avatar"
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <FiUser style={{ fontSize: "18px" }} />
                  )}
                  <span style={{ fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap" }}>
                    {(user.name || user.fullName || user.firstName || user.email?.split("@")[0] || "Account").trim().split(" ")[0]}
                  </span>
                </div>
              ) : (
                <FiUser
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuth(true);
                  }}
                  style={{
                    fontSize: "25px",
                    color: navTextColor,
                    cursor: "pointer"
                  }}
                />
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div
              className={`mobile-menu-btn ${mobileNav ? "open" : ""}`}
              onClick={() =>
                setMobileNav(!mobileNav)
              }
            >
              <span style={{ background: mobileNav ? "var(--accent)" : navTextColor }} />
              <span style={{ background: mobileNav ? "var(--accent)" : navTextColor }} />
              <span style={{ background: mobileNav ? "var(--accent)" : navTextColor }} />
            </div>

          </div>

        </div>

        </nav>
      )}
      {!isAdminRoute && <div className="nav-spacer" />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
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
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/pure-herbal-powders" element={<HerbalPowders />} />
        <Route path="/category/herbal-powders" element={<HerbalPowders />} />
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

              <div className="footer-social-wrapper">
                <span className="footer-social-heading">Follow Us</span>
                <div className="footer-social-links">
                  <a
                    href="https://instagram.com/earthkind_naturals"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn instagram"
                    aria-label="Instagram"
                    title="Instagram (@earthkind_naturals)"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://facebook.com/earthkindnaturals"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn facebook"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://wa.me/919027186252"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn whatsapp"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href="https://pinterest.com/earthkindnaturals"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn pinterest"
                    aria-label="Pinterest"
                    title="Pinterest"
                  >
                    <FaPinterestP />
                  </a>
                  <a
                    href="https://youtube.com/@earthkindnaturals"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn youtube"
                    aria-label="YouTube"
                    title="YouTube"
                  >
                    <FaYoutube />
                  </a>
                </div>
              </div>

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
                onClick={() => {
                  navigate("/shop");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Shop
              </div>

              {/* MY ORDERS / TRACK ORDER */}
              <div
                className="footer-link"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/my-orders");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                My Orders 📦
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
                  navigate("/about");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                About Us
              </div>

              {/* CONTACT US */}
              <div
                className="footer-link"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Contact Us
              </div>

            </div>
            {/* WELLNESS */}
            <div>

              <h3 className="footer-title">
                Wellness
              </h3>

              {/* HERBAL POWDERS */}
              <p
                className="footer-text"
                onClick={() => {
                  navigate("/pure-herbal-powders");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}

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
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
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

            </div>
          </div>

          <div className="footer-bottom">

            © 2026 EARTHKIND NATURALS —
            Crafted With Nature 🌿

          </div>

        </div>

      </footer>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        style={{ top: "90px" }}
      />

      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: 90,
          right: 20
        }}
      />

      {showAuth && (
        <AuthModal close={() => setShowAuth(false)} />
      )}

      {/* FLOATING REAL-TIME LIVE CHAT WIDGET */}
      <LiveChatWidget />
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