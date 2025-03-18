import { onBoardUser, upgradeUser, userProfile } from "@/actions/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import {
  addProductStock,
  generateBill,
  generateSalesReport,
  getAllBusiness,
  getAllNotification,
  getAllProducts,
  getBusinessAnalytics,
  getBusinessDetail,
  getProductbyBarcode,
  getSalesData,
  getSalesDataTime,
  getTopProduct,
  searchProducts,
} from "@/actions/business";
import { toast } from "sonner";

//user:

export const useOnBoardUser = () => {
  const queryCliet = useQueryClient();
  return useMutation({
    mutationFn: onBoardUser,
    onSuccess: () => {
      console.log("Success");
      queryCliet.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
    onError: (error) => {
      console.log("error in react query : ", error);
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryFn: userProfile,
    queryKey: queryKeys.userProfile(),
  });
};

export const useUpgradeUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upgradeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

//businesses:

export const useBusinessAnalytics = (businessId: string) => {
  return useQuery({
    queryFn: () => getBusinessAnalytics(businessId),
    queryKey: queryKeys.businessAnalytics(businessId),
    staleTime: 60 * 5 * 1000,
  });
};

export const useSalesReport = (businessId: string) => {
  return useQuery({
    queryFn: () => generateSalesReport(businessId),
    queryKey: queryKeys.salesReport(businessId),
  });
};

export const useSalesDataPeriod = (
  businessId: string,
  start: string,
  end: string
) => {
  return useQuery({
    queryFn: () => getSalesDataTime(businessId, start, end),
    queryKey: queryKeys.salesDataPeriod(businessId, start, end),
  });
};
export const useSalesData = (
  businessId: string,
  period: "7_days" | "30_days"
) => {
  return useQuery({
    queryFn: () => getSalesData(businessId, period),
    queryKey: queryKeys.salesData(businessId, period),
  });
};

export const useNotifications = (businessid: string) => {
  return useQuery({
    queryFn: () => getAllNotification(businessid),
    queryKey: queryKeys.notifications(businessid),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopProducts = (businessId: string) => {
  return useQuery({
    queryFn: () => getTopProduct(businessId),
    queryKey: queryKeys.topProducts(businessId),
  });
};

export const useGetAllProducts = (businessId: string) => {
  return useQuery({
    queryKey: queryKeys.allProducts(businessId),
    queryFn: () => getAllProducts(businessId),
  });
};

export const useGetAllBusiness = () => {
  return useQuery({
    queryKey: queryKeys.getAllBusiness(),
    queryFn: getAllBusiness,
  });
};

export const useGetBusiness = (businessId: string) => {
  return useQuery({
    queryKey: queryKeys.getBusinessDetail(businessId),
    queryFn: () => getBusinessDetail(businessId),
  });
};

export const useCreateBill = (
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
  const client = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.createBill(businessId),
    mutationFn: () =>
      generateBill(
        businessId,
        items,
        customerEmail,
        customerName,
        customerPhone,
        notes,
        discount
      ),
    onSuccess: (data: {
      status: number;
      data: {
        message: string;
        bill: {
          billId: string;
          date: Date;
        } | null;
      };
    }) => {
      // Handle success response
      toast(data.status === 201 ? "Success" : "Error", {
        description: data.data?.message,
      });
    },
    onError: () => {
      // Handle API errors
      toast("Error", {
        description: "An unexpected error occurred.",
      });
    },
    onSettled: async () => {
      // Invalidate the cache to refresh data
      await client.invalidateQueries({
        queryKey: queryKeys.getBills(businessId),
        exact: true,
      });
    },
  });
};

export const useGetBarcodeDetail = (
  businessId: string,
  barcode: string,
  options = {}
) => {
  return useQuery({
    queryKey: queryKeys.getBarcodeDetail(barcode, businessId),
    queryFn: () => getProductbyBarcode(businessId, barcode),
    ...options,
  });
};

export const useSearchProduct = (value: string, businessId: string) => {
  return useQuery({
    queryKey: queryKeys.searchProduct(value, businessId),
    queryFn: () => searchProducts(value, businessId),
  });
};

export const useAddProduct = (
  name: string,
  price: number,
  stock: number,
  lowStockThreshold: number,
  businessId: string,
  image?: string
) => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.createProduct(businessId),
    mutationFn: () =>
      addProductStock(name, price, stock, lowStockThreshold, businessId, image),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.allProducts(businessId) });
    },
  });
};
