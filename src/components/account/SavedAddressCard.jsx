import React from "react";

import {
  FiHome,
  FiTrash2,
  FiPlus,
  FiEdit2
} from "react-icons/fi";
function SavedAddressCard({
  user,
  addresses,
  setShowAddressModal,
  deleteAddress,
  editAddress
}) 
{

  return (

    <div
      style={{
        background: "#fff",

        borderRadius: "16px",

        padding: "12px",

        border:
          "1px solid rgba(0,0,0,0.05)"
      }}
    >

      {/* TOP */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "12px"
        }}
      >

        <h3
          style={{
            margin: 0,

            fontSize: "15px",

            color: "#222"
          }}
        >
          Saved Addresses
        </h3>

        <button
          onClick={() =>
            setShowAddressModal(true)
          }

          style={{
            border: "none",

            background: "#163923",

            color: "#fff",

            borderRadius: "999px",

            padding: "7px 12px",

            fontSize: "12px",

            display: "flex",

            alignItems: "center",

            gap: "6px",

            cursor: "pointer",

            fontWeight: "600"
          }}
        >

          <FiPlus size={13} />

          Add

        </button>

      </div>

      {/* NO ADDRESS */}

      {addresses.length === 0 && (

        <div
          style={{
            padding: "20px",

            borderRadius: "14px",

            background:
              "#f8f8f8",

            textAlign: "center",

            fontSize: "13px",

            color: "#666"
          }}
        >
          No saved addresses yet
        </div>

      )}

      {/* ADDRESS LIST */}

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: "10px"
        }}
      >

        {addresses.map(
          (item, index) => (

            <div
              key={item.id}

              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                gap: "10px",

                padding: "12px",

                borderRadius: "14px",

                background:
                  "#fafafa",

                border:
                  "1px solid rgba(0,0,0,0.05)"
              }}
            >

              {/* LEFT */}

              <div
                style={{
                  display: "flex",

                  gap: "10px",

                  minWidth: 0
                }}
              >

                <FiHome
                  size={16}

                  style={{
                    flexShrink: 0,

                    marginTop: "2px",

                    color: "#163923"
                  }}
                />

                <div>

                  <div
                    style={{
                      display: "flex",

                      alignItems:
                        "center",

                      gap: "8px",

                      flexWrap: "wrap"
                    }}
                  >

                    <h4
                      style={{
                        margin: 0,

                        fontSize:
                          "14px",

                        color: "#222"
                      }}
                    >
                      {item.type}
                    </h4>

                    {index === 0 && (

                      <span
                        style={{
                          background:
                            "#eaf7e8",

                          color:
                            "#2f7d32",

                          fontSize:
                            "10px",

                          padding:
                            "3px 8px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "700"
                        }}
                      >
                        Default
                      </span>

                    )}

                  </div>

                  <p
                    style={{
                      margin:
                        "3px 0 0",

                      fontSize:
                        "12px",

                      color: "#555"
                    }}
                  >
                    {item.fullName}
                  </p>

                  <p
                    style={{
                      margin:
                        "2px 0 0",

                      fontSize:
                        "12px",

                      color: "#555",

                      lineHeight:
                        "1.45"
                    }}
                  >
                    {item.address}
                  </p>

                  <p
                    style={{
                      margin:
                        "2px 0 0",

                      fontSize:
                        "12px",

                      color: "#555"
                    }}
                  >
                    {item.city}
                    {" - "}
                    {item.pincode}
                  </p>

                  <p
                    style={{
                      margin:
                        "2px 0 0",

                      fontSize:
                        "12px",

                      color: "#555"
                    }}
                  >
                    Phone:
                    {" "}
                    {item.phone}
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div
                style={{
                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  gap: "10px"
                }}
              >

               <button
 

  onClick={() =>
    editAddress(item)
  }

  style={{
    border: "none",

    background: "#eef4ff",

    color: "#2563eb",

    width: "28px",

    height: "28px",

    borderRadius: "8px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    cursor: "pointer"
  }}
>

  <FiEdit2 size={13} />

</button>

                <button
                  onClick={() =>
                    deleteAddress(
                      item.id
                    )
                  }

                  style={{
                    border: "none",

                    background:
                      "#fff0f0",

                    color: "#e53935",

                    width: "28px",

                    height: "28px",

                    borderRadius:
                      "8px",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    cursor: "pointer"
                  }}
                >

                  <FiTrash2 size={13} />

                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
}

export default SavedAddressCard;