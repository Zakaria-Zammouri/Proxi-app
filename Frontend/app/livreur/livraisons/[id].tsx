import { useCallback, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, MapPin, Navigation, Package, Phone, Store, UserRound, XCircle } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { getDeliveryById, updateDeliveryStatus } from "@/features/livreur/data/mockDeliveries";
import type { Delivery, DeliveryStatus } from "@/features/livreur/types/deliveries";
import { PrimaryButton, StatusPill, SurfaceCard } from "@/features/livreur/components/LivreurUI";

const nextStep: Partial<Record<DeliveryStatus, { status: DeliveryStatus; label: string }>> = {
  new: { status: "accepted", label: "Accepter la livraison" },
  accepted: { status: "picked_up", label: "Confirmer la récupération" },
  picked_up: { status: "on_the_way", label: "Démarrer la livraison" },
  on_the_way: { status: "delivered", label: "Confirmer la livraison" },
};

export default function DeliveryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [delivery, setDelivery] = useState<Delivery | undefined>(getDeliveryById(String(id)));

  useFocusEffect(useCallback(() => { setDelivery(getDeliveryById(String(id))); }, [id]));

  if (!delivery) {
    return <View style={styles.notFound}><Text style={styles.notFoundText}>Cette livraison est introuvable.</Text></View>;
  }

  const step = nextStep[delivery.status];

  function confirmStatusChange() {
    if (!step) return;
    Alert.alert("Confirmer l'action", `Passer la commande au statut « ${step.label} » ?`, [
      { text: "Retour", style: "cancel" },
      { text: "Confirmer", onPress: () => setDelivery(updateDeliveryStatus(delivery!.id, step.status)) },
    ]);
  }

  function cancelDelivery() {
    if (delivery!.status !== "new" && delivery!.status !== "accepted") return;
    Alert.alert("Annuler la livraison", "Voulez-vous vraiment annuler cette livraison ?", [
      { text: "Garder", style: "cancel" },
      { text: "Annuler la commande", style: "destructive", onPress: () => setDelivery(updateDeliveryStatus(delivery!.id, "cancelled")) },
    ]);
  }

  async function callCustomer() {
    try { await Linking.openURL(`tel:${delivery!.customer.phone}`); } catch { Alert.alert("Appel indisponible", "Votre appareil ne permet pas de lancer cet appel."); }
  }

  async function openDestination() {
    const address = encodeURIComponent(`${delivery!.destination.address}, ${delivery!.destination.city}, Morocco`);
    try { await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`); } catch { Alert.alert("Navigation indisponible", "Impossible d'ouvrir l'application de cartes."); }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}><ArrowLeft size={19} color={COLORS.text.primary} /><Text style={styles.backText}>Retour aux livraisons</Text></Pressable>
        <View style={styles.heading}><View style={styles.headingCopy}><Text style={styles.eyebrow}>DÉTAIL DE LA COMMANDE</Text><Text style={styles.reference}>{delivery.reference}</Text></View><StatusPill status={delivery.status} /></View>

        <SurfaceCard>
          <View style={styles.cardHeading}><UserRound size={18} color={COLORS.brand.primary} /><Text style={styles.cardTitle}>Informations client</Text></View>
          <Text style={styles.personName}>{delivery.customer.name}</Text>
          <View style={styles.inlineInfo}><Phone size={15} color={COLORS.text.secondary} /><Text style={styles.mutedText}>{delivery.customer.phone}</Text></View>
          <Pressable onPress={callCustomer} style={styles.callButton}><Phone size={16} color={COLORS.brand.primary} /><Text style={styles.callText}>Appeler le client</Text></Pressable>
        </SurfaceCard>

        <SurfaceCard>
          <View style={styles.cardHeading}><Store size={18} color={COLORS.brand.primary} /><Text style={styles.cardTitle}>Point de récupération</Text></View>
          <Text style={styles.personName}>{delivery.pickup.name}</Text>
          <View style={styles.inlineInfo}><MapPin size={15} color={COLORS.text.secondary} /><Text style={styles.mutedText}>{delivery.pickup.address}</Text></View>
        </SurfaceCard>

        <SurfaceCard>
          <View style={styles.cardHeading}><Navigation size={18} color={COLORS.status.success} /><Text style={styles.cardTitle}>Adresse de livraison</Text></View>
          <Text style={styles.personName}>{delivery.destination.address}</Text>
          <Text style={styles.mutedText}>{delivery.destination.city}</Text>
          <Pressable onPress={openDestination} style={styles.callButton}><Navigation size={16} color={COLORS.brand.primary} /><Text style={styles.callText}>Ouvrir dans Maps</Text></Pressable>
        </SurfaceCard>

        <SurfaceCard>
          <View style={styles.cardHeading}><Package size={18} color={COLORS.brand.primary} /><Text style={styles.cardTitle}>Articles commandés</Text></View>
          {delivery.items.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.itemRow}><View style={styles.itemCopy}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.mutedText}>Quantité : {item.quantity}</Text></View><Text style={styles.itemPrice}>{item.quantity * item.price} MAD</Text></View>
          ))}
          <View style={styles.separator} />
          <View style={styles.totalRow}><Text style={styles.mutedText}>Sous-total articles</Text><Text style={styles.mutedText}>{delivery.total - delivery.deliveryFee} MAD</Text></View>
          <View style={styles.totalRow}><Text style={styles.mutedText}>Frais de livraison</Text><Text style={styles.mutedText}>{delivery.deliveryFee} MAD</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total commande</Text><Text style={styles.totalValue}>{delivery.total} MAD</Text></View>
        </SurfaceCard>

        {delivery.notes ? <SurfaceCard><Text style={styles.cardTitle}>Instructions</Text><Text style={styles.mutedText}>{delivery.notes}</Text></SurfaceCard> : null}

        {delivery.status === "on_the_way" ? (
          <View style={styles.trackingNotice}><Navigation size={20} color={COLORS.brand.primary} /><View style={{ flex: 1 }}><Text style={styles.trackingTitle}>Livraison en cours</Text><Text style={styles.mutedText}>Le suivi GPS en temps réel sera activé lorsque le backend et le partage de position seront intégrés.</Text></View></View>
        ) : null}

        {step ? <PrimaryButton label={step.label} icon={<CheckCircle2 size={19} color="#FFFFFF" />} onPress={confirmStatusChange} /> : null}
        {delivery.status === "new" || delivery.status === "accepted" ? (
          <Pressable onPress={cancelDelivery} style={styles.cancelButton}><XCircle size={17} color={COLORS.status.error} /><Text style={styles.cancelText}>Annuler cette livraison</Text></Pressable>
        ) : null}
        {delivery.status === "delivered" ? <View style={styles.terminalNotice}><CheckCircle2 size={20} color={COLORS.status.success} /><Text style={styles.terminalText}>Livraison terminée avec succès.</Text></View> : null}
        {delivery.status === "cancelled" ? <View style={styles.cancelledNotice}><XCircle size={20} color={COLORS.status.error} /><Text style={styles.cancelledText}>Cette livraison a été annulée.</Text></View> : null}
        <Text style={styles.disclaimer}>Mode démonstration : les changements de statut sont conservés uniquement en mémoire sur cet appareil.</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background.light },
  content: { padding: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 48 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background.light },
  notFoundText: { color: COLORS.text.primary, fontWeight: "700" },
  backButton: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: SPACING.sm, marginBottom: SPACING.lg },
  backText: { color: COLORS.text.secondary, fontSize: 12, fontWeight: "700" },
  heading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: SPACING.lg },
  headingCopy: { flex: 1 },
  eyebrow: { color: COLORS.brand.primary, fontSize: 9, fontWeight: "800", letterSpacing: 1.2, marginBottom: 5 },
  reference: { color: COLORS.text.primary, fontSize: 22, fontWeight: "800" },
  cardHeading: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: SPACING.md },
  cardTitle: { color: COLORS.text.primary, fontSize: 14, fontWeight: "800" },
  personName: { color: COLORS.text.primary, fontSize: 15, fontWeight: "800", marginBottom: 6 },
  inlineInfo: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  mutedText: { color: COLORS.text.secondary, fontSize: 12, lineHeight: 18, flexShrink: 1 },
  callButton: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 9, borderRadius: RADIUS.md, backgroundColor: COLORS.brand.primaryLight, marginTop: SPACING.md },
  callText: { color: COLORS.brand.primary, fontSize: 11, fontWeight: "800" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, paddingVertical: 10 },
  itemCopy: { flex: 1 },
  itemName: { color: COLORS.text.primary, fontSize: 12, fontWeight: "700", marginBottom: 3 },
  itemPrice: { color: COLORS.text.primary, fontSize: 12, fontWeight: "700" },
  separator: { height: 1, backgroundColor: COLORS.border.light, marginVertical: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  totalLabel: { color: COLORS.text.primary, fontSize: 13, fontWeight: "800" },
  totalValue: { color: COLORS.brand.primary, fontSize: 16, fontWeight: "900" },
  trackingNotice: { flexDirection: "row", gap: 12, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.brand.primaryLight, marginBottom: SPACING.md },
  trackingTitle: { color: COLORS.text.primary, fontWeight: "800", fontSize: 13, marginBottom: 4 },
  cancelButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, padding: SPACING.md, marginTop: SPACING.sm },
  cancelText: { color: COLORS.status.error, fontSize: 12, fontWeight: "800" },
  terminalNotice: { flexDirection: "row", alignItems: "center", gap: 9, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: "#E7F4EB" },
  terminalText: { color: COLORS.status.success, fontWeight: "800", fontSize: 12 },
  cancelledNotice: { flexDirection: "row", alignItems: "center", gap: 9, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: "#FCEAEA" },
  cancelledText: { color: COLORS.status.error, fontWeight: "800", fontSize: 12 },
  disclaimer: { color: COLORS.text.secondary, textAlign: "center", fontSize: 9, lineHeight: 14, marginTop: SPACING.lg },
});
