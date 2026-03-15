import { ChevronsUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "@/stores/storeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useState, useEffect } from "react";
import StoreSwitcherSkeleton from "@/skeletons/storeSwitcher"

// Define Store interface matching StoreSwitcher expectations
type Status = 'active' | 'hold' | 'inactive';
type Industry = 'grocery' | 'cosmetics' | 'other';

interface Store {
  name: string;
  color: string;
  status: Status;
  industry: Industry;
  id: string;
}

// Utility to generate a random color for the store
const generateColor = () => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Map backend store data to StoreSwitcher format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToStore = (store: any): Store => ({
  id: store.id,
  name: store.name,
  color: store.color || generateColor(), // Generate client-side or use meta_data.color if available
  status: store.status as Status,
  industry: store.meta_data?.industry || 'other', // Assume industry in meta_data or default to 'other'
});

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'active':
      return 'bg-green-400';
    case 'hold':
      return 'bg-orange-400';
    case 'inactive':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
};

const getStatusGlow = (status: Status) => {
  switch (status) {
    case 'active':
      return 'shadow-[0_0_10px_rgba(34,197,94,0.8),0_0_20px_rgba(34,197,94,0.6),0_0_30px_rgba(34,197,94,0.4)]';
    case 'hold':
      return 'shadow-[0_0_10px_rgba(251,146,60,0.8),0_0_20px_rgba(251,146,60,0.6),0_0_30px_rgba(251,146,60,0.4)]';
    case 'inactive':
      return 'shadow-[0_0_10px_rgba(239,68,68,0.8),0_0_20px_rgba(239,68,68,0.6),0_0_30px_rgba(239,68,68,0.4)]';
    default:
      return 'shadow-[0_0_10px_rgba(156,163,175,0.8),0_0_20px_rgba(156,163,175,0.6),0_0_30px_rgba(156,163,175,0.4)]';
  }
};

export function StoreSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { stores, loading, error, activeStoreId, setActiveStoreId, fetchStores } = useStoreStore();
  const [activeTeam, setActiveTeam] = useState<Store | null>(null);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);

  // Fetch stores if not loaded
  useEffect(() => {
    if (!stores && !loading) {
      fetchStores();
    }
  }, [stores, loading, fetchStores]);


  // Set active team based on activeStoreId or default to first store
  useEffect(() => {
    if (stores && stores.length > 0) {
      const storeToSet = activeStoreId 
        ? stores.find(s => s.id === activeStoreId) 
        : stores[0];
      
      if (storeToSet) {
        setActiveTeam(mapToStore(storeToSet));
      }
    }
  }, [stores, activeStoreId]);

  // Handle adding a new store
  const handleAddStore = () => {
    setIsLimitDialogOpen(true);
  };

  if (loading) {
    return <SidebarMenu>
      <SidebarMenuItem>
        <StoreSwitcherSkeleton />
      </SidebarMenuItem>
      </SidebarMenu>;
  }

  if (error) {
    return <SidebarMenu><SidebarMenuItem>Error: {error}</SidebarMenuItem></SidebarMenu>;
  }

  if (!stores?.length || !activeTeam) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleAddStore}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gray-500 text-white font-medium text-sm">
              <Plus className="size-4" />
            </div>
            <span>Create a store</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg text-white font-medium text-sm relative"
                style={{ backgroundColor: activeTeam.color }}
              >
                {activeTeam.name.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs capitalize text-muted-foreground">
                  {activeTeam.industry}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Stores
            </DropdownMenuLabel>
            {stores.map((store) => {
              const mappedStore = mapToStore(store);
              return (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setActiveStoreId(store.id)}
                  className="gap-2 p-2"
                >
                  <div
                    className="flex size-6 items-center justify-center rounded-md text-white font-medium text-xs relative"
                    style={{ backgroundColor: mappedStore.color }}
                  >
                    {mappedStore.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{mappedStore.name}</span>
                    <div className="flex gap-1 items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(mappedStore.status)} ${getStatusGlow(
                          mappedStore.status
                        )}`}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {mappedStore.status}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleAddStore}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Store Creation Restricted</DialogTitle>
            <DialogDescription>
              To create additional stores, please upgrade your plan.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}