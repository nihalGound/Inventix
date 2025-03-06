"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBusinessAnalytics } from "@/utils/queries";

export function InventoryStatus({ businessId }: { businessId: string }) {
  const lowStockProduct = 30;
  const outOfStockProduct = 10;
  const { data } = useBusinessAnalytics(businessId);

  const { data: stats } = data as {
    status: number;
    data: {
      totalSales: number;
      lowStock: {
        businessId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        price: number;
        stock: number;
        lowStockThreshold: number;
        barcode: string;
      }[];
    };
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Low Stock Items</div>
              <div className="text-sm text-muted-foreground">
                {stats.lowStock.length} products
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-yellow-500 w-[${
                  (lowStockProduct / stats.totalSales) * 100
                }%]`}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Out of Stock</div>
              <div className="text-sm text-muted-foreground">
                {stats.lowStock.map((p) => p.stock === 0).length} products
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-red-500 w-[${
                  (outOfStockProduct / stats.totalSales) * 100
                }%]`}
              />
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          View All
        </Button>
      </CardContent>
    </Card>
  );
}
