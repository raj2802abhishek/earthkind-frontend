import React, {
  useState,
  useEffect
} from "react";

function AccountSettingsSection() {

  const [activeSection,
  setActiveSection] =
    useState("notifications");
      const [notifications,
  setNotifications] =
  useState({

    orderUpdates: true,

    offersDiscounts: true,

    rewardAlerts: true,

    backInStock: false,

    productLaunches: true

  });

  const [communication,
  setCommunication] =
  useState({

    emailMarketing: true,

    smsAlerts: false,

    whatsappUpdates: true,

    orderEmails: true,

    newsletter: false

  });
  useEffect(() => {

  const saved =
    localStorage.getItem(
      "notificationSettings"
    );

  if (saved) {

    setNotifications(
      JSON.parse(saved)
    );

  }

}, []);

useEffect(() => {

  localStorage.setItem(

    "communicationSettings",

    JSON.stringify(
      communication
    )

  );

}, [communication]);
const toggleNotification =
  (key) => {

    const updated = {

      ...notifications,

      [key]:
        !notifications[key]

    };

    setNotifications(updated);

    localStorage.setItem(

      "notificationSettings",

      JSON.stringify(updated)

    );

  };

  
const toggleCommunication =
  (key) => {

    setCommunication({

      ...communication,

      [key]:
        !communication[key]

    });

  };
   const saveShoppingPreferences =
() => {

  localStorage.setItem(

    "shoppingPreferences",

    JSON.stringify(
      shoppingPrefs
    )

  );

  alert(
    "Preferences Saved Successfully ✓"
  );

};

  const [shoppingPrefs, setShoppingPrefs] =
useState({

  language: "English",

  currency: "INR",

  country: "India",

  measurement: "Metric"

});
useEffect(() => {

  const savedPrefs =
    localStorage.getItem(
      "shoppingPreferences"
    );

  if (savedPrefs) {

    setShoppingPrefs(
      JSON.parse(savedPrefs)
    );

  }

}, []);

const clearRecentlyViewed =
() => {

  localStorage.removeItem(
    "recentlyViewed"
  );

  alert(
    "Recently Viewed Cleared ✓"
  );

};

const clearWishlist =
() => {

  localStorage.removeItem(
    "wishlist"
  );

  alert(
    "Wishlist Cleared ✓"
  );

};

const clearSearchHistory =
() => {

  localStorage.removeItem(
    "searchHistory"
  );

  alert(
    "Search History Cleared ✓"
  );

};


const logoutAllDevices =
() => {

  localStorage.removeItem(
    "token"
  );

  alert(
    "Logged out from all devices ✓"
  );

};

const currentDevice =
  navigator.platform;

const lastLogin =
  new Date().toLocaleString();


const statistics = {

  totalOrders: 12,

  totalSpent: 5240,

  totalSaved: 650,

  wishlistItems: 5,

  rewardPoints: 2500,

  couponsEarned: 8

};

  const menuItems = [

    {
      id: "notifications",
      label: "Notifications"
    },

    {
      id: "shopping",
      label: "Shopping Preferences"
    },

    {
      id: "privacy",
      label: "Privacy & Data"
    },

    {
      id: "session",
      label: "Session Management"
    },

    {
      id: "communication",
      label: "Communication"
    },

    {
      id: "statistics",
      label: "Statistics"
    }

  ];

  return (

    <div>

      <h2
        style={{
          color: "#123524",
          marginBottom: "18px"
        }}
      >
        Account Settings
      </h2>

      <div
        style={{
          display: "grid",
        gridTemplateColumns:
 "165px 1fr",
          gap: "16px"
        }}
      >

        {/* LEFT MENU */}

        <div
         style={{
  background: "#fff",
  borderRadius: "22px",
  border: "1px solid #eef2ef",
  padding: "20px",
  minHeight: "380px",
  maxHeight: "470px",
  overflow: "hidden"
}}
        >

          {menuItems.map(
            (item) => (

              <div
                key={item.id}

                onClick={() =>
                  setActiveSection(
                    item.id
                  )
                }

                style={{
  padding: "8px 10px",
  marginBottom: "6px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: "18px",
  fontWeight:
    activeSection === item.id
      ? "600"
      : "500",
  background:
    activeSection === item.id
      ? "#123524"
      : "transparent",
  color:
    activeSection === item.id
      ? "#fff"
      : "#333"
}}
              >
                {item.label}
              </div>

            )
          )}

        </div>

        {/* RIGHT CONTENT */}

        <div
          style={{
            background: "#fff",
            borderRadius: "22px",
            border:
              "1px solid #eef2ef",
            padding: "20px",
            minHeight: "380px"
          }}
        >

          

          {
activeSection ===
"notifications" && (

<div>

{/* ORDER UPDATES */}

<NotificationRow

title="Order Updates"

enabled={
notifications.orderUpdates
}

onClick={() =>
toggleNotification(
"orderUpdates"
)
}
/>

{/* OFFERS */}

<NotificationRow

title="Offers & Discounts"

enabled={
notifications.offersDiscounts
}

onClick={() =>
toggleNotification(
"offersDiscounts"
)
}
/>

{/* REWARDS */}

<NotificationRow

title="Reward Point Alerts"

enabled={
notifications.rewardAlerts
}

onClick={() =>
toggleNotification(
"rewardAlerts"
)
}
/>

{/* STOCK */}

<NotificationRow

title="Back In Stock Alerts"

enabled={
notifications.backInStock
}

onClick={() =>
toggleNotification(
"backInStock"
)
}
/>

{/* NEW PRODUCTS */}

<NotificationRow

title="New Product Launches"

enabled={
notifications.productLaunches
}

onClick={() =>
toggleNotification(
"productLaunches"
)
}
/>

</div>

)
}

         {activeSection === "shopping" && (

<div
  style={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }}
>
<h3
style={{
  marginTop: 0,
  color: "#123524"
}}
>
Shopping Preferences
</h3>

<div
style={{
  display: "grid",
  gap: "12px",
  marginTop: "16px"
}}
>

{/* LANGUAGE */}

<div>

<label
style={{
  display: "block",
  marginBottom: "6px",
  fontWeight: "600"
}}
>
Language
</label>

<select
value={shoppingPrefs.language}

onChange={(e) =>
setShoppingPrefs({
...shoppingPrefs,
language:
e.target.value
})
}

style={{
width: "100%",
padding: "12px",
borderRadius: "12px",
border:
"1px solid #dfe7df"
}}
>

<option>English</option>
<option>Spanish</option>
<option>French</option>
<option>German</option>
<option>Portuguese</option>
<option>Italian</option>
<option>Dutch</option>
<option>Arabic</option>
<option>Chinese</option>
<option>Japanese</option>
<option>Korean</option>
<option>Russian</option>
<option>Turkish</option>

</select>

</div>

{/* CURRENCY */}

<div>

<label
style={{
display: "block",
marginBottom: "6px",
fontWeight: "600"
}}
>
Currency
</label>

<select
value={shoppingPrefs.currency}

onChange={(e) =>
setShoppingPrefs({
...shoppingPrefs,
currency:
e.target.value
})
}

style={{
width: "100%",
padding: "12px",
borderRadius: "12px",
border:
"1px solid #dfe7df"
}}
>

<option>INR</option>
<option>USD</option>
<option>EUR</option>
<option>GBP</option>
<option>AED</option>
<option>CAD</option>
<option>AUD</option>
<option>JPY</option>
<option>SGD</option>

</select>

</div>

{/* COUNTRY */}

<div>

<label
style={{
display: "block",
marginBottom: "6px",
fontWeight: "600"
}}
>
Country / Region
</label>

<select
value={shoppingPrefs.country}

onChange={(e) =>
setShoppingPrefs({
...shoppingPrefs,
country:
e.target.value
})
}

style={{
width: "100%",
padding: "12px",
borderRadius: "12px",
border:
"1px solid #dfe7df"
}}
>

<option>India</option>
<option>United States</option>
<option>United Kingdom</option>
<option>Germany</option>
<option>France</option>
<option>Canada</option>
<option>Australia</option>
<option>UAE</option>
<option>Singapore</option>
<option>Japan</option>

</select>

</div>

{/* MEASUREMENT */}

<div>

<label
style={{
display: "block",
marginBottom: "6px",
fontWeight: "600"
}}
>
Measurement System
</label>

<select
value={
shoppingPrefs.measurement
}

onChange={(e) =>
setShoppingPrefs({
...shoppingPrefs,
measurement:
e.target.value
})
}

style={{
width: "100%",
padding: "12px",
borderRadius: "12px",
border:
"1px solid #dfe7df"
}}
>

<option>
Metric
</option>

<option>
Imperial
</option>

</select>

</div>

<button
onClick={
saveShoppingPreferences
}
style={{
marginTop: "auto",
background: "#123524",
color: "#fff",
border: "none",
padding: "12px",
borderRadius: "12px",
cursor: "pointer",
fontWeight: "600"
}}
>
Save Preferences
</button>

</div>

</div>

          )}

         {activeSection ===
"privacy" && (

<div>

<h3
style={{
marginTop: 0,
color: "#123524"
}}
>
Privacy & Data
</h3>

<div
style={{
display: "grid",
gap: "12px",
marginTop: "20px"
}}
>

<button
onClick={
clearRecentlyViewed
}
style={privacyButtonStyle}
>
Clear Recently Viewed
</button>

<button
onClick={
clearSearchHistory
}
style={privacyButtonStyle}
>
Clear Search History
</button>

<button
onClick={
clearWishlist
}
style={privacyButtonStyle}
>
Clear Wishlist
</button>

<button
style={{
...privacyButtonStyle,
background: "#123524",
color: "#fff"
}}
>
Export Account Activity
</button>

</div>

</div>

)}

         {activeSection ===
"session" && (

<div>

<h3
style={{
marginTop: 0,
color: "#123524"
}}
>
Session Management
</h3>

<div
style={{
display: "grid",
gap: "12px",
marginTop: "20px"
}}
>

<div
style={sessionCard}
>

<div
style={{
fontWeight: "600"
}}
>
Current Device
</div>

<div
style={{
fontSize: "13px",
color: "#666"
}}
>
{currentDevice}
</div>

</div>

<div
style={sessionCard}
>

<div
style={{
fontWeight: "600"
}}
>
Last Login
</div>

<div
style={{
fontSize: "13px",
color: "#666"
}}
>
{lastLogin}
</div>

</div>

<div
style={sessionCard}
>

<div
style={{
fontWeight: "600"
}}
>
Active Session
</div>

<div
style={{
fontSize: "13px",
color: "#22c55e"
}}
>
1 Device Active
</div>

</div>

<button
onClick={
logoutAllDevices
}
style={{
background: "#ef4444",
color: "#fff",
border: "none",
padding: "12px",
borderRadius: "12px",
cursor: "pointer",
fontWeight: "600"
}}
>
Logout From All Devices
</button>

</div>

</div>

)}

         {activeSection ===
  "communication" && (

<div>

<h3
  style={{
    marginTop: 0,
    color: "#123524"
  }}
>
  Communication Preferences
</h3>

<NotificationRow
  title="Email Marketing"
  enabled={
    communication.emailMarketing
  }
  onClick={() =>
    toggleCommunication(
      "emailMarketing"
    )
  }
/>

<NotificationRow
  title="SMS Alerts"
  enabled={
    communication.smsAlerts
  }
  onClick={() =>
    toggleCommunication(
      "smsAlerts"
    )
  }
/>

<NotificationRow
  title="WhatsApp Updates"
  enabled={
    communication.whatsappUpdates
  }
  onClick={() =>
    toggleCommunication(
      "whatsappUpdates"
    )
  }
/>

<NotificationRow
  title="Order Emails"
  enabled={
    communication.orderEmails
  }
  onClick={() =>
    toggleCommunication(
      "orderEmails"
    )
  }
/>

<NotificationRow
  title="Newsletter"
  enabled={
    communication.newsletter
  }
  onClick={() =>
    toggleCommunication(
      "newsletter"
    )
  }
/>

</div>

)}

          {activeSection ===
  "statistics" && (

<div>

<h3
  style={{
    marginTop: 0,
    color: "#123524"
  }}
>
  Account Statistics
</h3>

<div
  style={{
    display: "grid",

    gridTemplateColumns:
  "repeat(2,1fr)",

    gap: "8px"
  }}
>

  <StatCard
    title="Orders"
    value={
      statistics.totalOrders
    }
  />

  <StatCard
    title="Amount Spent"
    value={`₹${statistics.totalSpent}`}
  />

  <StatCard
    title="Money Saved"
    value={`₹${statistics.totalSaved}`}
  />

  <StatCard
    title="Wishlist"
    value={
      statistics.wishlistItems
    }
  />

  <StatCard
    title="Reward Points"
    value={
      statistics.rewardPoints
    }
  />

  <StatCard
    title="Coupons Earned"
    value={
      statistics.couponsEarned
    }
  />

</div>

</div>

)}

        </div>

      </div>

    </div>

  );

}


