
import {
  ScrollView,
  View,
  StyleSheet,
  type ViewProps,
  type ScrollViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING } from "@/lib/theme";

type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
};

export function ScreenContainer({
  children,
  scroll = false,
  contentContainerStyle,
  style,
  ...props
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      style={[styles.safeArea, style]}
      {...props}
    >
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING["3xl"],
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
});
