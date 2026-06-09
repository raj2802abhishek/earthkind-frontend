import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation
} from "react-router-dom";
import axios from "axios";
import { FiCreditCard } from "react-icons/fi";
import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function Checkout() {
const navigate = useNavigate();
const location = useLocation();
  const [showInstructionModal, setShowInstructionModal] =
  useState(false);

const [deliveryInstruction, setDeliveryInstruction] =
  useState("");

const [saturdayDelivery, setSaturdayDelivery] =
  useState(false);

const [sundayDelivery, setSundayDelivery] =
  useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState("COD");
    const [promoCode, setPromoCode] = useState("");
const [discount, setDiscount] = useState(0);
const [availableCoupons, setAvailableCoupons] = useState([]);
const [userCoupons, setUserCoupons] = useState([]);
const [message, setMessage] = useState("");
const [cartItems, setCartItems] = useState([]);
const [totalAmount, setTotalAmount] = useState(0);
const gstAmount =
  Math.round(totalAmount * 0.05);

const deliveryCharge =
  totalAmount >= 499 ? 0 : 50;

const finalAmount = Math.max(
  totalAmount +
  gstAmount +
  deliveryCharge -
  discount,
  0
);
const user = JSON.parse(localStorage.getItem("user"));
const validateCheckout = () => {
  console.log(selectedAddress);
  if (!selectedAddress) {
    alert("Please select or add a delivery address 📍");
    return false;
  }

  if (!paymentMethod) {
    alert("Please select a payment method 💳");
    return false;
  }

  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty 🛒");
    return false;
  }

  return true;
};


const handlePlaceOrder = async () => {
  console.log("HANDLE PLACE ORDER STARTED");
  if (!validateCheckout()) return;

  const orderData = {

  customerName: selectedAddress.fullName,

  phone: selectedAddress.phone,

  email: user?.email,

  address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,

products: cartItems.map((item) => ({
  _id: item._id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  image: item.image || item.images?.[0] || "",
  weight: item.weight || ""
})),

  totalAmount,

  discount,

  finalAmount:
    totalAmount +
    gstAmount +
    deliveryCharge -
    discount,

  paymentMethod,

  deliveryInstruction,

  saturdayDelivery,

  sundayDelivery,

  status:
    paymentMethod === "COD"
      ? "Pending"
      : "Paid"
};

  try {
if (paymentMethod === "COD") {

  /* INSTANT UI RESPONSE */
  localStorage.removeItem("cart");

  navigate("/order-success");

  /* SAVE ORDER IN BACKGROUND */
  axios.post(
    `${import.meta.env.VITE_API_URL}/api/orders/create`,
    orderData
  )
  .then(() => {

    /* REFRESH RECENT ORDER */
    window.dispatchEvent(
      new Event("orderPlaced")
    );

    toast.success(
      "Order placed with Cash on Delivery 🎉"
    );

  })
  .catch((error) => {

    console.log(error);

    toast.error("Order sync failed ❌");

  });

}
  else {

    // simulate payment
    const confirmPay =
      window.confirm(
        "Simulate payment success?"
      );

    if (!confirmPay) {

      toast.error("Payment failed ❌");

      return;
    }

    /* INSTANT NAVIGATION */
    localStorage.removeItem("cart");
    window.dispatchEvent(
  new Event("orderPlaced")
);

    navigate("/order-success");

    /* SAVE ORDER IN BACKGROUND */
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/create`,
      orderData
    )
    .then(() => {

      toast.success(
        "Payment successful & order placed 🎉"
      );

    })
    .catch((error) => {

      console.log(error);

      toast.error("Order sync failed ❌");

    });

  }

} catch (error) {

  console.log(error);

  toast.error("Order failed ❌");

}
};

const handleEditAddress = (address) => {
  setEditingAddress(address);

  setShowAddressModal(true);

setFullName(address.fullName || "");
setPhone(address.phone || "");
setAddress(address.address || "");
setCity(address.city || "");
setState(address.state || "");
setPincode(address.pincode || "");
};

const saveOrderToDB = async () => {
  const orderData = {
    customerName: selectedAddress.fullName,
    phone: selectedAddress.phone,
    address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
products: cartItems.map((item) => ({
  _id: item._id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  image: item.image || item.images?.[0] || "",
  weight: item.weight || ""
})),
    totalAmount,
    discount,
    finalAmount:
  totalAmount +
  gstAmount +
  deliveryCharge -
  discount,
    paymentMethod,
    status:
  paymentMethod === "COD"
    ? "Pending"
    : "Confirmed"
  };

  console.log(orderData.products);
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/create`,
      orderData
    );

    toast.success("Order placed successfully 🎉");

    localStorage.removeItem("cart");
    window.dispatchEvent(
  new Event("orderPlaced")
);
    window.location.href = "/order-success";

  } catch (error) {
    console.log(error);
    toast.error("Order failed ❌");
  }
};


