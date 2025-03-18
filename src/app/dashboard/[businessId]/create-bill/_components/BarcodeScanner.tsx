"use client";

import { useState, useEffect, useCallback } from "react";
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

interface ProductData {
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
}

export function BarcodeScanner({ businessId }: { businessId: string }) {
  const { isScannerOpen, addProduct, setIsScannerOpen } = useBillStore(
    (state) => state
  );
  const [scanning, setScanning] = useState(false);
  const [scanValue, setScanValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading } = useGetBarcodeDetail(businessId, scanValue);

  const handleAddProduct = useCallback(() => {
    if (data?.status === 200 && data?.data) {
      const productData: ProductData = data.data;
      const product: Product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        quantity: 1,
      };
      addProduct(product);
      toast.success("Product added successfully!");
      setIsScannerOpen(false)
    } else {
      toast.error("Product not found. Please scan a valid barcode.");
    }
    setScanValue("");
    setIsProcessing(false); // Allow the next scan after processing
  }, [data, addProduct]);

  useEffect(() => {
    if (scanValue && !isProcessing) {
      setIsProcessing(true);
      handleAddProduct();
    }
  }, [scanValue, handleAddProduct, isProcessing]);

  useEffect(() => {
    setScanning(isScannerOpen);
  }, [isScannerOpen]);

  const handleScannerError = useCallback((error: string | DOMException) => {
    console.error("QR Scanner Error:", error);
    toast.error("Scanner encountered an error. Please try again.");
  }, []);

  const handleScan = useCallback(
    (result: string) => {
      if (result && !isProcessing) {
        setScanValue(result);
      }
    },
    [isProcessing]
  );

  return (
    <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>

        {scanning && !isLoading && (
          <BarcodeScannerComponent
            onUpdate={(err, result) => {
              if (result) handleScan(result.getText());
            }}
            onError={handleScannerError}
            facingMode="environment"
            width="100%"
            height={250}
          />
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mb-4" />
            <p>Processing barcode...</p>
          </div>
        )}
        {!scanning && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Scanner is inactive. Open the scanner to scan barcodes.</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsScannerOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
