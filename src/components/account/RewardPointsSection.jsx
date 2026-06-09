import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiAward,
  FiGift,
  FiTrendingUp,
  FiStar
} from "react-icons/fi";

import {
  FaCrown,
  FaGem
} from "react-icons/fa";

function RewardPointsSection() {

  const [reward, setReward] =
    useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!user?.email) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rewards/${user.email}`
      );

      setReward(res.data);

    } catch (error) {

      console.log(error);

    }

  };
const redeemCoupon = async (
  pointsRequired,
  couponValue
) => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    const res =
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rewards/redeem-coupon`,
        {
          email: user.email,

          pointsRequired,

          couponValue
        }
      );

    alert(
      `Coupon Created Successfully 🎉

Code: ${res.data.coupon.code}

Value: ₹${res.data.coupon.discount}`
    );

    fetchRewards();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed"
    );

  }

};

  const getTierColor = () => {

    switch (reward?.tier) {

      case "Silver":
        return "#64748b";

      case "Gold":
        return "#ca8a04";

      case "Platinum":
        return "#7c3aed";

      default:
        return "#166534";

    }

  };

  if (!reward) {
    return <div>Loading...</div>;
  }

return (

  <div
  style={{
    maxHeight: "500px",

    overflowY: "auto",

    paddingRight: "10px",

    scrollbarWidth: "thin"
  }}
>

      <h2
        style={{
          color: "#123524",
          fontSize: "30px",
          marginBottom: "24px"
        }}
      >
        Reward Points
      </h2>

      {/* POINT CARD */}

   <div
  style={{
    background:
      "linear-gradient(135deg,#0f2d1d,#1f7a4d)",

    color: "#fff",

    padding: "28px",

    borderRadius: "24px",

    marginBottom: "20px",

    position: "relative",

    overflow: "hidden",

    boxShadow:
      "0 15px 35px rgba(22,101,52,0.25)"
  }}
>

 <FaCrown
  size={75}
  style={{
    position: "absolute",
    right: "18px",
    top: "14px",
    opacity: 0.08,
    pointerEvents: "none"
  }}
/>

  <p
    style={{
      margin: 0,
      opacity: .85,
      fontSize: "13px",
      letterSpacing: "1px"
    }}
  >
    EARTHKIND REWARDS
  </p>

  <h1
    style={{
      margin: "12px 0 4px",
      fontSize: "52px"
    }}
  >
    {reward.points}
  </h1>

  <p
    style={{
      margin: 0,
      opacity: .9
    }}
  >
    Available Reward Points
  </p>

  <div
    style={{
      display: "flex",
      gap: "14px",
      marginTop: "22px"
    }}
  >

    <div>
      <small
        style={{
          opacity: .7
        }}
      >
        Lifetime Earned
      </small>

      <div
        style={{
          fontWeight: "700"
        }}
      >
        {reward.lifetimeEarned}
      </div>
    </div>

    <div>
      <small
        style={{
          opacity: .7
        }}
      >
        Current Tier
      </small>

      <div
        style={{
          fontWeight: "700"
        }}
      >
        {reward.tier}
      </div>
    </div>

  </div>

</div>
      {/* PROGRESS */}

<div
  style={{
    background: "#fff",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid #eee",
    marginBottom: "22px"
  }}
>

  <h3
    style={{
      marginBottom: "14px"
    }}
  >
    Next Tier Progress
  </h3>

  <div
    style={{
      width: "100%",
      height: "12px",
      background: "#edf2ef",
      borderRadius: "999px",
      overflow: "hidden"
    }}
  >

    <div
      style={{
        height: "100%",

        width: `${Math.min(
          (reward.lifetimeEarned / 1000) * 100,
          100
        )}%`,

        background:
          "linear-gradient(90deg,#166534,#22c55e)",

        borderRadius: "999px"
      }}
    />

  </div>

  <p
    style={{
      marginTop: "12px",
      color: "#6b7280"
    }}
  >
    {reward.lifetimeEarned}
    {" "}
    /
    {" "}
    1000 points for Silver Tier
  </p>

</div>

{/* TIER */}

      <div
  style={{
    background: "#fff",

    padding: "20px",

    borderRadius: "18px",

    border: "1px solid #eee",

    marginBottom: "20px"
  }}
>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px"
  }}
