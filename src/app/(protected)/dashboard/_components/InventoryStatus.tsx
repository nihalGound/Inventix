"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const lowStockData = [
  { product: "Product X", stock: 15 },
  { product: "Product Y", stock: 12 },
  { product: "Product Z", stock: 10 },
  { product: "Product W", stock: 8 },
  { product: "Product V", stock: 5 },
];

export function InventoryStatus() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Low Stock Inventory</CardTitle>
        <CardDescription>Top 5 products with low stock</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lowStockData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="product" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#8884d8" name="Current Stock" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
