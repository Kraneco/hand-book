import { create } from "zustand";

export interface MaterialTransaction {
  id: string;
  date: Date;
  type: "in" | "out";
  quantity: number;
  unitPrice: number;
  supplier?: string;
  orderId?: string;
  notes?: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  parentId?: string;
  stock: number;
  averagePrice: number;
  isStockSufficient: boolean;
  transactions: MaterialTransaction[];
  children?: Material[];
}

interface MaterialState {
  materials: Material[];
  loading: boolean;
  setMaterials: (materials: Material[]) => void;
  addTransaction: (
    materialId: string,
    transaction: Omit<MaterialTransaction, "id">
  ) => void;
  updateStock: (
    materialId: string,
    quantity: number,
    type: "in" | "out"
  ) => void;
  setLoading: (loading: boolean) => void;
}

// 初始化材料数据
const initialMaterials: Material[] = [
  {
    id: "plastic-a4",
    name: "磨砂塑料皮A4",
    category: "塑料皮",
    stock: 500,
    averagePrice: 2.5,
    isStockSufficient: true,
    transactions: [
      {
        id: "t1",
        date: new Date("2024-01-10"),
        type: "in",
        quantity: 1000,
        unitPrice: 2.3,
        supplier: "华南塑料厂",
        notes: "新年补货",
      },
      {
        id: "t2",
        date: new Date("2024-01-15"),
        type: "out",
        quantity: 500,
        unitPrice: 2.3,
        orderId: "ORDER001",
        notes: "法棍收纳册生产",
      },
    ],
  },
  {
    id: "sulfuric-a4",
    name: "硫酸纸A4",
    category: "硫酸纸",
    stock: 800,
    averagePrice: 0.8,
    isStockSufficient: true,
    transactions: [
      {
        id: "t3",
        date: new Date("2024-01-12"),
        type: "in",
        quantity: 2000,
        unitPrice: 0.75,
        supplier: "纸业有限公司",
      },
      {
        id: "t4",
        date: new Date("2024-01-20"),
        type: "out",
        quantity: 1200,
        unitPrice: 0.75,
        orderId: "ORDER002",
        notes: "A6/A7/法棍/TN收纳册生产",
      },
    ],
  },
  {
    id: "sulfuric-b5",
    name: "硫酸纸B5",
    category: "硫酸纸",
    stock: 300,
    averagePrice: 0.6,
    isStockSufficient: false,
    transactions: [
      {
        id: "t5",
        date: new Date("2024-01-08"),
        type: "in",
        quantity: 1000,
        unitPrice: 0.55,
        supplier: "纸业有限公司",
      },
      {
        id: "t6",
        date: new Date("2024-01-25"),
        type: "out",
        quantity: 700,
        unitPrice: 0.55,
        orderId: "ORDER003",
        notes: "小面包收纳册生产",
      },
    ],
  },
  {
    id: "transparent-ring",
    name: "透明环",
    category: "环扣",
    stock: 0,
    averagePrice: 1.2,
    isStockSufficient: true,
    transactions: [],
    children: [
      {
        id: "ring-pink",
        name: "粉色透明环",
        category: "环扣",
        parentId: "transparent-ring",
        stock: 200,
        averagePrice: 1.2,
        isStockSufficient: true,
        transactions: [
          {
            id: "t7",
            date: new Date("2024-01-05"),
            type: "in",
            quantity: 500,
            unitPrice: 1.1,
            supplier: "五金配件厂",
          },
          {
            id: "t8",
            date: new Date("2024-01-18"),
            type: "out",
            quantity: 300,
            unitPrice: 1.1,
            orderId: "ORDER004",
            notes: "收纳册配件",
          },
        ],
      },
      {
        id: "ring-blue",
        name: "蓝色透明环",
        category: "环扣",
        parentId: "transparent-ring",
        stock: 150,
        averagePrice: 1.2,
        isStockSufficient: true,
        transactions: [
          {
            id: "t9",
            date: new Date("2024-01-05"),
            type: "in",
            quantity: 400,
            unitPrice: 1.1,
            supplier: "五金配件厂",
          },
          {
            id: "t10",
            date: new Date("2024-01-22"),
            type: "out",
            quantity: 250,
            unitPrice: 1.1,
            orderId: "ORDER005",
          },
        ],
      },
      {
        id: "ring-yellow",
        name: "黄色透明环",
        category: "环扣",
        parentId: "transparent-ring",
        stock: 180,
        averagePrice: 1.2,
        isStockSufficient: true,
        transactions: [
          {
            id: "t11",
            date: new Date("2024-01-05"),
            type: "in",
            quantity: 300,
            unitPrice: 1.1,
            supplier: "五金配件厂",
          },
          {
            id: "t12",
            date: new Date("2024-01-28"),
            type: "out",
            quantity: 120,
            unitPrice: 1.1,
            orderId: "ORDER006",
          },
        ],
      },
      {
        id: "ring-black",
        name: "黑色透明环",
        category: "环扣",
        parentId: "transparent-ring",
        stock: 220,
        averagePrice: 1.2,
        isStockSufficient: true,
        transactions: [
          {
            id: "t13",
            date: new Date("2024-01-05"),
            type: "in",
            quantity: 400,
            unitPrice: 1.1,
            supplier: "五金配件厂",
          },
          {
            id: "t14",
            date: new Date("2024-02-01"),
            type: "out",
            quantity: 180,
            unitPrice: 1.1,
            orderId: "ORDER007",
          },
        ],
      },
      {
        id: "ring-transparent",
        name: "透明透明环",
        category: "环扣",
        parentId: "transparent-ring",
        stock: 100,
        averagePrice: 1.2,
        isStockSufficient: false,
        transactions: [
          {
            id: "t15",
            date: new Date("2024-01-05"),
            type: "in",
            quantity: 200,
            unitPrice: 1.1,
            supplier: "五金配件厂",
          },
          {
            id: "t16",
            date: new Date("2024-02-03"),
            type: "out",
            quantity: 100,
            unitPrice: 1.1,
            orderId: "ORDER008",
          },
        ],
      },
    ],
  },
];

