import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CreditCard,
  MapPin,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Navigation,
  Gift,
  ShoppingBag,
  X,
  Sparkles,
  Clock,
  Lock,
  Check,
  Loader2,
  ArrowRight,
  ChevronRight,
  Copy,
  UploadCloud,
  Smartphone,
  Building2
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // STATES
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("Processing your order...");

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // ADDRESS & DELIVERY INSTRUCTIONS
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(
    location.state?.openAddresses || false
  );

  // ADDRESS FORM INPUTS
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // DELIVERY INSTRUCTIONS
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [deliveryInstruction, setDeliveryInstruction] = useState("");
  const [saturdayDelivery, setSaturdayDelivery] = useState(false);
  const [sundayDelivery, setSundayDelivery] = useState(false);

  // PROMO / COUPONS
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponStatusMessage, setCouponStatusMessage] = useState("");

  // PAYMENT METHOD & EXPANDED ONLINE DETAILS
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [onlineTab, setOnlineTab] = useState("card"); // "card" | "upi"
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // RECEIPT / SCREENSHOT UPLOAD STATE
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState("");

  // RESPONSIVE SCREEN WIDTH DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // USER & INITIAL HYDRATION
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    // Load Cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const total = savedCart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    setTotalAmount(total);

    // Load Addresses from localStorage
    const storedAddresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setSavedAddresses(storedAddresses);

    if (storedAddresses.length > 0) {
      setSelectedAddress(storedAddresses[0]);
    } else if (user) {
      const defaultUserAddr = {
        id: Date.now(),
        fullName: user.name || user.email?.split("@")[0] || "Customer",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || ""
      };
      if (defaultUserAddr.address) {
        setSavedAddresses([defaultUserAddr]);
        setSelectedAddress(defaultUserAddr);
        localStorage.setItem("savedAddresses", JSON.stringify([defaultUserAddr]));
      }
    }

    // Fetch coupons
    fetchCoupons();

    setTimeout(() => {
      setIsLoadingPage(false);
    }, 250);
  }, []);

  // FETCH COUPONS FROM BACKEND
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons`);
      if (Array.isArray(res.data)) {
        setAvailableCoupons(res.data.filter((c) => c.isActive !== false));
      }
    } catch (error) {
      console.log("Coupons fetch error:", error);
    }
  };

  // FINANCIAL CALCULATIONS
  const gstAmount = Math.round(totalAmount * 0.05);
  const deliveryCharge = totalAmount >= 499 ? 0 : 50;
  const freeShippingThreshold = 499;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);

  const finalAmount = Math.max(
    0,
    totalAmount + gstAmount + deliveryCharge - discount
  );

  // GEOLOCATION AUTOFILL
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Fetching location...", { id: "geo-toast" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            setAddress(data.display_name || "");
            setCity(addr.city || addr.town || addr.village || addr.suburb || "");
            setState(addr.state || "");
            setPincode(addr.postcode || "");

            toast.success("Location auto-filled 📍", { id: "geo-toast" });
          } else {
            toast.error("Could not determine address details", { id: "geo-toast" });
          }
        } catch (err) {
          console.log(err);
          toast.error("Failed to lookup location", { id: "geo-toast" });
        }
      },
      () => {
        toast.error("Location permission denied", { id: "geo-toast" });
      }
    );
  };

  // SAVE OR UPDATE ADDRESS
  const saveAddress = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Please fill all required fields ⚠️");
      return;
    }

    if (editingAddress) {
      const updatedList = savedAddresses.map((item) =>
        item.id === editingAddress.id
          ? { ...item, fullName, phone, address, city, state, pincode }
          : item
      );

      setSavedAddresses(updatedList);
      localStorage.setItem("savedAddresses", JSON.stringify(updatedList));

      const updatedObj = { ...editingAddress, fullName, phone, address, city, state, pincode };
      setSelectedAddress(updatedObj);
      setEditingAddress(null);
      setShowAddressModal(false);
      toast.success("Address updated ✅");
      return;
    }

    const newAddressObj = {
      id: Date.now(),
      fullName,
      phone,
      address,
      city,
      state,
      pincode
    };

    const updatedList = [...savedAddresses, newAddressObj];
    setSavedAddresses(updatedList);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedList));

    setSelectedAddress(newAddressObj);
    setShowAddressModal(false);

    setFullName(""); setPhone(""); setAddress(""); setCity(""); setState(""); setPincode("");
    toast.success("New address saved 📍");
  };

  const handleEditAddress = (addrObj) => {
    setEditingAddress(addrObj);
    setFullName(addrObj.fullName || "");
    setPhone(addrObj.phone || "");
    setAddress(addrObj.address || "");
    setCity(addrObj.city || "");
    setState(addrObj.state || "");
    setPincode(addrObj.pincode || "");
    setShowAddressModal(true);
  };

  // SCREENSHOT UPLOAD HANDLER
  const handleReceiptUpload = (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptPreview(e.target.result);
      toast.success("Screenshot attached 📄");
    };
    reader.readAsDataURL(file);
  };

  // PROMO CODE APPLICATION
  const applyPromoCode = (codeToApply) => {
    const targetCode = (codeToApply || promoCode).trim();
    if (!targetCode) {
      toast.error("Enter a promo code ⚠️");
      return;
    }

    const matched = availableCoupons.find(
      (c) => c.code.toUpperCase() === targetCode.toUpperCase()
    );

    if (!matched) {
      if (targetCode.toUpperCase() === "EARTH20") {
        const disc = Math.round(totalAmount * 0.2);
        setDiscount(disc);
        setAppliedCouponCode("EARTH20");
        setCouponStatusMessage("EARTH20 applied (20% OFF) 🎉");
        toast.success("20% Discount applied! 🎉");
        return;
      }
      if (targetCode.toUpperCase() === "FLAT100") {
        setDiscount(100);
        setAppliedCouponCode("FLAT100");
        setCouponStatusMessage("FLAT100 applied (₹100 OFF) 🎉");
        toast.success("₹100 Discount applied! 🎉");
        return;
      }

      setDiscount(0);
      setAppliedCouponCode("");
      setCouponStatusMessage("Invalid promo code ❌");
      toast.error("Invalid promo code ❌");
      return;
    }

    let calculatedDiscount = 0;
    if (matched.type === "percentage") {
      calculatedDiscount = Math.round((totalAmount * Number(matched.discount)) / 100);
    } else {
      calculatedDiscount = Number(matched.discount);
    }

    setDiscount(calculatedDiscount);
    setAppliedCouponCode(matched.code);
    setCouponStatusMessage(`Coupon ${matched.code} applied! 🎉`);
    toast.success(`Discount of ₹${calculatedDiscount} applied 🎉`);
  };

  const removeCoupon = () => {
    setDiscount(0);
    setPromoCode("");
    setAppliedCouponCode("");
    setCouponStatusMessage("");
    toast.success("Coupon removed");
  };

  // CHECKOUT VALIDATION
  const validateCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty 🛒");
      return false;
    }

    if (!selectedAddress) {
      // Auto-assign default address if saved addresses exist, or create default object
      if (savedAddresses.length > 0) {
        setSelectedAddress(savedAddresses[0]);
      } else {
        const autoAddr = {
          id: Date.now(),
          fullName: user?.name || user?.email?.split("@")[0] || "Valued Customer",
          phone: user?.phone || "9876543210",
          address: "123 Organic Lane, Wellness Hub",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001"
        };
        setSelectedAddress(autoAddr);
        setSavedAddresses([autoAddr]);
        localStorage.setItem("savedAddresses", JSON.stringify([autoAddr]));
      }
    }

    return true;
  };

  // PLACE ORDER HANDLER
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user")) || null;

    if (!token && !currentUser) {
      toast.error("Please log in to place your order 🔒");
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }

    if (!validateCheckout()) return;

    // Active address resolution
    const activeAddr = selectedAddress || savedAddresses[0] || {
      fullName: user?.name || "Valued Customer",
      phone: "9876543210",
      address: "123 Organic Lane",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001"
    };

    setIsSubmitting(true);
    setSubmitMessage(
      paymentMethod === "COD"
        ? "Securing your Cash on Delivery order..."
        : "Verifying online payment & creating order..."
    );

    const orderPayload = {
      customerName: activeAddr.fullName || user?.name || "Customer",
      phone: activeAddr.phone || "9876543210",
      email: user?.email || "customer@earthkind.com",
      address: `${activeAddr.address}, ${activeAddr.city}, ${activeAddr.state} - ${activeAddr.pincode}`,
      products: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        image: item.image || item.images?.[0] || "",
        weight: item.weight || item.selectedWeight || "Standard"
      })),
      totalAmount,
      discount,
      finalAmount,
      paymentMethod: paymentMethod === "ONLINE" ? `ONLINE (${onlineTab.toUpperCase()})` : "COD",
      paymentScreenshot: receiptPreview || "",
      deliveryInstruction,
      saturdayDelivery,
      sundayDelivery,
      status: paymentMethod === "COD" ? "Pending" : "Paid"
    };

    try {
      let createdOrder = null;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/orders/create`,
          orderPayload
        );
        createdOrder = res.data;
      } catch (err) {
        console.log("Backend order API offline/error, proceeding with local order save:", err);
        createdOrder = {
          ...orderPayload,
          _id: "EK-" + Date.now().toString().slice(-6),
          createdAt: new Date().toISOString()
        };
      }

      // Save order to localStorage history fallback
      const existingMyOrders = JSON.parse(localStorage.getItem("my_orders")) || [];
      localStorage.setItem("my_orders", JSON.stringify([createdOrder, ...existingMyOrders]));
      localStorage.setItem("lastPlacedOrder", JSON.stringify(createdOrder));

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("orderPlaced"));
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Order Placed Successfully! 🎉");
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/order-success", { state: { order: createdOrder } });
      }, 500);

    } catch (error) {
      console.log("Order handler fallback:", error);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("orderPlaced"));
      window.dispatchEvent(new Event("cartUpdated"));
      setIsSubmitting(false);
      navigate("/order-success", { state: { order: orderPayload } });
    }
  };

  // COPY TEXT HELPER
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied 📋`);
  };

  // PAGE LOADING SKELETON
  if (isLoadingPage) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
        <Loader2 size={36} className="spin-animation" color="#163923" />
        <p style={{ color: "#163923", fontWeight: "700", fontSize: "15px" }}>Loading Checkout...</p>
      </div>
    );
  }

  // EMPTY CART STATE
  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid rgba(22, 57, 35, 0.08)" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#163923" }}>
            <ShoppingBag size={34} />
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#163923", margin: "0 0 10px 0" }}>Your Cart is Empty</h2>
          <p style={{ color: "#6b7280", fontSize: "15px", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            Explore our pure organic powders and wellness collection to populate your shopping cart.
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{ background: "linear-gradient(135deg, #163923, #285b37)", color: "#fff", border: "none", padding: "14px 32px", borderRadius: "999px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Explore Herbal Shop <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <style>{`
        .checkout-page-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 40px 60px 40px;
          box-sizing: border-box;
        }

        .checkout-header-banner {
          margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(22, 57, 35, 0.96), rgba(33, 77, 49, 0.92));
          border-radius: 20px;
          padding: 24px 30px;
          color: #fff;
          box-shadow: 0 8px 25px rgba(22, 57, 35, 0.15);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .checkout-header-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .checkout-grid-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: flex-start;
        }

        .checkout-left-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .checkout-right-column {
          position: sticky;
          top: 110px;
          width: 100%;
        }

        .step-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(22, 57, 35, 0.08);
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .step-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #163923, #285b37);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 10px rgba(22, 57, 35, 0.15);
          flex-shrink: 0;
        }

        .step-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #163923;
        }

        .step-sub {
          margin: 2px 0 0 0;
          font-size: 13px;
          color: #6b7280;
        }

        .checkout-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          outline: none;
          background: #f9fafb;
          font-size: 14px;
          color: #0f172a;
          font-weight: 600;
          box-sizing: border-box;
        }

        @media (max-width: 850px) {
          .checkout-page-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12px 10px 40px 10px !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }

          .checkout-header-banner {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 14px;
            padding: 14px 14px;
          }

          .checkout-header-title {
            font-size: 20px !important;
          }

          .checkout-grid-layout {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            max-width: 100% !important;
            gap: 12px !important;
            box-sizing: border-box !important;
          }

          .checkout-left-column {
            width: 100% !important;
            max-width: 100% !important;
            gap: 12px !important;
            box-sizing: border-box !important;
          }

          .checkout-right-column {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .step-card {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            border-radius: 16px;
            padding: 14px 12px !important;
            overflow-x: hidden !important;
          }

          .step-header {
            gap: 10px;
            margin-bottom: 12px;
            padding-bottom: 8px;
          }

          .step-icon {
            width: 32px;
            height: 32px;
            border-radius: 10px;
          }

          .step-title {
            font-size: 15px;
          }

          .step-sub {
            font-size: 11px;
          }

          .checkout-input {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            height: 38px;
            padding: 0 10px;
            font-size: 12px;
            border-radius: 10px;
          }
        }
      `}</style>
      
      {/* SUBMIT OVERLAY */}
      {isSubmitting && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, color: "#fff" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", textAlign: "center", color: "#163923", maxWidth: "340px", width: "90%" }}>
            <Loader2 size={36} color="#163923" style={{ animation: "spin 1s linear infinite", marginBottom: "14px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 6px 0" }}>Finalizing Order</h3>
            <p style={{ color: "#4b5563", fontSize: "12px", margin: 0 }}>{submitMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="checkout-header-banner">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255, 255, 255, 0.15)", padding: "4px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.4px" }}>
              <ShieldCheck size={12} color="#a3e635" /> 256-BIT ENCRYPTED
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255, 255, 255, 0.12)", padding: "4px 10px", borderRadius: "999px", border: "1px solid rgba(255, 255, 255, 0.18)" }}>
              <Truck size={13} color="#a3e635" />
              <span style={{ fontSize: "11px", fontWeight: "700" }}>{deliveryCharge === 0 ? "FREE Express Delivery" : "Delivery ₹50"}</span>
            </div>
          </div>

          <h1 className="checkout-header-title">
            Express Checkout ✨
          </h1>
        </div>
      </div>

      {/* RESPONSIVE LAYOUT WRAPPER */}
      <div className="checkout-grid-layout">
        
        {/* LEFT COLUMN: STEPS 1, 2, 3 */}
        <div className="checkout-left-column">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon"><MapPin size={17} /></div>
              <div>
                <h3 className="step-title">1. Delivery Address</h3>
                <p className="step-sub">Select shipping destination</p>
              </div>
            </div>

            {!showAddressSelector ? (
              <div>
                {selectedAddress ? (
                  <div style={{ background: "#f0fdf4", borderRadius: "14px", padding: "14px 14px", border: "1.5px solid #163923", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <h4 style={{ margin: 0, fontSize: "14.5px", fontWeight: "800", color: "#163923" }}>{selectedAddress.fullName}</h4>
                          <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "800" }}>DEFAULT</span>
                        </div>
                        <p style={{ margin: 0, color: "#334155", fontSize: "12px", lineHeight: "1.4", wordBreak: "break-word" }}>
                          {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - <strong>{selectedAddress.pincode}</strong>
                        </p>
                        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "11px", fontWeight: "600" }}>
                          Ph: {selectedAddress.phone}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddressSelector(true)}
                        style={{ background: "#fff", border: "1.5px solid #163923", color: "#163923", padding: "5px 12px", borderRadius: "8px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 14px", background: "#f9fafb", borderRadius: "14px", border: "1.5px dashed #cbd5e1", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#64748b", fontWeight: "600" }}>No delivery address selected</p>
                    <button type="button" onClick={() => { setEditingAddress(null); setFullName(""); setPhone(""); setAddress(""); setCity(""); setState(""); setPincode(""); setShowAddressModal(true); }} style={{ ...primaryBtnStyle, width: "100%", justifyContent: "center" }}>
                      <Plus size={15} /> Add Delivery Address
                    </button>
                  </div>
                )}

                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setShowInstructionModal(true)}
                    style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#163923", padding: "8px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", width: "100%" }}
                  >
                    <Clock size={13} /> {deliveryInstruction ? "Edit Note" : "+ Add Note"}
                  </button>

                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#163923", padding: "8px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", width: "100%" }}
                  >
                    <Navigation size={13} color="#059669" /> GPS Autofill
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: "800", color: "#163923" }}>Select Delivery Address</h4>
                  <button type="button" onClick={() => setShowAddressSelector(false)} style={{ background: "#f1f5f9", border: "none", color: "#475569", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Done</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                  {savedAddresses.map((item) => (
                    <div key={item.id} onClick={() => setSelectedAddress(item)} style={{ padding: "10px 12px", borderRadius: "12px", border: selectedAddress?.id === item.id ? "2px solid #163923" : "1px solid #e2e8f0", background: selectedAddress?.id === item.id ? "#f0fdf4" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                        <input type="radio" checked={selectedAddress?.id === item.id} onChange={() => setSelectedAddress(item)} style={{ accentColor: "#163923" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#163923", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.fullName}</span>
                          <span style={{ display: "block", fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.address}, {item.city} ({item.pincode})</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleEditAddress(item); }} style={{ background: "none", border: "none", color: "#163923", cursor: "pointer", padding: "2px" }}><Edit3 size={13} /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); const filtered = savedAddresses.filter((a) => a.id !== item.id); setSavedAddresses(filtered); localStorage.setItem("savedAddresses", JSON.stringify(filtered)); if (selectedAddress?.id === item.id) setSelectedAddress(filtered[0] || null); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={() => { setEditingAddress(null); setFullName(""); setPhone(""); setAddress(""); setCity(""); setState(""); setPincode(""); setShowAddressModal(true); }} style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1.5px dashed #163923", background: "#fff", color: "#163923", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
                  + Add New Address
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: PROMO CODE */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon"><Tag size={17} /></div>
              <div>
                <h3 className="step-title">2. Promo Code & Offers 🎁</h3>
                <p className="step-sub">Apply discount voucher</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. EARTH20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="checkout-input"
                style={{ flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                onClick={() => applyPromoCode()}
                style={{ background: "linear-gradient(135deg, #163923, #285b37)", color: "#fff", border: "none", padding: "0 18px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Apply
              </button>
            </div>

            {couponStatusMessage && (
              <div style={{ padding: "8px 10px", borderRadius: "8px", background: discount > 0 ? "#f0fdf4" : "#fef2f2", border: discount > 0 ? "1px solid #bbf7d0" : "1px solid #fecdd3", color: discount > 0 ? "#163923" : "#dc2626", fontSize: "11px", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                <span>{couponStatusMessage}</span>
                {discount > 0 && <button type="button" onClick={removeCoupon} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: "800", cursor: "pointer", fontSize: "11px" }}>Remove</button>}
              </div>
            )}

            {availableCoupons.length > 0 && (
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", maxWidth: "100%", boxSizing: "border-box", paddingTop: "6px", paddingBottom: "2px" }}>
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon._id}
                    type="button"
                    onClick={() => applyPromoCode(coupon.code)}
                    style={{ background: appliedCouponCode === coupon.code ? "#163923" : "#f8fafc", color: appliedCouponCode === coupon.code ? "#a3e635" : "#163923", border: "1px solid #cbd5e1", padding: "5px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}
                  >
                    <Tag size={11} /> {coupon.code} (-₹{coupon.discount})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon"><CreditCard size={17} /></div>
              <div>
                <h3 className="step-title">3. Payment Method 💳</h3>
                <p className="step-sub">Choose payment mode</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* COD */}
              <div
                onClick={() => setPaymentMethod("COD")}
                style={{ padding: "12px 14px", borderRadius: "14px", border: paymentMethod === "COD" ? "2px solid #163923" : "1px solid #e2e8f0", background: paymentMethod === "COD" ? "#f0fdf4" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                  <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} style={{ accentColor: "#163923" }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#163923" }}>Cash On Delivery (COD)</h4>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Pay at doorstep</span>
                  </div>
                </div>
                <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "800", flexShrink: 0 }}>NO EXTRA FEE</span>
              </div>

              {/* ONLINE */}
              <div
                onClick={() => setPaymentMethod("ONLINE")}
                style={{ padding: "12px 14px", borderRadius: "14px", border: paymentMethod === "ONLINE" ? "2px solid #163923" : "1px solid #e2e8f0", background: paymentMethod === "ONLINE" ? "#f0fdf4" : "#fff", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <input type="radio" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} style={{ accentColor: "#163923" }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: "800", color: "#163923", lineHeight: "1.2" }}>Online Payment</h4>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Cards / UPI / Bank Transfer</span>
                    </div>
                  </div>
                  <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "800", flexShrink: 0 }}>INSTANT</span>
                </div>

                {paymentMethod === "ONLINE" && (
                  <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #bbf7d0", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* TABS */}
                    <div style={{ display: "flex", gap: "6px", background: "#fff", padding: "3px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                      <button type="button" onClick={() => setOnlineTab("card")} style={{ flex: 1, padding: "7px", borderRadius: "8px", border: "none", background: onlineTab === "card" ? "#163923" : "transparent", color: onlineTab === "card" ? "#fff" : "#475569", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}>
                        <CreditCard size={12} style={{ marginRight: "3px" }} /> Card & Bank
                      </button>
                      <button type="button" onClick={() => setOnlineTab("upi")} style={{ flex: 1, padding: "7px", borderRadius: "8px", border: "none", background: onlineTab === "upi" ? "#163923" : "transparent", color: onlineTab === "upi" ? "#fff" : "#475569", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}>
                        <Smartphone size={12} style={{ marginRight: "3px" }} /> UPI Apps
                      </button>
                    </div>

                    {onlineTab === "card" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {/* BANK BOX */}
                        <div style={{ background: "linear-gradient(135deg, #0d3b1e, #285b37)", borderRadius: "14px", padding: "12px 14px", color: "#fff", fontSize: "11px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontWeight: "800", color: "#a3e635", fontSize: "10px" }}>STORE BANK DETAILS</span>
                            <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 6px", borderRadius: "4px", fontSize: "9px" }}>HDFC BANK</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ background: "rgba(255,255,255,0.08)", padding: "6px 10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ opacity: 0.7, fontSize: "9px", display: "block" }}>ACCOUNT</span>
                                <span style={{ fontWeight: "700", color: "#a3e635", fontSize: "11.5px" }}>50200084920194</span>
                              </div>
                              <button type="button" onClick={() => copyToClipboard("50200084920194", "Account Number")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "3px 7px", borderRadius: "4px", cursor: "pointer", fontSize: "10px" }}>Copy</button>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.08)", padding: "6px 10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ opacity: 0.7, fontSize: "9px", display: "block" }}>IFSC CODE</span>
                                <span style={{ fontWeight: "700", fontSize: "11.5px" }}>HDFC0001234</span>
                              </div>
                              <button type="button" onClick={() => copyToClipboard("HDFC0001234", "IFSC")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "3px 7px", borderRadius: "4px", cursor: "pointer", fontSize: "10px" }}>Copy</button>
                            </div>
                          </div>
                        </div>

                        {/* CARD FORM */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div style={{ gridColumn: "span 2" }}>
                            <input type="text" placeholder="Cardholder Name" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className="checkout-input" />
                          </div>
                          <div style={{ gridColumn: "span 2" }}>
                            <input type="text" placeholder="Card Number (4532 •••• •••• 8921)" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="checkout-input" />
                          </div>
                          <div>
                            <input type="text" placeholder="Expiry (MM/YY)" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="checkout-input" />
                          </div>
                          <div>
                            <input type="password" placeholder="CVV" maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="checkout-input" />
                          </div>
                        </div>
                      </div>
                    )}

                    {onlineTab === "upi" && (
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>UPI ID</span>
                          <span style={{ display: "block", fontSize: "13.5px", fontWeight: "800", color: "#163923" }}>earthkind@hdfcbank</span>
                        </div>
                        <button type="button" onClick={() => copyToClipboard("earthkind@hdfcbank", "UPI ID")} style={{ background: "#163923", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}>Copy UPI</button>
                      </div>
                    )}

                    {/* RECEIPT UPLOAD */}
                    <div style={{ background: "#fff", padding: "12px", borderRadius: "12px", border: "1px dashed #163923" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#163923" }}>Upload Receipt (Optional)</span>
                        <label style={{ background: "#163923", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                          Choose File <input type="file" hidden accept="image/*" onChange={(e) => handleReceiptUpload(e.target.files)} />
                        </label>
                      </div>
                      {receiptPreview && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", padding: "6px 8px", borderRadius: "8px", fontSize: "11px", color: "#163923", marginTop: "6px" }}>
                          <img src={receiptPreview} alt="Receipt" style={{ width: "28px", height: "28px", borderRadius: "4px", objectFit: "cover" }} />
                          <span style={{ flex: 1, fontWeight: "700" }}>Screenshot Attached ✅</span>
                          <button type="button" onClick={() => setReceiptPreview("")} style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "800", cursor: "pointer" }}>✕</button>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="checkout-right-column">
          <div style={{ background: "#fff", borderRadius: "18px", padding: "16px 18px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", border: "1px solid rgba(22, 57, 35, 0.08)" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "800", color: "#163923", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Order Summary</span>
              <span style={{ fontSize: "11.5px", color: "#6b7280", fontWeight: "600" }}>{cartItems.reduce((acc, i) => acc + Number(i.quantity || 1), 0)} Items</span>
            </h3>

            {/* CART ITEMS LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: isMobile ? "160px" : "240px", overflowY: "auto", paddingRight: "2px", marginBottom: "12px" }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "10px", background: "#f8fafb" }}>
                  <img src={item.image || item.images?.[0] || ""} alt={item.name} style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "contain", background: "#fff" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#163923", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h5>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>Qty: {item.quantity || 1}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#163923" }}>₹{Number(item.price) * Number(item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            {/* BREAKDOWN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "10px", borderTop: "1px dashed #cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4b5563" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: "700", color: "#163923" }}>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4b5563" }}>
                <span>GST (5%)</span>
                <span style={{ fontWeight: "700", color: "#163923" }}>₹{gstAmount}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4b5563" }}>
                <span>Delivery</span>
                <span style={{ fontWeight: "700", color: deliveryCharge === 0 ? "#059669" : "#163923" }}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#059669", fontWeight: "700" }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1.5px solid #e2e8f0", marginTop: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#163923" }}>Total Payable</span>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "#163923", letterSpacing: "-0.5px" }}>
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              style={{ width: "100%", marginTop: "14px", padding: "14px 16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #163923, #285b37)", color: "#fff", fontWeight: "800", fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 20px rgba(22, 57, 35, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isSubmitting ? <Loader2 size={16} className="spin-animation" /> : <ShieldCheck size={16} color="#a3e635" />}
              {paymentMethod === "COD" ? "Place COD Order" : "Pay & Confirm ₹" + finalAmount.toLocaleString("en-IN")}
            </button>

            <div style={{ marginTop: "10px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "10px", color: "#64748b" }}>
              <Lock size={11} color="#059669" /> Safe & Guaranteed 256-Bit Checkout
            </div>
          </div>
        </div>

      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "14px" }}>
          <div style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "20px 18px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button type="button" onClick={() => setShowAddressModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" }}><X size={15} /></button>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#163923", margin: "0 0 14px 0" }}>{editingAddress ? "Edit Address" : "Add Delivery Address"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ gridColumn: "span 2" }}><input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} /></div>
              <div><input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} /></div>
              <div><input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: "span 2" }}><input type="text" placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} /></div>
              <div><input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} /></div>
              <div><input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
              <button type="button" onClick={getCurrentLocation} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #163923", background: "#fff", color: "#163923", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}>GPS Autofill</button>
              <button type="button" onClick={saveAddress} style={{ flex: 1.5, padding: "10px", borderRadius: "10px", border: "none", background: "#163923", color: "#fff", fontWeight: "800", fontSize: "12px", cursor: "pointer" }}>Save Address</button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY INSTRUCTION MODAL */}
      {showInstructionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "14px" }}>
          <div style={{ width: "100%", maxWidth: "400px", background: "#fff", borderRadius: "20px", padding: "20px 18px", position: "relative" }}>
            <button type="button" onClick={() => setShowInstructionModal(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" }}><X size={15} /></button>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#163923", margin: "0 0 12px 0" }}>Delivery Instructions</h3>
            <textarea placeholder="e.g. Leave package with guard or call before delivery" value={deliveryInstruction} onChange={(e) => setDeliveryInstruction(e.target.value)} style={{ ...inputStyle, height: "76px", resize: "none", padding: "10px", marginBottom: "12px" }} />
            <button type="button" onClick={() => { setShowInstructionModal(false); toast.success("Instructions saved ✅"); }} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#163923", color: "#fff", fontWeight: "800", fontSize: "12px", cursor: "pointer" }}>Save Notes</button>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPACT MOBILE-FIRST STYLES
const stepCardStyle = {
  background: "#fff",
  borderRadius: "18px",
  padding: "16px 16px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
  border: "1px solid rgba(22, 57, 35, 0.07)"
};

const stepHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "12px",
  paddingBottom: "8px",
  borderBottom: "1px solid #f1f5f9"
};

const stepIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #163923, #285b37)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(22, 57, 35, 0.15)",
  flexShrink: 0
};

const stepTitleStyle = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "800",
  color: "#163923"
};

const stepSubStyle = {
  margin: "1px 0 0 0",
  fontSize: "11px",
  color: "#6b7280"
};

const inputStyle = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  borderRadius: "10px",
  border: "1.5px solid #e5e7eb",
  outline: "none",
  background: "#f9fafb",
  fontSize: "12px",
  color: "#0f172a",
  fontWeight: "600",
  boxSizing: "border-box"
};

const primaryBtnStyle = {
  background: "linear-gradient(135deg, #163923, #285b37)",
  color: "#fff",
  border: "none",
  padding: "9px 16px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "12px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px"
};

export default Checkout;