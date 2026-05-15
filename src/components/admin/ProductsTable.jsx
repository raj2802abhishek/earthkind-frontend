import {
  Search,
  Trash2,
  Package2,
  Pencil,
  Check
} from "lucide-react";

import { useState } from "react";

function ProductsTable({
  products,
  deleteProduct,
  updateProduct
}) {

  const [search, setSearch] =
    useState("");

  const [selectedCategory,
    setSelectedCategory
  ] = useState("All");

  const [editingId, setEditingId] =
  useState(null);

const [editedName, setEditedName] =
  useState("");

const [editedPrice, setEditedPrice] =
  useState("");

   const handleEdit = async (id) => {

  await updateProduct(
    id,
    editedName,
    editedPrice
  );

  setEditingId(null);
};

  // FILTER PRODUCTS
  const filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : product.category ===
            selectedCategory;
          
           

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "28px",

          flexWrap: "wrap",

          gap: "16px"
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            color: "#123524",
            margin: 0,
            fontWeight: "700"
          }}
        >
          Products 📦
        </h1>

        {/* FILTER AREA */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >

          {/* SEARCH */}
          <div
            style={{
              display: "flex",
              alignItems: "center",

              background: "#fff",

              padding:
                "10px 14px",

              borderRadius: "14px",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >

            <Search
              size={18}
              color="#666"
            />

            <input
              type="text"

              placeholder="Search"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              style={{
                border: "none",
                outline: "none",

                marginLeft: "8px",

                background:
                  "transparent"
              }}
            />

          </div>

          {/* CATEGORY */}
          <select
            value={selectedCategory}

            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }

            style={{
              padding:
                "10px 14px",

              borderRadius: "14px",

              border: "none",

              background: "#fff",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >

            <option value="All">
              All Categories
            </option>

            <option>
              Herbal Powders
            </option>

            <option>
              Natural Seeds
            </option>

            <option>
              Herbal Tea
            </option>

            <option>
              Nuts & Dry Fruits
            </option>

          </select>

        </div>

      </div>

      {/* PRODUCT LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >

        {filteredProducts.map(
          (product) => (

          <div
            key={product._id}

            style={{
              background: "#fff",

              borderRadius: "24px",

              padding: "18px",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              boxShadow:
                "0 8px 20px rgba(0,0,0,0.05)",

              transition:
                "0.3s ease"
            }}
          >

            {/* LEFT */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >

              {/* IMAGE */}
              <div
                style={{
                  width: "78px",
                  height: "78px",

                  borderRadius:
                    "18px",

                  overflow: "hidden",

                  background:
                    "#f4f4f4",

                  flexShrink: 0
                }}
              >

                <img
                  src={product.image}

                  alt="product"

                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      "cover"
                  }}
                />

              </div>

              {/* DETAILS */}
              <div>

                {
  editingId === product._id ? (

    <input
      value={editedName}

      onChange={(e) =>
        setEditedName(
          e.target.value
        )
      }

      style={{
        border: "1px solid #ddd",
        padding: "8px 12px",
        borderRadius: "10px",
        fontSize: "20px",
        fontWeight: "600",
        outline: "none"
      }}
    />

  ) : (

    <h2
      style={{
        margin: 0,
        color: "#123524",
        fontSize: "24px"
      }}
    >
      {product.name}
    </h2>

  )
}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",

                    gap: "10px",

                    marginTop:
                      "8px",

                    flexWrap:
                      "wrap"
                  }}
                >

                  {/* CATEGORY */}
                  <div
                    style={{
                      background:
                        "#e8f5ec",

                      color:
                        "#14532d",

                      padding:
                        "6px 12px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "13px",

                      fontWeight:
                        "600"
                    }}
                  >
                    {
                      product.category
                    }
                  </div>

                  {/* PRICE */}
                 {
  editingId === product._id ? (

    <input
      type="number"

      value={editedPrice}

      onChange={(e) =>
        setEditedPrice(
          e.target.value
        )
      }

      style={{
        width: "90px",
        border: "1px solid #ddd",
        padding: "8px 10px",
        borderRadius: "10px",
        outline: "none",
        fontWeight: "600"
      }}
    />

  ) : (

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#555",
        fontWeight: "600"
      }}
    >
      ₹{product.price}
    </div>

  )
}

                </div>

              </div>

            </div>

            {/* RIGHT ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              {
  editingId === product._id ? (

    <button
      onClick={() =>
        handleEdit(
          product._id
        )
      }

      style={{
        background: "#14532d",
        color: "#fff",
        border: "none",
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <Check size={18} />

    </button>

  ) : (

    <button
      onClick={() => {

        setEditingId(
          product._id
        );

        setEditedName(
          product.name
        );

        setEditedPrice(
          product.price
        );
      }}

      style={{
        background: "#2563eb",
        color: "#fff",
        border: "none",
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <Pencil size={18} />

    </button>

  )
}

              {/* DELETE */}
              <button
                onClick={() =>
                  deleteProduct(
                    product._id
                  )
                }

                style={{
                  background:
                    "#dc2626",

                  color: "#fff",

                  border: "none",

                  width: "44px",

                  height: "44px",

                  borderRadius:
                    "14px",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center"
                }}
              >

                <Trash2
                  size={18}
                />

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY */}
      {filteredProducts.length === 0 && (

        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            color: "#777"
          }}
        >

          <Package2
            size={50}
          />

          <p>
            No products found
          </p>

        </div>

      )}

    </div>
  );
}

export default ProductsTable;