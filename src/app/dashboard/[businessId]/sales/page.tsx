import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InventoryStatus } from "./_components/InventoryStatus";
import { SalesOverview } from "./_components/SalesOverview";
import { TopProducts } from "./_components/TopProducts";

import ReportsPage from "./_components/Report";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import {
  generateSalesReport,
  getBusinessAnalytics,
  getSalesData,
} from "@/actions/business";
import SalesHeader from "./_components/SalesHeader";

export async function Sales({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: queryKeys.salesReport(businessId),
    queryFn: () => generateSalesReport(businessId),
  });

  await client.prefetchQuery({
    queryKey: queryKeys.salesData(businessId, "7_days"),
    queryFn: () => getSalesData(businessId, "7_days"),
  });
  await client.prefetchQuery({
    queryKey: queryKeys.salesData(businessId, "30_days"),
    queryFn: () => getSalesData(businessId, "30_days"),
  });

  await client.prefetchQuery({
    queryKey: queryKeys.businessAnalytics(businessId),
    queryFn: () => getBusinessAnalytics(businessId),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="min-h-screen bg-background p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sales History</h1>
            <p className="text-muted-foreground">
              Track your transactions and revenue
            </p>
          </div>
        </div>
        <SalesHeader businessId={businessId} />
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Reports & Analytics</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesOverview businessId={businessId} />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <TopProducts businessId={businessId} />
              <InventoryStatus businessId={businessId} />
            </div>
          </div>
        </div>

        <div>
          <ReportsPage businessId={businessId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default Sales;
