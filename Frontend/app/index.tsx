
import { router } from "expo-router";
import { mockDeliveries } from "@/features/livreur/data/mockDeliveries";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";

import {
  ArrowRight,
  ShoppingBag,
  Store,
  Bike,
  MapPin,
  ShieldCheck,
  Clock3,
} from "lucide-react-native";

import { COLORS, RADIUS, SHADOWS } from "@/lib/theme";
import { ProxiButton } from "@/components/proxi";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Tout à portée de main",
    description: "Retrouve les commerces et produits près de chez toi.",
  },
  {
    icon: Clock3,
    title: "Gagne du temps",
    description: "Commande facilement et suis tes commandes.",
  },
  {
    icon: ShieldCheck,
    title: "Un service de proximité",
    description: "Une expérience simple, pratique et rassurante.",
  },
];

const ROLES = [
  { icon: ShoppingBag, label: "Client" },
  { icon: Store, label: "Commerçant" },
  { icon: Bike, label: "Livreur" },
];

// Temporary mock data for the driver
const activeDeliveries = mockDeliveries.filter(
  (delivery) =>
    delivery.status === "accepted" ||
    delivery.status === "picked_up" ||
    delivery.status === "on_the_way"
).length;

const pendingDeliveries = mockDeliveries.filter(
  (delivery) => delivery.status === "new"
).length;

/// remove after data backend connection !!!!!!!!!!!!

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image
            source={require("../assets/images/logo-proxi.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>proxi</Text>
        </View>

        <Pressable
          onPress={() => router.push("/login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>Connexion</Text>
          <ArrowRight size={15} color={COLORS.brand.primary} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.locationBadge}>
          <MapPin size={14} color={COLORS.brand.primary} />
          <Text style={styles.locationText}>La proximité, autrement</Text>
        </View>

        <Text style={styles.title}>
          Vos commerces{"\n"}
          <Text style={styles.titleAccent}>près de vous.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Découvrez les boutiques de votre quartier, commandez vos produits
          préférés et faites-vous livrer simplement.
        </Text>

        <View style={styles.heroActions}>
          <ProxiButton
            title="Commencer"
            onPress={() => router.push("/signup")}
            size="lg"
          />

          <Pressable
            onPress={() => router.push("/login")}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>
              J'ai déjà un compte
            </Text>
            <ArrowRight size={17} color={COLORS.brand.primary} />
          </Pressable>
        </View>

        <View style={styles.heroVisual}>
          <View style={styles.visualCircle}>
            <View style={styles.visualMainIcon}>
              <ShoppingBag size={54} color={COLORS.brand.primary} />
            </View>

            <View style={styles.floatingIconOne}>
              <Store size={22} color={COLORS.brand.primary} />
            </View>

            <View style={styles.floatingIconTwo}>
              <Bike size={22} color={COLORS.brand.primary} />
            </View>

            <View style={styles.floatingIconThree}>
              <MapPin size={20} color={COLORS.brand.accent} />
            </View>
          </View>

          <View style={styles.visualCaption}>
            <Text style={styles.visualCaptionTitle}>
              Votre quartier, à portée de clic.
            </Text>
            <Text style={styles.visualCaptionText}>
              Achetez local. Vivez pratique.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>POURQUOI PROXI ?</Text>
        <Text style={styles.sectionTitle}>
          Le commerce local,{"\n"}en toute simplicité.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <View key={feature.title} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Icon size={22} color={COLORS.brand.primary} />
                </View>

                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.rolesSection}>
        <Text style={styles.sectionEyebrow}>UNE APP, TROIS ESPACES</Text>
        <Text style={styles.sectionTitle}>
          Proxi s'adapte à vous.
        </Text>

        <View style={styles.roles}>
          {ROLES.map((role) => {
            const Icon = role.icon;

            return (
              <View key={role.label} style={styles.roleItem}>
                <View style={styles.roleIcon}>
                  <Icon size={21} color={COLORS.brand.primary} />
                </View>
                <Text style={styles.roleLabel}>{role.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomCta}>
        <Text style={styles.bottomTitle}>Prêt à découvrir Proxi ?</Text>
        <Text style={styles.bottomDescription}>
          Rejoignez une nouvelle façon de consommer local.
        </Text>

        <ProxiButton
          title="Créer mon compte"
          onPress={() => router.push("/signup")}
          size="lg"
        />
      </View>

      <Text style={styles.footer}>
        © 2026 Proxi. Tous droits réservés.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 38,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  logo: {
    width: 44,
    height: 44,
  },

  brandName: {
    color: COLORS.brand.primary,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1.2,
  },

  loginLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
  },

  loginLinkText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  hero: {
    alignItems: "flex-start",
  },

  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.brand.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginBottom: 22,
  },

  locationText: {
    color: COLORS.brand.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: COLORS.text.primary,
    fontSize: 39,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1.5,
  },

  titleAccent: {
    color: COLORS.brand.primary,
  },

  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 340,
  },

  heroActions: {
    width: "100%",
    marginTop: 25,
    gap: 13,
  },

  secondaryAction: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryActionText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  heroVisual: {
    width: "100%",
    minHeight: 285,
    marginTop: 30,
    borderRadius: 28,
    backgroundColor: "#EAF2EC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  visualCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#D7E9DC",
    alignItems: "center",
    justifyContent: "center",
  },

  visualMainIcon: {
    width: 112,
    height: 112,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  floatingIconOne: {
    position: "absolute",
    top: 7,
    right: 0,
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  floatingIconTwo: {
    position: "absolute",
    bottom: 10,
    left: -2,
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  floatingIconThree: {
    position: "absolute",
    bottom: 0,
    right: 3,
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  visualCaption: {
    alignItems: "center",
    marginTop: 20,
  },

  visualCaptionTitle: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  visualCaptionText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    marginTop: 5,
  },

  section: {
    marginTop: 48,
  },

  sectionEyebrow: {
    color: COLORS.brand.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  features: {
    gap: 12,
    marginTop: 22,
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    flex: 1,
    gap: 5,
  },

  featureTitle: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  featureDescription: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },

  rolesSection: {
    marginTop: 45,
  },

  roles: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 9,
    marginTop: 22,
  },

  roleItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 17,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 9,
  },

  roleIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  roleLabel: {
    color: COLORS.text.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  bottomCta: {
    marginTop: 45,
    padding: 22,
    borderRadius: 24,
    backgroundColor: COLORS.brand.primaryLight,
    gap: 13,
  },

  bottomTitle: {
    color: COLORS.text.primary,
    fontSize: 21,
    fontWeight: "800",
  },

  bottomDescription: {
    color: COLORS.text.secondary,
    fontSize: 13,
    lineHeight: 20,
  },

  footer: {
    textAlign: "center",
    color: COLORS.text.secondary,
    fontSize: 11,
    marginTop: 30,
  },
});
