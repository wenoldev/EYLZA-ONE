"use client"

import { useSearchParams } from "react-router-dom"
import {
  User,
  Store,
  Lock,
  Bell,
  Shield
} from "lucide-react"

import { SidebadrBody } from "../navbar/sidebar-body"
import { Sidebar, SidebarProvider, SidebarContent } from "@/components/ui/sidebar"

// Import separate components
import { ProfileSettings } from "./components/ProfileSettings"
import { StoreSettings } from "./components/StoreSettings"
import { SecuritySettings } from "./components/SecuritySettings"
import { NotificationSettings } from "./components/NotificationSettings"
import { PrivacyPolicy } from "./components/PrivacyPolicy"
import { TermsAndConditions } from "./components/TermsAndConditions"
import { RefundPolicy } from "./components/RefundPolicy"

import type { MenuGroup } from "@/types/menu"

const settingsMenu: MenuGroup[] = [
  {
    sectionName: "Account Settings",
    items: [
      {
        title: "Profile",
        icon: User,
        route: { url: "dashboard/settings", queryParams: { tab: "profile" } }
      },
      {
        title: "Store",
        icon: Store,
        route: { url: "dashboard/settings", queryParams: { tab: "store" } }
      },
      {
        title: "Security",
        icon: Lock,
        route: { url: "dashboard/settings", queryParams: { tab: "security" } }
      },
      {
        title: "Notifications",
        icon: Bell,
        route: { url: "dashboard/settings", queryParams: { tab: "notifications" } }
      },
    ],
  },
  {
    sectionName: "Policy",
    items: [
      {
        title: "Policies",
        icon: Shield,
        subItems: [
          {
            title: "Privacy",
            route: { url: "dashboard/settings", queryParams: { tab: "privacy" } }
          },
          {
            title: "Terms and Condition",
            route: { url: "dashboard/settings", queryParams: { tab: "terms" } }
          },
          {
            title: "Refund Policy",
            route: { url: "dashboard/settings", queryParams: { tab: "refund" } }
          },
        ],
      },
    ],
  },
]

export default function SettingsPage() {
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "profile"

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "store":
        return <StoreSettings />
      case "security":
        return <SecuritySettings />
      case "notifications":
        return <NotificationSettings />
      case "privacy":
        return <PrivacyPolicy />
      case "terms":
        return <TermsAndConditions />
      case "refund":
        return <RefundPolicy />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <SidebarProvider className="flex min-h-screen w-full bg-gray-50/50 dark:bg-black">
      <div className="flex w-full">
        {/* Settings Sidebar */}
        <div className="w-64 flex-shrink-0 border-r dark:border-zinc-800 bg-white dark:bg-black">
          <Sidebar collapsible="none" className="w-64 border-none">
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <SidebarContent>
              <SidebadrBody items={settingsMenu} />
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="mx-auto max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}