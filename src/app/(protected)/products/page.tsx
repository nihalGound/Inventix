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
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  barcode: string;
  stock: number;
  price: number;
  lowThreshold: number;
  image: string;
}

function Products() {
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Milk",
      barcode: "A124Milk",
      stock: 100,
      lowThreshold: 20,
      price: 30,
      image: "/hello.png",
    },
    {
      id: 2,
      name: "Bread",
      barcode: "A124Milk",
      stock: 200,
      lowThreshold: 20,
      price: 50,
      image: "/hello.png",
    },
    {
      id: 3,
      name: "Cheese",
      barcode: "A124Milk",
      stock: 10,
      lowThreshold: 20,
      price: 10,
      image: "/hello.png",
    },
  ];
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const applyFilter = (value: "name" | "stock" | "price") => {
    const sortedProducts = [...products];
    if (value === "name")
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    else if (value === "price")
      sortedProducts.sort((a, b) => a.price - b.price);
    else if (value === "stock")
      sortedProducts.sort((a, b) => a.stock - b.stock);
    setProducts(sortedProducts);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNoResults(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate search results
    const filteredSales = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setProducts(filteredSales);
    setNoResults(filteredSales.length === 0);
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your inventory items</p>
        </div>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4 max-md:gap-y-2 items-start md:items-center w-full">
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
        <div className="relative flex-1">
          <Select
            onValueChange={(value: "name" | "stock" | "price") =>
              applyFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="price">price</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">{"Image"}</Button>
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
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <div
                        className={`${
                          product.stock <= product.lowThreshold
                            ? "bg-red-500/50"
                            : "bg-green-500/50"
                        } flex rounded-full px-2 py-1 text-centerk w-fit max-md:text-center max-md:bg-transparent`}
                      >
                        <span
                          className={`${
                            product.stock <= product.lowThreshold
                              ? "text-red-500"
                              : "text-green-500"
                          } max-md:text-xs`}
                        >
                          {product.stock <= product.lowThreshold
                            ? "Out of stock"
                            : "In stock"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => {}}>
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

export default Products;
