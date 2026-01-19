import { useEffect } from "react";
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

// Define props interface for AppSidebar
interface AppSidebarProps {
  className?: string;
  hideStoreSwitcher?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional props for flexibility
}

export function AppSidebar({ className, hideStoreSwitcher, ...props }: AppSidebarProps) {
  const { user, error, initializeAuth, isLoading } = useAuthStore();
  const { stores, loading: storeLoading, fetchStores, error: storeError } = useStoreStore();
  const navigate = useNavigate();
  const menuData = (user?.user_metadata?.role === "admin" || user?.role === "admin") ? adminMenuData : userMenuData;

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
    const isAdmin = user.user_metadata?.role === "admin" || user.role === "admin";
    if (isAdmin) return;

    const isVendor =
      user.user_metadata?.role === "vendor" || user.role === "vendor";
    console.log({ isVendor, stores });

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
    if (storeError) {
      console.log("err", storeError)
      navigate("/login")
    }
  }, [user, stores]);

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