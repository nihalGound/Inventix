import { client } from "@/lib/db";
import { startOfMonth, subMonths, format, subDays } from "date-fns";

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

interface TopProduct {
  name: string;
  revenue: number;
}

interface MonthlyTopProducts {
  month: string;
  products: TopProduct[];
}

export async function getTopProductsByMonth(
  businessId: string
): Promise<MonthlyTopProducts[]> {
  // Get start date (6 months ago from current date)
  const startDate = startOfMonth(subMonths(new Date(), 5));

  const sales = await client.sale.findMany({
    where: {
      businessId,
      soldAt: {
        gte: startDate,
      },
    },
    select: {
      soldAt: true,
      totalPrice: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      soldAt: "desc",
    },
  });

  // Group sales by month and calculate revenue per product
  const monthlyProducts = sales.reduce<
    Record<string, Record<string, TopProduct>>
  >((months, sale) => {
    const month = format(sale.soldAt, "MMMM");
    const productId = sale.product.id;

    if (!months[month]) {
      months[month] = {};
    }

    if (!months[month][productId]) {
      months[month][productId] = {
        name: sale.product.name,
        revenue: 0,
      };
    }

    months[month][productId].revenue += sale.totalPrice;
    return months;
  }, {});

  // Transform the data into the required format with top 3 products per month
  const result = Object.entries(monthlyProducts).map(([month, products]) => ({
    month,
    products: Object.values(products)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map((product) => ({
        name: product.name,
        revenue: Number(product.revenue.toFixed(2)),
      })),
  }));

  // Sort months chronologically
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return result.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );
}

export async function getLowStockProduct(businessId: string) {
  return await client.product.findMany({
    where: {
      businessId: businessId,
      stock: {
        lte: client.product.fields.lowStockThreshold,
      },
    },
    orderBy: {
      stock: "asc",
    },
    take: 5,
  });
}

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

  const topProductByMonth = getTopProductsByMonth(businessId);

  const lowStock = getLowStockProduct(businessId);

  return {
    totalSales: totalSales._sum.totalPrice || 0,
    totalProducts,
    topProductByMonth,
    lowStock,
  };
};

const getStartDate = (period: string): Date => {
  switch (period) {
    case "30_days":
      return subDays(new Date(), 30);
    case "7_days":
      return subDays(new Date(), 7);
    default:
      throw new Error(
        "Invalid period. Valid options are '30_days' or '7_days'."
      );
  }
};

export const fetchSalesReport = async (businessId: string, period: string) => {
  // Determine the date range for the specified period
  const startDate = getStartDate(period);
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

  // Fetch the total number of orders within the period
  const totalOrders = await client.sale.count({
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Fetch top products by quantity sold
  const topProductByQuantity = await client.sale.groupBy({
    by: ["productId"],
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 3, // Get the top 3 products
  });

  // Fetch top products by revenue generated
  const topProductByRevenue = await client.sale.groupBy({
    by: ["productId"],
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        totalPrice: "desc",
      },
    },
    take: 3, // Get the top 3 products
  });

  // Summarize the sales data (e.g., total sales, average sales, etc.)
  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const averageSales = totalSales / salesData.length || 0;

  // Return the report with summarized data and details
  return {
    totalSales,
    averageSales,
    totalOrders,
    topProductByQuantity,
    topProductByRevenue,
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
  }[],
  totalAmount: number,
  customerEmail?: string,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
  discount?: number
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
      discount,
    },
    include: {
      billItems: true,
    },
  });
};
