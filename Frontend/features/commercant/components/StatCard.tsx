
import { View, Text, StyleSheet } from "react-native";

type StatCardProps = {
  title: string;
  value: number;
  color: string;
  icon: string;
  unit?: string;
};

export default function StatCard({
  title,
  value,
  color,
  icon,
  unit = "",
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.accent,
          { backgroundColor: color },
        ]}
      />

      <View style={styles.top}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: color + "18" },
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View
          style={[
            styles.indicator,
            { backgroundColor: color + "20" },
          ]}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: color },
            ]}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.value} numberOfLines={1}>
          {value.toLocaleString("fr-FR")}
          {unit ? ` ${unit}` : ""}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8EEE9",
    margin: 5,
    minHeight: 145,
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#14532D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  content: {
    marginTop: 15,
  },

  value: {
    fontSize: 22,
    fontWeight: "900",
    color: "#202923",
  },

  title: {
    fontSize: 11,
    fontWeight: "600",
    color: "#77827B",
    marginTop: 7,
  },
});
