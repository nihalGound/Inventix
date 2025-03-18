import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BillStore {
  products: Product[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  discount: number;
  isScannerOpen: boolean;
  total: number;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  setCustomerName: (name: string) => void;
  setCustomerEmail: (email: string) => void;
  setCustomerPhone: (phone: string) => void;
  setDiscount: (discount: number) => void;
  setIsScannerOpen: (val: boolean) => void;
  resetStore: () => void;
}

export const useBillStore = create<BillStore>((set) => ({
  products: [],
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  discount: 0,
  isScannerOpen: false,
  total: 0,
  addProduct: (product: Product) => {
    set((state) => {
      const newTotal = state.total + product.quantity * product.price;
      return {
        products: [...state.products, product],
        total: newTotal,
      };
    });
  },
  removeProduct: (productId: string) => {
    set((state) => {
      const productToRemove = state.products.find(
        (product) => product.id === productId
      );
      if (productToRemove) {
        const updatedProduct = state.products.filter(
          (product) => product.id !== productId
        );
        const updatedTotal =
          state.total - productToRemove.price * productToRemove.quantity;
        return {
          products: updatedProduct,
          total: updatedTotal,
        };
      }
      return state;
    });
  },
  updateProductQuantity: (productId: string, quantity: number) => {
    set((state) => {
      const productToUpdate = state.products.find(
        (product) => product.id === productId
      );
      if (productToUpdate) {
        const updatedProduct = state.products.map((product) =>
          product.id === productId ? { ...product, quantity } : product
        );
        const newTotal = updatedProduct.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );
        return {
          products: updatedProduct,
          total: newTotal,
        };
      }
      return state;
    });
  },
  setCustomerName: (name: string) =>
    set(() => ({
      customerName: name,
    })),
  setCustomerEmail: (email: string) =>
    set(() => ({
      customerEmail: email,
    })),
  setCustomerPhone: (phone: string) =>
    set(() => ({
      customerPhone: phone,
    })),
  setDiscount: (discount: number) => {
    set((state) => {
      const discountPrice = (discount / 100) * state.total;
      const newTotal = state.total - discountPrice;
      return {
        discount: discount,
        total: newTotal,
      };
    });
  },
  setIsScannerOpen: (val) =>
    set(() => ({
      isScannerOpen: val,
    })),
  resetStore: () => {
    set(() => {
      return {
        discount: 0,
        total: 0,
        customerEmail: "",
        customerName: "",
        customerPhone: "",
        products: [],
      };
    });
  },
}));
