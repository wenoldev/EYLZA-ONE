;

import { ChevronRight, SquareArrowOutUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { MenuGroup, MenuItem } from '@/types/menu';

export function SidebadrBody({
  items,
}: {
  items: MenuGroup[];
}) {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const route = (item: MenuItem) => {
    if (item.route) {
      const { url, queryParams, external } = item.route;

      if (external) {
        window.open(url, '_blank');
      } else {
        let fullUrl = `/${url}`;
        if (queryParams) {
          const queryString = new URLSearchParams(queryParams).toString();
          fullUrl += `?${queryString}`;
        }
        navigate(fullUrl);
      }
      setOpenMobile(false);
    }
  };

  const isActive = (item: MenuItem): boolean => {
    if (!item.route || item.route.external) return false;

    const currentPath = location.pathname;
    const currentSearch = location.search;
    const basePath = `/${item.route.url}`;

    // Check if base path matches
    const pathMatches = currentPath === basePath || currentPath.startsWith(basePath + '/');

    if (!pathMatches) {
      // Check sub-items
      if (item.subItems?.length) {
        return item.subItems.some(sub => isActive(sub));
      }
      return false;
    }

    // If item has query params, they must also match
    if (item.route.queryParams) {
      const searchParams = new URLSearchParams(currentSearch);
      return Object.entries(item.route.queryParams).every(([key, value]) => {
        return searchParams.get(key) === String(value);
      });
    }

    // If item doesn't have query params but we are on the base path, it's a match
    // unless there's a more specific sub-item active
    return true;
  };

  const renderMenuItem = (item: MenuItem) => (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.isActive || isActive(item)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            onClick={() => !item.subItems && route(item)}
            isActive={isActive(item)}
            className={isActive(item) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
          >
            {item.icon && <item.icon className={isActive(item) ? 'text-sidebar-accent-foreground' : ''} />}
            <span>{item.title}</span>
            {item.subItems && item.subItems.length > 0 ? (
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            ) : item.route?.external && (
              <SquareArrowOutUpRight className="ml-auto" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {item.subItems && item.subItems.length > 0 && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    onClick={() => route(subItem)}
                    className={`cursor-pointer ${isActive(subItem) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                  >
                    <span>{subItem.title}</span>
                    {subItem.route?.external && (
                      <SquareArrowOutUpRight className="ml-auto" />
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );

  return (
    <SidebarGroup>
      {items.map((section, index) => (
        <div key={index}>
          <SidebarGroupLabel>{section.sectionName}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map(renderMenuItem)}
          </SidebarMenu>
        </div>
      ))}
    </SidebarGroup>
  );
}