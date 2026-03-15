import { useAuthStore } from "@/stores/authStore";
import { useStoreStore } from "@/stores/storeStore";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";

export const StoreRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const { stores, loading, error, fetchStores } = useStoreStore();
  const location = useLocation();
  const isVendor = user?.user_metadata?.role === 'vendor' || user?.role === 'vendor';

  useEffect(() => {
    if (!user || !isVendor) return;
    
    // fetch only if stores not fetched yet
    if (stores === null && !loading) {
      fetchStores();
    }
  }, [user, isVendor, stores, loading, fetchStores]);

  if (!user) {
    return <Loader />;
  }

  // 1️⃣ For vendors, we must wait for store data
  if (isVendor) {
    if (loading || stores === null) {
      return <Loader />;
    }

    // 2️⃣ Store fetch failed → logout
    if (error) {
      return <Navigate to="/login" replace />;
    }

    // 3️⃣ After fetch is complete → Now decide redirect
    if (stores.length === 0) {
      return <Navigate to="/store-setup" state={{ from: location }} replace />;
    }
    
  }
  
  return <>{children}</>;
};
