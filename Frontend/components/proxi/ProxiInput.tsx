
import { useState, type ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "@/lib/theme";

type ProxiInputProps = TextInputProps & {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  passwordToggle?: boolean;
};

export function ProxiInput({
  label,
  error,
  leftIcon,
  passwordToggle = false,
  secureTextEntry,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: ProxiInputProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = passwordToggle || Boolean(secureTextEntry);
  const isSecure = isPassword && !passwordVisible;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          Boolean(error) && styles.errorBorder,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

        <TextInput
          {...inputProps}
          secureTextEntry={isSecure}
          placeholderTextColor={COLORS.text.disabled}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, style]}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setPasswordVisible((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            hitSlop={10}
            style={styles.passwordToggle}
          >
            {passwordVisible ? (
              <EyeOff size={20} color={COLORS.text.secondary} />
            ) : (
              <Eye size={20} color={COLORS.text.secondary} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  focused: {
    borderColor: COLORS.brand.primary,
    borderWidth: 1.5,
  },
  errorBorder: {
    borderColor: COLORS.status.error,
  },
  leftIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    fontSize: 15,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  passwordToggle: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 12,
    color: COLORS.status.error,
  },
});
