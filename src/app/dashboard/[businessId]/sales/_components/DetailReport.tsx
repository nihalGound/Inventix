"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const sampleData = [
//   { date: "2025-01-10", totalSales: 1200, totalOrders: 15 },
//   { date: "2025-01-11", totalSales: 1100, totalOrders: 12 },
//   { date: "2025-01-12", totalSales: 1500, totalOrders: 18 },
//   { date: "2025-01-13", totalSales: 1800, totalOrders: 22 },
//   { date: "2025-01-14", totalSales: 900, totalOrders: 8 },
//   { date: "2025-01-15", totalSales: 1300, totalOrders: 14 },
//   { date: "2025-01-16", totalSales: 1700, totalOrders: 20 },
//   { date: "2025-01-17", totalSales: 1400, totalOrders: 16 },
//   { date: "2025-01-18", totalSales: 1900, totalOrders: 24 },
//   { date: "2025-01-19", totalSales: 950, totalOrders: 9 },
//   { date: "2025-01-20", totalSales: 1000, totalOrders: 11 },
//   { date: "2025-01-21", totalSales: 2000, totalOrders: 25 },
//   { date: "2025-01-22", totalSales: 1750, totalOrders: 21 },
//   { date: "2025-01-23", totalSales: 1600, totalOrders: 19 },
//   { date: "2025-01-24", totalSales: 1100, totalOrders: 13 },
//   { date: "2025-01-25", totalSales: 1200, totalOrders: 14 },
//   { date: "2025-01-26", totalSales: 1800, totalOrders: 22 },
//   { date: "2025-01-27", totalSales: 1450, totalOrders: 17 },
//   { date: "2025-01-28", totalSales: 1950, totalOrders: 23 },
//   { date: "2025-01-29", totalSales: 1050, totalOrders: 12 },
//   { date: "2025-01-30", totalSales: 1400, totalOrders: 15 },
//   { date: "2025-01-31", totalSales: 1700, totalOrders: 19 },
//   { date: "2025-02-01", totalSales: 1250, totalOrders: 14 },
//   { date: "2025-02-02", totalSales: 1850, totalOrders: 22 },
//   { date: "2025-02-03", totalSales: 1900, totalOrders: 24 },
//   { date: "2025-02-04", totalSales: 1550, totalOrders: 18 },
//   { date: "2025-02-05", totalSales: 950, totalOrders: 10 },
//   { date: "2025-02-06", totalSales: 2000, totalOrders: 26 },
//   { date: "2025-02-07", totalSales: 1500, totalOrders: 19 },
//   { date: "2025-02-08", totalSales: 1300, totalOrders: 15 },
// ];

interface DetailReportProps {
  data: {
    date: string;
    totalSales: number;
    totalOrders: number;
  }[];
}

function DetailReport({ data }: DetailReportProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="totalSales"
          name="Total Sales"
          stroke="#8884d8"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="totalOrders"
          name="Total Orders"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DetailReport;
