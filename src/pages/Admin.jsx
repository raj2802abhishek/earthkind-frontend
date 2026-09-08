import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";

import DashboardOverview from "../components/admin/DashboardOverview";

import ProductsTable from "../components/admin/ProductsTable";

import AddProductPanel from "../components/admin/AddProductPanel";

import OrdersPanel from "../components/admin/OrdersPanel";

import CouponsPanel from "../components/admin/CouponsPanel";

import MessagesPanel from "../components/admin/MessagesPanel";

import ReviewsPanel from "../components/admin/ReviewsPanel";

import "../components/admin/admin-responsive.css";

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

  const [imageFiles, setImageFiles] =
    useState([]);

  const [imagePreviews, setImagePreviews] =
    useState([]);

  const [imageUrl, setImageUrl] =
    useState("");

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [category, setCategory] = 
    useState("");

  const [isUploading, setIsUploading] =
    useState(false);

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

  // MOBILE SIDEBAR TOGGLE
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // DISABLE PAGE SCROLL
  

  // (Moved useEffect below function declarations)

  // FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      const list = Array.isArray(res.data) ? res.data : [];
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setProducts(list);

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

  // INITIAL FETCH & AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {}

    if (!token || !user || !user.isAdmin) {
      toast.error("Access denied: Admin privileges required ⚠️");
      window.location.href = "/login";
      return;
    }

    fetchProducts();
    fetchOrders();
    fetchCoupons();

    fetch(`${import.meta.env.VITE_API_URL}/api/users/count`)
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.totalUsers || 0))
      .catch((err) => console.log(err));
  }, []);

  // ADD COUPON
  const addCoupon = async () => {
    if (!couponCode || !couponDiscount) {
      toast.error("Please enter a coupon code and discount amount ⚠️");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons`,
        {
          code: couponCode,
          discount: couponDiscount,
          type: couponType
        }
      );

      toast.success("Coupon created successfully 🎉");

      setCouponCode("");
      setCouponDiscount("");
      setCouponType("fixed");

      fetchCoupons();

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add coupon ❌");
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

  useEffect(() => {
    const urls = imageFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleSelectImages = (fileList) => {
    const files = Array.from(fileList || []).filter(
      (file) => file && file.type && file.type.startsWith("image/")
    );

    if (!files.length) {
      return;
    }

    setImage(files[0]);
    setImageFiles((prev) => [...prev, ...files]);
    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    const filesToUpload = (files || []).filter(Boolean);

    if (!filesToUpload.length) {
      toast.success("Please select an image first");
      return;
    }

    const formData = new FormData();

    filesToUpload.forEach((file) => {
      formData.append("image", file);
    });

    try {
      setIsUploading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const uploadedUrls = (
        res.data.imageUrls ||
        (res.data.imageUrl ? [res.data.imageUrl] : [])
      ).filter(Boolean);

      if (!uploadedUrls.length) {
        toast.success("Image upload failed ❌");
        return;
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      setImageUrl((prev) => prev || uploadedUrls[0]);
      setImageFiles((prev) =>
        prev.filter((file) => !filesToUpload.includes(file))
      );
      setImage(null);

      toast.success(
        uploadedUrls.length > 1
          ? "Images uploaded successfully ✅"
          : "Image uploaded successfully ✅"
      );
    } catch (error) {
      console.log(error);
      toast.success("Image upload failed ❌");
    }
  };

  // UPLOAD IMAGE
  const uploadImage = async () => {
    const pending = imageFiles.length
      ? imageFiles
      : image
        ? [image]
        : [];

    if (!pending.length) {
      if (images.length) {
        toast.success("Images already uploaded ✅");
        return;
      }

      toast.success("Please select an image first");
      return;
    }

    await uploadFiles(pending);
  };

  // ADD PRODUCT
  const addProduct = async () => {
    if (!name.trim()) return toast.error("Product name is required");
    if (!price) return toast.error("Product price is required");
    if (!category) return toast.error("Please select a category");
    if (images.length === 0 && !imageUrl) return toast.error("Please upload at least one image");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add`,
        {
          name,
          price,
          category,
          description: "Premium Earthkind Naturals product",
          image: images[0] || imageUrl,
          images: images.length > 0 ? images : imageUrl ? [imageUrl] : [],
          story,
          benefits: benefits.filter((item) => item.trim() !== ""),
          howToUse: howToUse.filter((item) => item.trim() !== ""),
          ingredients: ingredients.filter((item) => item.trim() !== ""),
          stock: Number(stock) || 10,
          rating: 5,
          reviews: 0
        }
      );

      toast.success("Product added successfully ✅");

      // RESET
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setStory("");
      setBenefits([""]);
      setHowToUse([""]);
      setIngredients([""]);
      setImages([]);
      setImage(null);
      setImageFiles([]);
      setImagePreviews([]);
      setImageUrl("");

      // Fetch and switch to products tab to see new product
      await fetchProducts();
      setActiveTab("products");

    } catch (error) {
      console.log(error);
      toast.error("Failed to add product ❌");
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


  const updateProduct = async (id, name, price) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/update/${id}`,
        { name, price }
      );
      await fetchProducts();
    } catch (error) {
      console.log(error);
      throw error; // Re-throw so ProductsTable can catch it
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
    <>
      {/* MOBILE MENU TOGGLE BUTTON */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR OVERLAY */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className="admin-container"
        style={{
          display: "flex",

          gap: "24px",
          alignItems: "flex-start",


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
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
        products={products}
      />

      {/* RIGHT CONTENT */}
      <div
        className="admin-content"
        style={{
          marginLeft: "108px",
          padding: "32px 35px",
          flex: 1,
          minWidth: 0,
          background: "#f8f6f1",
          borderRadius: "36px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.7)",
          minHeight: "calc(100vh - 40px)",
          overflow: "hidden"
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

  stock={stock}
  setStock={setStock}

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
  setImages={(next) => {
    const resolved =
      typeof next === "function" ? next(images) : next;
    const urls = Array.isArray(resolved) ? resolved : [];
    setImages(urls);
    setImageUrl(urls[0] || "");
  }}
  imagePreviews={imagePreviews}

  setImage={handleSelectImages}

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

        {/* REVIEWS MANAGEMENT */}
        {activeTab === "reviews" && <ReviewsPanel />}

        {/* MESSAGES & SUPPORT CHAT */}
        {activeTab === "messages" && <MessagesPanel />}

      </div>

    </div>
    </>
  );
}

export default Admin;