"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesData } from "@/utils/queries";
import { useState } from "react";

// const data = [
//   { date: "Feb 14", sales: 3200 },
//   { date: "Feb 15", sales: 3800 },
//   { date: "Feb 16", sales: 4200 },
//   { date: "Feb 17", sales: 3900 },
//   { date: "Feb 18", sales: 3600 },
//   { date: "Feb 19", sales: 4100 },
//   { date: "Feb 20", sales: 4289 },
// ];

export function SalesOverview({ businessId }: { businessId: string }) {
  const [period, setPeriod] = useState<"7_days" | "30_days">("7_days");
  const { data } = useSalesData(businessId, period);
  const { data: stats } = data as {
    status: number;
    data: {
      businessId: string;
      id: string;
      productId: string;
      quantity: number;
      totalPrice: number;
      soldAt: Date;
    }[];
  };
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select
          defaultValue={"7_days"}
          onValueChange={(value: "7_days" | "30_days") => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7_days">Last 7 days</SelectItem>
            <SelectItem value="30_days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="soldAt" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalPrice"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-right text-sm text-muted-foreground">
        Total Sales: $
        {stats.reduce((prev, current) => prev + current.totalPrice, 0)}
      </div>
    </div>
  );
}
