import { AppSidebar } from "@/components/global/Loader/Sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};
function Layout({ children }: Props) {
  return (
    <div className="h-screen w-full flex bg-[#171717]">
      <AppSidebar />
      <div className="w-full overflow-y-auto bg-[#171717]">{children}</div>
    </div>
  );
}

export default Layout;