const handleRazorpayPayment = async () => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/razorpay`,
      { amount: totalAmount - discount }
    );

    const options = {
      key: "rzp_test_SjotFbSI2cLHpy",
      amount: data.amount,
      currency: "INR",
      name: "Earthkind Naturals",
      description: "Order Payment",
      order_id: data.id,

      handler: async function (response) {
  try {
    const verify = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/verify`,
      response
    );

    if (verify.data.success) {
      toast.success("Payment Verified ✅");

      await saveOrderToDB();   // 🔥 THIS IS THE FIX
    } else {
      toast.error("Payment verification failed ❌");
    }
  } catch (error) {
    console.log(error);
    toast.error("Verification error ❌");
  }
},

      theme: {
        color: "#234d2c"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.log(error);
    toast.error("Payment failed ❌");
  }
};

const applyCouponDirect = (
  coupon
) => {

  setPromoCode(
    coupon.code
  );

  if (
    coupon.type ===
    "percentage"
  ) {

    setDiscount(
      (totalAmount *
        coupon.discount) / 100
    );

  } else {

    setDiscount(
      coupon.discount
    );

  }

  setMessage(
    `Coupon Applied: ${coupon.code}`
  );

};

const applyPromoCode = () => {
  const matchedCoupon = availableCoupons.find(
    (coupon) =>
      coupon.code.toLowerCase() ===
      promoCode.toLowerCase() &&
      coupon.isActive
  );

  if (!matchedCoupon) {
    setDiscount(0);
    setMessage("Invalid promo code ❌");
    return;
  }

  if (matchedCoupon.type === "percentage") {
    setDiscount(
      (totalAmount * matchedCoupon.discount) / 100
    );

    setMessage(
      `Promo code applied: ${matchedCoupon.discount}% OFF 🎉`
    );
  } else {
    setDiscount(matchedCoupon.discount);

    setMessage(
      `Promo code applied: ₹${matchedCoupon.discount} OFF 🎉`
    );
  }
};
const GOOGLE_API_KEY = "AIzaSyC4SdS25bk9KjRa7WQOp7hrOFFdZ_mnRm0";
const [savedAddresses, setSavedAddresses] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);
const [showAddressModal, setShowAddressModal] =
  useState(false);

const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");
const [showAddressSelector, setShowAddressSelector] =
  useState(
    location.state?.openAddresses || false
  );
  const [editingAddress, setEditingAddress] = useState(null);
