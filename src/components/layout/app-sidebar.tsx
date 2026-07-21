"use client";

import {
  CalendarIcon,
  ContactIcon,
  FileTextIcon,
  FolderTreeIcon,
  LayoutDashboardIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/layout/nav-user";
import { PERMISSIONS as CATEGORY_PERMISSIONS } from "@/features/category";
import { PERMISSIONS as CLIENT_PERMISSIONS } from "@/features/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useHasPermission } from "@/features/auth";
import { USER_VIEW_PERMISSIONS } from "@/features/employee";
import { REPORT_VIEW_PERMISSIONS } from "@/features/report";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Holding any one of these is enough to see the item; omitted = always visible. */
  anyPermission?: string[];
}

// Pure so it's testable without mounting the whole sidebar (which needs a
// SidebarProvider, next/navigation, and NavUser's own store/router deps).
export function filterVisibleNavItems(items: NavItem[], hasPermission: (key: string) => boolean): NavItem[] {
  return items.filter((item) => !item.anyPermission || item.anyPermission.some((key) => hasPermission(key)));
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: UserCogIcon,
    // The users directory is an admin view — only user-managers see it.
    anyPermission: USER_VIEW_PERMISSIONS,
  },
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: UsersIcon,
    // Any one of these is enough to see the nav item at all.
    anyPermission: USER_VIEW_PERMISSIONS,
  },
  {
    title: "Clients",
    url: "/dashboard/clients",
    icon: ContactIcon,
    anyPermission: [CLIENT_PERMISSIONS.CLIENTS_READ],
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: FolderTreeIcon,
    anyPermission: [CATEGORY_PERMISSIONS.CATEGORIES_READ],
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: CalendarIcon,
    // Events have no permission keys of their own — same gate as Clients.
    anyPermission: [CLIENT_PERMISSIONS.CLIENTS_READ],
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileTextIcon,
    anyPermission: REPORT_VIEW_PERMISSIONS,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const hasPermission = useHasPermission();
  const visibleNavItems = filterVisibleNavItems(navItems, hasPermission);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <LayoutDashboardIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Reports System</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    render={
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
