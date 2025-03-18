"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Plus, Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { downloadBarcode } from "@/lib/utils";
import { useGetAllProducts } from "@/utils/queries";
import AddProductModal from "./addProductModal";

// Define Product type for better type safety
type Product = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  businessId: string;
  barcode: string;
};

function ProductPage({ businessId }: { businessId: string }) {
  // Proper React Query usage with destructuring
  const { 
    data: productsData, 
    isLoading,
    isError,
    error
  } = useGetAllProducts(businessId);

  // Extract products with proper typing
  const allProducts: Product[] = useMemo(() => {
    return productsData?.data || [];
  }, [productsData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price" | null>(null);

  // Filter and sort products in a single memoized value
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    
    // Apply search filter if query exists
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.id + "_" + product.name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting if selected
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price") return a.price - b.price;
        return a.stock - b.stock; // sortBy === "stock"
      });
    }
    
    return result;
  }, [allProducts, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // The actual filtering is handled by the useMemo above
    setIsSearching(false);
  };

  const handleSort = (value: "name" | "stock" | "price") => {
    setSortBy(value);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Loading inventory items...</p>
          </div>
        </div>
        <Card className="border rounded-lg overflow-hidden p-4">
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
        </Card>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">
            An error occurred while fetching products
          </p>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error ? error.message : "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const noResults = filteredProducts.length === 0 && searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your inventory items</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-x-2">
              <Plus size={16} />
              <span>Add Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddProductModal businessId={businessId} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4 max-md:gap-y-2 items-start md:items-center w-full mb-4">
        <div className="relative flex-1">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search by product or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-md:w-full placeholder:text-xs"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>
        <div className="relative flex-1 max-md:w-full">
          <Select onValueChange={(value: "name" | "stock" | "price") => handleSort(value)}>
            <SelectTrigger className="w-[180px] max-md:w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="border rounded-lg overflow-hidden">
        {isSearching ? (
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        ) : noResults ? (
          <div className="p-8 text-center text-muted-foreground">
            No products found matching your search criteria
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
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            {product.image ? "View" : "No Image"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div
                        className={`${
                          product.stock <= product.lowStockThreshold
                            ? "bg-red-500/50"
                            : "bg-green-500/50"
                        } flex rounded-full px-2 py-1 text-center w-fit max-md:text-center max-md:bg-transparent`}
                      >
                        <span
                          className={`${
                            product.stock <= product.lowStockThreshold
                              ? "text-red-500"
                              : "text-green-500"
                          } max-md:text-xs`}
                        >
                          {product.stock <= product.lowStockThreshold
                            ? "Low stock"
                            : "In stock"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBarcode(product.barcode)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Barcode
                      </Button>
                    </TableCell>
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

export default ProductPage;