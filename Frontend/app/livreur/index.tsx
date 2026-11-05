import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  UserRound,
  Package,
  Clock3,
  ChevronRight,
  Star,
  ThumbsUp,
  MessageCircle,
  Truck,
} from "lucide-react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "@/lib/theme";

import { ProxiCard } from "@/components/proxi/ProxiCard";
import { ProxiBadge } from "@/components/proxi/ProxiBadge";

// Données temporaires : à remplacer par les données du backend
const driver = {
  name: "Zakariae Berkane",
  activeDeliveries: 0,
  pendingDeliveries: 0,
};

const popularity = [
  {
    id: "rating",
    label: "Note moyenne",
    value: "4.8",
    suffix: "/ 5",
    description: "Basée sur les avis clients",
    icon: Star,
  },
  {
    id: "satisfaction",
    label: "Satisfaction",
    value: "96",
    suffix: "%",
    description: "Avis positifs des clients",
    icon: ThumbsUp,
  },
  {
    id: "reviews",
    label: "Avis reçus",
    value: "24",
    suffix: "",
    description: "Évaluations de vos clients",
    icon: MessageCircle,
  },
];

export default function LivreurDashboard() {
  const router = useRouter();

  <Pressable
  style={styles.quickAccess}
  onPress={() => router.push("/livreur/livraisons")}
>
  <View style={styles.quickIcon}>
    <Package size={21} color={COLORS.brand.primary} />
  </View>

  <View style={styles.quickText}>
    <Text style={styles.quickTitle}>Mes livraisons</Text>
    <Text style={styles.quickDescription}>
      Consulter et gérer mes commandes
    </Text>
  </View>

  <ChevronRight size={20} color={COLORS.text.secondary} />
</Pressable>

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.driverName}>{driver.name} 👋</Text>
          <Text style={styles.subtitle}>
            Prêt pour vos prochaines livraisons ?
          </Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => router.push("/livreur/profile")}
        >
          <UserRound size={23} color={COLORS.brand.primary} />
        </Pressable>
      </View>

      {/* DELIVERY STATISTICS */}
      <Text style={styles.sectionTitle}>Mon activité</Text>

      <View style={styles.statsContainer}>
        <ProxiCard style={styles.statCard}>
          <View style={styles.statIcon}>
            <Truck size={21} color={COLORS.brand.primary} />
          </View>

          <Text style={styles.statNumber}>
            {driver.activeDeliveries}
          </Text>

          <Text style={styles.statLabel}>Livraisons actives</Text>

          <ProxiBadge label="En cours" variant="brand" />
        </ProxiCard>

        <ProxiCard style={styles.statCard}>
          <View style={[styles.statIcon, styles.pendingIcon]}>
            <Clock3 size={21} color={COLORS.status.warning} />
          </View>

          <Text style={styles.statNumber}>
            {driver.pendingDeliveries}
          </Text>

          <Text style={styles.statLabel}>En attente</Text>

          <ProxiBadge label="À traiter" variant="warning" />
        </ProxiCard>
      </View>

      {/* POPULARITY SLIDER */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Votre popularité</Text>
          <Text style={styles.sectionSubtitle}>
            Ce que vos clients pensent de vous
          </Text>
        </View>

        <Star
          size={22}
          color={COLORS.brand.accent}
          fill={COLORS.brand.accent}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={260 + SPACING.md}
        decelerationRate="fast"
        contentContainerStyle={styles.sliderContent}
      >
        {popularity.map((item) => {
          const Icon = item.icon;

          return (
            <ProxiCard
              key={item.id}
              style={styles.popularityCard}
            >
              <View style={styles.popularityTop}>
                <View style={styles.popularityIcon}>
                  <Icon
                    size={20}
                    color={COLORS.brand.primary}
                  />
                </View>

                <Text style={styles.popularityLabel}>
                  {item.label}
                </Text>
              </View>

              <View style={styles.valueRow}>
                <Text style={styles.popularityValue}>
                  {item.value}
                </Text>
                <Text style={styles.popularitySuffix}>
                  {item.suffix}
                </Text>
              </View>

              <Text style={styles.popularityDescription}>
                {item.description}
              </Text>
            </ProxiCard>
          );
        })}
      </ScrollView>

      {/* DELIVERIES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mes livraisons</Text>

        <ProxiBadge label="0 nouvelle" variant="neutral" />
      </View>

      <ProxiCard style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Package
            size={32}
            color={COLORS.brand.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Aucune livraison pour le moment
        </Text>

        <Text style={styles.emptyDescription}>
          Vos nouvelles missions apparaîtront ici
          dès qu'elles vous seront attribuées.
        </Text>
      </ProxiCard>

      {/* QUICK ACCESS */}
      <Text style={styles.sectionTitle}>Accès rapide</Text>

      <Pressable
        style={styles.quickAccess}
        onPress={() => router.push("/livreur/profile")}
      >
        <View style={styles.quickIcon}>
          <UserRound
            size={21}
            color={COLORS.brand.primary}
          />
        </View>

        <View style={styles.quickText}>
          <Text style={styles.quickTitle}>Mon profil</Text>
          <Text style={styles.quickDescription}>
            Consulter mes informations personnelles
          </Text>
        </View>

        <ChevronRight
          size={20}
          color={COLORS.text.secondary}
        />
      </Pressable>

      <Text style={styles.footer}>
        Proxi · Espace livreur
      </Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  driverName: {
    fontSize: 23,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 6,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    gap: SPACING.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingIcon: {
    backgroundColor: COLORS.brand.accentLight,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderContent: {
    gap: SPACING.md,
    paddingRight: SPACING.md,
  },
  popularityCard: {
    width: 260,
    gap: SPACING.md,
  },
  popularityTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  popularityIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  popularityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  popularityValue: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.brand.primary,
  },
  popularitySuffix: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  popularityDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: SPACING["2xl"],
    gap: SPACING.md,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
  quickAccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface.light,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: SPACING.md,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: {
    flex: 1,
    gap: 4,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  quickDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
});