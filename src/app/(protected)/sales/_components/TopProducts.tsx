"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const topProductsByRevenue = [
  { name: "Product A", units: "432 units sold", revenue: 8942 },
  { name: "Product B", units: "287 units sold", revenue: 6784 },
];
const topProductsByUnits = [
  { name: "Product C", units: "500 units sold", revenue: 10000 },
  { name: "Product D", units: "350 units sold", revenue: 4500 },
];
const map = {
  revenue: topProductsByRevenue,
  units: topProductsByUnits,
};

export function TopProducts() {
  const [product, setProduct] = useState<"revenue" | "units">("revenue");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Top Products</CardTitle>
        <Select
          defaultValue="revenue"
          onValueChange={(value: "revenue" | "units") => setProduct(value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">By Revenue</SelectItem>
            <SelectItem value="units">By Units</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {map[product].map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {product.units}
                </div>
              </div>
              <div className="font-bold">
                ${product.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