const saveAddress = () => {
  if (
    !fullName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    alert("Please fill all address fields");
    return;
  }


if (editingAddress) {

  const updatedAddresses =
    savedAddresses.map((item) =>

      item.id === editingAddress.id
        ? {
            ...item,
            fullName,
            phone,
            address,
            city,
            state,
            pincode
          }
        : item
    );

  setSavedAddresses(updatedAddresses);

  localStorage.setItem(
    "savedAddresses",
    JSON.stringify(updatedAddresses)
  );

  setSelectedAddress({
    ...editingAddress,
    fullName,
    phone,
    address,
    city,
    state,
    pincode
  });

  setEditingAddress(null);

  toast.success("Address updated ✅");

  return;
}

  const newAddress = {
    id: Date.now(),
    fullName,
    phone,
    address,
    city,
    state,
    pincode
  };

  const updatedAddresses = [
    ...savedAddresses,
    newAddress
  ];

  setSavedAddresses(updatedAddresses);
  localStorage.setItem(
    "savedAddresses",
    JSON.stringify(updatedAddresses)
  );

  setSelectedAddress(newAddress);

  setFullName("");
  setPhone("");
  setAddress("");
  setCity("");
  setState("");
  setPincode("");

  toast.success("Address saved successfully 📍");
};
useEffect(() => {
  const storedAddresses =
    JSON.parse(
      localStorage.getItem("savedAddresses")
    ) || [];

  setSavedAddresses(storedAddresses);

  if (storedAddresses.length > 0) {
    setSelectedAddress(storedAddresses[0]);
  }
}, []);


const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
        );

        const data = await res.json();

        if (data.status !== "OK") {
  console.log("Google API Error:", data);
  alert(data.error_message || data.status);


  return;
}

        const components = data.results[0].address_components;

        const get = (type) =>
          components.find((c) => c.types.includes(type))
            ?.long_name || "";

        // Autofill fields
        setAddress(data.results[0].formatted_address);
        setCity(get("locality"));
        setState(get("administrative_area_level_1"));
        setPincode(get("postal_code"));

        alert("Address auto-filled 📍");
      } catch (err) {
        console.log(err);
        alert("Error fetching location");
      }
    },
    () => toast.error("Location permission denied ❌")
  );
};
useEffect(() => {

  fetchCoupons();

  fetchUserCoupons();

}, []);

