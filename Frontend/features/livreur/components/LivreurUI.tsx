import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "@/lib/theme";
import type { DeliveryStatus } from "../types/deliveries";

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
  new: "Nouvelle",
  accepted: "Acceptée",
  picked_up: "Récupérée",
  on_the_way: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export function ScreenTitle({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={ui.titleRow}>
      <View style={ui.titleCopy}>
        {eyebrow ? <Text style={ui.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={ui.screenTitle}>{title}</Text>
        {subtitle ? <Text style={ui.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={ui.sectionRow}>
      <Text style={ui.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={ui.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StatusPill({ status }: { status: DeliveryStatus }) {
  const color =
    status === "delivered"
      ? COLORS.status.success
      : status === "new"
        ? COLORS.status.warning
        : status === "cancelled"
          ? COLORS.status.error
          : status === "on_the_way"
            ? COLORS.status.info
            : COLORS.brand.primary;
  const background =
    status === "delivered"
      ? "#E7F4EB"
      : status === "new"
        ? "#FFF3DF"
        : status === "cancelled"
          ? "#FCEAEA"
          : status === "on_the_way"
            ? "#EAF2FA"
            : COLORS.brand.primaryLight;

  return (
    <View style={[ui.pill, { backgroundColor: background }]}>
      <View style={[ui.pillDot, { backgroundColor: color }]} />
      <Text style={[ui.pillText, { color }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

export function SurfaceCard({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[ui.card, style]}>{children}</View>;
}

export function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: ReactNode;
}) {
  return (
    <View style={ui.statCard}>
      <View style={ui.statIcon}>{icon}</View>
      <Text style={ui.statValue}>{value}</Text>
      <Text style={ui.statLabel}>{label}</Text>
      {detail ? <Text style={ui.statDetail}>{detail}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.primaryButton,
        disabled && ui.disabledButton,
        pressed && !disabled && ui.pressedButton,
      ]}
    >
      {icon}
      <Text style={ui.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string;
  message: string;
  icon: ReactNode;
}) {
  return (
    <View style={ui.emptyState}>
      <View style={ui.emptyIcon}>{icon}</View>
      <Text style={ui.emptyTitle}>{title}</Text>
      <Text style={ui.emptyMessage}>{message}</Text>
    </View>
  );
}

export const ui = StyleSheet.create({
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: SPACING.xl },
  titleCopy: { flex: 1 },
  eyebrow: { color: COLORS.brand.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.4, marginBottom: 5 },
  screenTitle: { color: COLORS.text.primary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: COLORS.text.secondary, fontSize: 13, marginTop: 5, lineHeight: 19 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: SPACING.xl, marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.text.primary, fontSize: 17, fontWeight: "800" },
  sectionAction: { color: COLORS.brand.primary, fontSize: 12, fontWeight: "800" },
  card: { backgroundColor: COLORS.surface.light, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.card },
  pill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 10, fontWeight: "800" },
  statCard: { flex: 1, minWidth: "46%", backgroundColor: COLORS.surface.light, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.card },
  statIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.brand.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: SPACING.md },
  statValue: { color: COLORS.text.primary, fontSize: 25, fontWeight: "800" },
  statLabel: { color: COLORS.text.secondary, fontSize: 12, fontWeight: "700", marginTop: 3 },
  statDetail: { color: COLORS.text.secondary, fontSize: 10, marginTop: 4 },
  primaryButton: { minHeight: 54, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.brand.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  disabledButton: { opacity: 0.45 },
  pressedButton: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  emptyState: { alignItems: "center", paddingHorizontal: SPACING.xl, paddingVertical: SPACING["4xl"], backgroundColor: COLORS.surface.light, borderRadius: RADIUS.xl },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: COLORS.brand.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: SPACING.md },
  emptyTitle: { color: COLORS.text.primary, fontSize: 16, fontWeight: "800" },
  emptyMessage: { color: COLORS.text.secondary, textAlign: "center", fontSize: 12, lineHeight: 19, marginTop: 6 },
});
