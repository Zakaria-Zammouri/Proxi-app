
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Stack } from "expo-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        "Champs obligatoires",
        "Veuillez saisir votre adresse e-mail et votre mot de passe."
      );
      return;
    }

    Alert.alert(
      "Proxi",
      "L'interface fonctionne ! La connexion réelle sera ajoutée ensuite."
    );
  }

  function handleForgotPassword() {
    Alert.alert(
      "Mot de passe oublié",
      "La récupération du mot de passe sera ajoutée prochainement."
    );
  }

  function handleRegister() {
    Alert.alert(
      "Créer un compte",
      "La page d'inscription sera ajoutée prochainement."
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Connexion", headerShown: false }} />

      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Proxi */}
          <View className="mb-10 items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-green-600">
              <Text className="text-4xl font-bold text-white">P</Text>
            </View>

            <Text className="text-4xl font-bold text-green-700">
              Proxi
            </Text>

            <Text className="mt-2 text-center text-base text-gray-500">
              Vos courses locales, en toute simplicité.
            </Text>
          </View>

          {/* Présentation */}
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Bienvenue !
            </Text>

            <Text className="text-base text-gray-500">
              Connectez-vous à votre compte.
            </Text>
          </View>

          {/* Formulaire */}
          <View className="gap-5">
            <View>
              <Text className="mb-2 font-semibold text-gray-800">
                Adresse e-mail
              </Text>

              <Input
                className="h-12 rounded-xl border-gray-300 px-4"
                placeholder="exemple@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="mb-2 font-semibold text-gray-800">
                Mot de passe
              </Text>

              <Input
                className="h-12 rounded-xl border-gray-300 px-4"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <Pressable
              className="self-end"
              onPress={handleForgotPassword}
            >
              <Text className="font-semibold text-green-700">
                Mot de passe oublié ?
              </Text>
            </Pressable>

            <Button
              className="mt-2 h-12 rounded-xl bg-green-600"
              onPress={handleLogin}
            >
              <Text className="font-bold text-white">
                Se connecter
              </Text>
            </Button>

            {/* Inscription */}
            <View className="mt-5 flex-row flex-wrap justify-center">
              <Text className="text-gray-500">
                Vous n'avez pas de compte ?{" "}
              </Text>

              <Pressable onPress={handleRegister}>
                <Text className="font-bold text-green-700">
                  Créer un compte
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-12 items-center">
            <Text className="text-center text-sm text-gray-400">
              Proxi — Vos commerces de proximité.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}