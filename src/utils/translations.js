// Language Translations for Earthkind Naturals (English & Hindi)

export const dictionary = {
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    wellness: "Wellness",
    about: "About",
    contact: "Contact",
    account: "Account",
    admin: "Admin",
    logout: "Logout",
    wishlist: "Wishlist",
    cart: "Cart",

    // Account & Profile
    myProfile: "My Profile",
    personalSecuritySettings: "Personal & security settings",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    verifiedMember: "VERIFIED MEMBER",
    strongSecurity: "Strong Security",
    accountSettings: "Account Settings",
    shoppingPreferences: "Shopping Preferences",
    notifications: "Notifications",
    privacyData: "Privacy & Data",
    sessionManagement: "Session Management",
    communication: "Communication",
    statistics: "Statistics",

    // Shopping Preferences
    language: "Language",
    currency: "Currency",
    countryRegion: "Country / Region",
    measurementSystem: "Measurement System",
    savePreferences: "Save Preferences",

    // Header & Search
    searchPlaceholder: "Search natural & herbal products...",
    searchProducts: "Search Products",

    // Product & E-commerce
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    price: "Price",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    reviews: "Reviews",
    description: "Description",
    benefits: "Benefits",
    howToUse: "How to Use",
    ingredients: "Ingredients",

    // Orders & Rewards
    myOrders: "My Orders",
    rewardPoints: "Reward Points",
    myCoupons: "My Coupons",
    recentlyViewed: "Recently Viewed",
    savedAddresses: "Saved Addresses",
    totalSpent: "Total Spent",
    totalSaved: "Total Saved",
    viewAll: "View All",

    // General
    welcome: "Welcome",
    login: "Login",
    register: "Register",
    success: "Success",
    error: "Error"
  },
  hi: {
    // Navigation
    home: "होम",
    shop: "दुकान",
    categories: "श्रेणियां",
    wellness: "वेलनेस",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    account: "खाता",
    admin: "एडमिन",
    logout: "लॉगआउट",
    wishlist: "विशलिस्ट",
    cart: "कार्ट",

    // Account & Profile
    myProfile: "मेरी प्रोफाइल",
    personalSecuritySettings: "व्यक्तिगत एवं सुरक्षा सेटिंग्स",
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
    phoneNumber: "फ़ोन नंबर",
    saveChanges: "परिवर्तन सहेजें",
    changePassword: "पासवर्ड बदलें",
    verifiedMember: "सत्यापित सदस्य",
    strongSecurity: "मजबूत सुरक्षा",
    accountSettings: "खाता सेटिंग्स",
    shoppingPreferences: "खरीदारी प्राथमिकताएं",
    notifications: "सूचनाएं",
    privacyData: "गोपनीयता और डेटा",
    sessionManagement: "सत्र प्रबंधन",
    communication: "संचार",
    statistics: "आंकड़े",

    // Shopping Preferences
    language: "भाषा",
    currency: "मुद्रा",
    countryRegion: "देश / क्षेत्र",
    measurementSystem: "माप प्रणाली",
    savePreferences: "प्राथमिकताएं सहेजें",

    // Header & Search
    searchPlaceholder: "प्राकृतिक और हर्बल उत्पाद खोजें...",
    searchProducts: "उत्पाद खोजें",

    // Product & E-commerce
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें",
    price: "कीमत",
    outOfStock: "स्टॉक में नहीं",
    inStock: "स्टॉक में उपलब्ध",
    reviews: "समीक्षाएं",
    description: "विवरण",
    benefits: "लाभ",
    howToUse: "उपयोग कैसे करें",
    ingredients: "सामग्री",

    // Orders & Rewards
    myOrders: "मेरे ऑर्डर",
    rewardPoints: "इनाम अंक",
    myCoupons: "मेरे कूपन",
    recentlyViewed: "हाल ही में देखे गए",
    savedAddresses: "सहेजे गए पते",
    totalSpent: "कुल खर्च",
    totalSaved: "कुल बचत",
    viewAll: "सभी देखें",

    // General
    welcome: "स्वागत है",
    login: "लॉगिन",
    register: "रजिस्टर",
    success: "सफलता",
    error: "त्रुटि"
  }
};

// Helper hook / function to get active language
export const getLanguage = () => {
  try {
    const prefs = JSON.parse(localStorage.getItem("shoppingPreferences") || "{}");
    const langStr = prefs.language || localStorage.getItem("appLanguage") || "English";
    if (langStr.toLowerCase().includes("hindi") || langStr.toLowerCase() === "hi") {
      return "hi";
    }
  } catch (e) {}
  return "en";
};

// Function to set active language globally
export const setLanguage = (langName) => {
  try {
    const prefs = JSON.parse(localStorage.getItem("shoppingPreferences") || "{}");
    prefs.language = langName;
    localStorage.setItem("shoppingPreferences", JSON.stringify(prefs));
    localStorage.setItem("appLanguage", langName);
    window.dispatchEvent(new Event("languageChanged"));
  } catch (e) {}
};

// Translation translation key lookup
export const t = (key) => {
  const currentLang = getLanguage();
  return dictionary[currentLang]?.[key] || dictionary.en[key] || key;
};
