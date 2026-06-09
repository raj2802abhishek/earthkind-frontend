import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import AdminSidebar from "../components/admin/AdminSidebar";

import DashboardOverview from "../components/admin/DashboardOverview";

import ProductsTable from "../components/admin/ProductsTable";

import AddProductPanel from "../components/admin/AddProductPanel";

import OrdersPanel from "../components/admin/OrdersPanel";

import CouponsPanel from "../components/admin/CouponsPanel";

function Admin() {

  
  // PRODUCTS
  const [products, setProducts] =
    useState([]);

  // ORDERS
  const [orders, setOrders] =
    useState([]);

  // PRODUCT FORM
  const [image, setImage] =
    useState(null);

  const [imageUrl, setImageUrl] =
    useState("");

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category, setCategory] =
    useState("");

    const [story, setStory] =
  useState("");

const [benefits, setBenefits] =
  useState([""]);

const [howToUse, setHowToUse] =
  useState([""]);

const [ingredients, setIngredients] =
  useState([""]);

const [images, setImages] =
  useState([]);
  // COUPONS
  const [coupons, setCoupons] =
    useState([]);

  const [couponCode, setCouponCode] =
    useState("");

  const [
    couponDiscount,
    setCouponDiscount
  ] = useState("");

  const [couponType, setCouponType] =
    useState("fixed");

  // ACTIVE TAB
  const [activeTab, setActiveTab] =
    useState("dashboard");

    const [totalUsers, setTotalUsers] =
  useState(0);

  // DISABLE PAGE SCROLL
  

  // INITIAL FETCH
  useEffect(() => {

    fetchProducts();
    fetchOrders();
    fetchCoupons();

    fetch(
  `${import.meta.env.VITE_API_URL}/api/users/count`
)
  .then((res) => res.json())
  .then((data) =>
    setTotalUsers(
      data.totalUsers
    )
  );

  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      setProducts(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // FETCH ORDERS
  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`
      );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // FETCH COUPONS
  const fetchCoupons = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coupons`
      );

      setCoupons(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // ADD COUPON
  const addCoupon = async () => {

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons`,
        {
          code: couponCode,
          discount: couponDiscount,
          type: couponType
        }
      );

      toast.success(
  "Coupon created successfully"
);

      setCouponCode("");
      setCouponDiscount("");
      setCouponType("fixed");

      fetchCoupons();

    } catch (error) {

      console.log(error);

       toast.success("Failed to add coupon ❌");

    }
  };

  // DELETE COUPON
  const deleteCoupon = async (id) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/coupons/${id}`
      );

       toast.success(
        "Coupon deleted successfully 🗑️"
      );

      fetchCoupons();

    } catch (error) {

      console.log(error);

       toast.success(
        "Failed to delete coupon ❌"
      );

    }
  };

  // UPLOAD IMAGE
  const uploadImage = async () => {

    if (!image) {

       toast.success(
        "Please select an image first"
      );

      return;
    }

    const formData = new FormData();

    formData.append("image", image);

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setImageUrl(res.data.imageUrl);

       toast.success(
        "Image uploaded successfully ✅"
      );

    } catch (error) {

      console.log(error);

       toast.success("Image upload failed ❌");

    }
  };

  // ADD PRODUCT
 const addProduct = async () => {

  try {

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/products/add`,
      {

        name,

        price,

        category,

        description:
          "Premium Earthkind Naturals product",

        image: imageUrl,

        /* NEW */
        images:
          images.length > 0
            ? images
            : [imageUrl],

        story,

        benefits:
          benefits.filter(
            (item) =>
              item.trim() !== ""
          ),

        howToUse:
          howToUse.filter(
            (item) =>
              item.trim() !== ""
          ),

        ingredients:
          ingredients.filter(
            (item) =>
              item.trim() !== ""
          ),

        stock: 10,

        rating: 5,

        reviews: 0

      }
    );

    toast.success(
      "Product added successfully ✅"
    );

    /* RESET */

    setName("");
    setPrice("");
    setCategory("");

    setStory("");

    setBenefits([""]);

    setHowToUse([""]);

    setIngredients([""]);

    setImages([]);

    fetchProducts();

  } catch (error) {

    console.log(error);

  }

};
  // DELETE PRODUCT
  const deleteProduct = async (id) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/delete/${id}`
      );

       toast.success(
        "Product deleted successfully 🗑️"
      );

      fetchProducts();

    } catch (error) {

      console.log(error);

    }
  };


  const updateProduct = async (
  id,
  name,
  price
) => {

  try {

    await axios.put(
  `${import.meta.env.VITE_API_URL}/api/products/update/${id}`,
      {
        name,
        price
      }
    );

    fetchProducts();

  } catch (error) {

    console.log(error);

  }
};
  // UPDATE ORDER STATUS
  const updateOrderStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
       `${import.meta.env.VITE_API_URL}/api/orders/update/${id}`,
        { status }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);

    }
  };

  return (

   <div
  style={{
    display: "flex",

    gap: "24px",
    alignItems: "stretch",

   

    background: "#ece9df",

    padding: "20px",

    minHeight: "100vh",

    overflow: "visible"
  }}
>
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* RIGHT CONTENT */}
      <div
        style={{
         

          padding: "45px",

          flex: 1,
minWidth: 0,

          background: "#f8f6f1",

          borderRadius: "36px",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",

          border:
            "1px solid rgba(255,255,255,0.7)",

          minHeight: "100vh",

overflow: "visible"

         
        }}
      >

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <DashboardOverview
  products={products}
  setProducts={setProducts}
  orders={orders}
  coupons={coupons}
  totalUsers={totalUsers}
/>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
         <ProductsTable
  products={products}
  deleteProduct={deleteProduct}
  updateProduct={updateProduct}
/>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "addProduct" && (
         <AddProductPanel

  name={name}
  setName={setName}

  price={price}
  setPrice={setPrice}

  category={category}
  setCategory={setCategory}

  story={story}
  setStory={setStory}

  benefits={benefits}
  setBenefits={setBenefits}

  howToUse={howToUse}
  setHowToUse={setHowToUse}

  ingredients={ingredients}
  setIngredients={setIngredients}

  images={images}
  setImages={setImages}

  setImage={setImage}

  uploadImage={uploadImage}

  addProduct={addProduct}
/>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <OrdersPanel
            orders={orders}
            updateOrderStatus={
              updateOrderStatus
            }
          />
        )}

        {/* COUPONS */}
        {activeTab === "coupons" && (
         <CouponsPanel

  coupons={coupons}

  couponCode={couponCode}
  setCouponCode={setCouponCode}

  discountAmount={couponDiscount}
  setDiscountAmount={setCouponDiscount}

  couponType={couponType}
  setCouponType={setCouponType}

  createCoupon={addCoupon}

  deleteCoupon={deleteCoupon}
/>
        )}

      </div>

    </div>
  );
}

export default Admin;