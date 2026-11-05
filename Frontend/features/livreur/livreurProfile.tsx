
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  UserRound,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Clock,
} from "lucide-react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
  SHADOWS,
} from "@/lib/theme";

import {
  ProxiCard,
  ProxiBadge,
} from "@/components/proxi";

export default function LivreurProfile() {
  // Temporary mock data
  const driver = {
    name: "Zakariae Berkane",
    email: "livreur@proxi.ma",
    phone: "06 12 34 56 78",
    role: "Livreur Proxi",
    status: "Compte actif",
  };

  return (
    <View style={styles.container}>

      {/* Page heading */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Mon profil</Text>
        <Text style={styles.pageSubtitle}>
          Gérez vos informations personnelles
        </Text>
      </View>

      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <UserRound
            size={42}
            color={COLORS.brand.primary}
          />
        </View>

        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.role}>{driver.role}</Text>

        <ProxiBadge
          label={driver.status}
          variant="success"
        />
      </View>

      {/* Personal information */}
      <ProxiCard style={styles.infoCard}>
        <Text style={styles.sectionTitle}>
          Informations personnelles
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Mail size={19} color={COLORS.brand.primary} />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Adresse email</Text>
            <Text style={styles.value}>{driver.email}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Phone size={19} color={COLORS.brand.primary} />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{driver.phone}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <ShieldCheck
              size={19}
              color={COLORS.brand.primary}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Statut du compte</Text>
            <Text style={styles.value}>{driver.status}</Text>
          </View>
        </View>
      </ProxiCard>

      {/* Account actions */}
      <Text style={styles.sectionHeading}>
        Mon compte
      </Text>

      <ProxiCard padding={0} style={styles.actionsCard}>

        <Pressable style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Clock size={19} color={COLORS.text.secondary} />
          </View>

          <Text style={styles.actionText}>
            Historique des livraisons
          </Text>

          <ChevronRight size={20} color={COLORS.text.secondary} />
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={styles.actionRow}
          onPress={() => {}}
        >
          <View style={styles.actionIcon}>
            <LogOut size={19} color={COLORS.status.error} />
          </View>

          <Text style={styles.logoutText}>
            Se déconnecter
          </Text>
        </Pressable>

      </ProxiCard>

      <Text style={styles.version}>
        PROXI · Espace livreur
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING["2xl"],
  },

  pageHeader: {
    marginBottom: SPACING.xl,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text.primary,
  },

  pageSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.surface.light,
    ...SHADOWS.card,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text.primary,
  },

  role: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  infoCard: {
    marginBottom: SPACING["2xl"],
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    gap: SPACING.xs,
  },

  label: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.sm,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },

  actionsCard: {
    overflow: "hidden",
  },

  actionRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },

  actionIcon: {
    width: 36,
    alignItems: "center",
  },

  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },

  logoutText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.status.error,
  },

  version: {
    textAlign: "center",
    color: COLORS.text.disabled,
    fontSize: 11,
    marginTop: SPACING["2xl"],
  },
});