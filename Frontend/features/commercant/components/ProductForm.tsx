import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Package, Camera, ImagePlus } from "lucide-react-native";

import { ProxiInput } from "@/components/proxi";
import { COLORS, RADIUS } from "@/lib/theme";

import type { Product } from "@/features/commercant/data/productsData";

type ProductFormProps = {
  initialProduct?: Product | null;
  onSave: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
};

export default function ProductForm({
  initialProduct,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setDescription(initialProduct.description);
      setPrice(String(initialProduct.price));
      setCategory(initialProduct.category);
      setImage(initialProduct.image);
      setStock(String(initialProduct.stock));
      setAvailable(initialProduct.available);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage("");
      setStock("");
      setAvailable(true);
    }
  }, [initialProduct]);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission refusée",
          "Autorise Proxi à accéder à ta galerie pour choisir une image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];

        if (!asset.base64) {
          Alert.alert(
            "Erreur",
            "Impossible de récupérer les données de cette image."
          );
          return;
        }

        const mimeType = asset.mimeType || "image/jpeg";

        setImage(`data:${mimeType};base64,${asset.base64}`);
      }
    } catch (error) {
      console.log("Erreur sélection image :", error);

      Alert.alert(
        "Erreur",
        "Une erreur est survenue pendant la sélection de l'image."
      );
    }
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !category.trim()) {
      Alert.alert(
        "Champs obligatoires",
        "Veuillez remplir le nom, le prix et la catégorie."
      );
      return;
    }

    const numericPrice = Number(price.replace(",", "."));
    const numericStock = Number(stock || "0");

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      Alert.alert("Prix invalide", "Veuillez saisir un prix valide.");
      return;
    }

    if (!Number.isFinite(numericStock) || numericStock < 0) {
      Alert.alert("Stock invalide", "Veuillez saisir un stock valide.");
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image,
      available,
      stock: numericStock,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formHeader}>
        <View style={styles.formIcon}>
          <Package size={29} color={COLORS.brand.primary} />
        </View>

        <Text style={styles.eyebrow}>MON CATALOGUE</Text>

        <Text style={styles.title}>
          {initialProduct ? "Modifier le produit" : "Ajouter un produit"}
        </Text>

        <Text style={styles.subtitle}>
          Complétez les informations de votre produit.
        </Text>
      </View>

      <View style={styles.fields}>
        <ProxiInput
          label="Nom du produit *"
          placeholder="Ex : Eau Sidi Ali"
          value={name}
          onChangeText={setName}
        />

        <ProxiInput
          label="Description"
          placeholder="Description du produit"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.textArea}
        />

        <ProxiInput
          label="Prix (DH) *"
          placeholder="Ex : 6"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <ProxiInput
          label="Catégorie *"
          placeholder="Ex : Boissons"
          value={category}
          onChangeText={setCategory}
        />

        <ProxiInput
          label="Stock disponible"
          placeholder="Quantité disponible"
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Image du produit</Text>

          {image ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: image }}
                style={styles.preview}
                resizeMode="cover"
              />

              <Pressable
                style={styles.removeImageButton}
                onPress={() => setImage("")}
              >
                <Text style={styles.removeImageText}>
                  Supprimer l'image
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyImage}>
              <Camera size={30} color={COLORS.text.secondary} />

              <Text style={styles.emptyImageText}>
                Aucune image sélectionnée
              </Text>
            </View>
          )}

          <Pressable style={styles.imageButton} onPress={pickImage}>
            <ImagePlus size={18} color={COLORS.brand.primary} />

            <Text style={styles.imageButtonText}>
              Choisir une image depuis la galerie
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={[
          styles.availabilityButton,
          available && styles.availableButton,
        ]}
        onPress={() => setAvailable(!available)}
      >
        <View
          style={[
            styles.availabilityDot,
            available && styles.activeDot,
          ]}
        />

        <Text
          style={[
            styles.availabilityText,
            available && styles.availableText,
          ]}
        >
          {available ? "Produit disponible" : "Produit indisponible"}
        </Text>
      </Pressable>

      <View style={styles.buttons}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>
            {initialProduct ? "Enregistrer" : "Ajouter le produit"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  formHeader: {
    alignItems: "flex-start",
    marginBottom: 28,
  },

  formIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
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

  fields: {
    gap: 20,
  },

  label: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  imageSection: {
    gap: 8,
  },

  emptyImage: {
    height: 145,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderStyle: "dashed",
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  emptyImageText: {
    color: COLORS.text.secondary,
    fontSize: 12,
  },

  previewContainer: {
    alignItems: "center",
  },

  preview: {
    width: 150,
    height: 150,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.brand.primaryLight,
  },

  removeImageButton: {
    marginTop: 10,
    padding: 8,
  },

  removeImageText: {
    color: "#C63E3E",
    fontSize: 13,
    fontWeight: "700",
  },

  imageButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primaryLight,
    marginTop: 4,
  },

  imageButtonText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  availabilityButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.surface.light,
    marginTop: 24,
  },

  availableButton: {
    backgroundColor: COLORS.brand.primaryLight,
    borderColor: COLORS.brand.primary,
  },

  availabilityDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.text.disabled,
  },

  activeDot: {
    backgroundColor: COLORS.brand.primary,
  },

  availabilityText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: "700",
  },

  availableText: {
    color: COLORS.brand.primary,
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: COLORS.brand.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1.5,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});