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
import debounce from "lodash.debounce";
import { Product, useBillStore } from "@/store/bill";
import { X } from "lucide-react";
import { DownloadableInvoice } from "./PrintableInvoice";

export function BillInterface() {
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
  } = useBillStore((state) => state);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateProductQuantity(id, quantity);
  };

  // const handlePrint = () => {
  //   const printWindow = window.open("", "_blank");
  //   if (printWindow) {
  //     printWindow.document.write(
  //       "<html><head><title>Invoice</title></head><body>"
  //     );
  //     printWindow.document.write('<div id="printable-invoice"></div>');
  //     printWindow.document.write("</body></html>");
  //     printWindow.document.close();

  //     const invoiceContainer =
  //       printWindow.document.getElementById("printable-invoice");
  //     if (invoiceContainer) {
  //       const invoiceElement = React.createElement(PrintableInvoice, {
  //         customerName,
  //         customerContact,
  //         products,
  //         discount,
  //         total: calculateTotal(),
  //       });

  //       // Create root and render using modern React API
  //       const root = createRoot(invoiceContainer);
  //       root.render(invoiceElement);
  //     }

  //     printWindow.print();
  //   }
  // };

  const handleSaveBill = async () => {
    const billData = {
      customerName,
      customerEmail,
      customerPhone,
      products,
      discount,
      total,
    };
    console.log("Saving bill:", billData);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Bill saved successfully!");
  };

  const debouncedSearch = debounce(async (term: string) => {
    setIsLoading(true);
    // Simulate API call with ${term}
    // console.log(term);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const results = [
      { id: "1", name: `Product 1`, price: 10, quantity: 1 },
      { id: "2", name: `Product 2`, price: 20, quantity: 1 },
      { id: "3", name: `Product 3`, price: 30, quantity: 1 },
    ];
    setSearchResults(results);
    setIsLoading(false);
  }, 300);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleAddProduct = (product: Product) => {
    addProduct(product);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
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
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer contact"
              />
            </div>
            <div>
              <Label htmlFor="customer-number">Customer Phone</Label>
              <Input
                id="customer-number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter customer contact"
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
          <div className="flex justify-between mb-4">
            <Button onClick={() => setIsSearchOpen(true)}>Add Product</Button>
            <Button onClick={() => setIsScannerOpen(true)}>Scan Product</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
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
                          Number.parseInt(e.target.value)
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
                    <Button onClick={() => removeProduct(product.id)}>
                      <X /> Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount in %</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number.parseFloat(e.target.value))}
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label>Total</Label>
              <div className="text-2xl font-bold">{total}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4">
        <DownloadableInvoice
          customerEmail={customerEmail}
          customerName={customerName}
          customerPhone={customerPhone}
          discount={discount}
          products={products}
          total={total}
          businessName="Business A"
        />
        <Button onClick={handleSaveBill}>Save Bill</Button>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="mt-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100/10 cursor-pointer"
                  onClick={() => handleAddProduct(product)}
                >
                  <span>{product.name}</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
