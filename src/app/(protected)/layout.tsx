import { AppSidebar } from "@/components/global/Loader/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};
function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex bg-[#171717]">
        <AppSidebar />
        <div className="w-full overflow-y-auto bg-[#171717]">
          <SidebarTrigger className="md:hidden"/>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
