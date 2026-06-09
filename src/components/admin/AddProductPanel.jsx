import {
  UploadCloud,
  PlusCircle,
  PackagePlus,
  Sparkles,
  ImagePlus
} from "lucide-react";

function AddProductPanel({

  name,
  setName,

  price,
  setPrice,

  stock,
  setStock,

  category,
  setCategory,

  story,
  setStory,

  benefits,
  setBenefits,

  howToUse,
  setHowToUse,

  ingredients,
  setIngredients,

  images,
  setImages,

  setImage,

  uploadImage,

  addProduct

}) {
  const updateArrayField = (
  setter,
  index,
  value,
  currentArray
) => {

  const updated = [...currentArray];

  updated[index] = value;

  setter(updated);

};

const addArrayField = (
  setter,
  currentArray
) => {

  setter([
    ...currentArray,
    ""
  ]);

};

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "48px",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center"
        }}
      >

        <h1
          style={{
            fontSize: "58px",

            color: "#123524",

            marginBottom: "18px",

            fontWeight: "800",

            letterSpacing: "-2px",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            gap: "16px",

            fontFamily:
              "'Poppins', sans-serif"
          }}
        >

          Add Product

          <Sparkles
            size={44}
            color="#7c3aed"
          />

        </h1>

        <p
          style={{
            color: "#6b7280",

            fontSize: "18px",

            maxWidth: "600px",

            lineHeight: "1.7"
          }}
        >
          Create and publish premium products
          for your EarthKind Naturals store.
        </p>

      </div>

      {/* MAIN CARD */}
      <div
        style={{
          background: "#fff",

          borderRadius: "30px",

          padding: "35px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06)",

          maxWidth: "950px",

          margin: "0 auto"
        }}
      >

        {/* GRID */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(3,minmax(0,1fr))",

            gap: "24px"
          }}
        >

          {/* PRODUCT NAME */}
          <div>

            <label
              style={labelStyle}
            >
              Product Name
            </label>

            <input
              type="text"

              placeholder="Enter product name"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              style={inputStyle}
            />

          </div>

          {/* PRICE */}
          <div>

            <label
              style={labelStyle}
            >
              Product Price
            </label>

            <input
              type="number"

              placeholder="₹ Price"

              value={price}

              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }

              style={inputStyle}
            />

          </div>

          {/* STOCK */}
          <div>

            <label
              style={labelStyle}
            >
              Stock Quantity
            </label>

            <input
              type="number"

              placeholder="Enter stock quantity"

              value={stock}

              onChange={(e) =>
                setStock(
                  e.target.value
                )
              }

              style={inputStyle}
            />

          </div>

          {/* CATEGORY */}
          <div
            style={{
              gridColumn:
                "span 3"
            }}
          >

            <label
              style={labelStyle}
            >
              Category
            </label>

            <select
              value={category}

              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }

              style={inputStyle}
            >

              <option value="">
                Select Category
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
          {/* PRODUCT STORY */}
<div
  style={{
    gridColumn: "span 3"
  }}
>

  <label style={labelStyle}>
    Product Story
  </label>

  <textarea

    placeholder="Write premium storytelling for the product..."

    value={story}

    onChange={(e) =>
      setStory(e.target.value)
    }

    style={{
      ...inputStyle,

      minHeight: "180px",

      padding: "20px",

      resize: "vertical"
    }}
  />

</div>

{/* BENEFITS */}
<div
  style={{
    gridColumn: "span 3"
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "16px"
    }}
  >

    <label style={labelStyle}>
      Product Benefits
    </label>

    <button

      type="button"

      onClick={() =>
        addArrayField(
          setBenefits,
          benefits
        )
      }

      className="earth-btn"
    >
      Add Benefit
    </button>

  </div>

  {benefits.map(
    (benefit, index) => (

    <input

      key={index}

      type="text"

      placeholder={`Benefit ${index + 1}`}

      value={benefit}

      onChange={(e) =>
        updateArrayField(
          setBenefits,
          index,
          e.target.value,
          benefits
        )
      }

      style={{
        ...inputStyle,

        marginBottom: "14px"
      }}
    />

  ))}

</div>

{/* HOW TO USE */}
<div
  style={{
    gridColumn: "span 3"
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "16px"
    }}
  >

    <label style={labelStyle}>
      How To Use
    </label>

    <button

      type="button"

      onClick={() =>
        addArrayField(
          setHowToUse,
          howToUse
        )
      }

      className="earth-btn"
    >
      Add Step
    </button>

  </div>

  {howToUse.map(
    (step, index) => (

    <input

      key={index}

      type="text"

      placeholder={`Step ${index + 1}`}

      value={step}

      onChange={(e) =>
        updateArrayField(
          setHowToUse,
          index,
          e.target.value,
          howToUse
        )
      }

      style={{
        ...inputStyle,

        marginBottom: "14px"
      }}
    />

  ))}