const fetchCoupons = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/coupons`
    );

    setAvailableCoupons(res.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchUserCoupons = async () => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user?.email) return;

    const res =
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coupons/user/${user.email}`
      );

    setUserCoupons(
      res.data.filter(
        coupon =>
          !coupon.used &&
          coupon.isActive
      )
    );

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {
  const savedCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  setCartItems(savedCart);

  const total = savedCart.reduce(
    (sum, item) =>
      sum + item.price * Number(item.quantity || 1),
    0
  );

  setTotalAmount(total);
}, []);
  return (
    <div
  style={{
    width: "100%",
    maxWidth: "1760px",
    margin: "0 auto",
    padding: "20px",
  }}
>
<h1
  style={{
    fontSize: "56px",
    color: "#234d2c",
    margin: 0,
    fontFamily: "Georgia, serif",
    textAlign: "center",
    marginBottom: "50px",
  }}
>
        Checkout{" "}
<FiCreditCard
  style={{
    verticalAlign: "middle",
    marginTop: "-6px"
  }}
/>
      </h1>

      {/* Address Section */}
<div
  style={{
    background: "#f8f5ef",
    padding: "35px",
    borderRadius: "22px",
    marginBottom: "35px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.03)"
  }}
>
  <h2
    style={{
      color: "#234d2c",
      marginBottom: "25px",
      fontSize: "28px"
    }}
  >
    Delivery Address 📍
  </h2>
  <button
  type="button"
  onClick={getCurrentLocation}
  style={{
    marginBottom: "25px",
    padding: "12px 24px",
    background: "#fff",
    border: "1px solid #234d2c",
    color: "#234d2c",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  Use Current Location 📍
</button>
{/* SINGLE AMAZON STYLE ADDRESS CARD */}

<div
 style={{
  background: "#fff",
  borderRadius: "24px",
  padding: "45px",
  border: "1px solid #dfe7df",

  width: "100%",

  minHeight: "220px",

  margin: "0 auto",

  boxSizing: "border-box",

  transition: "0.3s ease"
}}
>
  {/* DEFAULT VIEW */}

  {!showAddressSelector ? (

    <div
  style={{
    display: showAddressSelector
      ? "none"
      : "flex",

    justifyContent: "space-between",

    alignItems: "flex-start"
  }}
>

      <div style={{ flex: 1 }}>

       {selectedAddress ? (
  <>
    <h2
      style={{
        color: "#123524",
        fontSize: "26px",
        marginBottom: "14px",
        textAlign: "left",
        width: "100%"
      }}
    >
      Delivering to {selectedAddress.fullName}
    </h2>

    <p
      style={{
        color: "#4b5563",
        lineHeight: "1.8",
        fontSize: "18px"
      }}
    >
      {selectedAddress.address},
      {" "}
      {selectedAddress.city},
      {" "}
      {selectedAddress.state}
      {" "}
      -
      {" "}
      {selectedAddress.pincode}
    </p>
  </>
) : (
  <>
    <h2
      style={{
        color: "#123524",
        fontSize: "26px",
        marginBottom: "12px"
      }}
    >
      📍 No Delivery Address Added
    </h2>

    <p
      style={{
        color: "#6b7280",
        fontSize: "17px",
        lineHeight: "1.8"
      }}
    >
      Please add your delivery address to continue checkout and enjoy a seamless shopping experience.
    </p>
  </>
)}
       <button
  type="button"
  onClick={() =>
  setShowInstructionModal(true)
}
  style={{
    marginTop: "36px",
    background: "#fff",
    border: "1px solid #234d2c",
    padding: "8px 14px",
    borderRadius: "8px",
    color: "#234d2c",
    fontWeight: "600",
    cursor: "pointer",
    alignSelf: "flex-start",
    textAlign: "left",
    display: "block",
    transition: "0.3s ease",
  }}
  onMouseEnter={(e) => {
  e.target.style.color = "#1d6b43";
  e.target.style.transform = "translateX(4px)";
}}

onMouseLeave={(e) => {
  e.target.style.color = "#234d2c";
  e.target.style.transform = "translateX(0px)";
}}
>
  Add delivery instructions
</button>
{deliveryInstruction && (

  <div
    style={{
      marginTop: "16px",
      background: "#f8faf8",
      border: "1px solid #dfe7df",
      padding: "14px",
      borderRadius: "12px",
      width: "fit-content",
      maxWidth: "100%"
    }}
  >

    <p
      style={{
        color: "#234d2c",
        fontWeight: "600",
        marginBottom: "8px"
      }}
    >
      Delivery Instructions
    </p>

    <p
      style={{
        color: "#4b5563",
        marginBottom: "8px"
      }}
    >
      {deliveryInstruction}
    </p>

    <p
      style={{
        color: "#6b7280",
        fontSize: "14px"
      }}
    >
      Saturday:
      {" "}
      {saturdayDelivery ? "Yes" : "No"}
      {" | "}
      Sunday:
      {" "}
      {sundayDelivery ? "Yes" : "No"}
    </p>

  </div>

)}

      </div>

      <button
  type="button"

  onClick={() =>
    setShowAddressSelector(true)
  }


  style={{
    background: "none",
    border: "none",
    color: "#234d2c",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "18px",
    transition: "0.3s ease"
  }}
  onMouseEnter={(e) => {
    e.target.style.color = "#1d6b43";
    e.target.style.transform = "translateY(-2px)";
  }}

  onMouseLeave={(e) => {
    e.target.style.color = "#234d2c";
    e.target.style.transform = "translateY(0px)";
  }}
>
  Change
</button>

    </div>

  ) : (

    /* CHANGE VIEW */

    <div>

      <div
  style={{
    display: "flex",
    alignItems: "center",

    marginBottom: "32px",

    position: "relative"
  }}
>
  {/* BACK BUTTON */}

  <button
    type="button"

    onClick={() =>
      setShowAddressSelector(false)
    }

    style={{
      width: "50px",
      height: "50px",

      borderRadius: "50%",

      border: "2px solid #234d2c",

      background: "#fff",

      color: "#234d2c",

      cursor: "pointer",

      fontSize: "22px",

      fontWeight: "800",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      position: "absolute",
      left: "0",
      transition: "0.3s ease",
      
    }}
    onMouseEnter={(e) => {
  e.target.style.background = "#234d2c";
  e.target.style.color = "#fff";
  e.target.style.transform = "scale(1.08)";
}}

onMouseLeave={(e) => {
  e.target.style.background = "#fff";
  e.target.style.color = "#234d2c";
  e.target.style.transform = "scale(1)";
}}
  >
    ←
  </button>

  {/* TITLE */}

  <h2
    style={{
      color: "#123524",

      fontSize: "32px",

      fontWeight: "700",

      margin: "0 auto"
    }}
  >
    Select Delivery Address
  </h2>
</div>

      <div
        style={{
          display: "flex",
flexDirection: "column",
gap: "22px",
width: "100%"
        }}
      >

        {savedAddresses.map((item) => (

          <div
            key={item.id}

           style={{
  display: "flex",
  alignItems: "center",
  gap: "28px",
  padding: "30px",
  borderRadius: "22px",

  border:
    selectedAddress?.id === item.id
      ? "2px solid #234d2c"
      : "1px solid #dfe7df",

  background:
    selectedAddress?.id === item.id
      ? "#f8faf8"
      : "#fff",

  transition: "0.3s ease"
}}
          >

            {/* RADIO BUTTON */}

            <input
              type="radio"

              checked={
                selectedAddress?.id === item.id
              }

              onChange={() =>
                setSelectedAddress(item)
              }

             style={{
  width: "24px",
  height: "24px",
  accentColor: "#234d2c",
  cursor: "pointer",
  flexShrink: 0
}}
            />

            {/* ADDRESS DETAILS */}

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
                  color: "#123524",
                  marginBottom: "8px"
                }}
              >
                {item.fullName}
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.7"
                }}
              >
                {item.address},
                {" "}
                {item.city},
                {" "}
                {item.state}
                {" "}
                -
                {" "}
                {item.pincode}
              </p>

              <p
                style={{
                  marginTop: "6px",
                  color: "#6b7280"
                }}
              >
                Phone: {item.phone}
              </p>

              {/* EDIT DELETE */}

              <div
                style={{
                  display: "flex",
gap: "18px",
marginTop: "16px",
alignItems: "center"
                }}
              >

                <button
                  type="button"
                 onClick={() => handleEditAddress(item)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#234d2c",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {

  const updatedAddresses =
    savedAddresses.filter(
      (address) =>
        address.id !== item.id
    );

  setSavedAddresses(updatedAddresses);

  localStorage.setItem(
    "savedAddresses",
    JSON.stringify(updatedAddresses)
  );

  if (
    selectedAddress?.id === item.id
  ) {
    setSelectedAddress(
      updatedAddresses[0] || null
    );
  }
}}

                  style={{
                    background: "none",
                    border: "none",
                    color: "#d32f2f",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* BOTTOM BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "28px",
          flexWrap: "wrap"
        }}
      >

        <button
          type="button"

          onClick={() => {

  setEditingAddress(null);

  setFullName("");
  setPhone("");
  setAddress("");
  setCity("");
  setState("");
  setPincode("");

  setShowAddressModal(true);

}}

          style={{
            padding: "15px 24px",
            borderRadius: "14px",
            border: "1px solid #234d2c",
            background: "#fff",
            color: "#234d2c",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) => {
  e.target.style.background = "#234d2c";
  e.target.style.color = "#fff";
  e.target.style.transform = "translateY(-3px)";
}}

onMouseLeave={(e) => {
  e.target.style.background = "#fff";
  e.target.style.color = "#234d2c";
  e.target.style.transform = "translateY(0px)";
}}
        >
          + Add New Delivery Address
        </button>

        <button
          type="button"

          onClick={() =>
            setShowAddressSelector(false)
          }

          style={{
            padding: "15px 28px",
            borderRadius: "14px",
            border: "none",
            background:
              "linear-gradient(90deg,#123524,#1d6b43)",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) => {
  e.target.style.transform = "translateY(-3px)";
  e.target.style.boxShadow =
    "0 10px 20px rgba(35,77,44,0.25)";
}}

onMouseLeave={(e) => {
  e.target.style.transform = "translateY(0px)";
  e.target.style.boxShadow = "none";
}}
        >
          Deliver To This Address
        </button>

      </div>

    </div>

  )}

</div>
 
{/* ADD NEW ADDRESS FORM */}



</div>
      {/* Promo Code */}
      <div
        style={{
          background: "#f8f5ef",
          padding: "30px",
          borderRadius: "18px",
          marginBottom: "30px"
        }}
      >
        <h2 style={{ color: "#234d2c" }}>
          Gift Card / Promo Code 🎁
        </h2>

        <input
  type="text"
  placeholder="Enter Promo Code"
  value={promoCode}
  onChange={(e) => setPromoCode(e.target.value)}
  style={{
    ...inputStyle,

    width: "100%",

    boxSizing: "border-box",

    marginTop: "18px",

    marginBottom: "0"
  }}
/>

        <button
        type="button"
  onClick={applyPromoCode}
  style={{
    marginTop: "15px",
    padding: "12px 28px",
    background: "#234d2c",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  Apply Code
</button>
<p style={{ marginTop: "15px", color: "#234d2c" }}>
  {message}
</p>
{userCoupons.length > 0 && (

<div
  style={{
    marginTop: "20px"
  }}
>

  <h3
    style={{
      color: "#123524",
      marginBottom: "12px"
    }}
  >
    Your Available Coupons
  </h3>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "10px"
    }}
  >

    {userCoupons.map((coupon) => (

      <button
        key={coupon._id}

        onClick={() => {

          setPromoCode(
            coupon.code
          );

          applyCouponDirect(
            coupon
          );

        }}

        style={{
          border: "none",

          padding: "10px 14px",

          borderRadius: "12px",

          background:
            "#123524",

          color: "#fff",

          cursor: "pointer",

          fontWeight: "600"
        }}
      >
        ₹{coupon.discount}
        OFF
      </button>

    ))}

  </div>

</div>

)}
<div
  style={{
    marginTop: "24px",
    background: "#fff",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid #e7ece7"
  }}
>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "14px"
    }}
  >
    <span>Subtotal</span>
    <span>₹{totalAmount}</span>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "14px"
    }}
  >
    <span>GST (5%)</span>
    <span>₹{gstAmount}</span>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "14px"
    }}
  >
    <span>Delivery</span>

    <span>
      {deliveryCharge === 0
        ? "FREE"
        : `₹${deliveryCharge}`}
    </span>
  </div>

  {discount > 0 && (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "14px",
        color: "#2e7d32"
      }}
    >
      <span>Discount</span>
      <span>-₹{discount}</span>
    </div>

  )}

  <hr
    style={{
      margin: "18px 0",
      border: "none",
      borderTop:
        "1px solid #e5e7eb"
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <h2
      style={{
        color: "#123524"
      }}
    >
      Final Total
    </h2>

    <h2
      style={{
        color: "#123524"
      }}
    >
      ₹{finalAmount}
    </h2>

  </div>

</div>
</div>

{/* PAYMENT METHOD SECTION */}

<div
  style={{
    background: "#f8f5ef",
    padding: "30px",
    borderRadius: "18px",
    marginBottom: "30px"
  }}
>
  <h2
    style={{
      color: "#234d2c",
      marginBottom: "22px"
    }}
  >
    Payment Method 💳
  </h2>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}
  >

    {/* CASH ON DELIVERY */}

    <div
      onClick={() =>
        setPaymentMethod("COD")
      }
      style={{
        padding: "18px",
        borderRadius: "14px",
        border:
          paymentMethod === "COD"
            ? "2px solid #234d2c"
            : "1px solid #dfe7df",
        background:
          paymentMethod === "COD"
            ? "#f8faf8"
            : "#fff",
        cursor: "pointer",
        transition: "0.3s ease"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}
      >

        <input
          type="radio"
          checked={paymentMethod === "COD"}
          readOnly
          style={{
            width: "20px",
            height: "20px",
            accentColor: "#234d2c"
          }}
        />

        <div>
          <h3
            style={{
              color: "#123524",
              marginBottom: "4px"
            }}
          >
            Cash On Delivery
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            Pay when your order arrives
          </p>
        </div>

      </div>
    </div>

    {/* ONLINE PAYMENT */}

    <div
      onClick={() =>
        setPaymentMethod("ONLINE")
      }
      style={{
        padding: "18px",
        borderRadius: "14px",
        border:
          paymentMethod === "ONLINE"
            ? "2px solid #234d2c"
            : "1px solid #dfe7df",
        background:
          paymentMethod === "ONLINE"
            ? "#f8faf8"
            : "#fff",
        cursor: "pointer",
        transition: "0.3s ease"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}
      >

        <input
          type="radio"
          checked={
            paymentMethod === "ONLINE"
          }
          readOnly
          style={{
            width: "20px",
            height: "20px",
            accentColor: "#234d2c"
          }}
        />

        <div>
          <h3
            style={{
              color: "#123524",
              marginBottom: "4px"
            }}
          >
            UPI / Card / Net Banking
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            Secure payment with Razorpay
          </p>
        </div>

      </div>
    </div>

  </div>
</div>

      {/* Place Order */}
<div
  style={{
    textAlign: "center",
    marginTop: "10px",
    marginBottom: "30px",
  }}
>
  <button
  type="button"
    onClick={() => {
  if (!validateCheckout()) return;

  if (paymentMethod === "COD") {
    handlePlaceOrder();
  } else {
    handleRazorpayPayment();
  }
}}
    style={{
  padding: "16px 40px",

  background:
    "linear-gradient(135deg, #1f6b3b 0%, #0b3d20 100%)",

  color: "#fff",

  border: "none",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "600",

  fontSize: "17px",

  letterSpacing: "0.4px",

  boxShadow:
    "0 10px 30px rgba(20, 83, 45, 0.25)",

  transition:
  "all 0.30s cubic-bezier(0.4, 0, 0.2, 1)",

willChange: "transform",
  transform: "translateY(0)"
}}
onMouseEnter={(e) => {

  e.currentTarget.style.transform =
    "scale(1.06) translateY(-3px)";

  e.currentTarget.style.background =
    "linear-gradient(135deg, #2f8f4e 0%, #1d6b3d 45%, #14532d 100%)";

  e.currentTarget.style.boxShadow =
    "0 20px 45px rgba(22, 101, 52, 0.40)";

}}

onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "scale(1) translateY(0)";

  e.currentTarget.style.background =
    "linear-gradient(135deg, #1f6b3b 0%, #0b3d20 100%)";

  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(20, 83, 45, 0.25)";

}}
  >
    Place Order ✅
  </button>
</div>

{/* ADDRESS MODAL */}

{showAddressModal && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        width: "95%",
        maxWidth: "520px",
        background: "#fff",
        borderRadius: "24px",
        padding: "32px",
        position: "relative",
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.15)"
      }}
    >

      {/* CLOSE BUTTON */}

      <button
        type="button"

        onClick={() =>
          setShowAddressModal(false)
        }

        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          color: "#555"
        }}
      >
        ×
      </button>

      <h2
        style={{
          color: "#123524",
          marginBottom: "24px",
          textAlign: "center"
        }}
      >
        Add New Delivery Address
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Full Address"
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) =>
          setCity(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) =>
          setState(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) =>
          setPincode(e.target.value)
        }
        style={inputStyle}
      />

      <button
        type="button"

        onClick={() => {

          saveAddress();

          setShowAddressModal(false);

        }}

        style={{
          width: "100%",
          marginTop: "24px",
          padding: "16px",
          background:
            "linear-gradient(90deg,#123524,#1d6b43)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Save Address
      </button>

    </div>

  </div>

)}
{/* DELIVERY INSTRUCTION MODAL */}

