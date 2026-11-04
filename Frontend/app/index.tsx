import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ExpoStatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo-proxi.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          
        </View>

        {/* Présentation */}
        <View style={styles.hero}>
          <Text style={styles.badge}>
            BIENVENUE CHEZ PROXI
          </Text>

          <Text style={styles.title}>
            Vos courses,{"\n"}
            à deux pas de{"\n"}
            chez vous.
          </Text>

         
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Image
            source={require("../assets/images/logo-proxi.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.illustrationText}>
            Le commerce local, simplifié.
          </Text>
        </View>

      
       

        {/* Clients */}
        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.featureIcon}>🛍️</Text>
          </View>

          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              Pour les clients
            </Text>
            <Text style={styles.featureDescription}>
              Commandez facilement vos produits préférés.
            </Text>
          </View>
        </View>

        {/* Commerçants */}
        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.featureIcon}>🏪</Text>
          </View>

          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              Pour les commerçants
            </Text>
            <Text style={styles.featureDescription}>
              Développez votre activité et trouvez de nouveaux clients.
            </Text>
          </View>
        </View>

        {/* Livreurs */}
        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.featureIcon}>🛵</Text>
          </View>

          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              Pour les livreurs
            </Text>
            <Text style={styles.featureDescription}>
              Effectuez des livraisons et gagnez de l'argent.
            </Text>
          </View>
        </View>

        {/* Inscription */}
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryButtonText}>
            Commencer
          </Text>
        </Pressable>

        {/* Connexion */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryButtonText}>
            J'ai déjà un compte
          </Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2026 Proxi - Le commerce local à portée de main.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  content: {
    padding: 24,
    paddingBottom: 35,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
    marginBottom: 35,
  },

  logo: {
    width: 55,
    height: 55,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#14532D",
    marginLeft: 10,
  },

  hero: {
    marginBottom: 25,
  },

  badge: {
    color: "#16834A",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 14,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#14532D",
    lineHeight: 44,
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    color: "#718078",
    lineHeight: 25,
  },

  illustration: {
    backgroundColor: "#E4F1E5",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },

  heroImage: {
    width: 180,
    height: 150,
  },

  illustrationText: {
    color: "#14532D",
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#14532D",
    marginBottom: 17,
  },

  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#E8F5EC",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 24,
  },

  featureContent: {
    flex: 1,
    marginLeft: 14,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#14532D",
  },

  featureDescription: {
    color: "#87938A",
    marginTop: 4,
    lineHeight: 20,
  },

  primaryButton: {
    height: 58,
    backgroundColor: "#16834A",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 15,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  secondaryButton: {
    height: 55,
    borderWidth: 1.5,
    borderColor: "#16834A",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#16834A",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    color: "#A0ADA3",
    fontSize: 12,
    marginTop: 25,
  },
});
