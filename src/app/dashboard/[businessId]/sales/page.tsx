import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InventoryStatus } from "./_components/InventoryStatus";
import { SalesOverview } from "./_components/SalesOverview";
import { TopProducts } from "./_components/TopProducts";

import SalesHistory from "./_components/SalesHistory";
import ReportsPage from "./_components/Report";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import {
  generateSalesReport,
  getBusinessAnalytics,
  getSalesData,
} from "@/actions/business";
import SalesHeader from "./_components/SalesHeader";

export async function Sales({ params }: { params: { businessId: string } }) {
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: queryKeys.salesReport(params.businessId),
    queryFn: () => generateSalesReport(params.businessId),
  });

  await client.prefetchQuery({
    queryKey: queryKeys.salesData(params.businessId, "7_days"),
    queryFn: () => getSalesData(params.businessId, "7_days"),
  });
  await client.prefetchQuery({
    queryKey: queryKeys.salesData(params.businessId, "30_days"),
    queryFn: () => getSalesData(params.businessId, "30_days"),
  });

  await client.prefetchQuery({
    queryKey: queryKeys.businessAnalytics(params.businessId),
    queryFn: () => getBusinessAnalytics(params.businessId),
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales History</h1>
          <p className="text-muted-foreground">
            Track your transactions and revenue
          </p>
        </div>
      </div>
      <SalesHeader businessId={params.businessId} />
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
              <SalesOverview businessId={params.businessId} />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <TopProducts businessId={params.businessId} />
            <InventoryStatus businessId={params.businessId} />
          </div>
        </div>
      </div>

      <div>
        <ReportsPage businessId={params.businessId} />
      </div>

      <Card className="mt-6">
        <SalesHistory businessId={params.businessId} />
      </Card>
    </div>
  );
}