{showInstructionModal && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        width: "95%",
        maxWidth: "850px",
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.2)"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          padding: "24px 30px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <h2
          style={{
            color: "#123524"
          }}
        >
          Add delivery instructions
        </h2>

        <button
          type="button"

          onClick={() =>
            setShowInstructionModal(false)
          }

          style={{
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer"
          }}
        >
          ×
        </button>

      </div>

      {/* BODY */}

      <div
        style={{
          padding: "28px"
        }}
      >

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            overflow: "hidden"
          }}
        >

          {/* WEEKEND SECTION */}

          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #e5e7eb"
            }}
          >

            <h3
              style={{
                marginBottom: "20px",
                color: "#123524"
              }}
            >
              Can you receive deliveries at this address on weekends?
            </h3>

            <div
              style={{
                display: "flex",
                gap: "40px",
                flexWrap: "wrap"
              }}
            >

              {/* SATURDAY */}

              <div>

                <p
                  style={{
                    marginBottom: "12px",
                    fontWeight: "600"
                  }}
                >
                  Saturdays
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >

                  <button
                    type="button"

                    onClick={() =>
                      setSaturdayDelivery(false)
                    }

                    style={{
                      padding: "10px 30px",
                      borderRadius: "10px",
                      border:
                        !saturdayDelivery
                          ? "2px solid #234d2c"
                          : "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    No
                  </button>

                  <button
                    type="button"

                    onClick={() =>
                      setSaturdayDelivery(true)
                    }

                    style={{
                      padding: "10px 30px",
                      borderRadius: "10px",
                      border:
                        saturdayDelivery
                          ? "2px solid #234d2c"
                          : "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Yes
                  </button>

                </div>

              </div>

              {/* SUNDAY */}

              <div>

                <p
                  style={{
                    marginBottom: "12px",
                    fontWeight: "600"
                  }}
                >
                  Sundays
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >

                  <button
                    type="button"

                    onClick={() =>
                      setSundayDelivery(false)
                    }

                    style={{
                      padding: "10px 30px",
                      borderRadius: "10px",
                      border:
                        !sundayDelivery
                          ? "2px solid #234d2c"
                          : "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    No
                  </button>

                  <button
                    type="button"

                    onClick={() =>
                      setSundayDelivery(true)
                    }

                    style={{
                      padding: "10px 30px",
                      borderRadius: "10px",
                      border:
                        sundayDelivery
                          ? "2px solid #234d2c"
                          : "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Yes
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* TEXTAREA SECTION */}

          <div
            style={{
              padding: "20px"
            }}
          >

            <h3
              style={{
                marginBottom: "16px",
                color: "#123524"
              }}
            >
              Delivery instructions
            </h3>

            <textarea
              placeholder="TRY TO DELIVER IN THE MORNING"

              value={deliveryInstruction}

              onChange={(e) =>
                setDeliveryInstruction(
                  e.target.value
                )
              }

              style={{
                width: "100%",
                minHeight: "120px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                padding: "16px",
                resize: "none",
                fontSize: "15px"
              }}
            />

          </div>

        </div>

        {/* FOOTER */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px"
          }}
        >

          <button
            type="button"

            onClick={() => {

              setShowInstructionModal(false);

              toast.success(
                "Instructions saved ✅"
              );

            }}

            style={{
              padding: "14px 28px",
              borderRadius: "30px",
              border: "none",
              background: "#facc15",
              color: "#000",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Save instructions
          </button>

        </div>

      </div>

    </div>

  </div>

)}
<ToastContainer
  position="top-right"
  autoClose={2500}
/>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px"
};

const labelStyle = {
  display: "block",
  marginTop: "15px",
  fontSize: "16px"
};

export default Checkout;