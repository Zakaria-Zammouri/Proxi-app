
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  stock: number;
};

export const productsData: Product[] = [
  {
    id: 1,
    name: "Eau Sidi Ali",
    description: "Bouteille d'eau 1,5 L",
    price: 6,
    category: "Boissons",
    image: "",
    available: true,
    stock: 40,
  },
];
