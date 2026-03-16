import type { MenuGroup } from "@/types/menu";
import { ChartPie, LayoutGrid, Package2, PaintbrushVertical, ShoppingCart, User, Ticket, Settings, Users, Store, MessageSquareMore, Database, CreditCard, Puzzle } from "lucide-react";

export const userMenuData: MenuGroup[] = [
  {
    sectionName: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutGrid,
        route: { url: "dashboard/main" }
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
        title: "Inventory",
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
        title: "Tickets",
        route: { url: "dashboard/tickets" },
        icon: Ticket,
      },
      {
        title: "Plugins",
        route: { url: "dashboard/plugins" },
        icon: Store,
      },
      {
        title: "Settings",
        icon: Settings,
        route: { url: "dashboard/settings" }
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
      }
    ]
  },
  {
    sectionName: "Plugins",
    items: [
      {
        title: "CMS",
        route: { url: "dashboard/cms" },
        icon: Database,
      },
      {
        title: "Gallery",
        route: { url: "dashboard/gallery" },
        icon: LayoutGrid,
      },
      {
        title: "Testimonials",
        route: { url: "dashboard/testimonials" },
        icon: MessageSquareMore,
      }
    ]
  }
]

export const adminMenuData: MenuGroup[] = [
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
        icon: CreditCard,
        route: { url: "admin/plans" }
      },
      {
        title: "Users",
        icon: Users,
        route: { url: "admin/users" }
      },
      {
        title: "Plugins",
        icon: Puzzle,
        route: { url: "admin/plugins" }
      }
    ]
  }
]