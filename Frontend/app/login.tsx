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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Proxi", "Veuillez remplir tous les champs.");
      return;
    }

    Alert.alert("Proxi", "Interface de connexion fonctionnelle !");
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

        <Text style={styles.title}>Bon retour !</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour continuer vos activités.
        </Text>

        <View style={styles.form}>
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

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            placeholderTextColor="#9AA89C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert("Proxi", "Fonctionnalité bientôt disponible.")
            }
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}> S'inscrire</Text>
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
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 25,
  },
  backText: {
    color: "#16834A",
    fontSize: 16,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    color: "#16834A",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#14532D",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#647568",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#344B3A",
    fontWeight: "600",
    marginBottom: 9,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE7DD",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#344B3A",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 15,
  },
  forgotText: {
    color: "#16834A",
    fontWeight: "600",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#16834A",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: {
    color: "#647568",
    fontSize: 14,
  },
  signupLink: {
    color: "#16834A",
    fontWeight: "bold",
    fontSize: 14,
  },
});