"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DetailReport from "./DetailReport";
import { useSalesDataPeriod } from "@/utils/queries";

export default function ReportsPage({ businessId }: { businessId: string }) {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  );
  const [endDate, setEndDate] = useState(new Date().toISOString());

  const { data, isFetching } = useSalesDataPeriod(
    businessId,
    startDate,
    endDate
  );

  const stats = useMemo(() => {
    return (data?.data ?? []) as {
      businessId: string;
      id: string;
      productId: string;
      quantity: number;
      totalPrice: number;
      soldAt: Date;
    }[];
  }, [data]);

  const groupedData = useMemo(() => {
    return stats.reduce((acc, curr) => {
      const dateKey = new Date(curr.soldAt).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, totalSales: 0, totalOrders: 0 };
      }
      acc[dateKey].totalSales += curr.totalPrice;
      acc[dateKey].totalOrders += curr.quantity;
      return acc;
    }, {} as Record<string, { date: string; totalSales: number; totalOrders: number }>);
  }, [stats]);

  // Convert the grouped data into an array and sort by date
  const sampleData = useMemo(() => {
    return Object.values(groupedData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [groupedData]);

  const revenue = useMemo(
    () => stats.reduce((total, curr) => total + curr.totalPrice, 0),
    [stats]
  );
  const orders = stats.length;
  const averageOrderValue = orders > 0 ? revenue / orders : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Detailed Reports</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            className="w-full sm:w-[180px]"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className="w-full sm:w-[180px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isFetching ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-4 w-[100px]" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[90px]" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenue}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageOrderValue}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {isFetching ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DetailReport data={sampleData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
