"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessAnalytics } from "@/utils/queries";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

type Props = {
  type: "inventory" | "sales" | "alerts";
};
function StatsCard({ type }: Props) {
  const router = useRouter();
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
  const [hoverCard, setHovercard] = useState<boolean>(false);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHovercard(true)}
      onHoverEnd={() => setHovercard(false)}
      onClick={() => router.push("/inventory")}
      className="hover:cursor-pointer"
    >
      {isFetching || status != 200 ? (
        <>
          <Skeleton />
        </>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {type === "alerts"
                ? "Low Stock Alerts"
                : type === "inventory"
                ? "Total Inventory"
                : "Total Sales"}
            </CardTitle>
            <Package className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            {type === "sales" && "$ "}
              {type === "inventory"
                ? analytics.totalProducts
                : type === "alerts"
                ? analytics.lowStock.length
                : analytics.totalSales}
            </div>
            {type !== "sales" && (
              <p className="text-xs text-muted-foreground">
                {type === "alerts" ? "items need restocking" : "items in stock"}
              </p>
            )}
            {hoverCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs text-muted-foreground"
              >
                Click to view{" "}
                {type === "alerts"
                  ? "low stock items"
                  : type === "sales"
                  ? "sales details"
                  : "detailed inventory"}
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

export default StatsCard;
