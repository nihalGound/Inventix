"use server";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findUser } from "../user/query";
import {
  addBill,
  createBusiness,
  createNotification,
  createProduct,
  deleteProduct,
  fetchAnalyticsData,
  fetchPeriodSalesData,
  fetchSalesDataForDate,
  fetchSalesReport,
  findProducts,
  getBill,
  getBusiness,
  getBusinesses,
  getNotifications,
  getProduct,
  getProducts,
  getTopProductsByMonth,
  productByBarcode,
  updateNotificationStatus,
  updateProduct,
} from "./query";

export const onCurrentUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addBusiness = async (name: string, image?: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    if (existingUser.business.length && !existingUser.premium) {
      return {
        status: 401,
        data: "Upgrade plan to add more business",
      };
    }

    // Validate business name
    if (!name.trim()) {
      return {
        status: 400,
        data: "Business name cannot be empty",
      };
    }

    // Create the new business
    const newBusiness = await createBusiness(name.trim(), user.id, image);
    if (newBusiness) {
      return {
        status: 201,
        data: {
          message: "Business created successfully",
          business: newBusiness,
        },
      };
    }

    // Fallback for unexpected issues
    return {
      status: 500,
      data: "An unexpected error occurred. Business not created",
    };
  } catch (error) {
    console.error("Error adding business:", error);
    return {
      status: 500,
      data: "An error occurred while adding the business",
    };
  }
};

export const getAllBusiness = async () => {
  try {
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }
    const business = await getBusinesses(existingUser.clerkId);
    if (business) {
      return {
        status: 200,
        data: business,
      };
    }
    return {
      status: 400,
      data: [],
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: [],
    };
  }
};

export const getBusinessDetail = async (businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    const business = await getBusiness(businessId, user.id);
    if (business) {
      return {
        status: 200,
        data: {
          message: "business data fetched successfully",
          business: business,
        },
      };
    }
    return {
      status: 400,
      data: "An unexpected error occurred. Business not found",
    };
  } catch (error) {
    console.error("Error fetching business:", error);
    return {
      status: 500,
      data: "An error occurred while fetching the business",
    };
  }
};

export const addProductStock = async (
  name: string,
  price: number,
  stock: number,
  lowStockThreshold: number,
  businessId: string,
  image?: string
) => {
  try {
    if (!name || price < 0 || stock < 0 || lowStockThreshold < 0) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: {
          message: "Business not found for the current user",
        },
      };
    }

    const serialNumber = uuidv4().replace(/-/g, "").substring(0, 12);

    // Create the product
    const product = await createProduct(
      name,
      price,
      stock,
      lowStockThreshold,
      businessId,
      serialNumber,
      image
    );

    if (!product) {
      return {
        status: 500,
        data: {
          message: "Product could not be created due to an internal error",
        },
      };
    }

    return {
      status: 201,
      data: {
        message: "Product created successfully",
        product,
      },
    };
  } catch (error) {
    console.error("Error adding product stock:", error);
    return {
      status: 500,
      data: "An unexpected error occurred while adding product stock",
    };
  }
};

export const addStock = async (
  productId: string,
  businessId: string,
  stock: number
) => {
  try {
    // Validate input
    if (!productId || !businessId || stock === undefined || stock <= 0) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Ensure the product exists for the specified business
    const product = await getProduct(productId, businessId);
    if (!product) {
      return {
        status: 404,
        data: "Product not found in the database",
      };
    }

    // Update product stock
    const updatedProduct = await updateProduct(productId, { stock });
    if (!updatedProduct) {
      return {
        status: 500,
        data: "Failed to update product stock",
      };
    }

    return {
      status: 200,
      data: "Stock updated successfully",
    };
  } catch (error) {
    console.error("Error updating stock:", error);
    return {
      status: 500,
      data: "Something went wrong while updating stock",
    };
  }
};

export const updateThreshold = async (
  productId: string,
  lowStockThreshold: number,
  businessId: string
) => {
  try {
    // Validate input
    if (!productId || !businessId || lowStockThreshold < 0) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Ensure the product exists for the specified business
    const product = await getProduct(productId, businessId);
    if (!product) {
      return {
        status: 404,
        data: "Product not found in the database",
      };
    }

    // Update lowStockThreshold
    const updatedProduct = await updateProduct(productId, {
      lowStockThreshold,
    });
    if (!updatedProduct) {
      return {
        status: 500,
        data: "Failed to update product lowStockThreshold",
      };
    }

    return {
      status: 200,
      data: "Low stock threshold updated successfully",
    };
  } catch (error) {
    console.error("Error updating lowStockThreshold:", error);
    return {
      status: 500,
      data: "Something went wrong while updating the low stock threshold",
    };
  }
};

