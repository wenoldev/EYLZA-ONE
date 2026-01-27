
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router-dom"
import { LogOut, Crown, Settings } from "lucide-react"

export function NavProfile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const userDisplayName = user?.user_metadata?.full_name || "User"
  const userEmail = user?.user_metadata?.email || user?.email || "m@example.com"
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSettingsClick = () => {
    navigate("/settings")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-semibold cursor-pointer hover:scale-105 transition-transform">
          {userInitial}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {/* User Info Header */}
        <div className="px-2 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userDisplayName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <DropdownMenuItem className="px-2 py-2 cursor-pointer">
          <Crown className="w-4 h-4 mr-3 text-amber-500" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="px-2 py-2 cursor-pointer" onClick={handleSettingsClick}>
          <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="px-2 py-2 cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
