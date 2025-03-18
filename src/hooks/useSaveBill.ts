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
  const [billDate, setBillDate] = useState<Date | undefined>();
  const { data, isPending, mutate } = useCreateBill(
    businessId,
    items,
    customerEmail,
    customerName,
    customerPhone,
    notes,
    discount
  );

  // Safely check if data is available
  useEffect(() => {
    if (!isPending && data) {
      const { status, data: responseData } = data as {
        status: number;
        data: {
          message: string;
          bill: {
            billId: string;
            date: Date;
          };
        };
      };

      if (status === 201 && responseData?.bill) {
        setBillId(responseData.bill.billId);
        setBillDate(responseData.bill.date);
      }
    }
  }, [isPending, data]);

  return {
    mutate,
    isPending,
    billId,
    billDate,
    setBillId
  };
};
