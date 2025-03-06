import { getAllBusiness } from "@/actions/business";
import { AppSidebar } from "@/components/global/Loader/Sidebar";
import { queryKeys } from "@/utils/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { businessId: string };
};

async function Layout({ children, params }: Props) {
  //prefetch all queries related to params.businesssId;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getAllBusiness(),
    queryFn: getAllBusiness,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-screen w-full flex bg-[#171717]">
        <AppSidebar businessId={params.businessId} />
        <div className="w-full overflow-y-auto bg-[#171717]">{children}</div>
      </div>
    </HydrationBoundary>
  );
}

export default Layout;
