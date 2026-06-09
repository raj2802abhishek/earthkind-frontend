import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  FiCopy,
  FiTag,
  FiGift,
  FiCheckCircle,
  FiTrendingUp
} from "react-icons/fi";

function MyCouponsSection() {

  const [coupons, setCoupons] =
    useState([]);

  useEffect(() => {

    fetchCoupons();

  }, []);

  const fetchCoupons =
    async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/coupons/user/${user.email}`
          );

        setCoupons(res.data);

      } catch (err) {

        console.log(err);

      }

    };

    const activeCoupons =
  coupons.filter(
    (coupon) =>
      !coupon.used
  ).length;

const totalSavings =
  coupons.reduce(
    (total, coupon) =>
      total + coupon.discount,
    0
  );
  const [copied, setCopied] =
  useState(false);

 const copyCoupon = (
  code
) => {

  navigator.clipboard.writeText(
    code
  );

  setCopied(true);

  setTimeout(() => {

    setCopied(false);

  }, 2000);

};

 return (

  <div
    style={{
      maxHeight: "500px",
      overflowY: "auto",
      paddingRight: "8px",
      scrollbarWidth: "thin"
    }}
  >

      <h2
        style={{
          color: "#123524",
          marginBottom: "20px"
        }}
      >
        My Coupons ({coupons.length})
      </h2>

      {
  copied && (

    <div
      style={{
        background: "#22c55e",
        color: "#fff",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "15px",
        fontWeight: "600"
      }}
    >
      Coupon copied successfully ✓
    </div>

  )
}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",

    gap: "10px",

    marginBottom: "18px"
  }}
>

  {/* TOTAL COUPONS */}

 <div
  style={{
    background: "#fff",
    border: "1px solid #edf2ef",
    borderRadius: "18px",
   padding: "12px",

    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

  <div
    style={{
     width: "38px",
height: "38px",
      borderRadius: "14px",
      background:
        "linear-gradient(135deg,#123524,#1d6b43)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: "#fff"
    }}
  >
    <FiGift size={16} />
  </div>

  <div>

    <h2
      style={{
        margin: 0,
        color: "#123524"
      }}
    >
      {coupons.length}
    </h2>

    <p
      style={{
        margin: 0,
        color: "#777",
        fontSize: "12px"
      }}
    >
      Total Coupons
    </p>

  </div>

</div>
{/* ACTIVE */}

<div
  style={{
    background: "#fff",
    border: "1px solid #edf2ef",
    borderRadius: "18px",
    padding: "12px",

    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

  <div
    style={{
     width: "38px",
height: "38px",
      borderRadius: "14px",

      background:
        "linear-gradient(135deg,#16a34a,#22c55e)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: "#fff"
    }}
  >
    <FiCheckCircle size={16} />
  </div>

  <div>

    <h2
      style={{
        margin: 0,
        color: "#123524"
      }}
    >
      {activeCoupons}
    </h2>

    <p
      style={{
        margin: 0,
        color: "#777",
        fontSize: "12px"
      }}
    >
      Active
    </p>

  </div>

</div>

  
{/* SAVINGS */}

<div
  style={{
    background: "#fff",
    border: "1px solid #edf2ef",
    borderRadius: "18px",
  padding: "12px",

    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

  <div
    style={{
     width: "38px",
height: "38px",
      borderRadius: "14px",

      background:
        "linear-gradient(135deg,#ca8a04,#facc15)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: "#fff"
    }}
  >
    <FiTrendingUp size={16} />
  </div>

  <div>

    <h2
  style={{
    margin: 0,
    color: "#123524",
    fontSize: "24px"
  }}
>
      ₹{totalSavings}
    </h2>

    <p
      style={{
        margin: 0,
        color: "#777",
        fontSize: "12px"
      }}
    >
      Savings
    </p>

  </div>

</div>
</div>

      <div
        style={{
          display: "grid",
          gap: "14px"
        }}
      >

    {coupons.length === 0 && (

<div
  style={{
    background: "#fff",

    borderRadius: "28px",

    padding: "60px 30px",

    textAlign: "center",

    border: "1px solid #eef2ef",
    backdropFilter: "blur(10px)",
    minHeight: "280px"
  }}
>

  <div
    style={{
      fontSize: "70px"
    }}
  >
    🎁
  </div>

  <h2
    style={{
      color: "#123524",

      marginTop: "15px",

      marginBottom: "10px"
    }}
  >
    No Coupons Available
  </h2>

  <p
    style={{
      color: "#777",

      maxWidth: "350px",

      margin: "0 auto",

      lineHeight: "1.6"
    }}
  >
    Redeem reward points and unlock
    exclusive Earthkind discount
    coupons for your next order.
  </p>

</div>

)}

        {coupons.map(
          (coupon) => (

           <div
  key={coupon._id}
  style={{
    position: "relative",
    width: "100%",
boxSizing: "border-box",

    background:
      "linear-gradient(135deg,#0f2d1d,#1b5a3a)",

    borderRadius: "24px",

    padding: "22px",

    color: "#fff",

    overflow: "hidden",

    boxShadow:
      "0 18px 40px rgba(22,101,52,0.25)",

    border:
      "1px solid rgba(255,255,255,0.08)"
  }}
>

<FiTag
  size={90}
  style={{
    position: "absolute",
    right: "-15px",
    top: "-15px",
    opacity: 0.06
  }}
/>

<div
  style={{
    position: "absolute",
    inset: 0,

    background:
      "linear-gradient(45deg,transparent 48%,rgba(255,255,255,.03) 50%,transparent 52%)",

    pointerEvents: "none"
  }}
/>
              <FiTag
                size={70}
                style={{
                  position:
                    "absolute",

                  right: "-10px",

                  top: "-10px",

                  opacity: .08
                }}
              />

             <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <div>

    <p
      style={{
        margin: 0,
        opacity: .8,
        fontSize: "12px",
        letterSpacing: "1px"
      }}
    >
      EARTHKIND EXCLUSIVE
    </p>

    <h2
      style={{
        margin: "6px 0",
        fontSize: "34px"
      }}
    >
      ₹{coupon.discount}
    </h2>

  </div>

  <div
    style={{
      background:
        coupon.used
          ? "#ef4444"
          : "#22c55e",

      padding: "6px 12px",

      borderRadius: "999px",

      fontSize: "12px",

      fontWeight: "600"
    }}
  >
    {coupon.used
      ? "USED"
      : "ACTIVE"}
  </div>
</div>

             <div
  style={{
    marginTop: "20px",

    background:
      "rgba(255,255,255,0.08)",

    borderRadius: "14px",

    padding: "14px"
  }}
>
  <div
    style={{
      fontSize: "11px",
      opacity: .75,
      marginBottom: "6px"
    }}
  >
    COUPON CODE
  </div>

  <div
  style={{
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "2px",

    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }}
>
  {coupon.code}
</div>
</div>
<div
  style={{
    marginTop: "14px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center"
  }}
>

  <div>

    <div
      style={{
        fontSize: "11px",
        opacity: .7
      }}
    >
      VALID UNTIL
    </div>

    <div
      style={{
        fontWeight: "600"
      }}
    >
      {new Date(
        coupon.expiresAt
      ).toLocaleDateString()}
    </div>

  </div>

  <span
    style={{
      fontSize: "12px",

      background:
        "rgba(255,255,255,0.12)",

      padding: "5px 10px",

      borderRadius: "999px"
    }}
  >
    Reward Coupon
  </span>

</div>
             <button
  onClick={() =>
    copyCoupon(
      coupon.code
    )
  }

  style={{
    width: "100%",

    marginTop: "18px",

    border: "none",

    background:
      "#fff",

    color:
      "#123524",

    padding: "12px",

    borderRadius:
      "14px",

    fontWeight:
      "700",

    cursor:
      "pointer",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    gap: "8px"
  }}
>
  <FiCopy />

  Copy Coupon
</button>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default MyCouponsSection;