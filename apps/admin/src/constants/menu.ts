import type { MenuGroup } from "@/types/menu";
import { ChartPie, LayoutGrid, Package2, PaintbrushVertical, ShoppingCart, User, Ticket, Settings, Users, Store, Shield, MessageSquareMore } from "lucide-react";

export const userMenuData: MenuGroup[] = [
  {
    sectionName: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutGrid,
        route: { url: "" }
      },
      {
        title: "Analytics",
        icon: ChartPie,
        route: { url: "analytics" }
      }
    ]
  },
  {
    sectionName: "Menus",
    items: [
      {
        title: "Products",
        icon: ShoppingCart,
        subItems: [
          {
            title: "All products",
            route: { url: "products" }
          },
          { title: "Category", route: { url: "categories" } }
        ]
      },
      {
        title: "Orders",
        route: { url: "orders" },
        icon: Package2,
      },
      {
        title: "Customer queries",
        route: { url: "queries" },
        icon: User,
      },
      {
        title: "Themes",
        icon: PaintbrushVertical,
        subItems: [
          {
            title: "Select theme",
            route: { url: "select-theme" }
          },
          { title: "Edit theme", route: { url: 'edit-theme' } }
        ]
      },
      {
        title: "Tickets",
        route: { url: "tickets" },
        icon: Ticket,
      },
      {
        title: "Testimonials",
        route: { url: "testimonials" },
        icon: MessageSquareMore,
      },
      {
        title: "Settings",
        icon: Settings,
        route: { url: "settings" }
      }
    ]
  }
]

export const adminMenuData: MenuGroup[] = [
  {
    sectionName: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutGrid,
        route: { url: "" }
      }
    ]
  },
  {
    sectionName: "Management",
    items: [
      {
        title: "Stores",
        icon: Store,
        route: { url: "admin/stores" }
      },
      {
        title: "Themes",
        icon: PaintbrushVertical,
        route: { url: "admin/themes" }
      },
      {
        title: "Tickets",
        icon: Ticket,
        route: { url: "admin/tickets" }
      },
      {
        title: "Plans",
        icon: Settings,
        route: { url: "admin/plans" }
      },
      {
        title: "Users",
        icon: Users,
        route: { url: "admin/users" }
      },
      {
        title: "Settings",
        icon: Settings,
        route: { url: "dashboard/settings" }
      },
      {
        title: "Policy",
        icon: Shield,
        subItems: [
          { title: "Privacy", route: { url: "dashboard/settings", queryParams: { tab: "privacy" } } },
          { title: "Terms and Condition", route: { url: "dashboard/settings", queryParams: { tab: "terms" } } },
          { title: "Refund Policy", route: { url: "dashboard/settings", queryParams: { tab: "refund" } } }
        ]
      }
    ]
  }
]