</div>

{/* INGREDIENTS */}
<div
  style={{
    gridColumn: "span 3"
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "16px"
    }}
  >

    <label style={labelStyle}>
      Ingredients
    </label>

    <button

      type="button"

      onClick={() =>
        addArrayField(
          setIngredients,
          ingredients
        )
      }

      className="earth-btn"
    >
      Add Ingredient
    </button>

  </div>

  {ingredients.map(
    (ingredient, index) => (

    <input

      key={index}

      type="text"

      placeholder={`Ingredient ${index + 1}`}

      value={ingredient}

      onChange={(e) =>
        updateArrayField(
          setIngredients,
          index,
          e.target.value,
          ingredients
        )
      }

      style={{
        ...inputStyle,

        marginBottom: "14px"
      }}
    />

  ))}

</div>

          {/* IMAGE UPLOAD */}
          <div
            style={{
              gridColumn:
                "span 3"
            }}
          >

            <label
              style={labelStyle}
            >
              Product Image
            </label>

            <div
              style={{
                border:
                  "2px dashed #cbd5e1",

                borderRadius:
                  "28px",

                padding: "55px 30px",

                textAlign:
                  "center",

                background:
                  "linear-gradient(180deg,#fafafa,#f3f4f6)",

                transition: "0.3s ease",

                cursor: "pointer",

                position: "relative",

                overflow: "hidden"
              }}
            >

              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#14532d,#1f7a4d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}
              >

                <ImagePlus
                  size={40}
                  color="#fff"
                />

              </div>

              <p
                style={{
                  marginTop: "18px",

                  color: "#555",

                  fontSize: "17px",

                  fontWeight: "500"
                }}
              >
                Drag & Drop Product Image
              </p>

              <p
                style={{
                  marginTop: "8px",

                  color: "#9ca3af",

                  fontSize: "14px"
                }}
              >
                PNG, JPG, WEBP supported
              </p>

              <label
                style={{
                  display: "inline-block",
                  marginTop: "24px",
                  background:
                    "#123524",
                  color: "#fff",
                  padding: "13px 24px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px"
                }}
              >

                Choose Product Image

                <input
                  type="file"

                  hidden

                  onChange={(e) =>
                    setImage(
                      e.target.files[0]
                    )
                  }
                />

              </label>

            </div>

          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",

            gap: "18px",

            marginTop: "35px",

            flexWrap: "wrap",

            justifyContent: "center",

            alignItems: "center",

            width: "100%"
          }}
        >

          {/* UPLOAD */}
          <button
            onClick={uploadImage}

            style={{
              background:
                "#14532d",

              color: "#fff",

              border: "none",

              padding:
                "14px 24px",

              borderRadius:
                "16px",

              display: "flex",

              alignItems:
                "center",

              gap: "10px",

              cursor: "pointer",

              fontWeight: "600",

              fontSize: "15px",

              boxShadow:
                "0 8px 20px rgba(20,83,45,0.2)"
            }}
          >

            <UploadCloud
              size={18}
            />

            Upload Image

          </button>

          {/* ADD PRODUCT */}
          <button
            onClick={addProduct}

            style={{
              background:
                "linear-gradient(135deg,#123524,#1f7a4d)",

              color: "#fff",

              border: "none",

              padding:
                "14px 26px",

              borderRadius:
                "16px",

              display: "flex",

              alignItems:
                "center",

              gap: "10px",

              cursor: "pointer",

              fontWeight: "600",

              fontSize: "15px",

              boxShadow:
                "0 10px 24px rgba(0,0,0,0.12)"
            }}
          >

            <PlusCircle
              size={18}
            />

            Add Product

          </button>

        </div>

      </div>

      {/* BOTTOM INFO CARD */}
      <div
        style={{
          marginTop: "28px",

          background: "#123524",

          color: "#fff",

          padding: "22px",

          borderRadius: "24px",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center",

          gap: "18px",

          maxWidth: "920px",

          marginLeft: "auto",

          marginRight: "auto"
        }}
      >

        <PackagePlus
          size={36}
        />

        <div>

          <h3
            style={{
              margin: 0
            }}
          >
            Premium Product Management
          </h3>

          <p
            style={{
              marginTop: "6px",

              opacity: 0.8
            }}
          >
            Add high-quality products
            with optimized details and
            beautiful presentation.
          </p>

        </div>

      </div>

    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {

  width: "100%",

  height: "62px",

  padding: "0 18px",

  borderRadius: "18px",

  border: "1px solid #e5e7eb",

  outline: "none",

  background: "#f9fafb",

  fontSize: "16px",

  marginTop: "10px",

  boxSizing: "border-box",

  transition: "0.3s ease",

  fontWeight: "500"
};

/* LABEL STYLE */
const labelStyle = {

  color: "#374151",

  fontWeight: "600",

  fontSize: "14px"
};

export default AddProductPanel;