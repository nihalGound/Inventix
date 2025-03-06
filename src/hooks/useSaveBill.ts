import { useCreateBill } from "@/utils/queries";
import { useEffect, useState } from "react";

export const useSaveBill = (
  businessId: string,
  items: {
    productId: string;
    quantity: number;
  }[],
  customerEmail?: string,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
  discount?: number
) => {
  const [billId, setBillId] = useState<string>("");
  const { data, isPending, mutate } = useCreateBill(
    businessId,
    items,
    customerEmail,
    customerName,
    customerPhone,
    notes,
    discount
  );
  const { data: bill, status } = data as {
    status: number;
    data: {
      message: string;
      bill: string;
    };
  };

  useEffect(() => {
    if (!isPending && status === 201) {
      setBillId(bill.bill);
    }
  }, [isPending]);

  return {
    mutate,
    isPending,
    billId,
  };
};
