"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useSalesDataPeriod } from "@/utils/queries";

export default function SalesHistory({ businessId }: { businessId: string }) {
  const [sales, setSales] = useState<
    {
      businessId: string;
      id: string;
      productId: string;
      quantity: number;
      totalPrice: number;
      soldAt: Date;
    }[]
  >([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [noResults, setNoResults] = useState(false);

  const { data, isFetched, error } = useSalesDataPeriod(
    businessId,
    startDate,
    endDate
  );

  const { data: stats } = data as {
    data: {
      businessId: string;
      id: string;
      productId: string;
      quantity: number;
      totalPrice: number;
      soldAt: Date;
    }[];
  };

  useEffect(() => {
    if (isFetched) {
      setSales(stats);
    }
  }, [isFetched, stats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNoResults(false);

    const filteredSales = stats
      ? stats.filter(
          (sale) =>
            (!startDate || new Date(sale.soldAt) >= new Date(startDate)) &&
            (!endDate || new Date(sale.soldAt) <= new Date(endDate))
        )
      : [];

    setSales(filteredSales);
    setNoResults(filteredSales.length === 0);
  };

  return (
    <div className="bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales History</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        {!isFetched ? (
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Failed to load sales data
          </div>
        ) : noResults ? (
          <div className="p-8 text-center text-muted-foreground">
            No sales found matching your search criteria
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.soldAt.toLocaleString()}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
