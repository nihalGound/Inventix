"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessAnalytics } from "@/utils/queries";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const lowStockData = [
//   { product: "Product X", stock: 15 },
//   { product: "Product Y", stock: 12 },
//   { product: "Product Z", stock: 10 },
//   { product: "Product W", stock: 8 },
//   { product: "Product V", stock: 5 },
// ];

export function InventoryStatus() {
  const params = useParams();
  const { data, isFetching } = useBusinessAnalytics(
    params.businessId as string
  );
  const { data: analytics, status } = data as {
    status: number;
    data: {
      totalSales: number;
      totalProducts: number;
      topProductByMonth: {
        month: string;
        products: {
          name: string;
          revenue: number;
        }[];
      }[];
      lowStock: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        businessId: string;
        price: number;
        stock: number;
        lowStockThreshold: number;
      }[];
    };
  };
  if (isFetching || status != 200) {
    return (
      <Card>
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Low Stock Inventory</CardTitle>
        <CardDescription>Top 5 products with low stock</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.lowStock} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#8884d8" name="Current Stock" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
