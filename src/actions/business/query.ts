import { client } from "@/lib/db";
import { getStartDateForPeriod } from "@/lib/utils";

export const createBusiness = async (
  name: string,
  clerkId: string,
  image?: string
) => {
  return await client.business.create({
    data: {
      name: name,
      image: image || "",
      userId: clerkId,
    },
  });
};

export const getBusiness = async (businessId: string, clerkId: string) => {
  return await client.business.findFirst({
    where: {
      id: businessId,
      userId: clerkId,
    },
  });
};

export const createProduct = async (
  name: string,
  price: number,
  stock: number,
  lowStockThreshold: number,
  businessId: string,
  image?: string
) => {
  return await client.product.create({
    data: {
      name,
      lowStockThreshold,
      price,
      stock,
      businessId,
      image: image || "",
    },
  });
};

export const getProduct = async (productId: string, businessId: string) => {
  return await client.product.findFirst({
    where: {
      businessId,
      id: productId,
    },
  });
};

export const updateProduct = async (
  productId: string,
  args: {
    name?: string;
    stock?: number;
    image?: string;
    lowStockThreshold?: number;
    price?: number;
  }
) => {
  return await client.product.update({
    where: {
      id: productId,
    },
    data: {
      ...(args.name && { name: args.name }),
      ...(args.stock !== undefined && { stock: { increment: args.stock } }),
      ...(args.image && { image: args.image }),
      ...(args.lowStockThreshold !== undefined && {
        lowStockThreshold: args.lowStockThreshold,
      }),
      ...(args.price !== undefined && { price: args.price }),
    },
  });
};

export const deleteProduct = async (productId: string, businessId: string) => {
  return await client.product.delete({
    where: {
      id: productId,
      businessId: businessId,
    },
  });
};

export const fetchAnalyticsData = async (businessId: string) => {
  // Fetch the sales data for the given business
  const totalSales = await client.sale.aggregate({
    where: {
      businessId: businessId,
    },
    _sum: {
      totalPrice: true,
    },
  });

  // Fetch the total number of products in the business
  const totalProducts = await client.product.count({
    where: {
      businessId: businessId,
    },
  });

  // Fetch the number of orders
  const totalOrders = await client.sale.count({
    where: {
      businessId: businessId,
    },
  });

  const topProductByQuantity = await client.sale.groupBy({
    by: ["productId"],
    where: {
      businessId: businessId,
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 3, // Get top product
  });

  const topProductByRevenue = await client.sale.groupBy({
    by: ["productId"],
    where: {
      businessId: businessId,
    },
    _sum: {
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        totalPrice: "desc",
      },
    },
    take: 3, // Get top product
  });

  return {
    totalSales: totalSales._sum.totalPrice || 0,
    totalProducts,
    totalOrders,
    topProductByQuantity,
    topProductByRevenue,
  };
};

export const fetchSalesReport = async (businessId: string, period: string) => {
  // Determine the date range for the specified period
  const startDate = getStartDateForPeriod(period);
  const endDate = new Date(); // Current date

  // Fetch the sales data for the given period
  const salesData = await client.sale.findMany({
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Summarize the sales data (e.g., total sales, average sales, etc.)
  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const averageSales = totalSales / salesData.length || 0;

  // Example of additional sales data (you can modify this as per your requirements)
  return {
    totalSales,
    averageSales,
    salesData,
  };
};

export const createNotification = async (
  businessId: string,
  message: string,
  type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT"
) => {
  return await client.notification.create({
    data: {
      businessId: businessId,
      message: message,
      type: type,
      status: "UNREAD",
    },
  });
};

export const updateNotificationStatus = async (
  businessId: string,
  notificationId: string
) => {
  return await client.notification.update({
    where: {
      id: notificationId,
      businessId: businessId,
    },
    data: {
      status: "READ",
    },
  });
};

export const getNotifications = async (businesssId: string) => {
  return await client.notification.findMany({
    where: {
      businessId: businesssId,
      status: "UNREAD",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const addBill = async (
  businessId: string,
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount?: number;
  }[],
  totalAmount: number,
  customerEmail?: string,
  customerName?: string,
  customerPhone?: string,
  notes?: string
) => {
  return await client.bill.create({
    data: {
      businessId: businessId,
      ...(customerName && { customerName }),
      ...(customerEmail && { customerEmail }),
      ...(customerPhone && { customerPhone }),
      ...(notes && { notes }),
      totalAmount,
      billItems: {
        create: items,
      },
    },
    include: {
      billItems: true,
    },
  });
};
