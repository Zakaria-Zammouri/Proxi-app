import { useState, useCallback } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ArrowLeft, Package } from "lucide-react-native";

import { useRouter, useFocusEffect } from "expo-router";

import OrderCard from "@/features/commercant/components/OrderCard";

import {
  initialOrders,
  type Order,
  type OrderStatus,
} from "@/features/commercant/data/ordersData";

import { COLORS, RADIUS } from "@/lib/theme";

const STORAGE_KEY = "proxi_orders";

type FilterStatus = "all" | OrderStatus;

// Vérifier si une commande est en attente
const isPendingOrder = (status: OrderStatus) =>
  status === "pending" || status === "En attente";

export default function OrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [selectedFilter, setSelectedFilter] =
    useState<FilterStatus>("all");

  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les commandes à chaque ouverture
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadOrders = async () => {
        try {
          const savedOrders = await AsyncStorage.getItem(STORAGE_KEY);

          let loadedOrders: Order[];

          if (savedOrders !== null) {
            const parsedOrders: Order[] = JSON.parse(savedOrders);

            if (!Array.isArray(parsedOrders)) {
              throw new Error("Format des commandes invalide");
            }

            const savedById = new Map(
              parsedOrders.map((order) => [order.id, order])
            );

            const initialIds = new Set(
              initialOrders.map((order) => order.id)
            );

            loadedOrders = [
              ...initialOrders.map(
                (order) => savedById.get(order.id) ?? order
              ),

              ...parsedOrders.filter(
                (order) =>
                  !initialIds.has(order.id) &&
                  !(order.id === 3 && order.clientName === "Sara")
              ),
            ];
          } else {
            loadedOrders = initialOrders.filter(
              (order) =>
                !(order.id === 3 && order.clientName === "Sara")
            );
          }

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(loadedOrders)
          );

          if (isActive) {
            setOrders(loadedOrders);
          }
        } catch (error) {
          console.log("Erreur chargement commandes :", error);
        } finally {
          if (isActive) {
            setIsLoaded(true);
          }
        }
      };

      setIsLoaded(false);
      loadOrders();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Modifier le statut et sauvegarder
  const updateOrderStatus = async (
    id: number,
    status: OrderStatus
  ) => {
    try {
      const savedOrders = await AsyncStorage.getItem(STORAGE_KEY);

      const latestOrders: Order[] = savedOrders
        ? JSON.parse(savedOrders)
        : orders;

      if (!Array.isArray(latestOrders)) {
        throw new Error("Format des commandes invalide");
      }

      const updatedOrders = latestOrders.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedOrders)
      );

      setOrders(updatedOrders);

      console.log(
        `Commande #${id} sauvegardée : ${status}`
      );
    } catch (error) {
      console.log("Erreur sauvegarde :", error);

      if (Platform.OS === "web") {
        window.alert("Impossible de sauvegarder les commandes.");
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de sauvegarder les commandes."
        );
      }
    }
  };

  // Accepter une commande
  const handleAccept = (id: number) => {
    const confirmAccept = () => {
      updateOrderStatus(id, "processing");
    };

    if (Platform.OS === "web") {
      if (window.confirm("Voulez-vous accepter cette commande ?")) {
        confirmAccept();
      }
    } else {
      Alert.alert(
        "Accepter la commande",
        "Voulez-vous accepter cette commande ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Accepter",
            onPress: confirmAccept,
          },
        ]
      );
    }
  };

  // Refuser une commande
  const handleReject = (id: number) => {
    const confirmReject = () => {
      updateOrderStatus(id, "cancelled");
    };

    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Êtes-vous sûr de vouloir refuser cette commande ?"
        )
      ) {
        confirmReject();
      }
    } else {
      Alert.alert(
        "Refuser la commande",
        "Êtes-vous sûr de vouloir refuser cette commande ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Refuser",
            style: "destructive",
            onPress: confirmReject,
          },
        ]
      );
    }
  };

  // Marquer une commande comme prête
  const handleReady = (id: number) => {
    updateOrderStatus(id, "ready");
  };

  // Marquer une commande comme livrée
  const handleDeliver = (id: number) => {
    const confirmDeliver = () => {
      updateOrderStatus(id, "delivered");
    };

    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Confirmer que cette commande est terminée ?"
        )
      ) {
        confirmDeliver();
      }
    } else {
      Alert.alert(
        "Terminer la commande",
        "Confirmer que cette commande est terminée ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Confirmer",
            onPress: confirmDeliver,
          },
        ]
      );
    }
  };

  // Statistiques
  const pendingCount = orders.filter(
    (order) => isPendingOrder(order.status)
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "processing"
  ).length;

  const readyCount = orders.filter(
    (order) => order.status === "ready"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  // Filtres
  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : selectedFilter === "pending" ||
        selectedFilter === "En attente"
      ? orders.filter((order) => isPendingOrder(order.status))
      : orders.filter(
          (order) => order.status === selectedFilter
        );

  const filters: {
    label: string;
    value: FilterStatus;
  }[] = [
    { label: "Toutes", value: "all" },
    { label: "En attente", value: "pending" },
    { label: "En préparation", value: "processing" },
    { label: "Prêtes", value: "ready" },
    { label: "Terminées", value: "delivered" },
    { label: "Annulées", value: "cancelled" },
  ];

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Chargement des commandes...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/commercant")}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={21} color={COLORS.text.primary} />
        </Pressable>

        <Text style={styles.eyebrow}>ESPACE COMMERÇANT</Text>

        <Text style={styles.title}>Mes commandes</Text>

        <Text style={styles.subtitle}>
          Gérez et suivez les commandes de votre commerce.
        </Text>

        <View style={styles.banner}>
          <View style={styles.bannerItem}>
            <Text style={styles.bannerNumber}>{orders.length}</Text>
            <Text style={styles.bannerLabel}>Total commandes</Text>
          </View>

          <View style={styles.bannerDivider} />

          <View style={styles.bannerItem}>
            <Text style={styles.bannerNumber}>{pendingCount}</Text>
            <Text style={styles.bannerLabel}>En attente</Text>
          </View>
        </View>

        {/* STATISTIQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>STATISTIQUES</Text>

          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statNumber,
                  { color: COLORS.status.warning },
                ]}
              >
                {pendingCount}
              </Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statNumber,
                  { color: COLORS.status.info },
                ]}
              >
                {processingCount}
              </Text>
              <Text style={styles.statLabel}>En préparation</Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statNumber,
                  { color: COLORS.brand.primary },
                ]}
              >
                {readyCount}
              </Text>
              <Text style={styles.statLabel}>Prêtes</Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statNumber,
                  { color: COLORS.status.success },
                ]}
              >
                {deliveredCount}
              </Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statNumber,
                  { color: COLORS.status.error },
                ]}
              >
                {cancelledCount}
              </Text>
              <Text style={styles.statLabel}>Annulées</Text>
            </View>
          </View>
        </View>

        {/* LISTE DES COMMANDES */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>SUIVI</Text>

          <Text style={styles.sectionTitle}>
            Liste des commandes
          </Text>

          {/* FILTRES */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.value &&
                    styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.value &&
                      styles.activeFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* COMMANDES */}
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Package size={28} color={COLORS.brand.primary} />
              </View>

              <Text style={styles.emptyTitle}>
                Aucune commande
              </Text>

              <Text style={styles.emptyText}>
                Aucune commande dans cette catégorie pour le moment.
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onReady={handleReady}
                onDeliver={handleDeliver}
              />
            ))
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>proxi</Text>

          <Text style={styles.footerText}>
            Votre commerce, simplement.
          </Text>
        </View>
      </ScrollView>
    </View>
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background.light,
  },

  loadingText: {
    color: COLORS.brand.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  // HEADER

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
  },

  eyebrow: {
    color: COLORS.brand.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  title: {
    color: COLORS.text.primary,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 300,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    marginTop: 28,
    padding: 22,
    borderRadius: 24,
    backgroundColor: COLORS.brand.primary,
  },

  bannerItem: {
    flex: 1,
  },

  bannerNumber: {
    color: "#FFFFFF",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  bannerLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  bannerDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  // SECTIONS

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
    marginBottom: 20,
  },

  // STATISTIQUES

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "31%",
    flexGrow: 1,
    minHeight: 88,
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  statNumber: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },

  // FILTRES

  filtersScroll: {
    marginBottom: 18,
    marginHorizontal: -22,
  },

  filtersContainer: {
    gap: 8,
    paddingHorizontal: 22,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  activeFilter: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },

  filterText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: "700",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  // ÉTAT VIDE

  emptyContainer: {
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  emptyText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
  },

  // FOOTER

  footer: {
    alignItems: "center",
    marginTop: 40,
  },

  footerBrand: {
    color: COLORS.brand.primary,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  footerText: {
    color: COLORS.text.secondary,
    fontSize: 11,
    marginTop: 6,
  },
});