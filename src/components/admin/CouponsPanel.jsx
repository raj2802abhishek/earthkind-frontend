import {
  TicketPercent,
  CalendarDays,
  BadgePercent,
  Trash2
} from "lucide-react";

function CouponsPanel({
  couponCode,
  setCouponCode,
  discountAmount,
  setDiscountAmount,
  couponType,
  setCouponType,
  createCoupon,
  coupons,
  deleteCoupon
}) {

  return (

    <div>

      {/* HEADER */}
     <div
  style={{
    marginBottom: "45px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center"
  }}
>

        <h1
  style={{
    fontSize: "58px",

    fontWeight: "800",

    color: "#123524",

    marginBottom: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "16px",

    letterSpacing: "-2px",

    textAlign: "center",

    lineHeight: "1",

    fontFamily:
      "'Poppins', sans-serif"
  }}
>
  Coupons & Offers

  <span
    style={{
      fontSize: "58px"
    }}
  >
    🎟️
  </span>
</h1>

        <p
  style={{
    color: "#6b7280",

    fontSize: "18px",

    textAlign: "center",

    marginTop: "6px",

    letterSpacing: "1.7px"
  }}
>
          Create premium discounts,
          offers and promotional coupons.
        </p>

      </div>

      {/* CREATE COUPON CARD */}
      <div
        style={{
          background: "#fff",

          borderRadius: "30px",

          padding: "35px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06)",

          marginBottom: "35px"
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",

            marginBottom: "25px"
          }}
        >

          <div
            style={{
              width: "52px",
              height: "52px",

              borderRadius: "16px",

              background:
                "linear-gradient(135deg,#14532d,#1f7a4d)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              color: "#fff"
            }}
          >
            <TicketPercent size={24} />
          </div>

          <div>

            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                color: "#111827"
              }}
            >
              Create New Coupon
            </h2>

            <p
              style={{
                marginTop: "4px",
                color: "#6b7280"
              }}
            >
              Offer discounts to customers
            </p>

          </div>

        </div>

        {/* FORM */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap: "18px"
          }}
        >

          {/* COUPON CODE */}
          <input
            type="text"

            placeholder="Coupon Code"

            value={couponCode}

            onChange={(e) =>
              setCouponCode(e.target.value)
            }

            style={{
              padding: "16px",

              borderRadius: "16px",

              border:
                "1px solid #d1d5db",

              outline: "none",

              fontSize: "15px"
            }}
          />

          {/* DISCOUNT */}
          <input
            type="number"

            placeholder="Discount Amount"

            value={discountAmount}

            onChange={(e) =>
              setDiscountAmount(
                e.target.value
              )
            }

            style={{
              padding: "16px",

              borderRadius: "16px",

              border:
                "1px solid #d1d5db",

              outline: "none",

              fontSize: "15px"
            }}
          />

          {/* TYPE */}
          <select
            value={couponType}

            onChange={(e) =>
              setCouponType(
                e.target.value
              )
            }

            style={{
              padding: "16px",

              borderRadius: "16px",

              border:
                "1px solid #d1d5db",

              outline: "none",

              fontSize: "15px",

              background: "#fff"
            }}
          >

            <option value="percentage">
              Percentage
            </option>

            <option value="flat">
              Flat Discount
            </option>

          </select>

        </div>

        {/* BUTTON */}
        <button
          onClick={createCoupon}

          style={{
            marginTop: "24px",

            background:
              "linear-gradient(135deg,#14532d,#1f7a4d)",

            color: "#fff",

            border: "none",

            padding: "15px 28px",

            borderRadius: "18px",

            cursor: "pointer",

            fontSize: "15px",

            fontWeight: "600",

            boxShadow:
              "0 10px 20px rgba(20,83,45,0.25)"
          }}
        >
          Create Coupon
        </button>

      </div>

      {/* COUPON LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >

        {coupons.map((coupon) => (

          <div
            key={coupon._id}

            style={{
              background: "#fff",

              borderRadius: "24px",

              padding: "24px",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",

              flexWrap: "wrap",

              gap: "18px"
            }}
          >

            {/* LEFT */}
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "18px"
              }}
            >

              {/* ICON */}
              <div
                style={{
                  width: "64px",
                  height: "64px",

                  borderRadius: "20px",

                  background:
                    "linear-gradient(135deg,#14532d,#1f7a4d)",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  color: "#fff"
                }}
              >
                <BadgePercent size={30} />
              </div>

              {/* DETAILS */}
              <div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "#111827"
                  }}
                >
                  {coupon.code}
                </h2>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#6b7280"
                  }}
                >
                  Discount:
                  {" "}
                  <strong>
                    {coupon.discount}
                  </strong>
                </p>

                <div
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",

                    marginTop: "8px",

                    color: "#6b7280",

                    fontSize: "14px"
                  }}
                >
                  <CalendarDays size={15} />

                  {coupon.type}
                </div>

              </div>

            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() =>
                deleteCoupon(coupon._id)
              }

              style={{
                background: "#dc2626",

                color: "#fff",

                border: "none",

                width: "50px",

                height: "50px",

                borderRadius: "16px",

                cursor: "pointer",

                display: "flex",

                alignItems: "center",

                justifyContent: "center"
              }}
            >
              <Trash2 size={20} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CouponsPanel;