export const updateProductImage = async (
  productId: string,
  image: string,
  businessId: string
) => {
  try {
    // Validate input
    if (!productId || !businessId || !image) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Ensure the product exists for the specified business
    const product = await getProduct(productId, businessId);
    if (!product) {
      return {
        status: 404,
        data: "Product not found in the database",
      };
    }

    // Update lowStockThreshold
    const updatedProduct = await updateProduct(productId, {
      image,
    });
    if (!updatedProduct) {
      return {
        status: 500,
        data: "Failed to update product image",
      };
    }

    return {
      status: 200,
      data: "Low stock image updated successfully",
    };
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      status: 500,
      data: "Something went wrong while updating the image",
    };
  }
};

export const removeProduct = async (productId: string, businessId: string) => {
  try {
    // Validate input
    if (!productId || !businessId) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Ensure the product exists for the specified business
    const product = await getProduct(productId, businessId);
    if (!product) {
      return {
        status: 404,
        data: "Product not found in the database",
      };
    }

    // Update lowStockThreshold
    const updatedProduct = await deleteProduct(productId, businessId);
    if (!updatedProduct) {
      return {
        status: 500,
        data: "Failed to remove product",
      };
    }

    return {
      status: 200,
      data: "product removed successfully",
    };
  } catch (error) {
    console.error("Error removing product:", error);
    return {
      status: 500,
      data: "Something went wrong while removing the product",
    };
  }
};

export const updateProductPrice = async (
  productId: string,
  newPrice: number,
  businessId: string
) => {
  try {
    // Validate input
    if (!productId || !businessId || newPrice === undefined) {
      return {
        status: 400,
        data: "Invalid input data. Please check product details.",
      };
    }

    // Fetch the current user and business
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    // Ensure the product exists for the specified business
    const product = await getProduct(productId, businessId);
    if (!product) {
      return { status: 404, data: "Product not found in the database" };
    }

    // Update product price
    const updatedProduct = await updateProduct(productId, { price: newPrice });
    if (!updatedProduct) {
      return {
        status: 500,
        data: "Failed to update product price",
      };
    }

    return {
      status: 200,
      data: "Product price updated successfully",
    };
  } catch (error) {
    console.error("Error updating product price:", error);
    return {
      status: 500,
      data: "Something went wrong while updating the product price",
    };
  }
};

export const getBusinessAnalytics = async (businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    // Example of fetching analytics data (you can modify this logic to match your requirements)
    const analyticsData = await fetchAnalyticsData(businessId); // Custom function for fetching analytics data

    return { status: 200, data: analyticsData };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { status: 500, data: "Error fetching analytics data" };
  }
};

export const generateSalesReport = async (businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    // Generate the sales report based on the period (weekly, monthly, etc.)
    const salesReport = await fetchSalesReport(businessId); // Custom function for generating report

    return { status: 200, data: salesReport };
  } catch (error) {
    console.error("Error generating sales report:", error);
    return { status: 500, data: "Error generating sales report" };
  }
};

export const getSalesDataTime = async (
  businessId: string,
  start: string,
  end: string
) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    const data = await fetchSalesDataForDate(businessId, start, end);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    console.error("Error generating sales report:", error);
    return { status: 500, data: "Error generating sales report" };
  }
};

export const getSalesData = async (
  businessId: string,
  period: "30_days" | "7_days"
) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }
    const data = await fetchPeriodSalesData(businessId, period);
    return {
      status: 200,
      data: data,
    };
  } catch (error) {
    console.error("Error getting sale data:", error);
    return { status: 500, data: "Error getting sales data" };
  }
};

