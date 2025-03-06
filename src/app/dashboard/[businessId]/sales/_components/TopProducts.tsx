"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesReport } from "@/utils/queries";
import { useState } from "react";

export function TopProducts({ businessId }: { businessId: string }) {
  const [product, setProduct] = useState<"revenue" | "units">("revenue");
  const { data } = useSalesReport(businessId);

  const { data: stats } = data as {
    data: {
      topProductByQuantity: {
        productId: string;
        name: string;
        quantity: number;
      }[];
      topProductByRevenue: {
        productId: string;
        name: string;
        revenue: number;
      }[];
    };
  };

  const topProducts =
    product === "revenue"
      ? stats?.topProductByRevenue || []
      : stats?.topProductByQuantity || [];

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
          {topProducts.map(
            (productItem: {
              productId: string;
              name: string;
              quantity?: number;
              revenue?: number;
            }) => (
              <div
                key={productItem.productId}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{productItem.name}</div>
                  {productItem.quantity && (
                    <div className="text-sm text-muted-foreground">
                      {productItem.quantity.toLocaleString()} units sold
                    </div>
                  )}
                </div>
                <div className="font-bold">
                  {productItem.revenue &&
                    `$${productItem.revenue.toLocaleString()}`}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
