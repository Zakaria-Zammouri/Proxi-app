
import {
  ActivityIndicator,
  Pressable,
  Text,
  StyleSheet,
  type ViewStyle,
} from "react-native";

type ProxiButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ProxiButtonSize = "sm" | "md" | "lg";

type ProxiButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ProxiButtonVariant;
  size?: ProxiButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const VARIANTS = {
  primary: {
    backgroundColor: "#086044",
    borderColor: "#086044",
    textColor: "#FFFFFF",
  },
  secondary: {
    backgroundColor: "#E8F3EE",
    borderColor: "#E8F3EE",
    textColor: "#086044",
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderColor: "#086044",
    textColor: "#086044",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: "#086044",
  },
} as const;

const SIZES = {
  sm: { height: 44, paddingHorizontal: 16, fontSize: 14 },
  md: { height: 50, paddingHorizontal: 20, fontSize: 15 },
  lg: { height: 56, paddingHorizontal: 24, fontSize: 16 },
} as const;

export function ProxiButton({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ProxiButtonProps) {
  const colors = VARIANTS[variant];
  const dimensions = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={[
        styles.button,
        {
          height: dimensions.height,
          paddingHorizontal: dimensions.paddingHorizontal,
          width: fullWidth ? "100%" : undefined,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: colors.textColor,
              fontSize: dimensions.fontSize,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 14,
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.1,
    textAlign: "center",
  },
});
