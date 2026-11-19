import type { Delivery, DeliveryStatus } from "../types/deliveries";

const initialDeliveries: Delivery[] = [
  {
    id: "1",
    reference: "PRX-2026-001",
    customer: { name: "Youssef Amrani", phone: "0612345678" },
    pickup: { name: "Snack Al Amal", address: "Boulevard Mohammed V, Oujda" },
    destination: { address: "Rue 12, Hay Al Qods", city: "Oujda" },
    items: [
      { name: "Tacos poulet", quantity: 2, price: 45 },
      { name: "Coca-Cola", quantity: 2, price: 10 },
    ],
    total: 125,
    deliveryFee: 15,
    status: "new",
    createdAt: "14:20",
    notes: "Appeler le client à l'arrivée.",
  },
  {
    id: "2",
    reference: "PRX-2026-002",
    customer: { name: "Sara Bennis", phone: "0623456789" },
    pickup: { name: "Pizza House", address: "Centre-ville, Oujda" },
    destination: { address: "Hay Al Matar", city: "Oujda" },
    items: [
      { name: "Pizza Margherita", quantity: 1, price: 55 },
      { name: "Jus d'orange", quantity: 1, price: 15 },
    ],
    total: 82,
    deliveryFee: 12,
    status: "accepted",
    createdAt: "14:05",
  },
  {
    id: "3",
    reference: "PRX-2026-003",
    customer: { name: "Adam Karim", phone: "0634567890" },
    pickup: { name: "Burger Station", address: "Hay El Qods, Oujda" },
    destination: { address: "Rue 8, Hay El Qods", city: "Oujda" },
    items: [
      { name: "Double Burger", quantity: 1, price: 60 },
      { name: "Frites", quantity: 1, price: 15 },
    ],
    total: 87,
    deliveryFee: 12,
    status: "on_the_way",
    createdAt: "13:40",
  },
  {
    id: "4",
    reference: "PRX-2026-004",
    customer: { name: "Imane Haddad", phone: "0645678901" },
    pickup: { name: "Café Central", address: "Centre-ville, Oujda" },
    destination: { address: "Hay Al Qods", city: "Oujda" },
    items: [{ name: "Café", quantity: 2, price: 12 }],
    total: 32,
    deliveryFee: 8,
    status: "delivered",
    createdAt: "12:30",
  },
  {
    id: "5",
    reference: "PRX-2026-005",
    customer: { name: "Nadia Fassi", phone: "0656789012" },
    pickup: { name: "Boulangerie Al Waha", address: "Rue de Marrakech, Oujda" },
    destination: { address: "Hay Lazaret", city: "Oujda" },
    items: [{ name: "Pack petit déjeuner", quantity: 1, price: 48 }],
    total: 58,
    deliveryFee: 10,
    status: "cancelled",
    createdAt: "11:50",
    notes: "Commande annulée dans cette démonstration.",
  },
];

let deliveries: Delivery[] = initialDeliveries.map((delivery) => ({ ...delivery }));

export function getDeliveries(): Delivery[] {
  return deliveries.map((delivery) => ({ ...delivery }));
}

export function getDeliveryById(id: string): Delivery | undefined {
  const delivery = deliveries.find((item) => item.id === id);
  return delivery ? { ...delivery } : undefined;
}

export function updateDeliveryStatus(
  id: string,
  status: DeliveryStatus,
): Delivery | undefined {
  deliveries = deliveries.map((delivery) =>
    delivery.id === id ? { ...delivery, status } : delivery,
  );
  return getDeliveryById(id);
}

export function resetDeliveries(): void {
  deliveries = initialDeliveries.map((delivery) => ({ ...delivery }));
}
