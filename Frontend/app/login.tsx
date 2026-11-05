import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft, Mail, LockKeyhole, ShoppingBag } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { ProxiButton, ProxiInput } from "@/components/proxi";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Champs manquants", "Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Email invalide", "Veuillez saisir une adresse email valide.");
      return;
    }

    setLoading(true);

    // Authentification temporaire : à connecter au backend.
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Interface prête",
        "L'interface de connexion est fonctionnelle. L'authentification backend reste à intégrer."
      );
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={21} color={COLORS.text.primary} />
        </Pressable>

        <View style={styles.brandIcon}>
          <ShoppingBag size={29} color={COLORS.brand.primary} />
        </View>

        <Text style={styles.eyebrow}>BON RETOUR !</Text>
        <Text style={styles.title}>Content de vous revoir.</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour retrouver votre espace Proxi.
        </Text>

        <View style={styles.form}>
          <ProxiInput
            label="Adresse email"
            placeholder="exemple@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={19} color={COLORS.text.secondary} />}
          />

          <ProxiInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            passwordToggle
            autoCapitalize="none"
            autoComplete="password"
            leftIcon={<LockKeyhole size={19} color={COLORS.text.secondary} />}
          />

          <Pressable
            onPress={() =>
              Alert.alert(
                "Mot de passe oublié",
                "La récupération du mot de passe sera disponible après l'intégration du backend."
              )
            }
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </Pressable>

          <ProxiButton
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            size="lg"
          />
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Vous n'avez pas encore de compte ?</Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}> S'inscrire</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          En continuant, vous acceptez nos conditions d'utilisation.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 35,
  },
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
  brandIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
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
  form: {
    gap: 21,
    marginTop: 38,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -9,
    paddingVertical: 4,
  },
  forgotText: {
    color: COLORS.brand.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 35,
  },
  signupText: {
    color: COLORS.text.secondary,
    fontSize: 13,
  },
  signupLink: {
    color: COLORS.brand.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  footer: {
    color: COLORS.text.secondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    marginTop: "auto",
    paddingTop: 45,
  },
});