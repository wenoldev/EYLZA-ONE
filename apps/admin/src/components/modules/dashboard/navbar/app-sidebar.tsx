import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SidebadrBody } from "./sidebar-body";
import { SidebarBottom } from "./sidebar-bottom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminMenuData, userMenuData } from "@/constants/menu";
import { MenuSkeleton } from "@/skeletons/menu";
import { useAuthStore } from "@/stores/authStore";
import { StoreSwitcher } from "./StoreSwitcher";
import { useStoreStore } from "@/stores/storeStore";
import api from "@/lib/api";

// Define props interface for AppSidebar
interface AppSidebarProps {
  className?: string;
  hideStoreSwitcher?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional props for flexibility
}

export function AppSidebar({ className, hideStoreSwitcher, ...props }: AppSidebarProps) {
  const { user, error, initializeAuth, isLoading } = useAuthStore();
  const { stores, loading: storeLoading, fetchStores } = useStoreStore();
  const navigate = useNavigate();
  const [activePlugins, setActivePlugins] = useState<string[]>([]);

  const currentStore = stores?.[0];
  const userRole = user?.user_metadata?.role || user?.role;

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Redirect to login if there's an error or no user
    if (error || !user) {
      navigate("/login");
    }
  }, [error, user, navigate]);

  useEffect(() => {
    if (!user) return;

    // If admin, skip store checks and redirects
    const isAdmin = userRole === "admin";
    if (isAdmin) return;

    const isVendor = userRole === "vendor";

    if (!stores || stores.length === 0) {
      // fetch only if not already loading
      if (!storeLoading) {
        fetchStores();
        return;
      }
      // if vendor and finished loading but still no stores → redirect
      if (isVendor && !storeLoading && stores?.length === 0) {
        navigate("/store-setup");
      }
    }
  }, [user, stores, userRole]);

  useEffect(() => {
    const fetchActivePlugins = async () => {
      if (!currentStore || userRole === 'admin') return;
      try {
        const res = await api.get(`/api/v1/stores/${currentStore.id}/plugins`);
        if (res.data?.data?.plugins) {
          setActivePlugins(res.data.data.plugins.map((p: any) => p.slug));
        }
      } catch (err) {
        console.error("Failed to fetch active plugins", err);
      }
    };

    fetchActivePlugins();
  }, [currentStore, userRole]);

  const menuData = useMemo(() => {
    const baseMenu = userRole === "admin" ? adminMenuData : userMenuData;
    if (userRole === "admin") return baseMenu;

    return baseMenu.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (item.title === 'Testimonials') return activePlugins.includes('testimonials');
        if (item.title === 'Gallery') return activePlugins.includes('gallery');
        return true;
      })
    }));
  }, [userRole, activePlugins]);

  if (isLoading) {
    return <MenuSkeleton />;
  }

  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      <SidebarHeader>
        {!hideStoreSwitcher && <StoreSwitcher />}
      </SidebarHeader>
      <SidebarContent>
        <SidebadrBody items={menuData} />
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <SidebarBottom />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
