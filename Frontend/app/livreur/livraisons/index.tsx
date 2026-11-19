import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ChevronRight, MapPin, Package, Search, X } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { getDeliveries } from "@/features/livreur/data/mockDeliveries";
import type { Delivery, DeliveryStatus } from "@/features/livreur/types/deliveries";
import { EmptyState, ScreenTitle, StatusPill } from "@/features/livreur/components/LivreurUI";

type Filter = "all" | "new" | "active" | "delivered" | "cancelled";
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "new", label: "Nouvelles" },
  { key: "active", label: "En cours" },
  { key: "delivered", label: "Terminées" },
  { key: "cancelled", label: "Annulées" },
];

export default function DeliveriesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [deliveries, setDeliveries] = useState<Delivery[]>(getDeliveries());

  useFocusEffect(useCallback(() => { setDeliveries(getDeliveries()); }, []));

  const filtered = useMemo(() => deliveries.filter((delivery) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "new" && delivery.status === "new") ||
      (filter === "active" && ["accepted", "picked_up", "on_the_way"].includes(delivery.status)) ||
      (filter === "delivered" && delivery.status === "delivered") ||
      (filter === "cancelled" && delivery.status === "cancelled");
    const normalized = query.trim().toLowerCase();
    const matchesQuery = !normalized || [delivery.reference, delivery.customer.name, delivery.pickup.name, delivery.destination.address].some((value) => value.toLowerCase().includes(normalized));
    return matchesFilter && matchesQuery;
  }), [deliveries, filter, query]);

  const counts: Record<Filter, number> = {
    all: deliveries.length,
    new: deliveries.filter((item) => item.status === "new").length,
    active: deliveries.filter((item) => ["accepted", "picked_up", "on_the_way"].includes(item.status)).length,
    delivered: deliveries.filter((item) => item.status === "delivered").length,
    cancelled: deliveries.filter((item) => item.status === "cancelled").length,
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenTitle eyebrow="Gestion" title="Mes livraisons" subtitle={`${deliveries.length} commande(s) dans votre espace`} />
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.text.secondary} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher une commande..." placeholderTextColor={COLORS.text.disabled} style={styles.searchInput} />
        {query.length > 0 ? <Pressable onPress={() => setQuery("")}><X size={17} color={COLORS.text.secondary} /></Pressable> : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable key={item.key} onPress={() => setFilter(item.key)} style={[styles.filter, filter === item.key && styles.filterSelected]}>
            <Text style={[styles.filterText, filter === item.key && styles.filterTextSelected]}>{item.label}</Text>
            <Text style={[styles.filterCount, filter === item.key && styles.filterCountSelected]}>{counts[item.key]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.resultsLabel}>{filtered.length} résultat(s)</Text>
      {filtered.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} onPress={() => router.push(`/livreur/livraisons/${delivery.id}`)} />)}
      {filtered.length === 0 ? <EmptyState icon={<Package size={26} color={COLORS.brand.primary} />} title="Aucune livraison" message="Aucune commande ne correspond à votre recherche ou à ce filtre." /> : null}
    </ScrollView>
  );
}

function DeliveryCard({ delivery, onPress }: { delivery: Delivery; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardTop}><Text style={styles.reference}>{delivery.reference}</Text><StatusPill status={delivery.status as DeliveryStatus} /></View>
      <Text style={styles.customer}>{delivery.customer.name}</Text>
      <View style={styles.detailRow}><Package size={15} color={COLORS.brand.primary} /><Text style={styles.detailText}>{delivery.pickup.name}</Text></View>
      <View style={styles.detailRow}><MapPin size={15} color={COLORS.text.secondary} /><Text style={styles.detailText}>{delivery.destination.address}, {delivery.destination.city}</Text></View>
      <View style={styles.cardBottom}><Text style={styles.amount}>{delivery.total} MAD</Text><Text style={styles.time}>{delivery.createdAt}</Text><ChevronRight size={18} color={COLORS.text.secondary} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background.light },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: 48 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: COLORS.surface.light, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, minHeight: 48, marginBottom: SPACING.md },
  searchInput: { flex: 1, color: COLORS.text.primary, fontSize: 13, paddingVertical: 10 },
  filters: { gap: 7, paddingBottom: SPACING.md },
  filter: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 9, paddingHorizontal: 12, borderRadius: RADIUS.full, backgroundColor: COLORS.surface.light },
  filterSelected: { backgroundColor: COLORS.brand.primary },
  filterText: { color: COLORS.text.secondary, fontSize: 11, fontWeight: "700" },
  filterTextSelected: { color: "#FFFFFF" },
  filterCount: { color: COLORS.text.secondary, fontSize: 10, fontWeight: "800" },
  filterCountSelected: { color: "#D4E8DE" },
  resultsLabel: { color: COLORS.text.secondary, fontSize: 11, fontWeight: "700", marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md },
  cardPressed: { opacity: 0.8 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: SPACING.md },
  reference: { color: COLORS.text.primary, fontSize: 12, fontWeight: "800" },
  customer: { color: COLORS.text.primary, fontSize: 16, fontWeight: "800", marginBottom: 9 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 7 },
  detailText: { color: COLORS.text.secondary, fontSize: 11, flex: 1 },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: SPACING.lg, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border.light },
  amount: { color: COLORS.brand.primary, fontSize: 14, fontWeight: "800", flex: 1 },
  time: { color: COLORS.text.secondary, fontSize: 11 },
});
