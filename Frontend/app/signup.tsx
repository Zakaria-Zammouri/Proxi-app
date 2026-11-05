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
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  ShoppingBag,
  Store,
  Bike,
  Check,
} from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";
import { ProxiButton, ProxiInput } from "@/components/proxi";

type UserRole = "Client" | "Commerçant" | "Livreur";

const ROLES: {
  value: UserRole;
  description: string;
  icon: typeof ShoppingBag;
}[] = [
  {
    value: "Client",
    description: "Je souhaite commander",
    icon: ShoppingBag,
  },
  {
    value: "Commerçant",
    description: "Je souhaite vendre",
    icon: Store,
  },
  {
    value: "Livreur",
    description: "Je souhaite livrer",
    icon: Bike,
  },
];

export default function SignupScreen() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Client");
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      !telephone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Email invalide", "Veuillez saisir une adresse email valide.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Mot de passe trop court",
        "Votre mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Mots de passe différents",
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    // Inscription temporaire : à connecter au backend.
    setLoading(false);

    Alert.alert(
      "Formulaire validé",
      `Votre formulaire ${role.toLowerCase()} est prêt. La création réelle du compte sera disponible après l'intégration du backend.`,
      [
        {
          text: "Continuer",
          onPress: () => router.replace("/login"),
        },
      ]
    );
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
          <UserRound size={28} color={COLORS.brand.primary} />
        </View>

        <Text style={styles.eyebrow}>REJOIGNEZ PROXI</Text>
        <Text style={styles.title}>Créons votre compte.</Text>
        <Text style={styles.subtitle}>
          Quelques informations pour commencer votre expérience Proxi.
        </Text>

        <Text style={styles.sectionTitle}>Je souhaite utiliser Proxi en tant que</Text>

        <View style={styles.rolesContainer}>
          {ROLES.map((item) => {
            const Icon = item.icon;
            const selected = role === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setRole(item.value)}
                style={[
                  styles.roleCard,
                  selected && styles.roleCardSelected,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View
                  style={[
                    styles.roleIcon,
                    selected && styles.roleIconSelected,
                  ]}
                >
                  <Icon
                    size={21}
                    color={
                      selected ? COLORS.brand.primary : COLORS.text.secondary
                    }
                  />
                </View>

                <View style={styles.roleTextContainer}>
                  <Text
                    style={[
                      styles.roleName,
                      selected && styles.roleNameSelected,
                    ]}
                  >
                    {item.value}
                  </Text>
                  <Text style={styles.roleDescription}>
                    {item.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                  ]}
                >
                  {selected ? (
                    <Check size={13} color="#FFFFFF" />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Vos informations</Text>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <ProxiInput
                label="Nom"
                placeholder="Votre nom"
                value={nom}
                onChangeText={setNom}
                autoCapitalize="words"
                leftIcon={<UserRound size={18} color={COLORS.text.secondary} />}
              />
            </View>

            <View style={styles.nameField}>
              <ProxiInput
                label="Prénom"
                placeholder="Votre prénom"
                value={prenom}
                onChangeText={setPrenom}
                autoCapitalize="words"
              />
            </View>
          </View>

          <ProxiInput
            label="Adresse email"
            placeholder="exemple@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={18} color={COLORS.text.secondary} />}
          />

          <ProxiInput
            label="Téléphone"
            placeholder="06 00 00 00 00"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={COLORS.text.secondary} />}
          />

          <ProxiInput
            label="Mot de passe"
            placeholder="Minimum 6 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            passwordToggle
            autoCapitalize="none"
            leftIcon={<LockKeyhole size={18} color={COLORS.text.secondary} />}
          />

          <ProxiInput
            label="Confirmer le mot de passe"
            placeholder="Répétez votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            passwordToggle
            autoCapitalize="none"
            leftIcon={<LockKeyhole size={18} color={COLORS.text.secondary} />}
          />

          <ProxiButton
            title="Créer mon compte"
            onPress={handleSignup}
            loading={loading}
            size="lg"
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}> Se connecter</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          En créant un compte, vous acceptez nos conditions d'utilisation.
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
    paddingHorizontal: 22,
    paddingTop: 45,
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
    marginBottom: 27,
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: COLORS.brand.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 21,
  },
  eyebrow: {
    color: COLORS.brand.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 27,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 8,
  },
  rolesContainer: {
    gap: 10,
    marginBottom: 27,
  },
  roleCard: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.surface.light,
    gap: 12,
  },
  roleCardSelected: {
    borderColor: COLORS.brand.primary,
    backgroundColor: COLORS.brand.primaryLight,
  },
  roleIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F1F3F0",
    alignItems: "center",
    justifyContent: "center",
  },
  roleIconSelected: {
    backgroundColor: "#FFFFFF",
  },
  roleTextContainer: {
    flex: 1,
    gap: 4,
  },
  roleName: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  roleNameSelected: {
    color: COLORS.brand.primary,
  },
  roleDescription: {
    color: COLORS.text.secondary,
    fontSize: 11,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  form: {
    gap: 19,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
    minWidth: 0,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 30,
  },
  loginText: {
    color: COLORS.text.secondary,
    fontSize: 13,
  },
  loginLink: {
    color: COLORS.brand.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  footer: {
    color: COLORS.text.secondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 24,
  },
});