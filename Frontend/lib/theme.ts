
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "expo-router/react-navigation";

// ============================================
// PROXI DESIGN SYSTEM — VERSION 1.0
// ============================================

export const COLORS = {
  brand: {
    primary: "#086044",
    primaryDark: "#064B36",
    primaryLight: "#E8F3EE",
    accent: "#F99B32",
    accentLight: "#FFF2E2",
  },

  background: {
    light: "#F7F8F5",
    dark: "#111A16",
  },

  surface: {
    light: "#FFFFFF",
    dark: "#1B2821",
  },

  text: {
    primary: "#202923",
    secondary: "#77827B",
    inverse: "#FFFFFF",
    disabled: "#A7B0AA",
  },

  border: {
    light: "#E5EAE6",
    dark: "#304037",
  },

  status: {
    success: "#238653",
    warning: "#E99A28",
    error: "#D94B4B",
    info: "#3978B8",
  },
} as const;

// ============================================
// SPACING
// ============================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 999,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  lineHeight: {
    body: 24,
    heading: 32,
    display: 42,
  },
} as const;

// ============================================
// ELEVATION
// ============================================

export const SHADOWS = {
  card: {
    shadowColor: "#202923",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  floating: {
    shadowColor: "#202923",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

// ============================================
// NAVIGATION THEMES
// ============================================

export const THEME = {
  light: {
    background: COLORS.background.light,
    foreground: COLORS.text.primary,
    card: COLORS.surface.light,
    cardForeground: COLORS.text.primary,
    popover: COLORS.surface.light,
    popoverForeground: COLORS.text.primary,
    primary: COLORS.brand.primary,
    primaryForeground: COLORS.text.inverse,
    secondary: COLORS.brand.primaryLight,
    secondaryForeground: COLORS.brand.primary,
    muted: "#EEF1ED",
    mutedForeground: COLORS.text.secondary,
    accent: COLORS.brand.accentLight,
    accentForeground: "#8A4D0B",
    destructive: COLORS.status.error,
    border: COLORS.border.light,
    input: COLORS.border.light,
    ring: COLORS.brand.primary,
    radius: "1rem",
    chart1: COLORS.brand.primary,
    chart2: COLORS.brand.accent,
    chart3: COLORS.status.info,
    chart4: COLORS.status.success,
    chart5: COLORS.status.warning,
  },

  dark: {
    background: COLORS.background.dark,
    foreground: "#F3F6F3",
    card: COLORS.surface.dark,
    cardForeground: "#F3F6F3",
    popover: COLORS.surface.dark,
    popoverForeground: "#F3F6F3",
    primary: "#3D9A70",
    primaryForeground: "#FFFFFF",
    secondary: "#263B30",
    secondaryForeground: "#DCECE2",
    muted: "#26312B",
    mutedForeground: "#A7B5AC",
    accent: "#F99B32",
    accentForeground: "#251707",
    destructive: "#E35B5B",
    border: COLORS.border.dark,
    input: COLORS.border.dark,
    ring: "#3D9A70",
    radius: "1rem",
    chart1: "#3D9A70",
    chart2: "#F99B32",
    chart3: "#6BA5D9",
    chart4: "#69B98B",
    chart5: "#E6B45A",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },

  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
