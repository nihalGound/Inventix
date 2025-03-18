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

export const getBusinesses = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId: clerkId,
    },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
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
  barcode: string,
  image?: string
) => {
  return await client.product.create({
    data: {
      name,
      lowStockThreshold,
      price,
      stock,
      businessId,
      barcode,
      image: image || "",
    },
  });
};

export const getProducts = async (businessId: string) => {
  return await client.product.findMany({
    where: {
      businessId: businessId,
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

export const productByBarcode = async (barcode: string, businessId: string) => {
  return await client.product.findFirst({
    where: {
      businessId,
      barcode,
    },
  });
};

export const findProducts = async (value: string, businessId: string) => {
  return await client.product.findMany({
    where: {
      businessId: businessId,
      OR: [
        {
          name: {
            contains: value,
            mode: "insensitive",
          },
        },
        {
          barcode: {
            contains: value,
            mode: "insensitive",
          },
        },
      ],
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

export const getTopProductsByMonth = async (businessId: string) => {
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
};

export const getLowStockProduct = async (businessId: string) => {
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

  const topProductByMonth = await getTopProductsByMonth(businessId);

  const lowStock = await getLowStockProduct(businessId);

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

export const fetchPeriodSalesData = async (
  businessId: string,
  period: string
) => {
  const startDate = getStartDate(period);
  const endDate = new Date(); // Current date

  // Fetch the sales data for the given period
  return await client.sale.findMany({
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};

export const fetchSalesDataForDate = async (
  businessId: string,
  start: string,
  end: string
) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return await client.sale.findMany({
    where: {
      businessId: businessId,
      soldAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};

export const fetchSalesReport = async (businessId: string) => {
  // Determine the date range for the specified period
  // Fetch the sales data for the given period
  const salesData = await client.sale.findMany({
    where: {
      businessId: businessId,
    },
  });

  // Fetch the total number of orders within the period
  const totalOrders = await client.sale.count({
    where: {
      businessId: businessId,
    },
  });

  // Fetch top products by quantity sold
  const productByQuant = await client.sale.groupBy({
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
    take: 3, // Get the top 3 products
  });

  const productId1 = productByQuant.map((p) => p.productId);

  const productDetailsByQuantity = await client.product.findMany({
    where: {
      id: { in: productId1 },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Combine the data
  const topProductByQuantity = productByQuant.map((item) => {
    const productDetail = productDetailsByQuantity.find(
      (product) => product.id === item.productId
    );
    return {
      productId: item.productId,
      name: productDetail?.name || "Unknown",
      quantity: item._sum.quantity || 0,
    };
  });

  // Step 2: Fetch top products by revenue
  const productByReven = await client.sale.groupBy({
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
    take: 3, // Get the top 3 products
  });

  const productId2 = productByReven.map((p) => p.productId);

  const productDetailsByRevenue = await client.product.findMany({
    where: {
      id: { in: productId2 },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Combine the data
  const topProductByRevenue = productByReven.map((item) => {
    const productDetail = productDetailsByRevenue.find(
      (product) => product.id === item.productId
    );
    return {
      productId: item.productId,
      name: productDetail?.name || "Unknown",
      revenue: item._sum.totalPrice || 0,
    };
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
    select: {
      createdAt: true,
      id: true,
      readAt: true,
      status: true,
      type: true,
      message: true,
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
  });
};

export const getBill = async (billId: string, businessId: string) => {
  return await client.bill.findFirst({
    where: {
      id: billId,
      businessId: businessId,
    },
  });
};

export const addSale = async (
  productId: string,
  businessId: string,
  quantity: number,
  totalPrice: number
) => {
  return await client.sale.create({
    data: {
      quantity,
      totalPrice,
      businessId,
      productId,
    },
  });
};
