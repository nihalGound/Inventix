import { SalesOverview } from "./_components/SalesOverview";
import { InventoryStatus } from "./_components/InventoryStatus";
import LowStockTable from "./_components/LowStockTable";
import StatsCard from "./_components/StatsCard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { getBusinessAnalytics, getTopProduct } from "@/actions/business";

export default async function Dashboard({
  params,
}: {
  params: { businessId: string };
}) {
  const client = new QueryClient();

  await client.prefetchQuery({
    queryKey: queryKeys.businessAnalytics(params.businessId),
    queryFn: () => getBusinessAnalytics(params.businessId),
  });

  await client.prefetchQuery({
    queryKey: queryKeys.topProducts(params.businessId),
    queryFn: () => getTopProduct(params.businessId),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="min-h-screen bg-background p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard type="inventory" />
          <StatsCard type="sales" />
          <StatsCard type="alerts" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesOverview />
          <InventoryStatus />
        </div>
        <div className="w-full">
          <LowStockTable />
        </div>
      </div>
    </HydrationBoundary>
  );
}
