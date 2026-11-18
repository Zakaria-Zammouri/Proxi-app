export type OrderStatus =
  | "pending"
  | "En attente"
  | "processing"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  clientName: string;
  phone: string;
  address: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

export const initialOrders: Order[] = [
  {
    id: 1,
    clientName: "Ahmed",
    phone: "0612345678",
    address: "Centre-ville",
    date: "05/11/2026 à 14:30",
    items: [
      { id: 1, name: "Eau Sidi Ali", quantity: 2, price: 6 },
      { id: 2, name: "Pain", quantity: 3, price: 2 },
    ],
    total: 18,
    status: "pending",
  },
  {
    id: 2,
    clientName: "Youssef",
    phone: "0623456789",
    address: "Quartier Al Qods",
    date: "05/11/2026 à 15:45",
    items: [
      { id: 3, name: "Lait", quantity: 4, price: 8 },
      { id: 4, name: "Sucre", quantity: 2, price: 12 },
    ],
    total: 56,
    status: "processing",
  },
  {
    id: 4,
    clientName: "zakaria",
    phone: "0612345677",
    address: "oujda",
    date: "07/11/2026 à 10:30",
    items: [
      { id: 1, name: "Eau Sidi Ali", quantity: 1, price: 6 },
      { id: 2, name: "Pain", quantity: 2, price: 1 },
    ],
    total: 8,
    status: "En attente",
  },
  {
    id: 5,
    clientName: "Ayyoub",
    phone: "06227412375",
    address: "Quartier Al Hikma",
    date: "07/11/2026 à 11:22",
    items: [
        { id: 1, name: "Eau Sidi Ali", quantity: 2, price: 6 },
      { id: 4, name: "Coca-Cola", quantity: 2, price: 8 },
    ],
    total: 28,
    status: "En attente",
  },
];