import React from "react";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiStar,
  FiEye,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { FiTag } from "react-icons/fi";

function AccountSidebar({
  navigate,
  setShowMenu,
  activeTab,
  setActiveTab
}) {
  const menuItems = [
    {
  icon: <FiUser size={14} />,
  text: "My Profile",
  action: () => {
    setActiveTab("profile");
  }
},
    {
      icon: <FiPackage size={14} />,
      text: "My Orders",
      action: () => {
        navigate("/my-orders");
        setShowMenu(false);
      }
    },
    {
      icon: <FiHeart size={14} />,
      text: "Wishlist",
      action: () => {
        navigate("/wishlist");
        setShowMenu(false);
      }
    },
    {
  icon: <FiMapPin size={14} />,
  text: "Addresses",
  action: () => {
    navigate("/checkout", {
      state: {
        openAddresses: true
      }
    });

    setShowMenu(false);
  }
},
   {
  icon: <FiCreditCard size={14} />,
  text: "Payment History",
  action: () => {
    setActiveTab("paymenthistory");
  }
},
    {
  icon: <FiStar size={14} />,
  text: "Reward Points",

  action: () => {
    setActiveTab("rewardpoints");
  }
},
{
  icon: <FiTag size={14} />,
  text: "My Coupons",
  action: () => {
    setActiveTab("mycoupons");
  }
},
    {
  icon: <FiEye size={14} />,

  text: "Recently Viewed",

  action: () => {

    setActiveTab(
      "recentlyviewed"
    );

  }
},
   {
  icon: <FiSettings size={14} />,
  text: "Account Settings",

  action: () => {
    setActiveTab("accountsettings");
  }
}
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
    setShowMenu(false);
  };

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "6px 0"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {menuItems.map((item, index) => {
        

          return (
            <div
              key={index}
              onClick={item.action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 8px",
                borderRadius: "9px",
                cursor: item.action ? "pointer" : "default",
                fontSize: "13px",
                color: "#2f2f2f",
                lineHeight: 1.1,
                transition: "0.2s ease",
                background:
activeTab ===
item.text.toLowerCase().replace(/\s/g, "")
  ? "rgba(47,125,50,0.08)"
  : "transparent"
              }}
              onMouseEnter={(e) => {
               if (
  activeTab !==
  item.text.toLowerCase().replace(/\s/g, "")
) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                if (
  activeTab !==
  item.text.toLowerCase().replace(/\s/g, "")
) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "10px",
          paddingTop: "8px",
          borderTop: "1px solid rgba(0,0,0,0.08)"
        }}
      >
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#e53935",
            cursor: "pointer",
            padding: "7px 8px",
            borderRadius: "9px",
            fontSize: "13px",
            lineHeight: 1.1
          }}
        >
          <FiLogOut size={14} />
          Logout
        </div>
      </div>
    </div>
  );
}

export default AccountSidebar;