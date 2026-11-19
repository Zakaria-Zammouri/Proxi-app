import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { CheckCircle2, ChevronRight, Clock3, XCircle } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { getDeliveries } from "@/features/livreur/data/mockDeliveries";
import type { Delivery } from "@/features/livreur/types/deliveries";
import { EmptyState, ScreenTitle, StatusPill } from "@/features/livreur/components/LivreurUI";

type HistoryFilter = "all" | "delivered" | "cancelled";
export default function HistoryScreen() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>(getDeliveries());
  const [filter, setFilter] = useState<HistoryFilter>("all");
  useFocusEffect(useCallback(() => { setDeliveries(getDeliveries()); }, []));

  const history = useMemo(() => deliveries.filter((item) => {
    if (filter === "delivered") return item.status === "delivered";
    if (filter === "cancelled") return item.status === "cancelled";
    return item.status === "delivered" || item.status === "cancelled";
  }), [deliveries, filter]);
  const completed = deliveries.filter((item) => item.status === "delivered").length;
  const cancelled = deliveries.filter((item) => item.status === "cancelled").length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenTitle eyebrow="Vos activités" title="Historique" subtitle="Retrouvez les livraisons terminées et annulées." />
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><View style={styles.summaryIcon}><CheckCircle2 size={18} color={COLORS.status.success} /></View><Text style={styles.summaryNumber}>{completed}</Text><Text style={styles.summaryLabel}>Terminées</Text></View>
        <View style={styles.summaryCard}><View style={[styles.summaryIcon, styles.cancelIcon]}><XCircle size={18} color={COLORS.status.error} /></View><Text style={styles.summaryNumber}>{cancelled}</Text><Text style={styles.summaryLabel}>Annulées</Text></View>
      </View>
      <View style={styles.filters}>
        {([{ key: "all", label: "Tout" }, { key: "delivered", label: "Terminées" }, { key: "cancelled", label: "Annulées" }] as const).map((item) => (
          <Pressable key={item.key} onPress={() => setFilter(item.key)} style={[styles.filter, filter === item.key && styles.filterActive]}><Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>{item.label}</Text></Pressable>
        ))}
      </View>
      {history.map((delivery) => <HistoryRow key={delivery.id} delivery={delivery} onPress={() => router.push(`/livreur/livraisons/${delivery.id}`)} />)}
      {history.length === 0 ? <EmptyState icon={<Clock3 size={26} color={COLORS.brand.primary} />} title="Historique vide" message="Les livraisons terminées ou annulées apparaîtront ici." /> : null}
    </ScrollView>
  );
}

function HistoryRow({ delivery, onPress }: { delivery: Delivery; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>{delivery.status === "delivered" ? <CheckCircle2 size={20} color={COLORS.status.success} /> : <XCircle size={20} color={COLORS.status.error} />}</View>
      <View style={styles.rowCopy}><Text style={styles.reference}>{delivery.reference}</Text><Text style={styles.customer}>{delivery.customer.name}</Text><Text style={styles.destination}>{delivery.destination.address}, {delivery.destination.city}</Text></View>
      <View style={styles.rowRight}><StatusPill status={delivery.status} /><Text style={styles.amount}>{delivery.deliveryFee} MAD</Text><ChevronRight size={16} color={COLORS.text.secondary} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background.light },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: 48 },
  summaryRow: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.xl },
  summaryCard: { flex: 1, backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, padding: SPACING.md },
  summaryIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: "#E7F4EB", alignItems: "center", justifyContent: "center", marginBottom: 9 },
  cancelIcon: { backgroundColor: "#FCEAEA" },
  summaryNumber: { color: COLORS.text.primary, fontSize: 24, fontWeight: "900" },
  summaryLabel: { color: COLORS.text.secondary, fontSize: 11, marginTop: 3 },
  filters: { flexDirection: "row", gap: 8, marginBottom: SPACING.md },
  filter: { backgroundColor: COLORS.surface.light, paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full },
  filterActive: { backgroundColor: COLORS.brand.primary },
  filterText: { color: COLORS.text.secondary, fontSize: 11, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.surface.light, padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.sm },
  rowIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.background.light, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1 },
  reference: { color: COLORS.text.primary, fontSize: 11, fontWeight: "800" },
  customer: { color: COLORS.text.primary, fontSize: 12, fontWeight: "700", marginTop: 3 },
  destination: { color: COLORS.text.secondary, fontSize: 10, marginTop: 3 },
  rowRight: { alignItems: "flex-end", gap: 6 },
  amount: { color: COLORS.brand.primary, fontSize: 10, fontWeight: "800" },
});
