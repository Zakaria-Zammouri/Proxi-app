import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Bike, ChevronRight, Clock3, Mail, MapPin, Package, Phone, ShieldCheck, Star, UserRound } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { getDeliveries } from "@/features/livreur/data/mockDeliveries";
import { getDriverAvailability } from "@/features/livreur/data/driverState";
import { ScreenTitle, SurfaceCard } from "@/features/livreur/components/LivreurUI";

export default function LivreurProfile() {
  const router = useRouter();
  const deliveries = getDeliveries();
  const completed = deliveries.filter((item) => item.status === "delivered").length;
  const available = getDriverAvailability();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenTitle eyebrow="Compte" title="Mon profil" subtitle="Vos informations personnelles et votre activité." />
      <View style={styles.profileHero}>
        <View style={styles.avatar}><UserRound size={38} color={COLORS.brand.primary} /></View>
        <Text style={styles.name}>Mohamed Amine</Text>
        <Text style={styles.role}>Livreur Proxi</Text>
        <View style={styles.activeBadge}><ShieldCheck size={14} color={COLORS.status.success} /><Text style={styles.activeText}>Compte actif</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Informations personnelles</Text>
      <SurfaceCard>
        <InfoRow icon={<Mail size={18} color={COLORS.brand.primary} />} label="Adresse e-mail" value="livreur@proxi.ma" />
        <View style={styles.divider} />
        <InfoRow icon={<Phone size={18} color={COLORS.brand.primary} />} label="Téléphone" value="06 12 34 56 78" />
        <View style={styles.divider} />
        <InfoRow icon={<MapPin size={18} color={COLORS.brand.primary} />} label="Ville" value="Oujda, Maroc" />
        <View style={styles.divider} />
        <InfoRow icon={<Bike size={18} color={COLORS.brand.primary} />} label="Moyen de transport" value="Moto" />
      </SurfaceCard>

      <Text style={styles.sectionTitle}>Mes statistiques</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Package size={18} color={COLORS.brand.primary} /><Text style={styles.statNumber}>{completed}</Text><Text style={styles.statLabel}>Livraisons</Text></View>
        <View style={styles.stat}><Star size={18} color={COLORS.brand.accent} /><Text style={styles.statNumber}>4.8/5</Text><Text style={styles.statLabel}>Note démo</Text></View>
        <View style={styles.stat}><Clock3 size={18} color={COLORS.brand.primary} /><Text style={styles.statNumber}>{available ? "En ligne" : "Hors ligne"}</Text><Text style={styles.statLabel}>Disponibilité</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Raccourcis</Text>
      <Pressable style={styles.linkRow} onPress={() => router.push("/livreur/livraisons")}><Package size={19} color={COLORS.brand.primary} /><Text style={styles.linkText}>Mes livraisons</Text><ChevronRight size={18} color={COLORS.text.secondary} /></Pressable>
      <Pressable style={styles.linkRow} onPress={() => router.push({pathname: "/livreur/historique" as any,})}><Clock3 size={19} color={COLORS.brand.primary} /><Text style={styles.linkText}>Mon historique</Text><ChevronRight size={18} color={COLORS.text.secondary} /></Pressable>
      <Text style={styles.note}>Profil de démonstration : ces informations seront remplacées par les données du compte connecté lors de l'intégration du backend.</Text>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <View style={styles.infoRow}>{icon}<View style={styles.infoCopy}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background.light },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: 48 },
  profileHero: { alignItems: "center", backgroundColor: COLORS.surface.light, borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.xl },
  avatar: { width: 82, height: 82, borderRadius: 28, backgroundColor: COLORS.brand.primaryLight, alignItems: "center", justifyContent: "center" },
  name: { color: COLORS.text.primary, fontSize: 20, fontWeight: "900", marginTop: SPACING.md },
  role: { color: COLORS.text.secondary, fontSize: 12, marginTop: 4 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#E7F4EB", paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.full, marginTop: SPACING.md },
  activeText: { color: COLORS.status.success, fontSize: 10, fontWeight: "800" },
  sectionTitle: { color: COLORS.text.primary, fontSize: 15, fontWeight: "800", marginBottom: SPACING.sm, marginTop: SPACING.sm },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  infoCopy: { flex: 1 },
  infoLabel: { color: COLORS.text.secondary, fontSize: 10 },
  infoValue: { color: COLORS.text.primary, fontSize: 13, fontWeight: "700", marginTop: 3 },
  divider: { height: 1, backgroundColor: COLORS.border.light },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: SPACING.lg },
  stat: { flex: 1, alignItems: "center", backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, paddingHorizontal: 4 },
  statNumber: { color: COLORS.text.primary, fontSize: 16, fontWeight: "900", marginTop: 8 },
  statLabel: { color: COLORS.text.secondary, fontSize: 9, marginTop: 3 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: COLORS.surface.light, borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm },
  linkText: { color: COLORS.text.primary, fontSize: 12, fontWeight: "700", flex: 1 },
  note: { color: COLORS.text.secondary, fontSize: 9, lineHeight: 15, textAlign: "center", marginTop: SPACING.lg },
});
