import React, {
  useEffect,
  useState
} from "react";

import {
  FiEye,
  FiTrash2,
  FiArrowRight
} from "react-icons/fi";

import {
  useNavigate
} from "react-router-dom";

function RecentlyViewedSection({
  setShowMenu
}) {

  const navigate =
    useNavigate();

  const [products,
    setProducts] =
      useState([]);

  useEffect(() => {

    const viewed =
      JSON.parse(
        localStorage.getItem(
          "recentlyViewed"
        )
      ) || [];

    setProducts(viewed);

  }, []);

  const removeProduct =
    (id) => {

      const updated =
        products.filter(
          (item) =>
            item._id !== id
        );

      setProducts(updated);

      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updated)
      );

    };

  return (

    <div>

      {/* HEADER */}

      <h2
        style={{
          color: "#123524",
          marginBottom: "6px"
        }}
      >
        👀 Recently Viewed Products
        ({products.length})
      </h2>

      <p
        style={{
          color: "#777",
          marginBottom: "18px"
        }}
      >
        Continue where you left off
      </p>

      {/* EMPTY STATE */}

      {products.length === 0 && (

        <div
          style={{
            background: "#fff",
            borderRadius: "28px",
            padding: "70px 30px",
            textAlign: "center",
            border:
              "1px solid #eef2ef"
          }}
        >

          <div
            style={{
              fontSize: "70px"
            }}
          >
            👀
          </div>

          <h2
            style={{
              color: "#123524",
              marginTop: "15px"
            }}
          >
            No Recently Viewed Products
          </h2>

          <p
            style={{
              color: "#777",
              maxWidth: "350px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}
          >
            Products you explore will
            automatically appear here.
          </p>

        </div>

      )}

      {/* SCROLLABLE PRODUCT LIST */}

      {products.length > 0 && (

        <div
          style={{
            display: "grid",
            gap: "14px",

            maxHeight: "500px",
            overflowY: "auto",

            paddingRight: "5px"
          }}
        >

          {products.map(
            (product) => (

              <div
                key={product._id}

                style={{
                  background:
                    "linear-gradient(180deg,#ffffff,#f8faf8)",

                  borderRadius: "22px",

                  padding: "16px",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "space-between",

                  gap: "14px",

                  border:
                    "1px solid #eef2ef",

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.05)"
                }}
              >

                {/* LEFT */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1
                  }}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit:
                        "contain",

                      background:
                        "#fff",

                      borderRadius:
                        "16px",

                      padding: "8px",

                      border:
                        "1px solid #eef2ef"
                    }}
                  />

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color:
                          "#123524"
                      }}
                    >
                      {product.name}
                    </h3>

                    <p
                      style={{
                        margin:
                          "5px 0",
                        color:
                          "#777"
                      }}
                    >
                      ₹{product.price}
                    </p>

                    <p
                      style={{
                        margin: 0,

                        fontSize:
                          "13px",

                        color:
                          "#999"
                      }}
                    >
                      {product.category ||
                        "Herbal Product"}
                    </p>

                  </div>

                </div>

                {/* RIGHT ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >

                  <button
                   onClick={() => {

  if (setShowMenu) {
    setShowMenu(false);
  }

  navigate(
    "/product-details",
    {
      state: {
        product
      }
    }
  );

}}

                    style={{
                      border: "none",

                      background:
                        "#123524",

                      color:
                        "#fff",

                      padding:
                        "10px 16px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "6px",

                      fontWeight:
                        "600"
                    }}
                  >
                    View Again
                    <FiArrowRight />
                  </button>

                  <button
                    onClick={() =>
                      removeProduct(
                        product._id
                      )
                    }

                    style={{
                      border: "none",

                      background:
                        "#fff5f5",

                      color:
                        "#ef4444",

                      width: "42px",

                      height: "42px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer"
                    }}
                  >
                    <FiTrash2 />
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default RecentlyViewedSection;