"use client";

import { useState } from "react";
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

// Define the type for the sales data
interface Sale {
  id: string;
  productId: string;
  businessId: string;
  quantity: number;
  totalPrice: number;
  soldAt: string | Date;
}

export default function SalesHistory({ businessId }: { businessId: string }) {
  // Default to one week ago
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
  });
  
  // Search state (only updated when Search button is clicked)
  const [searchParams, setSearchParams] = useState({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  // Use React Query with the search parameters
  const { data, isFetched, error, isLoading, refetch } = useSalesDataPeriod(
    businessId,
    searchParams.startDate,
    searchParams.endDate
  );

  // Handle input changes without triggering data fetch
  const handleDateChange = (field: string, value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    setSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
    // Force a refetch with new params
    setTimeout(() => refetch(), 0);
  };

  // Safely extract sales data
  let salesData: Sale[] = [];
  if (data) {
    // Handle different possible data structures
    if (Array.isArray(data)) {
      salesData = data;
    } else if (data.data && Array.isArray(data.data)) {
      salesData = data.data;
    }
  }

  const noResults = isFetched && salesData.length === 0;

  return (
    <div className="bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales History</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        {isLoading ? (
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
                {salesData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.soldAt).toLocaleString()}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </Card>
      
      {/* Debug information - fixed to avoid errors when data is undefined */}
      <div className="mt-4 p-4 bg-black rounded text-xs">
        <h3 className="font-bold mb-1">Debug Info:</h3>
        <p>businessId: {businessId}</p>
        <p>Start Date: {searchParams.startDate}</p>
        <p>End Date: {searchParams.endDate}</p>
        <p>isLoading: {isLoading.toString()}</p>
        <p>isFetched: {isFetched.toString()}</p>
        <p>Has Data: {data ? 'Yes' : 'No'}</p>
        <p>Data Type: {data ? typeof data : 'undefined'}</p>
        <p>Records Count: {salesData.length}</p>
      </div>
    </div>
  );
}