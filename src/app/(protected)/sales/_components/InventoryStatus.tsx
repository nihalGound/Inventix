"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InventoryStatus() {
  const totalSales = 1000;
  const lowStockProduct = 30;
  const outOfStockProduct = 10;
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
              <div className="text-sm text-muted-foreground">12 products</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-yellow-500 w-[${
                  (lowStockProduct / totalSales) * 100
                }%]`}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Out of Stock</div>
              <div className="text-sm text-muted-foreground">3 products</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-red-500 w-[${
                  (outOfStockProduct / totalSales) * 100
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