export const useMaterialStore = create<MaterialState>((set, get) => ({
  materials: initialMaterials,
  loading: false,
  setMaterials: (materials) => set({ materials }),
  addTransaction: (materialId, transaction) =>
    set((state) => {
      const newTransaction = { ...transaction, id: Date.now().toString() };
      const updateMaterial = (materials: Material[]): Material[] =>
        materials.map((material) => {
          if (material.id === materialId) {
            const newTransactions = [...material.transactions, newTransaction];
            const newStock =
              transaction.type === "in"
                ? material.stock + transaction.quantity
                : material.stock - transaction.quantity;

            // 重新计算平均价格
            const inTransactions = newTransactions.filter(
              (t) => t.type === "in"
            );
            const totalValue = inTransactions.reduce(
              (sum, t) => sum + t.quantity * t.unitPrice,
              0
            );
            const totalQuantity = inTransactions.reduce(
              (sum, t) => sum + t.quantity,
              0
            );
            const averagePrice =
              totalQuantity > 0
                ? totalValue / totalQuantity
                : material.averagePrice;

            return {
              ...material,
              stock: newStock,
              averagePrice,
              isStockSufficient: newStock > 100, // 简单的库存充足判断
              transactions: newTransactions,
            };
          }
          if (material.children) {
            return {
              ...material,
              children: updateMaterial(material.children),
            };
          }
          return material;
        });

      return { materials: updateMaterial(state.materials) };
    }),
  updateStock: (materialId, quantity, type) => {
    const { addTransaction } = get();
    addTransaction(materialId, {
      date: new Date(),
      type,
      quantity,
      unitPrice: 0, // 这里可能需要从其他地方获取价格
      notes: "手动调整库存",
    });
  },
  setLoading: (loading) => set({ loading }),
}));
