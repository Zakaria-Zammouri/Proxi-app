
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import {
  MapPin,
  Phone,
  Package,
  Store,
  CheckCircle2,
  Clock3,
  Navigation,
} from "lucide-react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "@/lib/theme";

import { ProxiCard } from "@/components/proxi/ProxiCard";
import { ProxiBadge } from "@/components/proxi/ProxiBadge";
import { getDeliveryById } from "@/features/livreur/data/mockDeliveries";
import type { DeliveryStatus } from "@/features/livreur/types/deliveries";

const statusConfig: Record<
  DeliveryStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" | "brand" }
> = {
  new: { label: "Nouvelle", variant: "info" },
  accepted: { label: "Acceptée", variant: "brand" },
  picked_up: { label: "Récupérée", variant: "warning" },
  on_the_way: { label: "En cours de livraison", variant: "warning" },
  delivered: { label: "Livrée", variant: "success" },
  cancelled: { label: "Annulée", variant: "error" },
};

const steps: { status: DeliveryStatus; label: string }[] = [
  { status: "new", label: "Nouvelle commande" },
  { status: "accepted", label: "Commande acceptée" },
  { status: "picked_up", label: "Commande récupérée" },
  { status: "on_the_way", label: "En cours de livraison" },
  { status: "delivered", label: "Commande livrée" },
];

const statusOrder: DeliveryStatus[] = [
  "new",
  "accepted",
  "picked_up",
  "on_the_way",
  "delivered",
];

export default function DeliveryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const delivery = getDeliveryById(id);

  if (!delivery) {
    return (
      <View style={styles.notFound}>
        <Package size={40} color={COLORS.text.secondary} />
        <Text style={styles.notFoundTitle}>
          Livraison introuvable
        </Text>
        <Text style={styles.notFoundText}>
          Cette commande n'existe pas dans nos données.
        </Text>
      </View>
    );
  }

  const currentIndex = statusOrder.indexOf(delivery.status);
  const isCancelled = delivery.status === "cancelled";

  return (
    <>
      <Stack.Screen options={{ title: "Détails de livraison" }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ORDER HEADER */}
        <ProxiCard style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Text style={styles.reference}>
              {delivery.reference}
            </Text>
            <ProxiBadge
              label={statusConfig[delivery.status].label}
              variant={statusConfig[delivery.status].variant}
            />
          </View>

          <Text style={styles.total}>
            {delivery.total} MAD
          </Text>
          <Text style={styles.date}>
            Commande créée à {delivery.createdAt}
          </Text>
        </ProxiCard>

        {/* PROGRESS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Suivi de la livraison
          </Text>

          <ProxiCard style={styles.progressCard}>
            {isCancelled ? (
              <ProxiBadge label="Commande annulée" variant="error" />
            ) : (
              steps.map((step, index) => {
                const completed = index <= currentIndex;
                const current = index === currentIndex;

                return (
                  <View key={step.status} style={styles.step}>
                    <View style={styles.stepIndicator}>
                      {completed ? (
                        <CheckCircle2
                          size={21}
                          color={COLORS.brand.primary}
                        />
                      ) : (
                        <View style={styles.pendingDot} />
                      )}

                      {index !== steps.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            completed && styles.completedLine,
                          ]}
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.stepLabel,
                        current && styles.currentStep,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                );
              })
            )}
          </ProxiCard>
        </View>

        {/* CUSTOMER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>

          <ProxiCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.iconContainer}>
                <Phone size={20} color={COLORS.brand.primary} />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>
                  {delivery.customer.name}
                </Text>
                <Text style={styles.infoSubtitle}>
                  {delivery.customer.phone}
                </Text>
              </View>
            </View>
          </ProxiCard>
        </View>

        {/* PICKUP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Point de récupération</Text>

          <ProxiCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.iconContainer}>
                <Store size={20} color={COLORS.brand.primary} />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>
                  {delivery.pickup.name}
                </Text>
                <Text style={styles.infoSubtitle}>
                  {delivery.pickup.address}
                </Text>
              </View>
            </View>
          </ProxiCard>
        </View>

        {/* DESTINATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination</Text>

          <ProxiCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.iconContainer, styles.destinationIcon]}>
                <MapPin size={20} color={COLORS.status.warning} />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>
                  {delivery.destination.address}
                </Text>
                <Text style={styles.infoSubtitle}>
                  {delivery.destination.city}
                </Text>
              </View>
            </View>
          </ProxiCard>
        </View>

        {/* ITEMS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de la commande</Text>

          <ProxiCard style={styles.itemsCard}>
            {delivery.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemNameContainer}>
                  <Text style={styles.itemQuantity}>
                    {item.quantity}x
                  </Text>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>
                </View>

                <Text style={styles.itemPrice}>
                  {item.price * item.quantity} MAD
                </Text>
              </View>
            ))}

            <View style={styles.separator} />

            <View style={styles.itemRow}>
              <Text style={styles.feeLabel}>Frais de livraison</Text>
              <Text style={styles.itemPrice}>
                {delivery.deliveryFee} MAD
              </Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalLabel}>
                {delivery.total} MAD
              </Text>
            </View>
          </ProxiCard>
        </View>

        {/* NOTES */}
        {delivery.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <ProxiCard style={styles.notesCard}>
              <Text style={styles.notesText}>
                {delivery.notes}
              </Text>
            </ProxiCard>
          </View>
        )}

        {/* LOCATION PLACEHOLDER */}
        {delivery.status === "on_the_way" && (
          <ProxiCard style={styles.trackingCard}>
            <Navigation
              size={24}
              color={COLORS.brand.primary}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Suivi GPS
              </Text>
              <Text style={styles.infoSubtitle}>
                Le partage de position sera disponible
                lorsque le système de géolocalisation sera intégré.
              </Text>
            </View>
          </ProxiCard>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING["4xl"],
    gap: SPACING.lg,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background.light,
    gap: SPACING.md,
    padding: SPACING.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  notFoundText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  headerCard: {
    gap: SPACING.sm,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  reference: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  total: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.brand.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  progressCard: {
    gap: SPACING.xs,
  },
  step: {
    flexDirection: "row",
    minHeight: 43,
    gap: SPACING.md,
  },
  stepIndicator: {
    width: 22,
    alignItems: "center",
  },
  pendingDot: {
    width: 13,
    height: 13,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    marginTop: 3,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: 3,
  },
  completedLine: {
    backgroundColor: COLORS.brand.primary,
  },
  stepLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    paddingTop: 2,
  },
  currentStep: {
    fontWeight: "700",
    color: COLORS.brand.primary,
  },
  infoCard: {
    gap: SPACING.md,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  destinationIcon: {
    backgroundColor: COLORS.brand.accentLight,
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  infoSubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  itemsCard: {
    gap: SPACING.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
  },
  itemNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand.primary,
  },
  itemName: {
    fontSize: 13,
    color: COLORS.text.primary,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
  },
  feeLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  notesCard: {
    backgroundColor: COLORS.brand.accentLight,
    borderColor: COLORS.brand.accentLight,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 19,
  },
  trackingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.brand.primaryLight,
    borderColor: COLORS.brand.primaryLight,
  },
});