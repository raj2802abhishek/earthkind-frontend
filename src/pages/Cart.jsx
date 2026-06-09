import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {

    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = savedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1
    }));

    setCart(updatedCart);

  }, []);

  const increaseQuantity = (index) => {

    const updatedCart = [...cart];

    updatedCart[index].quantity =
      Number(updatedCart[index].quantity || 1) + 1;

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const decreaseQuantity = (index) => {

  const updatedCart = [...cart];

  if (
    Number(
      updatedCart[index].quantity || 1
    ) > 1
  ) {

    updatedCart[index].quantity =
      Number(
        updatedCart[index].quantity
      ) - 1;

  } else {

    updatedCart.splice(index, 1);
  }

  setCart(updatedCart);

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};

  const removeFromCart = (id) => {

    const updatedCart = cart.filter(
      (item, index) => index !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      item.price *
        Number(item.quantity || 1),
    0
  );
  const groupedCart = Object.values(

  cart.reduce((acc, item) => {

    if (!acc[item.name]) {

      acc[item.name] = {
        name: item.name,
        category: item.category,
        items: [],
      };
    }

    acc[item.name].items.push(item);

    return acc;

  }, {})
);

  return (

    <div
  style={{
    padding: "20px",
    width: "100%",
    maxWidth: "1760px",
    margin: "0 auto",
  }}
>

     <h1
  style={{
    fontSize: "56px",
    color: "#234d2c",
    margin: 0,
    fontFamily: "Georgia, serif",
    textAlign: "center",
    marginBottom: "50px",
  }}
>
       Your Cart <FiShoppingCart 
       style={{
    verticalAlign: "middle",
    marginTop: "-6px"
  }}
       />
      </h1>

      {cart.length === 0 ? (

        <h2
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "70px",
            
          }}
        >
          Your cart is empty
        </h2>

      ) : (

        <>

         {groupedCart.map((group, groupIndex) => (

  <div
    key={groupIndex}

    style={{
      padding: "18px",
      marginBottom: "30px",
      borderRadius: "24px",
      background:
        "linear-gradient(145deg,#ffffff,#f8faf8)",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.05)",
      border:
        "1px solid rgba(18,53,36,0.05)",
        overflow: "hidden",

backdropFilter: "blur(10px)",

transition: "0.35s ease",
    }}
    onMouseEnter={(e) => {

  e.currentTarget.style.transform =
    "translateY(-4px)";

  e.currentTarget.style.boxShadow =
    "0 18px 40px rgba(0,0,0,0.08)";
}}

onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "translateY(0px)";

  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.05)";
}}
  >
    
   <div
  style={{
    display: "flex",
    gap: "20px",
    alignItems: "stretch"
  }}
>

  {/* PRODUCT IMAGE */}
  <img
    src={
      group.items[0].image
    }

    alt={group.name}

    style={{
  width: "250px",
height: "320px",

  objectFit: "contain",

  borderRadius: "24px",

  background:
    "linear-gradient(145deg,#f7faf7,#eef5ef)",

  padding: "18px",

  border:
    "1px solid #eef2ee",

  boxShadow:
    "0 10px 24px rgba(0,0,0,0.04)",

  flexShrink: 0
}}
  />

  {/* RIGHT SIDE */}
  <div
  style={{
   width: "220px",
   height:"320px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",

   
  }}
>

    {/* PRODUCT TITLE */}
    <h2
      style={{
        color: "#234d2c",
        marginBottom: "8px",
        fontSize: "28px",
letterSpacing: "-1px",
lineHeight: "1.1"
      }}
    >
      {group.name}
    </h2>

    <p
      style={{
        color: "#6b7280",
        marginBottom: "0px",
        fontSize: "15px"
      }}
    >
      {group.category}
    </p>

    {/* ALL WEIGHTS */}
    {group.items.map((item) => {

      const originalIndex =
        cart.findIndex(
          (cartItem) =>

            cartItem._id === item._id &&

            cartItem.weight === item.weight
        );

      return (

        <div
          key={
            item._id +
            item.weight
          }

          style={{
            padding: "0px",

            borderTop:
              "1px solid #eef2ee",

            display: "flex",

           justifyContent: "center",
gap: "18px",

            alignItems: "center"
          }}
        >

          {/* LEFT */}
          <div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "0px",
                marginTop: "-4px"
              }}
            >

              <p
                style={{
                  color: "#123524",
                  fontWeight: "600",
                  fontSize: "17px",
                  minWidth: "70px"
                }}
              >
                {item.weight}
              </p>

              <h3
                style={{
                  color: "#2e7d32",
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "-1px"
                }}
              >
                ₹{item.price}
              </h3>

            </div>

            {/* QUANTITY */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap:"6px"
              }}
            >

              <button
                onClick={() =>
                  decreaseQuantity(
                    originalIndex
                  )
                }

                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d6e4d6",
                  cursor: "pointer",
                  background: "#fff",
                  fontSize: "20px",
                  transition: "0.3s ease"
                }}
                onMouseEnter={(e) => {

  e.currentTarget.style.background =
    "#123524";

  e.currentTarget.style.color =
    "#fff";

  e.currentTarget.style.transform =
    "translateY(-2px)";
}}

onMouseLeave={(e) => {

  e.currentTarget.style.background =
    "#fff";

  e.currentTarget.style.color =
    "#123524";

  e.currentTarget.style.transform =
    "translateY(0px)";
}}
              >
                -
              </button>

              <span
                style={{
                  fontWeight: "700",
                  fontSize: "18px",
                  color: "#123524",
                  minWidth: "20px",
                  textAlign: "center"
                }}
              >
                {item.quantity || 1}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(
                    originalIndex
                  )
                }

                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  border:
                    "1px solid #d6e4d6",
                  cursor: "pointer",
                  background: "#fff",
                  fontSize: "20px",
                  transition: "0.3s ease"
                }}
                onMouseEnter={(e) => {

  e.currentTarget.style.background =
    "#123524";

  e.currentTarget.style.color =
    "#fff";

  e.currentTarget.style.transform =
    "translateY(-2px)";
}}

