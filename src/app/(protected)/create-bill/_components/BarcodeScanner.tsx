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

export function BarcodeScanner() {
  const { isScannerOpen, addProduct, setIsScannerOpen } = useBillStore(
    (state) => state
  );
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isScannerOpen) {
      setScanning(true);
    } else {
      setScanning(false);
    }
  }, [isScannerOpen]);

  const handleScan = async (result: string | null) => {
    if (result) {
      setLoading(true);
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        //support this product foudn after api call for product details;
        const product: Product = {
          id: result,
          name: "Temporary Product",
          price: 10,
          quantity: 1,
        };
        addProduct(product);
      } catch (error) {
        console.error("Error processing barcode:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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
          {scanning && !loading && (
            <BarcodeScannerComponent
              onUpdate={(_, result) => result && handleScan(result.getText())}
              onError={handleError}
              facingMode="environment"
              width={"100%"}
              height={"100%"}
            />
          )}
          {loading && (
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
