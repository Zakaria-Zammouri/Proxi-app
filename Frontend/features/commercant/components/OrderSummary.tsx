import { View, Text, StyleSheet } from "react-native";

import {
  ShoppingBag,
  Clock3,
  Package,
  Check,
  X,
} from "lucide-react-native";

import { COLORS, RADIUS } from "@/lib/theme";

type OrderSummaryProps = {
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
};

export default function OrderSummary({
  pending,
  processing,
  delivered,
  cancelled,
}: OrderSummaryProps) {
  const orders = [
    {
      title: "En attente",
      value: pending,
      color: COLORS.status.warning,
      icon: Clock3,
      description: "À traiter",
    },
    {
      title: "En préparation",
      value: processing,
      color: COLORS.status.info,
      icon: Package,
      description: "En cours",
    },
    {
      title: "Livrées",
      value: delivered,
      color: COLORS.status.success,
      icon: Check,
      description: "Terminées",
    },
    {
      title: "Annulées",
      value: cancelled,
      color: COLORS.status.error,
      icon: X,
      description: "Refusées",
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <ShoppingBag size={22} color={COLORS.brand.primary} />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Mes commandes</Text>

          <Text style={styles.subtitle}>
            Suivi de votre activité
          </Text>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalValue}>
            {pending + processing + delivered + cancelled}
          </Text>
          <Text style={styles.totalLabel}>Total</Text>
        </View>
      </View>

      {/* STATISTIQUES */}

      <View style={styles.grid}>
        {orders.map((order) => {
          const Icon = order.icon;

          return (
            <View key={order.title} style={styles.statCard}>
              {/* ICÔNE ET NOMBRE */}

              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.statusIcon,
                    { backgroundColor: order.color + "18" },
                  ]}
                >
                  <Icon size={19} color={order.color} />
                </View>

                <View
                  style={[
                    styles.countContainer,
                    { backgroundColor: order.color + "18" },
                  ]}
                >
                  <Text
                    style={[styles.count, { color: order.color }]}
                  >
                    {order.value}
                  </Text>
                </View>
              </View>

              {/* TITRE */}

              <Text style={styles.label}>{order.title}</Text>

              {/* DESCRIPTION */}

              <View style={styles.cardBottom}>
                <View
                  style={[
                    styles.bottomLine,
                    { backgroundColor: order.color },
                  ]}
                />

                <Text style={styles.description}>
                  {order.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface.light,
  },

  // HEADER

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brand.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },

  totalBadge: {
    backgroundColor: COLORS.background.light,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    alignItems: "center",
  },

  totalValue: {
    color: COLORS.brand.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  totalLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  // GRID

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  // CARTE STATISTIQUE

  statCard: {
    width: "48.5%",
    minHeight: 125,
    backgroundColor: COLORS.background.light,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 12,
    justifyContent: "space-between",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  countContainer: {
    minWidth: 35,
    height: 31,
    paddingHorizontal: 9,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  count: {
    fontSize: 15,
    fontWeight: "800",
  },

  label: {
    color: COLORS.text.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },

  bottomLine: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  description: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "600",
  },
});