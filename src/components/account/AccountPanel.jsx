import axios from "axios";
import PaymentHistorySection from "./PaymentHistorySection";
import ProfileSection from "./ProfileSection";
import RewardPointsSection
from "./RewardPointsSection";
import MyCouponsSection
from "./MyCouponsSection";
import RecentlyViewedSection
from "./RecentlyViewedSection";
import AccountSettingsSection
from "./AccountSettingsSection";
import React, { useEffect, useState } from "react";

import {
  FiX,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiStar
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import AccountSidebar from "./AccountSidebar";
import AccountStats from "./AccountStats";
import RecentOrderCard from "./RecentOrderCard";
import SavedAddressCard from "./SavedAddressCard";
import AccountStatus from "./AccountStatus";

function AccountPanel({
  user,
  lastOrder,
  setShowMenu
}) {

  const [activeTab, setActiveTab] =
  useState("dashboard");
  const navigate = useNavigate();
  const [rewardPoints, setRewardPoints] =
  useState(0);

  const wishlist =
    JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];

    useEffect(() => {

  const fetchRewards = async () => {

    try {

      if (!user?.email) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rewards/${user.email}`
      );

      setRewardPoints(
        res.data.points || 0
      );

    } catch (error) {

      console.log(error);

    }

  };

  fetchRewards();

}, [user]);

  // =========================
  // ADDRESS STATES
  // =========================

  const [showAddressModal,
    setShowAddressModal] =
      useState(false);

  const [addresses,
    setAddresses] =
      useState(

        JSON.parse(
          localStorage.getItem(
            "savedAddresses"
          )
        ) || []

      );

  const [editingId,
  setEditingId] =
    useState(null);

  const [newAddress,
    setNewAddress] =
      useState({

        type: "Home",

        fullName:
          user?.name || "",

        address: "",

        city: "",

        pincode: "",

        phone: ""
      });

  // =========================
  // SAVE ADDRESS
  // =========================

  const handleSaveAddress = () => {

  if (
    !newAddress.address ||
    !newAddress.city ||
    !newAddress.phone
  ) {

    alert(
      "Please fill all fields"
    );

    return;
  }

  let updatedAddresses = [];
  // LIMIT ONLY 2 ADDRESSES

if (
  !editingId &&
  addresses.length >= 2
) {

  alert(
    "You can only save 2 addresses"
  );

  return;
}

  // =====================
  // EDIT EXISTING ADDRESS
  // =====================

  if (editingId) {

    updatedAddresses =
      addresses.map((item) =>

        item.id === editingId
          ? {
              ...item,
              ...newAddress
            }
          : item
      );

  }

  // =====================
  // ADD NEW ADDRESS
  // =====================

  else {

    updatedAddresses = [

      ...addresses,

      {
        ...newAddress,
        id: Date.now()
      }
    ];
  }

  setAddresses(
    updatedAddresses
  );

  localStorage.setItem(

    "savedAddresses",

    JSON.stringify(
      updatedAddresses
    )
  );

  // RESET
  setEditingId(null);

  setShowAddressModal(false);

  setNewAddress({
    type: "Home",
    fullName: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });
};

  // =========================
  // DELETE ADDRESS
  // =========================

  const deleteAddress = (id) => {

    const updated =
      addresses.filter(
        (item) =>
          item.id !== id
      );

    setAddresses(updated);

    localStorage.setItem(
      "savedAddresses",
      JSON.stringify(updated)
    );
  };

  const editAddress = (item) => {

  setEditingId(item.id);

  setNewAddress({

    type:
      item.type || "Home",

    fullName:
      item.fullName || "",

    address:
      item.address || "",

    city:
      item.city || "",

    pincode:
      item.pincode || "",

    phone:
      item.phone || ""
  });

  setShowAddressModal(true);
};
  return (

    <>

      {/* MAIN PANEL */}

      <div
        onClick={(e) =>
          e.stopPropagation()
        }

        style={{
          position: "absolute",

          top: "58px",

          right: 0,
          
          width:
            window.innerWidth <= 768
              ? "94vw"
              : "620px",

          background:
            "rgba(255,255,255,0.88)",

          backdropFilter:
            "blur(24px)",

          WebkitBackdropFilter:
            "blur(24px)",

          border:
            "1px solid rgba(255,255,255,0.45)",

          borderRadius: "22px",

          padding: "14px",

          boxShadow:
            "0 22px 60px rgba(0,0,0,0.16)",

          zIndex: 9999
        }}
      >

        {/* CLOSE */}
        <div
          onClick={() =>
            setShowMenu(false)
          }

          style={{
            position: "absolute",

            top: "14px",

            right: "14px",

            cursor: "pointer",

            fontSize: "20px",

            color: "#444"
          }}
        >
          <FiX />
        </div>

        {/* TOP PROFILE */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",

            marginBottom: "14px"
          }}
        >

          <div
            style={{
              width: "48px",
              height: "48px",

              borderRadius: "50%",

              background:
                "linear-gradient(135deg,#163923,#285b37)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              color: "#fff",

              fontSize: "20px",

              fontWeight: "700",

              flexShrink: 0
            }}
          >
            {user?.name?.charAt(0)}
          </div>

          <div>

            <h2
              style={{
                margin: 0,

                color: "#163923",

                fontSize: "18px",

                fontFamily:
                  "Georgia, serif"
              }}
            >
              {user?.name}
            </h2>

            <p
              style={{
                marginTop: "3px",

                color: "#666",

                fontSize: "12px"
              }}
            >
              {user?.email}
            </p>

            <div
              style={{
                marginTop: "7px",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap: "6px",

                background:
                  "#eef8ee",

                color:
                  "#2f7d32",

                padding:
                  "4px 10px",

                borderRadius:
                  "999px",

                fontSize:
                  "11px",

                fontWeight:
                  "600"
              }}
            >
              ✅ Verified User
            </div>

          </div>

        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              window.innerWidth <= 768
                ? "repeat(2,1fr)"
                : "repeat(4,1fr)",

            gap: "8px",

            marginBottom: "12px"
          }}
        >

          <AccountStats
            number="12"
            label="Orders"
            icon={<FiPackage />}
          />

          <AccountStats
            number={wishlist.length}
            label="Wishlist"
            icon={<FiHeart />}
          />

         <AccountStats
  number={rewardPoints}
  label="Reward Points"
  icon={<FiStar />}
/>

          <AccountStats
            number={addresses.length}
            label="Addresses"
            icon={<FiMapPin />}
          />

        </div>

        {/* MAIN */}
      <div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth <= 768
        ? "1fr"
        : "170px 1fr",

    gap: "12px"
  }}
>

        <AccountSidebar
  navigate={navigate}
  setShowMenu={
    setShowMenu
  }
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
        <div
  style={{
    display: "flex",

    flexDirection: "column",

    gap: "10px"
  }}
>

           {activeTab === "dashboard" && (
  <>
    <RecentOrderCard
      lastOrder={lastOrder}
    />

    <SavedAddressCard
      user={user}
      addresses={addresses}
      setShowAddressModal={
        setShowAddressModal
      }
      deleteAddress={
        deleteAddress
      }
      editAddress={
        editAddress
      }
    />

    <AccountStatus />
  </>
)}

{activeTab === "profile" && (
  <ProfileSection
    user={user}
    setUser={() => {}}
  />
)}
{activeTab === "paymenthistory" && (
  <PaymentHistorySection />
)}
{
  activeTab === "rewardpoints" && (
    <RewardPointsSection />
  )
}
{
  activeTab === "mycoupons" && (
    <MyCouponsSection />
  )
}

{
  activeTab ===
  "recentlyviewed" && (

    <RecentlyViewedSection
  setShowMenu={setShowMenu}
/>

  )
}

{
  activeTab ===
  "accountsettings" && (

    <AccountSettingsSection />

  )
}

          </div>

        </div>

        {/* ADDRESS MODAL */}

        {showAddressModal && (

          <div
            onClick={(e) =>
              e.stopPropagation()
            }

            style={{
              position: "absolute",

              top: "50%",

              left: "0",

              transform:
                "translate(-105%, -50%)",

              width:
                window.innerWidth <= 768
                  ? "100%"
                  : "330px",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              zIndex: 10000
            }}
          >

            <div
              onClick={(e) =>
                e.stopPropagation()
              }

              style={{
                width: "100%",

                background:
                  "rgba(255,255,255,0.96)",

                backdropFilter:
                  "blur(18px)",

                WebkitBackdropFilter:
                  "blur(18px)",

                border:
                  "1px solid rgba(255,255,255,0.4)",

                borderRadius: "24px",

                padding: "20px",

                boxShadow:
                  "0 18px 50px rgba(0,0,0,0.14)"
              }}
            >

              <h2
                style={{
                  marginTop: 0,

                  color: "#163923"
                }}
              >
              {editingId
  ? "Edit Address"
  : "Add Address"}
              </h2>

              <input
                placeholder="Full Address"

                value={
                  newAddress.address
                }

                onChange={(e) =>
                  setNewAddress({

                    ...newAddress,

                    address:
                      e.target.value
                  })
                }

                style={inputStyle}
              />

              <input
                placeholder="City"

                value={
                  newAddress.city
                }

                onChange={(e) =>
                  setNewAddress({

                    ...newAddress,

                    city:
                      e.target.value
                  })
                }

                style={inputStyle}
              />

              <input
                placeholder="Pincode"

                value={
                  newAddress.pincode
                }

                onChange={(e) =>
                  setNewAddress({

                    ...newAddress,

                    pincode:
                      e.target.value
                  })
                }

                style={inputStyle}
              />

              <input
                placeholder="Phone"

                value={
                  newAddress.phone
                }

                onChange={(e) =>
                  setNewAddress({

                    ...newAddress,

                    phone:
                      e.target.value
                  })
                }

                style={inputStyle}
              />

              <div
                style={{
                  display: "flex",

                  gap: "10px",

                  marginTop: "14px"
                }}
              >

                <button
                  onClick={
                    handleSaveAddress
                  }

                  style={{
                    flex: 1,

                    padding: "12px",

                    background:
                      "#163923",

                    color: "#fff",

                    border: "none",

                    borderRadius:
                      "12px",

                    cursor: "pointer"
                  }}
                >
                  {editingId
  ? "Update Address"
  : "Save Address"}
                </button>

                <button
                  onClick={() =>
                    setShowAddressModal(
                      false
                    )
                  }

                  style={{
                    flex: 1,

                    padding: "12px",

                    background:
                      "#f3f3f3",

                    border: "none",

                    borderRadius:
                      "12px",

                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </>
  );
}

const inputStyle = {

  width: "100%",

  padding: "12px",

  marginTop: "10px",

  borderRadius: "12px",

  border:
    "1px solid rgba(0,0,0,0.08)",

  fontSize: "14px",

  outline: "none"
};

export default AccountPanel;