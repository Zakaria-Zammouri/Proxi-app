
import {
  View,
  StyleSheet,
  type ViewProps,
} from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/lib/theme";

type ProxiCardProps = ViewProps & {
  padding?: number;
  elevated?: boolean;
};

export function ProxiCard({
  children,
  padding = SPACING.lg,
  elevated = true,
  style,
  ...props
}: ProxiCardProps) {
  return (
    <View
      {...props}
      style={[
        styles.card,
        { padding },
        elevated ? SHADOWS.card : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.surface.light,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
});