>

  <FaGem
    size={18}
    color="#166534"
  />

  <h3
    style={{
      margin: 0,
      color: "#163923",
      fontWeight: "700"
    }}
  >
    VIP Membership Journey
  </h3>

</div>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "18px"
    }}
  >
    
    VIP Membership Journey
  </h3>

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        "repeat(4,1fr)",

      gap: "10px"
    }}
  >

    {[
      {
        icon: "🥉",
        name: "Bronze"
      },
      {
        icon: "🥈",
        name: "Silver"
      },
      {
        icon: "🥇",
        name: "Gold"
      },
      {
        icon: "💎",
        name: "Platinum"
      }
    ].map((tier) => (

      <div
        key={tier.name}
        style={{
          textAlign: "center",

          padding: "14px",

          borderRadius: "14px",

          background:
            reward.tier === tier.name
              ? "#eef8ee"
              : "#f8f8f8",

          border:
            reward.tier === tier.name
              ? "1px solid #22c55e"
              : "1px solid #eee"
        }}
      >

        <div
          style={{
            fontSize: "22px"
          }}
        >
          {tier.icon}
        </div>

        <div
          style={{
            marginTop: "6px",

            fontSize: "12px",

            fontWeight: "600"
          }}
        >
          {tier.name}
        </div>

      </div>

    ))}

  </div>

</div>

  {/* REDEEM REWARDS */}

<div
  style={{
    background: "#fff",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid #eee",
    marginBottom: "22px"
  }}
>

  <div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginBottom: "18px"
  }}
>

  <FiGift
    size={22}
    color="#166534"
  />

  <h3
    style={{
      margin: 0
    }}
  >
    Redeem Rewards
  </h3>

</div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(2,1fr)",
      gap: "12px"
    }}
  >

  {[
    { pts: 500, value: 50 },
    { pts: 1000, value: 100 },
    { pts: 2000, value: 250 },
    { pts: 5000, value: 750 }
  ].map((item) => (

    <div
      key={item.pts}

      style={{
        border: "1px solid #edf2ef",

        borderRadius: "18px",

        padding: "16px",
background:
  "linear-gradient(135deg,#ffffff,#f7faf8)",

boxShadow:
  "0 10px 25px rgba(0,0,0,0.04)",

transition:
  "all .25s ease"
      }}
    >

      <FiGift
        size={20}
        color="#166534"
      />

     <h2
  style={{
    margin: "10px 0 4px",

    color: "#166534",

    fontSize: "28px"
  }}
>
  ₹{item.value}
</h2>

      <p
        style={{
          fontSize: "12px",

          color: "#666"
        }}
      >
       Coupon Voucher

Redeem using
        {" "}
        {item.pts}
        {" "}
        points
      </p>

      <button
        onClick={() =>
          redeemCoupon(
            item.pts,
            item.value
          )
        }

        style={{
          width: "100%",

          marginTop: "10px",

          border: "none",

          padding: "10px",

          borderRadius: "12px",

          background:
            "#166534",

          color: "#fff",

          cursor: "pointer",

          fontWeight: "600"
        }}
      >
        Redeem
      </button>

    </div>

  ))}



  </div>

</div>

      {/* TRANSACTION HISTORY */}

      <div
        style={{
          background: "#fff",

          borderRadius: "18px",

          border: "1px solid #eee",

          padding: "20px",

          maxHeight: "180px",

          overflowY: "auto"
        }}
      >

        <h3
          style={{
            marginBottom: "20px"
          }}
        >
          Reward Activity
        </h3>

        {reward.transactions.map(
          (item, index) => (

            <div
              key={index}

              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                padding: "12px 0",

                borderBottom:
                  "1px solid #f1f1f1"
              }}
            >

              <div>

                <h4
                  style={{
                    margin: 0
                  }}
                >
                  {item.title}
                </h4>

                <p
                  style={{
                    margin: 0,

                    color: "#777",

                    fontSize: "13px"
                  }}
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

              <strong
                style={{
                  color: "#166534"
                }}
              >
                +{item.points}
              </strong>

            </div>

          )
        )}

      </div>

    </div>

  );

}

const redeemBtn = {

  border: "none",

  padding: "14px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#166534,#22c55e)",

  color: "#fff",

  cursor: "pointer",

  fontWeight: "700"

};

export default RewardPointsSection;