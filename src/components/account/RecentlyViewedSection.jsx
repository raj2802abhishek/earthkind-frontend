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
    <div className="rv-container">
      {/* HEADER */}
      <h2
        style={{
          color: "#123524",
          fontSize: "26px",
          fontWeight: "800",
          marginBottom: "4px"
        }}
      >
        👀 Recently Viewed Products ({products.length})
      </h2>

      <p
        style={{
          color: "#777",
          marginBottom: "18px",
          fontSize: "14px"
        }}
      >
        Continue where you left off
      </p>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "60px 20px",
            textAlign: "center",
            border: "1px solid #eef2ef"
          }}
        >
          <div style={{ fontSize: "60px" }}>👀</div>
          <h2 style={{ color: "#123524", marginTop: "14px", fontSize: "20px" }}>
            No Recently Viewed Products
          </h2>
          <p
            style={{
              color: "#777",
              maxWidth: "350px",
              margin: "8px auto 0",
              lineHeight: "1.6",
              fontSize: "13px"
            }}
          >
            Products you explore will automatically appear here.
          </p>
        </div>
      )}

      {/* SCROLLABLE PRODUCT LIST */}
      {products.length > 0 && (
        <div className="rv-grid">
          {products.map((product) => (
            <div key={product._id} className="rv-card">
              {/* LEFT */}
              <div className="rv-card-left">
                <img
                  src={product.image}
                  alt={product.name}
                  className="rv-card-img"
                />

                <div className="rv-card-info">
                  <h3 className="rv-card-title">
                    {product.name}
                  </h3>

                  <div className="rv-card-price">
                    ₹{product.price}
                  </div>

                  <p className="rv-card-cat">
                    {product.category || "Herbal Product"}
                  </p>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="rv-card-actions">
                <button
                  type="button"
                  className="rv-view-btn"
                  onClick={() => {
                    if (setShowMenu) {
                      setShowMenu(false);
                    }
                    navigate("/product-details", {
                      state: { product }
                    });
                  }}
                >
                  View Again
                  <FiArrowRight />
                </button>

                <button
                  type="button"
                  className="rv-delete-btn"
                  onClick={() => removeProduct(product._id)}
                  title="Remove from recently viewed"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentlyViewedSection;