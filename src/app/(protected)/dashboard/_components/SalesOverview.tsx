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

const salesData = [
  { month: "January", "Product A": 5000, "Product B": 4200, "Product C": 3800 },
  {
    month: "February",
    "Product A": 5200,
    "Product B": 4400,
    "Product C": 3900,
  },
  { month: "March", "Product A": 5500, "Product D": 4600, "Product C": 4100 },
  { month: "April", "Product A": 5800, "Product B": 4800, "Product C": 4300 },
  { month: "May", "Product A": 6000, "Product B": 5000, "Product C": 4500 },
  { month: "June", "Product D": 6200, "Product B": 5200, "Product C": 4700 },
];

const products = ["Product A", "Product B", "Product C"];
const colors = ["#8884d8", "#82ca9d", "#ffc658"];

export function SalesOverview() {
  const [activeProducts, setActiveProducts] = useState(products);

  const toggleProduct = (product: string) => {
    setActiveProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

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
