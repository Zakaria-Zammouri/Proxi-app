
import { Text, StyleSheet, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";

type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "brand";

type ProxiBadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const BADGE_COLORS = {
  success: { background: "#E8F5EC", text: "#238653" },
  warning: { background: "#FFF3DF", text: "#A9650B" },
  error: { background: "#FCEAEA", text: "#C63E3E" },
  info: { background: "#EAF2FA", text: "#3978B8" },
  neutral: { background: "#EEF1ED", text: "#66736B" },
  brand: {
    background: COLORS.brand.primaryLight,
    text: COLORS.brand.primary,
  },
} as const;

export function ProxiBadge({
  label,
  variant = "neutral",
}: ProxiBadgeProps) {
  const colors = BADGE_COLORS[variant];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
