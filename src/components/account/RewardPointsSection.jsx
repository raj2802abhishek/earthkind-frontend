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
    <div className="reward-section-container">
      <h2
        style={{
          color: "#123524",
          fontSize: "28px",
          fontWeight: "800",
          marginBottom: "20px"
        }}
      >
        Reward Points
      </h2>

      {/* POINT CARD HERO */}
      <div className="reward-card-hero">
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
            opacity: 0.85,
            fontSize: "12px",
            letterSpacing: "1px",
            fontWeight: "700"
          }}
        >
          EARTHKIND REWARDS
        </p>

        <h1 className="reward-hero-points">
          {reward.points}
        </h1>

        <p
          style={{
            margin: 0,
            opacity: 0.9,
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Available Reward Points
        </p>

        <div className="reward-stats-row">
          <div>
            <small style={{ opacity: 0.7, fontSize: "11px" }}>
              Lifetime Earned
            </small>
            <div style={{ fontWeight: "800", fontSize: "16px" }}>
              {reward.lifetimeEarned} pts
            </div>
          </div>

          <div>
            <small style={{ opacity: 0.7, fontSize: "11px" }}>
              Current Tier
            </small>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "#d8ef7f" }}>
              {reward.tier}
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "18px",
          border: "1px solid #eee",
          marginBottom: "20px"
        }}
      >
        <h3
          style={{
            marginBottom: "12px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#163923"
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
              width: `${Math.min((reward.lifetimeEarned / 1000) * 100, 100)}%`,
              background: "linear-gradient(90deg, #166534, #22c55e)",
              borderRadius: "999px"
            }}
          />
        </div>

        <p
          style={{
            marginTop: "10px",
            color: "#6b7280",
            fontSize: "13px",
            margin: "10px 0 0 0"
          }}
        >
          {reward.lifetimeEarned} / 1000 points for Silver Tier
        </p>
      </div>

      {/* TIER JOURNEY */}
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
            marginBottom: "16px"
          }}
        >
          <FaGem size={18} color="#166534" />
          <h3
            style={{
              margin: 0,
              color: "#163923",
              fontWeight: "700",
              fontSize: "16px"
            }}
          >
            VIP Membership Journey
          </h3>
        </div>

        <div className="reward-tiers-grid">
          {[
            { icon: "🥉", name: "Bronze" },
            { icon: "🥈", name: "Silver" },
            { icon: "🥇", name: "Gold" },
            { icon: "💎", name: "Platinum" }
          ].map((tier) => (
            <div
              key={tier.name}
              style={{
                textAlign: "center",
                padding: "12px 8px",
                borderRadius: "14px",
                background: reward.tier === tier.name ? "#eef8ee" : "#f8f8f8",
                border: reward.tier === tier.name ? "1.5px solid #22c55e" : "1px solid #eee"
              }}
            >
              <div style={{ fontSize: "22px" }}>{tier.icon}</div>
              <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: "700" }}>
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
            marginBottom: "16px"
          }}
        >
          <FiGift size={20} color="#166534" />
          <h3
            style={{
              margin: 0,
              color: "#163923",
              fontWeight: "700",
              fontSize: "16px"
            }}
          >
            Redeem Rewards
          </h3>
        </div>

        <div className="reward-redeem-grid">
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
                borderRadius: "16px",
                padding: "16px",
                background: "linear-gradient(135deg, #ffffff, #f7faf8)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "space-between" }}>
                <FiGift size={22} color="#166534" />
                <span style={{ fontSize: "11px", fontWeight: "700", background: "#eef8ee", color: "#166534", padding: "2px 8px", borderRadius: "999px" }}>
                  {item.pts} Pts
                </span>
              </div>

              <h2
                style={{
                  margin: "8px 0 2px",
                  color: "#166534",
                  fontSize: "26px",
                  fontWeight: "800"
                }}
              >
                ₹{item.value} OFF
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: "0 0 10px 0"
                }}
              >
                Coupon Voucher ({item.pts} points)
              </p>

              <button
                onClick={() => redeemCoupon(item.pts, item.value)}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "10px",
                  borderRadius: "12px",
                  background: "#166534",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  marginTop: "auto"
                }}
              >
                Redeem Voucher
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="reward-activity-box">
        <h3
          style={{
            marginBottom: "14px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#163923"
          }}
        >
          Reward Activity
        </h3>

        {reward.transactions?.length > 0 ? (
          reward.transactions.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f1f1f1"
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                  {item.title}
                </h4>
                <p style={{ margin: 0, color: "#777", fontSize: "12px" }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <strong style={{ color: "#166534", fontSize: "14px" }}>
                +{item.points}
              </strong>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "13px", color: "#888" }}>No recent reward activity</p>
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