"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddProduct } from "@/utils/queries";
import React, { useState } from "react";

function AddProductModal({ businessId }: { businessId: string }) {
  const [detail, setDetail] = useState<{
    name: string;
    price: string;
    stock: string;
    lowStockThreshold: string;
    image?: File | null;
  }>({
    name: "",
    price: "",
    stock: "",
    lowStockThreshold: "",
    image: null,
  });

  const handleInputChange = (key: string, value: string) => {
    setDetail((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDetail((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const { mutate, isPending, isError, isSuccess } = useAddProduct(
    detail.name,
    parseFloat(detail.price) || 0,
    parseInt(detail.stock, 10) || 0,
    parseInt(detail.lowStockThreshold, 10) || 0,
    businessId,
    detail.image ? URL.createObjectURL(detail.image) : undefined
  );

  return (
    <div className="flex flex-col p-4 gap-4">
      <div>
        <Label htmlFor="product-name">Product Name:</Label>
        <Input
          id="product-name"
          placeholder="Enter product name"
          className="w-full text-sm"
          value={detail.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="price">Price:</Label>
        <Input
          id="price"
          placeholder="$ 10.0"
          className="w-full text-sm"
          value={detail.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock:</Label>
        <Input
          id="stock"
          placeholder="10"
          className="w-full text-sm"
          value={detail.stock}
          onChange={(e) => handleInputChange("stock", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="low-stock">Low Stock Threshold:</Label>
        <Input
          id="low-stock"
          placeholder="2"
          className="w-full text-sm"
          value={detail.lowStockThreshold}
          onChange={(e) =>
            handleInputChange("lowStockThreshold", e.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="image-upload">Product Image:</Label>
        <Input
          id="image-upload"
          type="file"
          className="w-full text-sm"
          onChange={handleFileChange}
        />
      </div>

      <Button
        type="submit"
        onClick={() => {
          mutate();
        }}
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add Product"}
      </Button>

      {isSuccess && (
        <p className="text-green-600">Product added successfully!</p>
      )}
      {isError && (
        <p className="text-red-600">Failed to add product. Try again.</p>
      )}
    </div>
  );
}

export default AddProductModal;
