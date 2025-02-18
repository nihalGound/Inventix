"use client";

import { BillInterface } from "./_components/BillInterface";
import { BarcodeScanner } from "./_components/BarcodeScanner";

export default function CreateBillPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Bill</h1>
      <BillInterface />
      <BarcodeScanner />
    </div>
  );
}
