"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Product, useBillStore } from "@/store/bill";
import { Plus, X } from "lucide-react";
import { DownloadableInvoice } from "./PrintableInvoice";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";
import { useSaveBill } from "@/hooks/useSaveBill";
import { useGetBusiness } from "@/utils/queries";

export function BillInterface({ businessId }: { businessId: string }) {
  const {
    addProduct,
    setCustomerEmail,
    setCustomerName,
    setCustomerPhone,
    setDiscount,
    setIsScannerOpen,
    customerEmail,
    customerName,
    customerPhone,
    discount,
    products,
    removeProduct,
    updateProductQuantity,
    total,
    resetStore,
  } = useBillStore((state) => state);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data } = useGetBusiness(businessId);

  const { data: business } = data as {
    status: number;
    data: {
      message: string;
      business: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        image: string | null;
      };
    };
  };

  // Get search results with improved hook
  const {
    isFetching,
    isLoading,
    onSearchQuery,
    products: searchResults,
    query,
  } = useSearch(businessId);

  const { billId, billDate, isPending, mutate, setBillId } = useSaveBill(
    businessId,
    products.map((p) => {
      return {
        productId: p.id,
        quantity: p.quantity,
      };
    }),
    customerEmail,
    customerName,
    customerPhone,
    "",
    discount
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    // Prevent negative or invalid quantities
    if (quantity > 0) {
      updateProductQuantity(id, quantity);
    }
  };

  const handleSaveBill = () => {
    // Validate before saving
    if (products.length === 0) {
      alert("Please add at least one product to the bill");
      return;
    }

    mutate();
  };

  const handleAddProduct = (product: Product) => {
    addProduct(product);
    // Optionally close the dialog after adding
    setIsSearchOpen(false);
  };

  const resetBill = () => {
    // Reset all bill-related states
    resetStore();
    // Reset any component-specific state if needed
    setIsSearchOpen(false);
    setBillId("");
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customer-email">Customer Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
            <div>
              <Label htmlFor="customer-number">Customer Phone</Label>
              <Input
                id="customer-number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter customer phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <Button onClick={() => setIsSearchOpen(true)}>Add Product</Button>
            <Button onClick={() => setIsScannerOpen(true)}>Scan Product</Button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {"No products added yet. Click 'Add Product' to begin."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          min={1}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        ${(product.price * product.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    setDiscount(value);
                  }
                }}
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold mt-2">${total.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 items-center">
        {billId && billDate && (
          <>
            <Button variant="outline" onClick={resetBill} className="gap-2">
              <Plus className="h-4 w-4" />
              New Bill
            </Button>
            <DownloadableInvoice
              billId={billId}
              date={billDate}
              customerEmail={customerEmail}
              customerName={customerName}
              customerPhone={customerPhone}
              discount={discount}
              products={products}
              total={total}
              businessName={business.business.name}
            />
          </>
        )}
        <Button
          onClick={handleSaveBill}
          disabled={isPending || products.length === 0}
        >
          {isPending ? "Saving..." : "Save Bill"}
        </Button>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search products..."
            value={query}
            onChange={onSearchQuery}
            className="mb-4"
          />

          {isLoading || isFetching ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {query.trim()
                ? "No products found matching your search"
                : "Type to search for products"}
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 px-2 py-1 font-medium text-sm border-b">
                <div>Name</div>
                <div>Price</div>
                <div>Stock</div>
                <div>Status</div>
              </div>

              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "grid grid-cols-4 gap-2 p-2 hover:bg-muted rounded-md cursor-pointer items-center",
                    product.stock <= 0 && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (product.stock > 0) {
                      handleAddProduct({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                      });
                    }
                  }}
                >
                  <div className="font-medium truncate" title={product.name}>
                    {product.name}
                  </div>
                  <div>${product.price.toFixed(2)}</div>
                  <div>{product.stock}</div>
                  <div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        product.stock <= product.lowStockThreshold
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {product.stock <= 0
                        ? "Out of stock"
                        : product.stock <= product.lowStockThreshold
                        ? "Low stock"
                        : "In stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
