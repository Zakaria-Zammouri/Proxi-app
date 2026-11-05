
import { View, StyleSheet } from "react-native";
import LivreurProfile from "@/features/livreur/livreurProfile";
import { COLORS } from "@/lib/theme";

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <LivreurProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
});