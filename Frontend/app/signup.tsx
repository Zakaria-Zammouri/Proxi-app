import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Client");

  const handleSignup = () => {
    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      !telephone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Proxi", "Veuillez remplir tous les champs.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Proxi", "Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Proxi",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Proxi", "Les mots de passe ne correspondent pas.");
      return;
    }

    Alert.alert(
      "Proxi",
      `Inscription validée !\nVotre rôle : ${role}`,
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo-proxi.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          
        </View>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez votre communauté Proxi.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#9AA89C"
            value={nom}
            onChangeText={setNom}
          />

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre prénom"
            placeholderTextColor="#9AA89C"
            value={prenom}
            onChangeText={setPrenom}
          />

          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="exemple@email.com"
            placeholderTextColor="#9AA89C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre numéro de téléphone"
            placeholderTextColor="#9AA89C"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 caractères"
            placeholderTextColor="#9AA89C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmez votre mot de passe"
            placeholderTextColor="#9AA89C"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Choisissez votre rôle</Text>

          <View style={styles.rolesContainer}>
            {["Client", "Commerçant", "Livreur"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.roleButton,
                  role === item && styles.selectedRole,
                ]}
                onPress={() => setRole(item)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === item && styles.selectedRoleText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Créer mon compte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}> Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },
  content: {
    flexGrow: 1,
    padding: 25,
    paddingTop: 65,
    paddingBottom: 35,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 25,
    zIndex: 1,
  },
  backText: {
    color: "#16834A",
    fontSize: 16,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 75,
    height: 75,
  },
  logoText: {
    color: "#16834A",
    fontSize: 27,
    fontWeight: "bold",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#14532D",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#647568",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#344B3A",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 13,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE7DD",
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    color: "#344B3A",
  },
  rolesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 13,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: "#DCE7DD",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  selectedRole: {
    backgroundColor: "#16834A",
    borderColor: "#16834A",
  },
  roleText: {
    color: "#344B3A",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedRoleText: {
    color: "#FFFFFF",
  },
  signupButton: {
    backgroundColor: "#16834A",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: "#647568",
    fontSize: 13,
  },
  loginLink: {
    color: "#16834A",
    fontWeight: "bold",
    fontSize: 13,
  },
});