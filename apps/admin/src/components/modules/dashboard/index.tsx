import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { AppSidebar } from './navbar/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { NavProfile } from './navbar/nav-profile'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Outlet, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from './navbar/nav-breadcrumbs'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { useStoreStore } from '@/stores/storeStore'
import api from '@/lib/api'

interface Notification {
  id: number;
  title: string;
  time: string;
  unread: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const setNavigator = useAuthStore((state) => state.setNavigator);

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'New message received', time: '2 min ago', unread: true },
    { id: 2, title: 'System update available', time: '1 hour ago', unread: true },
    { id: 3, title: 'Weekly report ready', time: '3 hours ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const { activeStoreId } = useStoreStore();
  const [billingInfo, setBillingInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      if (!activeStoreId) return;
      try {
        const res = await api.get(`/api/v1/billing/status?storeId=${activeStoreId}`);
        const data = res.data.data;
        setBillingInfo(data);
        
        // Redirect to pricing if blocked
        if (data.isBlocked) {
          navigate(`/pricing?storeId=${activeStoreId}`);
        }
      } catch (err) {
        console.error('Failed to fetch billing status', err);
      }
    };
    fetchBilling();
  }, [activeStoreId]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 h-16 z-50 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white/70 backdrop-blur-sm dark:bg-black/70 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1>Eylza</h1>
              <Breadcrumbs />
            </div>
          </div>
          <div className='flex-grow' />
          <div className='mr-4 flex items-center gap-4'>
            {billingInfo && (
              <>
                {billingInfo.subscriptionStatus === 'trial' && billingInfo.daysRemaining > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 hidden md:flex">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Trial: {billingInfo.daysRemaining} days left
                  </Badge>
                )}
                {billingInfo.subscriptionStatus === 'active' && billingInfo.daysRemaining <= 10 && billingInfo.daysRemaining > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`${billingInfo.daysRemaining <= 3 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'} gap-1 hidden md:flex`}
                  >
                    <span className={`w-2 h-2 rounded-full ${billingInfo.daysRemaining <= 3 ? 'bg-red-500' : 'bg-orange-500'} animate-pulse`} />
                    Plan ends in {billingInfo.daysRemaining} days
                  </Badge>
                )}
              </>
            )}
            {/* Theme Toggle */}
            <ThemeSwitcher />
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[1.25rem]"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-2">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="p-3 cursor-pointer"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-2 w-full">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.unread ? 'bg-blue-500' : 'bg-transparent'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${
                                notification.unread ? 'font-medium' : 'font-normal'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
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

export default Dashboard