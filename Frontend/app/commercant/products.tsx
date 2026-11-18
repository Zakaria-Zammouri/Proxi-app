import { useState, useEffect, useCallback } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  SearchX,
  Trash,
  X,
} from "lucide-react-native";

import {
  useRouter,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  productsData,
  type Product,
} from "@/features/commercant/data/productsData";

import ProductCard from "@/features/commercant/components/ProductCard";
import ProductForm from "@/features/commercant/components/ProductForm";

import { COLORS, RADIUS, SHADOWS } from "@/lib/theme";

const STORAGE_KEY = "proxi_products";

export default function ProductsScreen() {
  const router = useRouter();

  // Ouvrir directement le formulaire d'ajout depuis le Dashboard
  const { add } = useLocalSearchParams<{ add?: string }>();

  const [products, setProducts] = useState<Product[]>(productsData);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  // CHARGER LES PRODUITS
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProducts = async () => {
        try {
          const savedProducts = await AsyncStorage.getItem(STORAGE_KEY);

          let loadedProducts: Product[];

          if (savedProducts !== null) {
            const parsedProducts: Product[] = JSON.parse(savedProducts);

            if (!Array.isArray(parsedProducts)) {
              throw new Error("Format des produits invalide");
            }

            // Vérifier les valeurs de stock et disponibilité
            loadedProducts = parsedProducts.map((product) => {
              const stock = Math.max(0, Number(product.stock) || 0);

              return {
                ...product,
                stock,
                available: stock === 0 ? false : product.available,
              };
            });
          } else {
            loadedProducts = productsData.map((product) => ({
              ...product,
              stock: Math.max(0, Number(product.stock) || 0),
              available: product.stock > 0 ? product.available : false,
            }));

            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(loadedProducts)
            );
          }

          if (isActive) {
            setProducts(loadedProducts);
            setIsLoaded(true);
          }
        } catch (error) {
          console.log("Erreur chargement produits :", error);

          if (isActive) {
            setProducts(productsData);
            setIsLoaded(true);
          }
        }
      };

      setIsLoaded(false);
      loadProducts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // OUVRIR LE FORMULAIRE D'AJOUT (/commercant/products?add=1)
  useEffect(() => {
    if (add === "1" && isLoaded) {
      setSelectedProduct(null);
      setFormVisible(true);
      router.setParams({ add: "" });
    }
  }, [add, isLoaded]);

  // SAUVEGARDER LES PRODUITS
  useEffect(() => {
    if (!isLoaded) return;

    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(products)
        );
      } catch (error) {
        console.log("Erreur sauvegarde produits :", error);
      }
    };

    saveProducts();
  }, [products, isLoaded]);

  // CATÉGORIES
  const categories = [
    "Toutes",
    ...Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(
            (category): category is string =>
              typeof category === "string" && category.length > 0
          )
      )
    ),
  ];

  // RECHERCHE ET FILTRAGE
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.description || "").toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "Toutes" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // OUVRIR FORMULAIRE AJOUT
  const openAddForm = () => {
    setSelectedProduct(null);
    setFormVisible(true);
  };

  // AJOUTER OU MODIFIER UN PRODUIT
  const handleSave = (productData: Omit<Product, "id">) => {
    const stock = Math.max(0, Number(productData.stock) || 0);

    const correctedProductData = {
      ...productData,
      stock,
      available: stock === 0 ? false : productData.available,
    };

    if (selectedProduct) {
      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...correctedProductData }
            : product
        )
      );

      Alert.alert("Succès", "Produit modifié avec succès.");
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...correctedProductData,
      };

      setProducts((previousProducts) => [
        ...previousProducts,
        newProduct,
      ]);

      Alert.alert("Succès", "Produit ajouté avec succès.");
    }

    setSelectedProduct(null);
    setFormVisible(false);
  };

  // MODIFIER UN PRODUIT
  const handleEdit = (id: number) => {
    const product = products.find((item) => item.id === id);

    if (product) {
      setSelectedProduct(product);
      setFormVisible(true);
    }
  };

  // ACTIVER / DÉSACTIVER UN PRODUIT
  const handleToggleAvailability = (id: number) => {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    if (product.stock === 0 && !product.available) {
      Alert.alert(
        "Stock épuisé",
        "Impossible d'activer ce produit. Veuillez d'abord ajouter du stock."
      );
      return;
    }

    setProducts((previousProducts) =>
      previousProducts.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  // MODIFIER LE STOCK
  const handleStockChange = (id: number, amount: number) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) => {
        if (product.id !== id) return product;

        const newStock = Math.max(
          0,
          product.stock + amount
        );

        return {
          ...product,
          stock: newStock,
          available:
            newStock === 0 ? false : product.available,
        };
      })
    );
  };

  // DEMANDER CONFIRMATION SUPPRESSION
  const handleDelete = (id: number) => {
    setProductToDelete(id);
  };

  // CONFIRMER SUPPRESSION
  const confirmDelete = () => {
    if (productToDelete === null) return;

    const id = productToDelete;

    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id)
    );

    setProductToDelete(null);

    Alert.alert(
      "Succès",
      "Le produit a été supprimé avec succès."
    );
  };

  // ANNULER SUPPRESSION
  const cancelDelete = () => {
    setProductToDelete(null);
  };

  // STATISTIQUES DU STOCK
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock < 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  const availableCount = products.filter(
    (product) => product.available && product.stock > 0
  ).length;

  // CHARGEMENT
  if (!isLoaded) {
    return (
      <View style={styles.screen}>
        <Text style={styles.loadingText}>
          Chargement des produits...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/commercant")}
          accessibilityRole="button"
          accessibilityLabel="Retour au Dashboard"
        >
          <ArrowLeft size={21} color={COLORS.text.primary} />
        </Pressable>

        <Text style={styles.eyebrow}>MON CATALOGUE</Text>

        <Text style={styles.title}>Mes produits</Text>

        <Text style={styles.subtitle}>
          Gérez facilement le catalogue de votre commerce.
        </Text>

        {/* RÉSUMÉ DES PRODUITS */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Package size={24} color="#FFFFFF" />
          </View>

          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>
              Total des produits
            </Text>

            <Text style={styles.bannerSubtitle}>
              Produits dans votre catalogue
            </Text>
          </View>

          <Text style={styles.bannerCount}>{products.length}</Text>
        </View>

        {/* RÉSUMÉ DU STOCK */}
        <View style={styles.stockSummary}>
          <View style={styles.stockSummaryItem}>
            <Text
              style={[
                styles.stockNumber,
                { color: COLORS.status.warning },
              ]}
            >
              {lowStockCount}
            </Text>

            <Text style={styles.stockSummaryLabel}>
              Stock faible
            </Text>
          </View>

          <View style={styles.stockSummaryDivider} />

          <View style={styles.stockSummaryItem}>
            <Text
              style={[
                styles.stockNumber,
                { color: COLORS.status.error },
              ]}
            >
              {outOfStockCount}
            </Text>

            <Text style={styles.stockSummaryLabel}>
              Rupture de stock
            </Text>
          </View>
        </View>

        {/* RÉSUMÉ DISPONIBILITÉ */}
        <View style={styles.availabilitySummary}>
          <Text style={styles.availabilitySummaryNumber}>
            {availableCount}
          </Text>

          <Text style={styles.availabilitySummaryLabel}>
            Produits disponibles à la vente
          </Text>
        </View>

        {/* CATALOGUE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionEyebrow}>CATALOGUE</Text>

              <Text style={styles.sectionTitle}>
                Mon catalogue
              </Text>

              <Text style={styles.sectionSubtitle}>
                {filteredProducts.length} produit(s) affiché(s)
              </Text>
            </View>

            <Pressable
              style={styles.addButton}
              onPress={openAddForm}
            >
              <Plus size={17} color="#FFFFFF" />

              <Text style={styles.addButtonText}>Ajouter</Text>
            </Pressable>
          </View>

          {/* RECHERCHE */}
          <View style={styles.searchContainer}>
            <Search size={19} color={COLORS.text.secondary} />

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un produit..."
              placeholderTextColor={COLORS.text.disabled}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
                hitSlop={10}
              >
                <X size={18} color={COLORS.text.secondary} />
              </Pressable>
            )}
          </View>

          {/* CATÉGORIES */}
          <Text style={styles.filterTitle}>
            Filtrer par catégorie
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category, index) => (
              <Pressable
                key={`${category}-${index}`}
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* LISTE DES PRODUITS */}
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Package size={30} color={COLORS.brand.primary} />
              </View>

              <Text style={styles.emptyTitle}>
                Aucun produit pour le moment
              </Text>

              <Text style={styles.emptyText}>
                Commencez à construire votre catalogue en ajoutant
                vos premiers produits.
              </Text>

              <Pressable
                style={styles.emptyButton}
                onPress={openAddForm}
              >
                <Plus size={17} color="#FFFFFF" />

                <Text style={styles.emptyButtonText}>
                  Ajouter mon premier produit
                </Text>
              </Pressable>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <View style={styles.emptyIconContainer}>
                <SearchX size={30} color={COLORS.brand.primary} />
              </View>

              <Text style={styles.emptyTitle}>
                Aucun résultat
              </Text>

              <Text style={styles.emptyText}>
                Aucun produit ne correspond à votre recherche
                ou à cette catégorie.
              </Text>

              <Pressable
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("Toutes");
                }}
              >
                <Text style={styles.resetButtonText}>
                  Réinitialiser les filtres
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailability={handleToggleAvailability}
                onStockChange={handleStockChange}
              />
            ))
          )}

          {/* AJOUTER EN BAS */}
          {products.length > 0 && (
            <Pressable
              style={styles.bottomAddButton}
              onPress={openAddForm}
            >
              <Plus size={19} color="#FFFFFF" />

              <Text style={styles.bottomAddButtonText}>
                Ajouter un nouveau produit
              </Text>
            </Pressable>
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

      {/* CONFIRMATION SUPPRESSION */}
      {productToDelete !== null && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIcon}>
              <Trash size={28} color="#C63E3E" />
            </View>

            <Text style={styles.confirmTitle}>
              Supprimer ce produit ?
            </Text>

            <Text style={styles.confirmText}>
              Cette action est définitive. Voulez-vous vraiment
              supprimer ce produit de votre catalogue ?
            </Text>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>
                  Annuler
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteText}>
                  Supprimer
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* FORMULAIRE AJOUT / MODIFICATION */}
      {formVisible && (
        <View style={styles.formContainer}>
          <ProductForm
            initialProduct={selectedProduct}
            onSave={handleSave}
            onCancel={() => {
              setFormVisible(false);
              setSelectedProduct(null);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 30,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 80,
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

  // RÉSUMÉS

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 28,
    padding: 22,
    borderRadius: 24,
    backgroundColor: COLORS.brand.primary,
  },

  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  bannerInfo: {
    flex: 1,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  bannerSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    marginTop: 4,
  },

  bannerCount: {
    color: "#FFFFFF",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  stockSummary: {
    backgroundColor: COLORS.surface.light,
    marginTop: 12,
    padding: 18,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  stockSummaryItem: {
    flex: 1,
    alignItems: "center",
  },

  stockNumber: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  stockSummaryLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  stockSummaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border.light,
  },

  availabilitySummary: {
    backgroundColor: COLORS.brand.primaryLight,
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  availabilitySummaryNumber: {
    color: COLORS.brand.primary,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  availabilitySummaryLabel: {
    color: COLORS.brand.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },

  // SECTION CATALOGUE

  section: {
    marginTop: 48,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 20,
  },

  sectionHeaderText: {
    flex: 1,
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
  },

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

  // RECHERCHE ET FILTRES

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontSize: 15,
    color: COLORS.text.primary,
  },

  filterTitle: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  categoryScroll: {
    marginBottom: 20,
    marginHorizontal: -22,
  },

  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 22,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },

  categoryText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  bottomAddButton: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
    marginTop: 8,
  },

  bottomAddButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  // ÉTATS VIDES

  emptyContainer: {
    backgroundColor: COLORS.surface.light,
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  noResultsContainer: {
    backgroundColor: COLORS.surface.light,
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.brand.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },

  emptyButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  resetButton: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primaryLight,
  },

  resetButtonText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
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

  // CONFIRMATION SUPPRESSION

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(32,41,35,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
    zIndex: 100,
    elevation: 10,
  },

  confirmBox: {
    width: "100%",
    backgroundColor: COLORS.surface.light,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    ...SHADOWS.floating,
  },

  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FCEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  confirmTitle: {
    color: COLORS.text.primary,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  confirmText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
  },

  confirmActions: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.brand.primaryLight,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: COLORS.brand.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.status.error,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmDeleteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  // FORMULAIRE

  formContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    elevation: 10,
    backgroundColor: COLORS.background.light,
    paddingHorizontal: 22,
    paddingTop: 48,
  },
});