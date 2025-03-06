"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Product, useBillStore } from "@/store/bill";
import { useGetBarcodeDetail } from "@/utils/queries";
import { toast } from "sonner";

export function BarcodeScanner({ businessId }: { businessId: string }) {
  const { isScannerOpen, addProduct, setIsScannerOpen } = useBillStore(
    (state) => state
  );
  const [scanning, setScanning] = useState(false);
  const [scanValue, setScanValue] = useState<string>("");

  const { data, isLoading } = useGetBarcodeDetail(businessId, scanValue, {
    enabled: !!scanValue,
  });

  const { data: productData, status } = data as {
    status: number;
    data: {
      businessId: string;
      barcode: string;
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      image: string | null;
      price: number;
      stock: number;
      lowStockThreshold: number;
    };
  };

  useEffect(() => {
    if (status === 200 && productData) {
      const product: Product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        quantity: 1,
      };
      addProduct(product);
      toast.success("Product added successfully!");
      setScanValue("");
    } else if (scanValue) {
      toast.error("Product not found. Please scan a valid barcode.");
      setScanValue("");
    }
  }, [productData, scanValue, status, addProduct]);

  useEffect(() => {
    if (isScannerOpen) {
      setScanning(true);
    } else {
      setScanning(false);
    }
  }, [isScannerOpen]);

  const handleError = (error: string | DOMException) => {
    console.error("QR Scanner Error:", error);
  };

  return (
    <Dialog open={isScannerOpen} onOpenChange={() => setIsScannerOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {scanning && !isLoading && (
            <BarcodeScannerComponent
              onUpdate={(_, result) => result && setScanValue(result.getText())}
              onError={handleError}
              facingMode="environment"
              width={"100%"}
              height={"100%"}
            />
          )}
          {isLoading && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Processing barcode...</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsScannerOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
