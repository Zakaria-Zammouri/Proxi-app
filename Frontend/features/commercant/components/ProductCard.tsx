import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";

import { Package, TriangleAlert, Minus, Plus } from "lucide-react-native";

import type { Product } from "@/features/commercant/data/productsData";

import { COLORS, RADIUS, SHADOWS } from "@/lib/theme";

type ProductCardProps = {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onStockChange: (id: number, amount: number) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
  onStockChange,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <View style={styles.card}>
      <View style={styles.productHeader}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderContainer]}>
            <Package size={34} color={COLORS.brand.primary} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.description}>
            {product.description || "Aucune description"}
          </Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <Text style={styles.price}>{product.price} DH</Text>

          <Text style={styles.stock}>
            Stock disponible : {product.stock}
          </Text>

          {isOutOfStock && (
            <View style={[styles.stockBadge, styles.outOfStockBadge]}>
              <TriangleAlert size={13} color="#C63E3E" />
              <Text style={styles.outOfStockText}>
                Rupture de stock
              </Text>
            </View>
          )}

          {isLowStock && (
            <View style={[styles.stockBadge, styles.lowStockBadge]}>
              <TriangleAlert size={13} color="#A9650B" />
              <Text style={styles.lowStockText}>Stock faible</Text>
            </View>
          )}

          <Text
            style={[
              styles.status,
              product.available && !isOutOfStock
                ? styles.available
                : styles.unavailable,
            ]}
          >
            {isOutOfStock
              ? "Indisponible - Stock épuisé"
              : product.available
              ? "● Disponible"
              : "● Indisponible"}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.stockActions}>
        <Text style={styles.stockLabel}>Modifier le stock</Text>

        <Pressable
          style={[
            styles.stockButton,
            isOutOfStock && styles.disabledButton,
          ]}
          disabled={isOutOfStock}
          onPress={() => onStockChange(product.id, -1)}
        >
          <Minus size={17} color={COLORS.brand.primary} />
        </Pressable>

        <Text style={styles.stockValue}>{product.stock}</Text>

        <Pressable
          style={styles.stockButton}
          onPress={() => onStockChange(product.id, 1)}
        >
          <Plus size={17} color={COLORS.brand.primary} />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(product.id)}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </Pressable>

        <Pressable
          style={[
            styles.availabilityButton,
            isOutOfStock && styles.disabledAvailabilityButton,
          ]}
          disabled={isOutOfStock}
          onPress={() => onToggleAvailability(product.id)}
        >
          <Text style={styles.availabilityButtonText}>
            {product.available ? "Désactiver" : "Activer"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(product.id)}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...SHADOWS.card,
  },

  productHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 105,
    height: 115,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.brand.primaryLight,
  },

  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  description: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.brand.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },

  category: {
    color: COLORS.brand.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  price: {
    color: COLORS.brand.primary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 8,
  },

  stock: {
    color: COLORS.text.secondary,
    fontSize: 12,
    marginTop: 5,
  },

  stockBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },

  lowStockBadge: {
    backgroundColor: "#FFF3DF",
  },

  lowStockText: {
    color: "#A9650B",
    fontSize: 11,
    fontWeight: "700",
  },

  outOfStockBadge: {
    backgroundColor: "#FCEAEA",
  },

  outOfStockText: {
    color: "#C63E3E",
    fontSize: 11,
    fontWeight: "700",
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },

  available: {
    color: COLORS.status.success,
  },

  unavailable: {
    color: "#C63E3E",
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginTop: 16,
  },

  stockActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 14,
    gap: 12,
  },

  stockLabel: {
    flex: 1,
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  stockButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.brand.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.35,
  },

  stockValue: {
    minWidth: 22,
    textAlign: "center",
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.brand.primaryLight,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    color: COLORS.brand.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  availabilityButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFF3DF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledAvailabilityButton: {
    opacity: 0.45,
  },

  availabilityButtonText: {
    color: "#A9650B",
    fontSize: 12,
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#FCEAEA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#C63E3E",
    fontSize: 12,
    fontWeight: "700",
  },
});