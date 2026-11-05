
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import {
  MapPin,
  Clock3,
  ChevronRight,
  Package,
} from "lucide-react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "@/lib/theme";

import { ProxiCard } from "@/components/proxi/ProxiCard";
import { ProxiBadge } from "@/components/proxi/ProxiBadge";
import { mockDeliveries } from "@/features/livreur/data/mockDeliveries";
import type { DeliveryStatus } from "@/features/livreur/types/deliveries";

type Filter = "all" | "new" | "active";

const statusConfig: Record<
  DeliveryStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }
> = {
  new: { label: "Nouvelle", variant: "info" },
  accepted: { label: "Acceptée", variant: "info" },
  picked_up: { label: "Récupérée", variant: "warning" },
  on_the_way: { label: "En livraison", variant: "warning" },
  delivered: { label: "Livrée", variant: "success" },
  cancelled: { label: "Annulée", variant: "error" },
};

export default function DeliveryListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    if (filter === "new") return delivery.status === "new";

    if (filter === "active") {
      return ["accepted", "picked_up", "on_the_way"].includes(
        delivery.status
      );
    }

    return true;
  });

  const counts = {
    all: mockDeliveries.length,
    new: mockDeliveries.filter((d) => d.status === "new").length,
    active: mockDeliveries.filter((d) =>
      ["accepted", "picked_up", "on_the_way"].includes(d.status)
    ).length,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mes livraisons</Text>
        <Text style={styles.subtitle}>
          Retrouvez et gérez vos commandes
        </Text>
      </View>

      {/* FILTERS */}
      <View style={styles.filters}>
        {([
          { key: "all", label: "Toutes", count: counts.all },
          { key: "new", label: "Nouvelles", count: counts.new },
          { key: "active", label: "En cours", count: counts.active },
        ] as const).map((item) => {
          const selected = filter === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterButton,
                selected && styles.selectedFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.selectedFilterText,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  selected && styles.selectedFilterText,
                ]}
              >
                {item.count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* DELIVERY CARDS */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {filteredDeliveries.length} livraison(s)
        </Text>
      </View>

      {filteredDeliveries.length === 0 ? (
        <ProxiCard style={styles.emptyCard}>
          <Package size={36} color={COLORS.text.secondary} />
          <Text style={styles.emptyTitle}>
            Aucune livraison trouvée
          </Text>
          <Text style={styles.emptySubtitle}>
            Les nouvelles commandes apparaîtront ici.
          </Text>
        </ProxiCard>
      ) : (
        filteredDeliveries.map((delivery) => (
          <Pressable
            key={delivery.id}
            onPress={() =>
              router.push({
                pathname: "/livreur/livraisons/[id]",
                params: { id: delivery.id },
              })
            }
          >
            <ProxiCard style={styles.deliveryCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.reference}>
                    {delivery.reference}
                  </Text>
                  <Text style={styles.customerName}>
                    {delivery.customer.name}
                  </Text>
                </View>

                <ProxiBadge
                  label={statusConfig[delivery.status].label}
                  variant={statusConfig[delivery.status].variant}
                />
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <MapPin size={17} color={COLORS.brand.primary} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Récupération</Text>
                  <Text style={styles.infoValue}>
                    {delivery.pickup.name}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={17} color={COLORS.status.warning} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Destination</Text>
                  <Text style={styles.infoValue}>
                    {delivery.destination.address}, {delivery.destination.city}
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.cardFooter}>
                <View style={styles.timeContainer}>
                  <Clock3 size={14} color={COLORS.text.secondary} />
                  <Text style={styles.timeText}>
                    {delivery.createdAt}
                  </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {delivery.total} MAD
                  </Text>
                  <ChevronRight
                    size={18}
                    color={COLORS.text.secondary}
                  />
                </View>
              </View>
            </ProxiCard>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING["2xl"],
    paddingBottom: SPACING["4xl"],
    gap: SPACING.lg,
  },
  header: {
    gap: SPACING.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  filters: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  selectedFilter: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  filterCount: {
    fontSize: 11,
    color: COLORS.text.secondary,
  },
  selectedFilterText: {
    color: COLORS.text.inverse,
  },
  listHeader: {
    marginTop: SPACING.xs,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  deliveryCard: {
    gap: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  reference: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    gap: 3,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text.primary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brand.primary,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: SPACING["2xl"],
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
});