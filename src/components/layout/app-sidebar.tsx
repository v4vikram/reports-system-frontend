"use client";

import {
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

const navItems = [
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
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileTextIcon,
    anyPermission: REPORT_VIEW_PERMISSIONS,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const hasPermission = useHasPermission();
  const visibleNavItems = navItems.filter(
    (item) => !item.anyPermission || item.anyPermission.some((key) => hasPermission(key))
  );

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
