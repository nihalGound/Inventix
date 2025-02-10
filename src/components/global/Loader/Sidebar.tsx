import {
  BellDot,
  ChartColumnIncreasing,
  LayoutDashboard,
  Package,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "products",
    icon: Package,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: BellDot,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-5 flex w-full">
        <div className="flex gap-x-3 items-center bg-black p-2 py-4 px-3 justify-center">
          <User />
          <span>User</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