export const addNotification = async (
  businessId: string,
  message: string,
  type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT"
) => {
  try {
    if (!businessId || !message || !type) {
      return {
        status: 400,
        data: "Invalid input data. Please check the notification details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Create the notification
    const notification = await createNotification(businessId, message, type);
    if (!notification) {
      return {
        status: 500,
        data: "Error in notification creation",
      };
    }

    return {
      status: 201,
      data: "Notification created successfully",
    };
  } catch (error) {
    console.error("Error adding notification:", error);
    return {
      status: 500,
      data: "Something went wrong while adding the notification",
    };
  }
};

export const updateNotification = async (
  businessId: string,
  notificationId: string
) => {
  try {
    if (!businessId || !notificationId) {
      return {
        status: 400,
        data: "Invalid input data. Please check the notification details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Update the notification status
    const updatedNotification = await updateNotificationStatus(
      businessId,
      notificationId
    );
    if (!updatedNotification) {
      return {
        status: 500,
        data: "Error updating notification",
      };
    }

    return {
      status: 200,
      data: "Notification updated successfully",
    };
  } catch (error) {
    console.error("Error updating notification:", error);
    return {
      status: 500,
      data: "Something went wrong while updating the notification",
    };
  }
};

export const getAllNotification = async (businessId: string) => {
  try {
    // Validate input
    if (!businessId) {
      return {
        status: 400,
        data: "Invalid input data. Please check the notification details.",
      };
    }

    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    // Fetch notifications for the business
    const notifications = await getNotifications(businessId);
    if (notifications && notifications.length > 0) {
      return {
        status: 200,
        data: {
          message: "Notifications fetched successfully",
          notifications,
        },
      };
    } else {
      return {
        status: 404,
        data: "No notifications found for this business.",
      };
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      status: 500,
      data: "Something went wrong while fetching notifications.",
    };
  }
};

export const generateBill = async (
  businessId: string,
  items: {
    productId: string;
    quantity: number;
  }[],
  customerEmail?: string,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
  discount?: number // Discount in percentage
) => {
  try {
    // Input validation
    if (!businessId || !items || items.length === 0) {
      return {
        status: 400,
        data: {
          message: "Invalid input data. Business ID and items are required.",
          bill: null,
        },
      };
    }

    // Validate Clerk and Business
    const clerk = await onCurrentUser();
    if (!clerk) {
      return {
        status: 401,
        data: {
          message: "User not authenticated",
          bill: null,
        },
      };
    }

    const user = await findUser(clerk.id);
    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          bill: null,
        },
      };
    }

    const business = await getBusiness(businessId, clerk.id);
    if (!business) {
      return {
        status: 404,
        data: {
          message: "Business not found for the current user",
          bill: null,
        },
      };
    }

    // Calculate bill items and total amount
    let totalAmount = 0;
    const billItems: {
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];
    const errors: string[] = [];

    await Promise.all(
      items.map(async (item) => {
        try {
          const product = await getProduct(item.productId, businessId);
          if (!product) {
            errors.push(`Product with ID ${item.productId} not found.`);
            return;
          }

          const unitPrice = product.price;
          const subtotal = unitPrice * item.quantity;
          totalAmount += subtotal;

          billItems.push({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice,
            subtotal,
          });

          // Update product stock
          await updateProduct(item.productId, {
            stock: product.stock - item.quantity,
          });

          // Send low stock notification if necessary
          if (product.stock - item.quantity <= product.lowStockThreshold) {
            // Send notification for stock alert
          }
        } catch (error) {
          console.error(`Error processing item ${item.productId}:`, error);
          errors.push(`Error processing item ${item.productId}: ${error}`);
        }
      })
    );

    // Check if bill can be created
    if (billItems.length === 0) {
      return {
        status: 400,
        data: {
          message: "No valid items to create a bill.",
          bill: null,
        },
      };
    }

    // Apply discount to the total amount (if provided)
    let discountedAmount = totalAmount;
    if (discount && discount > 0) {
      discountedAmount = totalAmount - (totalAmount * discount) / 100;
    }

    // Create the bill
    const bill = await addBill(
      businessId,
      billItems,
      discountedAmount,
      customerEmail,
      customerName,
      customerPhone,
      notes
    );

    if (!bill) {
      return {
        status: 500,
        data: {
          message: "Failed to create bill.",
          bill: null,
        },
      };
    }

    return {
      status: 201,
      data: {
        message: "Bill generated successfully.",
        bill: bill.id,
      },
    };
  } catch (error) {
    console.error("Error generating bill:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while generating the bill.",
        bill: null,
      },
    };
  }
};

export const getBillDetail = async (
  billId: string,
  businessId: string,
  clerkId?: string
) => {
  try {
    if (!businessId || billId) {
      return {
        status: 400,
        data: "Invalid input data.",
      };
    }
    let user;
    if (clerkId) {
      const temp = await findUser(clerkId);
      if (!temp) {
        return { status: 401, data: "User not authenticated" };
      }
      user = temp;
    }
    // Fetch the current user
    else {
      user = await onCurrentUser();
      if (!user) {
        return { status: 401, data: "User not authenticated" };
      }
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        data: "User not found in the database",
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        data: "Business not found for the current user",
      };
    }

    const bill = await getBill(billId, businessId);
    if (bill) {
      return {
        status: 200,
        data: bill,
      };
    }
    return {
      status: 404,
      data: "Not found",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: "Not found",
    };
  }
};

export const getAllProducts = async (businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    const products = await getProducts(businessId);
    if (products) {
      return {
        status: 200,
        data: products,
      };
    }
    return {
      status: 400,
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
    };
  }
};

export const getTopProduct = async (businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    const data = await getTopProductsByMonth(businessId);
    if (data) {
      return {
        status: 200,
        data: data,
      };
    }
    return {
      status: 400,
      data: [],
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      data: [],
    };
  }
};

export const getProductbyBarcode = async (
  businessId: string,
  barcode: string
) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not authenticated" };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return { status: 404, data: "User not found in the database" };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return { status: 404, data: "Business not found for the current user" };
    }

    const product = await productByBarcode(barcode, businessId);
    if (product) {
      return {
        status: 200,
        data: product,
      };
    }

    return {
      status: 400,
      data: "Product not found",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: "Something went wrong",
    };
  }
};

export const searchProducts = async (value: string, businessId: string) => {
  try {
    // Fetch the current user
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, message: "User not authenticated", data: [] };
    }

    // Ensure the user exists in the database
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 404,
        message: "User not found in the database",
        data: [],
      };
    }

    // Ensure the business belongs to the current user
    const business = await getBusiness(businessId, user.id);
    if (!business) {
      return {
        status: 404,
        message: "Business not found for the current user",
        data: [],
      };
    }
    const products = await findProducts(value, businessId);
    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: [],
    };
  }
};
