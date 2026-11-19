import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ArrowUpRight,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Power,
  Star,
  Wallet,
} from "lucide-react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/lib/theme";
import { getDeliveries } from "@/features/livreur/data/mockDeliveries";
import { getDriverAvailability, setDriverAvailability } from "@/features/livreur/data/driverState";
import type { Delivery } from "@/features/livreur/types/deliveries";
import { ScreenTitle, SectionTitle, StatCard, StatusPill } from "@/features/livreur/components/LivreurUI";

export default function LivreurDashboard() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>(getDeliveries());
  const [available, setAvailable] = useState(getDriverAvailability());

  useFocusEffect(
    useCallback(() => {
      setDeliveries(getDeliveries());
      setAvailable(getDriverAvailability());
    }, []),
  );

  const activeCount = deliveries.filter((item) => ["accepted", "picked_up", "on_the_way"].includes(item.status)).length;
  const newCount = deliveries.filter((item) => item.status === "new").length;
  const completedCount = deliveries.filter((item) => item.status === "delivered").length;
  const earnings = deliveries.filter((item) => item.status === "delivered").reduce((sum, item) => sum + item.deliveryFee, 0);
  const recent = deliveries.filter((item) => item.status !== "cancelled").slice(0, 3);

  function toggleAvailability() {
    const next = !available;
    setAvailable(setDriverAvailability(next));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenTitle
        eyebrow="Espace livreur"
        title="Bonjour, Mohamed 👋"
        subtitle="Voici le résumé de votre activité aujourd'hui."
        right={
          <Pressable style={styles.profileButton} onPress={() => router.push("/livreur/profile")} accessibilityLabel="Ouvrir mon profil">
            <Bike size={22} color={COLORS.brand.primary} />
          </Pressable>
        }
      />

      <Pressable onPress={toggleAvailability} style={[styles.availabilityCard, !available && styles.availabilityOff]}>
        <View style={styles.availabilityIcon}><Power size={20} color={available ? COLORS.status.success : COLORS.status.error} /></View>
        <View style={styles.availabilityCopy}>
          <Text style={styles.availabilityTitle}>{available ? "Vous êtes disponible" : "Vous êtes indisponible"}</Text>
          <Text style={styles.availabilitySubtitle}>{available ? "Vous pouvez recevoir de nouvelles courses." : "Vous ne souhaitez pas recevoir de courses."}</Text>
        </View>
        <View style={[styles.toggle, available && styles.toggleOn]}><View style={[styles.toggleKnob, available && styles.toggleKnobOn]} /></View>
      </Pressable>

      <View style={styles.ratingCard}>
        <View style={styles.ratingTop}>
          <View>
            <Text style={styles.ratingEyebrow}>VOTRE POPULARITÉ</Text>
            <Text style={styles.ratingTitle}>Un service qui compte.</Text>
          </View>
          <View style={styles.ratingIcon}><Star size={22} color="#FFC66D" fill="#FFC66D" /></View>
        </View>
        <View style={styles.ratingBottom}>
          <View><Text style={styles.ratingNumber}>4.8 <Text style={styles.ratingOutOf}>/ 5</Text></Text><Text style={styles.ratingCaption}>Note moyenne simulée</Text></View>
          <View><Text style={styles.ratingNumber}>26</Text><Text style={styles.ratingCaption}>Avis de démonstration</Text></View>
        </View>
        <Text style={styles.demoNote}>Données fictives — les avis seront connectés au backend.</Text>
      </View>

      <SectionTitle title="Vue d'ensemble" />
      <View style={styles.statsGrid}>
        <StatCard label="Nouvelles" value={newCount} detail="À accepter" icon={<Package size={19} color={COLORS.brand.primary} />} />
        <StatCard label="En cours" value={activeCount} detail="À terminer" icon={<Clock3 size={19} color={COLORS.brand.primary} />} />
        <StatCard label="Terminées" value={completedCount} detail="Livraisons réussies" icon={<CheckCircle2 size={19} color={COLORS.brand.primary} />} />
        <StatCard label="Gains démo" value={`${earnings} MAD`} detail="Frais des livraisons terminées" icon={<Wallet size={19} color={COLORS.brand.primary} />} />
      </View>

      <Pressable style={styles.mainAction} onPress={() => router.push("/livreur/livraisons")}>
        <View style={styles.mainActionIcon}><Package size={22} color="#FFFFFF" /></View>
        <View style={styles.mainActionCopy}><Text style={styles.mainActionTitle}>Gérer mes livraisons</Text><Text style={styles.mainActionSubtitle}>{newCount} nouvelle(s) commande(s) à consulter</Text></View>
        <ArrowUpRight size={21} color="#FFFFFF" />
      </Pressable>

      <SectionTitle title="Activité récente" action="Tout voir" onAction={() => router.push("/livreur/livraisons")} />
      {recent.map((delivery) => (
        <Pressable key={delivery.id} style={styles.deliveryRow} onPress={() => router.push(`/livreur/livraisons/${delivery.id}`)}>
          <View style={styles.deliveryIcon}><Package size={19} color={COLORS.brand.primary} /></View>
          <View style={styles.deliveryCopy}><Text style={styles.deliveryReference}>{delivery.reference}</Text><Text style={styles.deliveryCustomer}>{delivery.customer.name}</Text><Text style={styles.deliveryDestination}>{delivery.destination.address}</Text></View>
          <View style={styles.deliveryRight}><StatusPill status={delivery.status} /><ChevronRight size={17} color={COLORS.text.secondary} /></View>
        </Pressable>
      ))}

      <Pressable style={styles.historyLink} onPress={() => router.push("/livreur/historique")}>
        <Clock3 size={19} color={COLORS.brand.primary} /><Text style={styles.historyText}>Consulter mon historique</Text><ChevronRight size={19} color={COLORS.text.secondary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background.light },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: 48 },
  profileButton: { width: 46, height: 46, borderRadius: 16, backgroundColor: COLORS.brand.primaryLight, alignItems: "center", justifyContent: "center" },
  availabilityCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: "#E8F4EC", marginBottom: SPACING.lg, borderWidth: 1, borderColor: "#D3E9DA" },
  availabilityOff: { backgroundColor: "#FCEEEE", borderColor: "#F3D5D5" },
  availabilityIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  availabilityCopy: { flex: 1 },
  availabilityTitle: { color: COLORS.text.primary, fontWeight: "800", fontSize: 13 },
  availabilitySubtitle: { color: COLORS.text.secondary, fontSize: 10, marginTop: 3, lineHeight: 15 },
  toggle: { width: 42, height: 25, borderRadius: 20, backgroundColor: "#CBD2CD", padding: 3, justifyContent: "center" },
  toggleOn: { backgroundColor: COLORS.status.success, alignItems: "flex-end" },
  toggleKnob: { width: 19, height: 19, borderRadius: 10, backgroundColor: "#FFFFFF" },
  toggleKnobOn: { alignSelf: "flex-end" },
  ratingCard: { backgroundColor: COLORS.brand.primary, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.card },
  ratingTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ratingEyebrow: { color: "#BBD9CB", fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  ratingTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 6 },
  ratingIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: "#FFFFFF1C", alignItems: "center", justifyContent: "center" },
  ratingBottom: { flexDirection: "row", gap: 45, marginTop: SPACING.xl },
  ratingNumber: { color: "#FFFFFF", fontSize: 25, fontWeight: "800" },
  ratingOutOf: { color: "#D4E8DE", fontSize: 13 },
  ratingCaption: { color: "#D4E8DE", fontSize: 10, marginTop: 3 },
  demoNote: { color: "#BBD9CB", fontSize: 9, marginTop: SPACING.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
  mainAction: { backgroundColor: COLORS.brand.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, flexDirection: "row", alignItems: "center", gap: SPACING.md, marginTop: SPACING.xl },
  mainActionIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFFFFF24", alignItems: "center", justifyContent: "center" },
  mainActionCopy: { flex: 1 },
  mainActionTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  mainActionSubtitle: { color: "#D4E8DE", fontSize: 10, marginTop: 4 },
  deliveryRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm },
  deliveryIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: COLORS.brand.primaryLight, alignItems: "center", justifyContent: "center" },
  deliveryCopy: { flex: 1 },
  deliveryReference: { color: COLORS.text.primary, fontSize: 12, fontWeight: "800" },
  deliveryCustomer: { color: COLORS.text.secondary, fontSize: 11, marginTop: 3 },
  deliveryDestination: { color: COLORS.text.secondary, fontSize: 10, marginTop: 2 },
  deliveryRight: { alignItems: "flex-end", gap: 7 },
  historyLink: { flexDirection: "row", alignItems: "center", gap: 10, padding: SPACING.lg, backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, marginTop: SPACING.md },
  historyText: { flex: 1, color: COLORS.text.primary, fontSize: 13, fontWeight: "700" },
});
