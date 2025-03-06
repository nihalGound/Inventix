"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopProducts } from "@/utils/queries";
import { useParams } from "next/navigation";

// const salesData = [
//   { month: "January", "Product A": 5000, "Product B": 4200, "Product C": 3800 },
//   {
//     month: "February",
//     "Product A": 5200,
//     "Product B": 4400,
//     "Product C": 3900,
//   },
//   { month: "March", "Product A": 5500, "Product D": 4600, "Product C": 4100 },
//   { month: "April", "Product A": 5800, "Product B": 4800, "Product C": 4300 },
//   { month: "May", "Product A": 6000, "Product B": 5000, "Product C": 4500 },
//   { month: "June", "Product D": 6200, "Product B": 5200, "Product C": 4700 },
// ];

const colors = ["#8884d8", "#82ca9d", "#ffc658"];

export function SalesOverview() {
  const params = useParams();
  const { data: topProducts, isFetching: fetching } = useTopProducts(
    params.businessId as string
  );

  const { data: salesData, status: productStatus } = topProducts as {
    status: number;
    data: {
      month: string;
      products: {
        name: string;
        revenue: number;
      }[];
    }[];
  };
  //below code is for fin top 3 product which occur most in salesdata.
  const productCount: Record<string, number> = {};
  salesData.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "month") productCount[key] = (productCount[key] || 0) + 1;
    });
  });
  const sortedProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const products = sortedProducts.map((product) => product[0]);
  const [activeProducts, setActiveProducts] = useState(products);

  const toggleProduct = (product: string) => {
    setActiveProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  if (fetching || productStatus != 200) {
    return (
      <Card>
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue by product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4 max-md:space-x-1">
          {products.map((product, index) => (
            <Button
              key={product}
              size="sm"
              variant={activeProducts.includes(product) ? "default" : "outline"}
              onClick={() => toggleProduct(product)}
              style={{ borderColor: colors[index] }}
              className="max-md:px-2 max-md:py-1"
            >
              {product}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {products.map(
              (product, index) =>
                activeProducts.includes(product) && (
                  <Line
                    key={product}
                    type="monotone"
                    dataKey={product}
                    stroke={colors[index]}
                    activeDot={{ r: 8 }}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