const privacyButtonStyle = {

padding: "12px",

borderRadius: "12px",

border: "1px solid #eef2ef",

background: "#fafcfb",

cursor: "pointer",

fontWeight: "600",

textAlign: "left"

};
const sessionCard = {

padding: "14px",

borderRadius: "14px",

border: "1px solid #eef2ef",

background: "#fafcfb"

};

function NotificationRow({

title,

enabled,

onClick

}) {

return (

<div
style={{

display: "flex",

justifyContent:
"space-between",

alignItems: "center",

padding: "12px 16px",

background: "#fafcfb",

border:
"1px solid #eef2ef",

borderRadius: "14px",

marginBottom: "8px",

transition: "0.25s",

cursor: "pointer"
}}
>

<div>

<div
style={{

fontWeight: "600",

color: "#123524",

fontSize: "14px",

lineHeight: "18px"
}}
>
{title}
</div>


</div>

<div

onClick={onClick}

style={{
width: "52px",

height: "30px",

flexShrink: 0,

borderRadius: "999px",

background:
enabled
? "#22c55e"
: "#dcdcdc",

cursor: "pointer",

position: "relative",

transition:
"0.25s"
}}
>

<div
style={{

width: "22px",

height: "22px",
borderRadius: "50%",

background: "#fff",

position:
"absolute",

top: "3px",
left:
enabled
? "26px"
: "4px",

transition:
"0.25s"
}}
/>

</div>

</div>

);

}

function StatCard({

  title,

  value

}) {

  return (

    <div
      style={{

        background:
          "#fafcfb",

        border:
          "1px solid #eef2ef",

        borderRadius:
          "16px",

        padding:
          "16px"

      }}
    >

      <div
        style={{

          color:
            "#6b7280",

          fontSize:
            "13px",

          marginBottom:
            "8px"

        }}
      >
        {title}
      </div>

      <div
        style={{

          color:
            "#123524",

          fontSize:
  "18px",

          fontWeight:
            "700"

        }}
      >
        {value}
      </div>

    </div>

  );

}

export default AccountSettingsSection;