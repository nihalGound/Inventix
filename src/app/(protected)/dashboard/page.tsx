"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Package, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesOverview } from "./_components/SalesOverview";
import { InventoryStatus } from "./_components/InventoryStatus";
import LowStockTable from "./_components/LowStockTable";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredCard("inventory")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => router.push("/inventory")}
          className="hover:cursor-pointer"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory
              </CardTitle>
              <Package className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">items in stock</p>
              {hoveredCard === "inventory" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Click to view detailed inventory
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredCard("sales")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => router.push("/sales")}
          className="hover:cursor-pointer"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
              {hoveredCard === "sales" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Click to view sales details
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredCard("alerts")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => router.push("/stocks")}
          className="hover:cursor-pointer"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Alerts
              </CardTitle>
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                items need restocking
              </p>
              {hoveredCard === "alerts" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Click to view low stock items
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesOverview />
        <InventoryStatus />
      </div>
      <div className="w-full">
        <LowStockTable />
      </div>
    </div>
  );
}
