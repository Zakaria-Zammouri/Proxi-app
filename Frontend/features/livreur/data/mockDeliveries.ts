
import type { Delivery } from "../types/deliveries";

export const mockDeliveries: Delivery[] = [
  {
    id: "1",
    reference: "PRX-2026-001",
    customer: {
      name: "Youssef Amrani",
      phone: "06 12 34 56 78",
    },
    pickup: {
      name: "Snack Al Amal",
      address: "Boulevard Mohammed V",
    },
    destination: {
      address: "Hay Al Qods, Rue 12",
      city: "Oujda",
    },
    items: [
      { name: "Tacos poulet", quantity: 2, price: 45 },
      { name: "Coca-Cola", quantity: 2, price: 10 },
    ],
    total: 110,
    deliveryFee: 15,
    status: "new",
    createdAt: "14:20",
    notes: "Appeler le client à l'arrivée.",
  },
  {
    id: "2",
    reference: "PRX-2026-002",
    customer: {
      name: "Sara Bennis",
      phone: "06 55 44 33 22",
    },
    pickup: {
      name: "Pizza House",
      address: "Avenue Allal El Fassi",
    },
    destination: {
      address: "Hay Al Matar",
      city: "Oujda",
    },
    items: [
      { name: "Pizza Margherita", quantity: 1, price: 55 },
      { name: "Jus d'orange", quantity: 1, price: 15 },
    ],
    total: 70,
    deliveryFee: 12,
    status: "accepted",
    createdAt: "14:05",
  },
  {
    id: "3",
    reference: "PRX-2026-003",
    customer: {
      name: "Adam Karim",
      phone: "06 77 88 99 00",
    },
    pickup: {
      name: "Burger Station",
      address: "Centre-ville",
    },
    destination: {
      address: "Hay El Qods",
      city: "Oujda",
    },
    items: [
      { name: "Double Burger", quantity: 1, price: 60 },
      { name: "Frites", quantity: 1, price: 15 },
    ],
    total: 75,
    deliveryFee: 12,
    status: "on_the_way",
    createdAt: "13:40",
  },
  {
    id: "4",
    reference: "PRX-2026-004",
    customer: {
      name: "Imane Haddad",
      phone: "06 11 22 33 44",
    },
    pickup: {
      name: "Café Central",
      address: "Place du 16 Août",
    },
    destination: {
      address: "Hay Al Qods",
      city: "Oujda",
    },
    items: [
      { name: "Café", quantity: 2, price: 12 },
    ],
    total: 24,
    deliveryFee: 8,
    status: "delivered",
    createdAt: "12:30",
  },
];

export const getDeliveryById = (id: string) =>
  mockDeliveries.find((delivery) => delivery.id === id);