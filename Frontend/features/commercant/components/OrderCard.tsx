import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Calendar, ChevronDown, ChevronUp } from "lucide-react-native";

import type { Order, OrderStatus } from "../data/ordersData";

import { COLORS, RADIUS, SHADOWS } from "@/lib/theme";

type OrderCardProps = {
  order: Order;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onReady: (id: number) => void;
  onDeliver: (id: number) => void;
};

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; background: string }
> = {
  pending: {
    label: "En attente",
    color: "#A9650B",
    background: "#FFF3DF",
  },

  "En attente": {
    label: "En attente",
    color: "#A9650B",
    background: "#FFF3DF",
  },

  processing: {
    label: "En préparation",
    color: COLORS.status.info,
    background: "#EAF2FA",
  },

  ready: {
    label: "Prête",
    color: COLORS.status.success,
    background: "#E8F5EC",
  },

  delivered: {
    label: "Terminée",
    color: COLORS.status.success,
    background: "#E8F5EC",
  },

  cancelled: {
    label: "Annulée",
    color: "#C63E3E",
    background: "#FCEAEA",
  },
};

export default function OrderCard({
  order,
  onAccept,
  onReject,
  onReady,
  onDeliver,
}: OrderCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const status = statusConfig[order.status];

  // Accepter les deux valeurs pour le statut en attente
  const isPending =
    order.status === "pending" ||
    order.status === "En attente";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.orderId}>
            Commande #{order.id}
          </Text>

          <View style={styles.dateRow}>
            <Calendar size={13} color={COLORS.text.secondary} />

            <Text style={styles.date}>{order.date}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.background },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: status.color },
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>

      {/* BOUTON DÉTAILS */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.detailsButton}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.detailsButtonText}>
          {showDetails
            ? "Masquer les détails"
            : "Voir les détails"}
        </Text>

        {showDetails ? (
          <ChevronUp size={16} color={COLORS.brand.primary} />
        ) : (
          <ChevronDown size={16} color={COLORS.brand.primary} />
        )}
      </TouchableOpacity>

      {/* DÉTAILS DE LA COMMANDE */}
      {showDetails && (
        <View>
          {/* CLIENT */}
          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>
              Informations du client
            </Text>

            <Text style={styles.clientName}>
              {order.clientName}
            </Text>

            <Text style={styles.info}>
              Téléphone : {order.phone}
            </Text>

            <Text style={styles.info}>
              Adresse : {order.address}
            </Text>
          </View>

          {/* PRODUITS */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>
              Produits commandés
            </Text>

            {order.items.map((item) => (
              <View key={item.id} style={styles.productRow}>
                <Text style={styles.productName}>
                  {item.name} × {item.quantity}
                </Text>

                <Text style={styles.productPrice}>
                  {item.quantity * item.price} DH
                </Text>
              </View>
            ))}
          </View>

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalPrice}>
              {order.total} DH
            </Text>
          </View>
        </View>
      )}

      {/* ACTIONS : EN ATTENTE */}
      {isPending && (
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAccept(order.id)}
            style={styles.acceptButton}
          >
            <Text style={styles.buttonText}>Accepter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onReject(order.id)}
            style={styles.rejectButton}
          >
            <Text style={styles.rejectText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* EN PRÉPARATION */}
      {order.status === "processing" && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onReady(order.id)}
          style={styles.readyButton}
        >
          <Text style={styles.buttonText}>
            Marquer comme prête
          </Text>
        </TouchableOpacity>
      )}

      {/* PRÊTE */}
      {order.status === "ready" && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onDeliver(order.id)}
          style={styles.acceptButton}
        >
          <Text style={styles.buttonText}>
            Marquer comme traitée
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...SHADOWS.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  headerInfo: {
    flex: 1,
  },

  orderId: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },

  date: {
    color: COLORS.text.secondary,
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  detailsButton: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: COLORS.brand.primaryLight,
    borderRadius: 14,
  },

  detailsButtonText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  clientSection: {
    marginTop: 18,
  },

  clientName: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  info: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  productsSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },

  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  productName: {
    flex: 1,
    color: COLORS.text.secondary,
    fontSize: 13,
  },

  productPrice: {
    color: COLORS.text.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingTop: 14,
    marginTop: 6,
  },

  totalLabel: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  totalPrice: {
    color: COLORS.brand.primary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  acceptButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  rejectButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#FCEAEA",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  readyButton: {
    height: 50,
    backgroundColor: COLORS.status.info,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  rejectText: {
    color: "#C63E3E",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});