onMouseLeave={(e) => {

  e.currentTarget.style.background =
    "#fff";

  e.currentTarget.style.color =
    "#123524";

  e.currentTarget.style.transform =
    "translateY(0px)";
}}
              >
                +
              </button>

            </div>

          </div>

        </div>

      );
    })}

    {/* SUBTOTAL + REMOVE */}
    <div
      style={{
        marginTop: "2px",
        paddingTop: "6px",

        borderTop:
          "1px solid #eef2ee",

        display: "flex",

flexDirection: "column",

alignItems: "center",

justifyContent: "center",

gap: "12px"
      }}
    >

      <div>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "1px",
            marginTop:"2px",
          }}
        >
          Product Subtotal
        </p>

        <h3
          style={{
            color: "#123524",
            fontSize: "22px",
            fontWeight: "800",
             marginTop:"2px",
          }}
        >
          ₹
          {group.items.reduce(
            (total, item) =>

              total +
              item.price *
                Number(
                  item.quantity || 1
                ),

            0
          )}
        </h3>

      </div>

      
    </div>

  </div>
  

</div>

  <div
  style={{
    marginTop: "10px",
    display: "flex",
    justifyContent: "center"
  }}
>

  <button
    onClick={() => {

      group.items.forEach(
        (item) => {

          const originalIndex =
            cart.findIndex(
              (cartItem) =>

                cartItem._id === item._id &&

                cartItem.weight === item.weight
            );

          if (
            originalIndex !== -1
          ) {

            removeFromCart(
              originalIndex
            );
          }
        }
      );
    }}

    style={{
      background: "#fff",

      color: "#c0392b",

      border:
        "1px solid #e74c3c",

      padding: "12px 34px",

      borderRadius: "14px",

      cursor: "pointer",

      fontWeight: "600",

      transition: "0.3s ease",

      fontSize: "15px",

      minWidth: "220px"
    }}

    onMouseEnter={(e) => {

      e.currentTarget.style.background =
        "#e74c3c";

      e.currentTarget.style.color =
        "#fff";
    }}

    onMouseLeave={(e) => {

      e.currentTarget.style.background =
        "#fff";

      e.currentTarget.style.color =
        "#c0392b";
    }}
  >
    Remove Product
  </button>

</div>

  </div>
  
  

))}


          {/* TOTAL SECTION */}
          <div
            style={{
              marginTop: "60px",

              padding: "28px",

              background:
                "linear-gradient(145deg,#ffffff,#f8faf8)",

              borderRadius: "28px",

              boxShadow:
                "0 12px 35px rgba(0,0,0,0.06)",

              textAlign: "center",
              maxWidth: "980px",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >

            <p
              style={{
                color: "#6b7280",
                marginBottom: "10px"
              }}
            >
              Premium Secure Checkout
            </p>

            <h2
              style={{
                color: "#123524",
                marginBottom: "24px",
                fontSize: "36px"
              }}
            >
              Total:
              {" "}
              ₹{totalPrice}
            </h2>

            <button
              onClick={() =>
                navigate("/checkout")
              }

              style={{
                padding: "18px 72px",

                background:
                  "linear-gradient(90deg,#123524,#1d6b43)",

                color: "#fff",

                border: "none",

                borderRadius: "18px",

                cursor: "pointer",

                fontSize: "16px",

                fontWeight: "600",

                transition: "0.35s ease",
                

                boxShadow:
                  "0 12px 24px rgba(18,53,36,0.18)"
              }}
Earthkind Naturals
              onMouseEnter={(e) => {

  e.currentTarget.style.transform =
    "translateY(-3px) scale(1.02)";

  e.currentTarget.style.boxShadow =
    "0 18px 32px rgba(18,53,36,0.28)";

  e.currentTarget.style.background =
    "linear-gradient(90deg,#0f2d1f,#1f7a4d)";
}}
onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "translateY(0px) scale(1)";

  e.currentTarget.style.boxShadow =
    "0 12px 24px rgba(18,53,36,0.18)";

  e.currentTarget.style.background =
    "linear-gradient(90deg,#123524,#1d6b43)";
}}
            >
              Proceed to Checkout
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Cart;