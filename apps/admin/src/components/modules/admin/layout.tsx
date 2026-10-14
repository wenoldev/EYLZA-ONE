import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { AppSidebar } from '@/components/modules/dashboard/navbar/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { NavProfile } from '@/components/modules/dashboard/navbar/nav-profile'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'
import { useAuthStore } from '@/stores/authStore'

const AdminLayout = () => {
  const navigate = useNavigate();
  const setNavigator = useAuthStore((state) => state.setNavigator);

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <SidebarProvider>
      <AppSidebar hideStoreSwitcher={true} />
      <SidebarInset>
        <header className="flex sticky top-0 h-16 z-50 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white/70 backdrop-blur-sm dark:bg-black/70 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <Link to="/admin/stores" className="font-semibold hover:opacity-80 transition-opacity">
                Eylza Admin
              </Link>
            </div>
          </div>
          <div className='flex-grow' />
          <div className='mr-4 flex items-center gap-2'>
            {/* Theme Toggle */}
            <ThemeSwitcher />
            {/* Profile (Logout) */}
            <NavProfile />
          </div>
        </header>
        <div className='sm:p-4 p-2 relative'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
