
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import { useStoreStore } from "@/stores/storeStore"
import type { PricingPlan } from "@/constants/plans"
import api from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { LogOut, Crown, Settings, CreditCard } from "lucide-react"
import { useState, useEffect } from "react"

export function NavProfile() {
  const { user, logout } = useAuthStore()
  const { stores } = useStoreStore()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PricingPlan[]>([])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/api/v1/admin/plans')
        if (response.data?.data?.plans) {
          setPlans(response.data.data.plans)
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      }
    }
    fetchPlans()
  }, [])

  const currentStore = stores?.[0]
  const currentPlanId = currentStore?.plan_id || 'free'
  
  const currentPlanIndex = plans.findIndex(p => p.id === currentPlanId)
  const nextPlan = currentPlanIndex !== -1 && currentPlanIndex < plans.length - 1 
    ? plans[currentPlanIndex + 1] 
    : null
  console.log({user});

  const userDisplayName = user?.name || user?.user_metadata?.full_name || "User"
  const userEmail = user?.email || user?.user_metadata?.email || "m@example.com"
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSettingsClick = () => {
    navigate("/dashboard/settings")
  }

  const handlePaymentsClick = () => {
    navigate("/dashboard/payments")
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
        {/*nextPlan && (
          <DropdownMenuItem 
            className="px-2 py-2 cursor-pointer"
            onClick={() => navigate('/pricing')}
          >
            <Crown className="w-4 h-4 mr-3 text-amber-500" />
            <span>Upgrade to {nextPlan.name}</span>
          </DropdownMenuItem>
        )*/}

        <DropdownMenuItem className="px-2 py-2 cursor-pointer" onClick={handleSettingsClick}>
          <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="px-2 py-2 cursor-pointer" onClick={handlePaymentsClick}>
          <CreditCard className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>Billing & Payments</span>
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
