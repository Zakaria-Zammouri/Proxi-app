
export type DeliveryStatus =
  | "new"
  | "accepted"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export type Delivery = {
  id: string;
  reference: string;
  customer: {
    name: string;
    phone: string;
  };
  pickup: {
    name: string;
    address: string;
  };
  destination: {
    address: string;
    city: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  deliveryFee: number;
  status: DeliveryStatus;
  createdAt: string;
  notes?: string;
};