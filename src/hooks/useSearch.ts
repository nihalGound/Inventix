import { searchProducts } from "@/actions/business";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

// Define proper type for product
type Product = {
  image: string | null;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  stock: number;
  lowStockThreshold: number;
  businessId: string;
  barcode: string;
};

export const useSearch = (businessId: string) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Handle input change
  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Debounce the search query
  useEffect(() => {
    const delayInputTimeOutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Reduced to 500ms for better responsiveness
    return () => clearTimeout(delayInputTimeOutId);
  }, [query]);

  // Use React Query with proper return value
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: queryKeys.searchProduct(debouncedQuery, businessId),
    queryFn: async () => {
      // Only search if we have a query
      if (!debouncedQuery.trim()) {
        return { status: 200, data: [] };
      }
      
      const res = await searchProducts(debouncedQuery, businessId);
      return res;
    },
    // Ensure we're not fetching with empty query
    enabled: debouncedQuery.trim() !== "",
    // Prevent stale data
    staleTime: 30000,
  });

  // Extract products with proper fallback
  const products: Product[] = (data?.status === 200 && data?.data) ? data.data : [];

  return { 
    onSearchQuery, 
    query, 
    isFetching, 
    isLoading,
    error,
    products 
  };
};