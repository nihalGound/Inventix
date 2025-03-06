"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesReport } from "@/utils/queries";
import { DollarSign, Package, TrendingUp } from "lucide-react";

type Props = {
  businessId: string;
};

function SalesHeader({ businessId }: Props) {
  const { data } = useSalesReport(businessId, "30_days");
  const { data: stats } = data as {
    data: {
      totalSales: number;
      averageSales: number;
      totalOrders: number;
    };
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Sales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSales}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesHeader;
