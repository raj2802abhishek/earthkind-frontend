import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TicketPercent,
  PlusCircle,
  LogOut
} from "lucide-react";

function AdminSidebar({
  activeTab,
  setActiveTab
}) {

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },

    {
      id: "products",
      label: "Products",
      icon: <Package size={20} />
    },

    {
      id: "addProduct",
      label: "Add Product",
      icon: <PlusCircle size={20} />
    },

    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={20} />
    },

    {
      id: "coupons",
      label: "Coupons",
      icon: <TicketPercent size={20} />
    }
  ];

  return (

   <div
  style={{
    width: "270px",

    height: "calc(123.0vh - 80px)",
    

    background:
  "linear-gradient(180deg, #081120 0%, #17263a 52%, #1d4b3b 100%)",

    color: "#ffffff",

    padding: "32px 18px",

   position: "sticky",

   top: "1px",

    borderRadius: "32px",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    boxShadow:
  "0 24px 60px rgba(2,6,23,0.28), inset 0 1px 0 rgba(255,255,255,0.05)",

   border: "1px solid rgba(255,255,255,0.06)",

    backdropFilter: "blur(14px)",

    WebkitBackdropFilter: "blur(14px)",

    zIndex: 1,

    overflow: "hidden",

    transition: "all 0.3s ease"
  }}
>

      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div
          style={{
            marginBottom: "45px",
            paddingLeft: "10px"
          }}
        >
         

          <p
            style={{
              opacity: 0.72,

              fontSize: "17px",
              

              fontWeight: "500",

textTransform: "uppercase",

letterSpacing: "1.2px"
              
            }}
          >
             Admin Panel
          </p>
        </div>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >

          {menuItems.map((item) => {

            const isActive =
              activeTab === item.id;

            return (

              <div
                key={item.id}

                onClick={() =>
                  setActiveTab(item.id)
                }

                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "14px",

                  padding: "15px 18px",

                  borderRadius: "18px",

                  cursor: "pointer",

                 transition:
  "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",

                  background: isActive
  ? "rgba(255,255,255,0.11)"
  : "transparent",

                  border: isActive
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid transparent",

                  backdropFilter: isActive
                    ? "blur(12px)"
                    : "none",

                  fontWeight: isActive
                    ? "600"
                    : "500",

                  color: "#fff",

                 boxShadow: isActive
  ? "0 8px 25px rgba(0,0,0,0.18)"
  : "none"
                }}

                onMouseEnter={(e) => {

                  if (!isActive) {

                    e.currentTarget.style.background =
  "rgba(255,255,255,0.08)";

e.currentTarget.style.transform =
  "translateX(4px)";

                  }

                }}

                onMouseLeave={(e) => {

                  if (!isActive) {

                    e.currentTarget.style.background =
                      "transparent";

                  }

                }}
              >

                {item.icon}

                <span
                  style={{
                    fontSize: "16px"
                  }}
                >
                  {item.label}
                </span>

              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        style={{
          padding: "15px 18px",

          borderRadius: "18px",

          background:
            "rgba(255,255,255,0.08)",

          cursor: "pointer",

          display: "flex",

          alignItems: "center",

          gap: "12px",

          transition: "0.3s ease"
        }}
      >

        <LogOut size={18} />

        <span
          style={{
            fontWeight: "500"
          }}
        >
          Logout
        </span>

      </div>
    </div>
  );
}

export default AdminSidebar;