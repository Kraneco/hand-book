import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  createdAt: Date;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [
    {
      id: "1",
      name: "法棍收纳册",
      category: "收纳册",
      price: 89,
      stock: 50,
      description: "法式风格收纳册，配2个环扣",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "A6收纳册",
      category: "收纳册",
      price: 45,
      stock: 100,
      description: "A6尺寸收纳册，配2个环扣",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      name: "A7收纳册",
      category: "收纳册",
      price: 35,
      stock: 80,
      description: "A7尺寸收纳册，配1个环扣",
      createdAt: new Date("2024-01-25"),
    },
    {
      id: "4",
      name: "小面包收纳册",
      category: "收纳册",
      price: 28,
      stock: 120,
      description: "小面包造型收纳册，配1个环扣",
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "5",
      name: "TN收纳册",
      category: "收纳册",
      price: 75,
      stock: 60,
      description: "TN风格收纳册，配2个环扣",
      createdAt: new Date("2024-02-05"),
    },
  ],
  loading: false,
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}));
