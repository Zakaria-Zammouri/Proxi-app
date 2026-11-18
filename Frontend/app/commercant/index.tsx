import { useState, useCallback } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Bell,
  ShoppingBag,
  ClipboardList,
  CircleCheck,
  Wallet,
  Package,
  Plus,
  TriangleAlert,
  ChevronRight,
  ArrowRight,
} from "lucide-react-native";

import {
  initialOrders,
  type Order,
} from "@/features/commercant/data/ordersData";

import {
  productsData,
  type Product,
} from "@/features/commercant/data/productsData";

import OrderSummary from "@/features/commercant/components/OrderSummary";
import SalesChart from "@/features/commercant/components/SalesChart";

import { COLORS, RADIUS, SHADOWS } from "@/lib/theme";

const STORAGE_KEY = "proxi_orders";
const PRODUCTS_STORAGE_KEY = "proxi_products";

const removeOldTestOrder = (orders: Order[]) => {
  return orders.filter(
    (order) => !(order.id === 3 && order.clientName === "Sara")
  );
};

const isPendingOrder = (status: Order["status"]) => {
  return status === "pending" || status === "En attente";
};

export default function CommercantDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Recharger les commandes à chaque ouverture du Dashboard
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

            loadedOrders = removeOldTestOrder(parsedOrders);
          } else {
            loadedOrders = removeOldTestOrder(initialOrders);
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

          if (isActive) {
            setOrders(removeOldTestOrder(initialOrders));
          }
        }
      };

      // Charger les produits pour afficher l'état du stock
      const loadProducts = async () => {
        try {
          const savedProducts = await AsyncStorage.getItem(
            PRODUCTS_STORAGE_KEY
          );

          let loadedProducts: Product[] = productsData;

          if (savedProducts !== null) {
            const parsedProducts: Product[] =
              JSON.parse(savedProducts);

            if (Array.isArray(parsedProducts)) {
              loadedProducts = parsedProducts;
            }
          }

          if (isActive) {
            setProducts(loadedProducts);
          }
        } catch (error) {
          console.log("Erreur chargement produits :", error);

          if (isActive) {
            setProducts(productsData);
          }
        }
      };

      loadOrders();
      loadProducts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Commandes livrées
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  );

  // Total des ventes : uniquement les commandes livrées
  const salesTotal = deliveredOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  // Statistiques
  const pendingCount = orders.filter(
    (order) => isPendingOrder(order.status)
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "processing"
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  // Stock (mêmes règles que la page produits)
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock < 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  // Dernières commandes
  const recentOrders = orders.slice(-2).reverse();

  // Format des ventes
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("fr-FR")} DH`;
  };

  // Traduction des statuts
  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
      case "En attente":
        return "En attente";
      case "processing":
        return "En préparation";
      case "ready":
        return "Prête";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  // Couleurs des statuts
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
      case "En attente":
        return COLORS.status.warning;
      case "processing":
        return COLORS.status.info;
      case "ready":
      case "delivered":
        return COLORS.status.success;
      case "cancelled":
        return COLORS.status.error;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Image
            source={require("../../assets/images/logo-proxi.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>proxi</Text>
        </View>

        <Pressable
          style={styles.notificationButton}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Bell size={20} color={COLORS.text.primary} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>Commerce actif</Text>
        </View>

        <Text style={styles.greeting}>Bonjour 👋</Text>

        <Text style={styles.title}>
          <Text style={styles.titleAccent}>Commerçant !</Text>
        </Text>

        <Text style={styles.subtitle}>
          Gérez votre activité et suivez vos performances
          en toute simplicité.
        </Text>
      </View>

      {/* STATISTIQUES */}

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>MON ACTIVITÉ</Text>

        <Text style={styles.sectionTitle}>
          Vue d'ensemble
        </Text>

        <Text style={styles.sectionSubtitle}>
          Les performances de votre commerce
        </Text>

        <View style={styles.statsGrid}>
          {/* VENTES */}

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Wallet size={21} color={COLORS.brand.primary} />
            </View>

            <Text style={styles.statValue} numberOfLines={1}>
              {formatPrice(salesTotal)}
            </Text>

            <Text style={styles.statLabel}>Ventes totales</Text>
          </View>

          {/* COMMANDES */}

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <ClipboardList size={21} color={COLORS.brand.primary} />
            </View>

            <Text style={styles.statValue}>{orders.length}</Text>

            <Text style={styles.statLabel}>Commandes</Text>
          </View>

          {/* LIVRAISONS */}

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <CircleCheck size={21} color={COLORS.brand.primary} />
            </View>

            <Text style={styles.statValue}>
              {deliveredOrders.length}
            </Text>

            <Text style={styles.statLabel}>Livrées</Text>
          </View>
        </View>
      </View>

      {/* STOCK */}

      <View style={styles.section}>
        <View style={styles.recentHeader}>
          <View style={styles.recentHeaderText}>
            <Text style={styles.sectionEyebrow}>STOCK</Text>

            <Text style={styles.sectionTitle}>
              État du stock
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/commercant/products?add=1")}
          >
            <Plus size={17} color="#FFFFFF" />

            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionSubtitle}>
          Surveillez vos produits à réapprovisionner
        </Text>

        <Pressable
          style={styles.stockCard}
          onPress={() => router.push("/commercant/products")}
        >
          <View style={styles.stockItem}>
            <Text
              style={[
                styles.stockNumber,
                { color: COLORS.status.warning },
              ]}
            >
              {lowStockCount}
            </Text>

            <Text style={styles.stockLabel}>Stock faible</Text>
          </View>

          <View style={styles.stockDivider} />

          <View style={styles.stockItem}>
            <Text
              style={[
                styles.stockNumber,
                { color: COLORS.status.error },
              ]}
            >
              {outOfStockCount}
            </Text>

            <Text style={styles.stockLabel}>Rupture de stock</Text>
          </View>

          <View style={styles.stockDivider} />

          <View style={styles.stockItem}>
            <Text style={styles.stockNumber}>{products.length}</Text>

            <Text style={styles.stockLabel}>Produits</Text>
          </View>
        </Pressable>

        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <View style={styles.stockAlert}>
            <TriangleAlert size={16} color="#A9650B" />

            <Text style={styles.stockAlertText}>
              Certains produits nécessitent un réapprovisionnement.
            </Text>
          </View>
        )}
      </View>

      {/* GRAPHIQUE DES VENTES */}

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>PERFORMANCES</Text>

        <Text style={styles.sectionTitle}>Mes ventes</Text>

        <Text style={styles.sectionSubtitle}>
          Évolution de votre chiffre d'affaires
        </Text>

        <View style={styles.card}>
          <SalesChart orders={orders} />
        </View>
      </View>

      {/* STATISTIQUES COMMANDES */}

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>COMMANDES</Text>

        <Text style={styles.sectionTitle}>
          Suivi des commandes
        </Text>

        <Text style={styles.sectionSubtitle}>
          Consultez l'état de vos commandes
        </Text>

        <View style={styles.card}>
          <OrderSummary
            pending={pendingCount}
            processing={processingCount}
            delivered={deliveredOrders.length}
            cancelled={cancelledCount}
          />
        </View>
      </View>

      {/* DERNIÈRES COMMANDES */}

      <View style={styles.section}>
        <View style={styles.recentHeader}>
          <View style={styles.recentHeaderText}>
            <Text style={styles.sectionEyebrow}>ACTIVITÉ</Text>

            <Text style={styles.sectionTitle}>
              Commandes récentes
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/commercant/orders")}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>Voir tout</Text>
            <ArrowRight size={15} color={COLORS.brand.primary} />
          </Pressable>
        </View>

        <Text style={styles.sectionSubtitle}>
          Vos dernières activités
        </Text>

        {recentOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Package size={28} color={COLORS.brand.primary} />
            </View>

            <Text style={styles.emptyTitle}>Aucune commande</Text>

            <Text style={styles.emptyText}>
              Vos nouvelles commandes apparaîtront ici.
            </Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {recentOrders.map((order) => (
              <Pressable
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push("/commercant/orders")}
              >
                <View style={styles.orderIcon}>
                  <ShoppingBag size={22} color={COLORS.brand.primary} />
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.orderClient} numberOfLines={1}>
                    {order.clientName}
                  </Text>

                  <Text style={styles.orderNumber}>
                    Commande #{order.id}
                  </Text>

                  <Text style={styles.orderPrice}>
                    {formatPrice(Number(order.total || 0))}
                  </Text>
                </View>

                <View style={styles.orderRight}>
                  <View
                    style={[
                      styles.orderStatus,
                      {
                        backgroundColor:
                          getStatusColor(order.status) + "18",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.orderStatusDot,
                        {
                          backgroundColor: getStatusColor(
                            order.status
                          ),
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.orderStatusText,
                        {
                          color: getStatusColor(order.status),
                        },
                      ]}
                    >
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>

                  <ChevronRight
                    size={18}
                    color={COLORS.text.secondary}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* ACCÈS RAPIDES */}

      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>RACCOURCIS</Text>

        <Text style={styles.sectionTitle}>
          Gestion du commerce
        </Text>

        <Text style={styles.sectionSubtitle}>
          Accédez rapidement à vos outils
        </Text>

        <View style={styles.actions}>
          {/* AJOUT RAPIDE D'UN PRODUIT */}

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/commercant/products?add=1")}
          >
            <Plus size={20} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>
              Ajouter un produit
            </Text>

            <ArrowRight size={19} color="#FFFFFF" />
          </Pressable>

          {/* PRODUITS */}

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/commercant/products")}
          >
            <Package size={20} color={COLORS.brand.primary} />

            <Text style={styles.secondaryButtonText}>
              Gérer mes produits
            </Text>

            <ArrowRight size={19} color={COLORS.brand.primary} />
          </Pressable>

          {/* COMMANDES */}

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/commercant/orders")}
          >
            <ClipboardList size={20} color={COLORS.brand.primary} />

            <Text style={styles.secondaryButtonText}>
              Voir toutes les commandes
            </Text>

            <ArrowRight size={19} color={COLORS.brand.primary} />
          </Pressable>
        </View>
      </View>

      {/* FOOTER */}

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>proxi</Text>

        <Text style={styles.footerText}>
          Votre commerce, à portée de main. 🌿
        </Text>
      </View>
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

  // HEADER

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 34,
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

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand.accent,
  },

  hero: {
    alignItems: "flex-start",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.brand.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginBottom: 22,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.brand.primary,
  },

  statusText: {
    color: COLORS.brand.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  greeting: {
    color: COLORS.text.secondary,
    fontSize: 15,
    fontWeight: "500",
  },

  title: {
    color: COLORS.text.primary,
    fontSize: 39,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1.5,
    marginTop: 4,
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
  },

  sectionSubtitle: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: "hidden",
  },

  // STATISTIQUES

  statsGrid: {
    flexDirection: "row",
    gap: 9,
  },

  statCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 142,
    backgroundColor: COLORS.surface.light,
    paddingVertical: 17,
    paddingHorizontal: 6,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
  },

  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statValue: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },

  // COMMANDES RÉCENTES

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  recentHeaderText: {
    flex: 1,
  },

  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingLeft: 10,
  },

  seeAllText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  orderList: {
    gap: 12,
  },

  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  orderInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  orderClient: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  orderNumber: {
    color: COLORS.text.secondary,
    fontSize: 12,
  },

  orderPrice: {
    color: COLORS.brand.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  orderRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 6,
  },

  orderStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  orderStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  emptyContainer: {
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    padding: 26,
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
    marginTop: 6,
    textAlign: "center",
  },

  // STOCK

  addButton: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface.light,
    padding: 18,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  stockItem: {
    flex: 1,
    alignItems: "center",
  },

  stockNumber: {
    color: COLORS.text.primary,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  stockLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  stockDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border.light,
  },

  stockAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF3DF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 12,
  },

  stockAlertText: {
    flex: 1,
    color: "#A9650B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },

  // BOUTONS

  actions: {
    gap: 13,
  },

  primaryButton: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
    borderWidth: 1,
    borderColor: COLORS.brand.primary,
  },

  primaryButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  secondaryButton: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.brand.primary,
  },

  secondaryButtonText: {
    flex: 1,
    color: COLORS.brand.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
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