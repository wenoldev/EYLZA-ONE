import { HelpCircle, Ticket } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

export function SidebarBottom() {
  const { user } = useAuthStore()
  const userRole = user?.user_metadata?.role || "vendor"
  const isAdmin = userRole === "admin"

  return (
    <div className="space-y-1">

      <SidebarMenuButton asChild>
        <Link to="/help">
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Link>
      </SidebarMenuButton>

      {isAdmin && (
        <SidebarMenuButton asChild>
          <Link to="/admin/tickets">
            <Ticket className="h-4 w-4" />
            View Tickets
          </Link>
        </SidebarMenuButton>
      )}
    </div>
  )
}
