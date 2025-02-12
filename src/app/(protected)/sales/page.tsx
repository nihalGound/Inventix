"use client";
import { Download, TrendingUp, Package, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryStatus } from "./_components/InventoryStatus";
import { SalesOverview } from "./_components/SalesOverview";
import { TopProducts } from "./_components/TopProducts";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SalesHistory from "./_components/SalesHistory";

export default function Sales() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales History</h1>
          <p className="text-muted-foreground">
            Track your transactions and revenue
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-x-4 items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Select start Date :
          </span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Sales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,289</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
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
            <div className="text-2xl font-bold">$27.50</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Reports & Analytics</h2>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesOverview />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <TopProducts />
            <InventoryStatus />
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <SalesHistory />
      </Card>
    </div>
  );
}
