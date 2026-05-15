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
  useEffect(() => {

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };

  }, []);

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
            "Added from Admin Panel",

          image: imageUrl,

          stock: 10,

          rating: 5,

          reviews: 0
        }
      );

       toast.success(
        "Product added successfully ✅"
      );

      setName("");
      setPrice("");
      setCategory("");

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

    alignItems: "flex-start",

    background: "#ece9df",

    padding: "20px 24px",

    height: "119vh",

    overflow: "hidden"
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

          width: "100%",

          background: "#f8f6f1",

          borderRadius: "36px",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",

          border:
            "1px solid rgba(255,255,255,0.7)",

          height: "calc(123.0vh - 80px)",

          overflowY: "auto"
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