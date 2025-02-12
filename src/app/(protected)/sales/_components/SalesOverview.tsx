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

const data = [
  { date: "Feb 14", sales: 3200 },
  { date: "Feb 15", sales: 3800 },
  { date: "Feb 16", sales: 4200 },
  { date: "Feb 17", sales: 3900 },
  { date: "Feb 18", sales: 3600 },
  { date: "Feb 19", sales: 4100 },
  { date: "Feb 20", sales: 4289 },
];

export function SalesOverview() {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select defaultValue="7" disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-right text-sm text-muted-foreground">
        Total Sales: $24,589
      </div>
    </div>
  );
}
