import type { MenuGroup } from "@/types/menu";
import { ChartPie, LayoutGrid, Package2, PaintbrushVertical, ShoppingCart, User, Ticket, Settings, Users, Store, Shield, MessageSquareMore, Database } from "lucide-react";

export const userMenuData: MenuGroup[] = [
  {
    sectionName: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutGrid,
        route: { url: "dashboard" }
      },
      {
        title: "Analytics",
        icon: ChartPie,
        route: { url: "dashboard/analytics" }
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
            route: { url: "dashboard/products" }
          },
          { title: "Category", route: { url: "dashboard/categories" } }
        ]
      },
      {
        title: "Orders",
        route: { url: "dashboard/orders" },
        icon: Package2,
      },
      {
        title: "Customer queries",
        route: { url: "dashboard/queries" },
        icon: User,
      },
      {
        title: "Themes",
        icon: PaintbrushVertical,
        subItems: [
          {
            title: "Select theme",
            route: { url: "dashboard/select-theme" }
          },
          { title: "Edit theme", route: { url: 'dashboard/edit-theme' } }
        ]
      },
      {
        title: "Tickets",
        route: { url: "dashboard/tickets" },
        icon: Ticket,
      },
      {
        title: "Testimonials",
        route: { url: "dashboard/testimonials" },
        icon: MessageSquareMore,
      },
      {
        title: "CMS",
        route: { url: "dashboard/cms" },
        icon: Database,
      },
      {
        title: "Gallery",
        route: { url: "dashboard/gallery" },
        icon: LayoutGrid, // Using LayoutGrid for now
      },
      {
        title: "Plugins",
        route: { url: "dashboard/plugins" },
        icon: Settings, // Using Settings for now
      },
      {
        title: "Settings",
        icon: Settings,
        route: { url: "dashboard/settings" }
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
        title: "Plugins",
        icon: Settings,
        route: { url: "admin/plugins" }
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