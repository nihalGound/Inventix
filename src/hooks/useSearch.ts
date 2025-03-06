import { searchProducts } from "@/actions/business";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const useSearch = (businessId: string) => {
  const [query, setQuery] = useState<string>("");
  const [debounce, setDebounce] = useState<string>("");
  const [products, setProducts] = useState<
    {
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
    }[]
  >([]);
  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const delayInputTimeOutId = setTimeout(() => {
      setDebounce(query);
    }, 1000);
    return () => clearTimeout(delayInputTimeOutId);
  }, [query]);

  const { isFetching, refetch } = useQuery({
    queryKey: queryKeys.searchProduct(query, businessId),
    queryFn: async () => {
      const res = await searchProducts(query, businessId);
      if (res.status === 200) {
        setProducts(res.data);
      }
    },
  });
  useEffect(() => {
    if (debounce) refetch();
    if (!debounce) setProducts([]);
    return () => {
      debounce;
    };
  }, [debounce]);

  return { onSearchQuery, query, isFetching, products };
};
