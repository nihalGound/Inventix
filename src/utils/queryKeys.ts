export const queryKeys = {
  businessAnalytics: (businessId: string) => [
    "business",
    businessId,
    "analytics",
  ],
  salesReport: (businessId: string) => ["business", businessId, "salesReport"],
  salesData: (businessId: string, period: string) => [
    "salesData",
    businessId,
    period,
  ],
  salesDataPeriod: (businessId: string, start: string, end: string) => [
    "salesDataPeriod",
    businessId,
    start,
    end,
  ],
  notifications: (businessId: string) => [
    "business",
    businessId,
    "notifications",
  ],
  topProducts: (businessId: string) => ["business", businessId, "top-products"],
  userProfile: () => ["user-profile"],
  onBoardUser: () => ["onboardUser"],
  allProducts: (businessId: string) => ["business", businessId, "products"],
  getProduct: (productId: string, businessId: string) => [
    "business",
    productId,
    "productId",
    businessId,
  ],
  getAllBusiness: () => ["businesses"],
  getBusinessDetail: (businessId: string) => ["business",businessId],
  createBill: (businessId: string) => ["business", businessId, "create-bill"],
  getBills: (businessId: string) => ["business", businessId, "get-bills"],
  getBarcodeDetail: (barcode: string, businessId: string) => [
    "barcode",
    barcode,
    businessId,
  ],
  searchProduct: (value: string, businessId: string) => [
    "search-product",
    value,
    businessId,
  ],
  createProduct: (businessId: string) => ["create-product", businessId],
};
