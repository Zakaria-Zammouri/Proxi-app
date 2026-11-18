import { useMemo, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { Wallet, Check } from "lucide-react-native";

import type { Order } from "@/features/commercant/data/ordersData";

import { COLORS as THEME } from "@/lib/theme";

type Period = "week" | "month";

type ChartItem = {
  date: Date;
  label: string;
  value: number;
};

type SalesChartProps = {
  orders: Order[];
};

const COLORS = {
  primary: THEME.brand.primary,
  dark: THEME.brand.primaryDark,
  background: THEME.background.light,
  lightGreen: THEME.brand.primaryLight,
  white: THEME.surface.light,
  text: THEME.text.primary,
  secondary: THEME.text.secondary,
  border: THEME.border.light,
  empty: "#D7E9DC",
};

// Extraire la date des commandes
const parseOrderDate = (date: string): Date | null => {
  if (!date) return null;

  const dateOnly = date.trim().split(" ")[0];
  const parts = dateOnly.split("/");

  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return null;

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getDate() !== day ||
    parsed.getMonth() !== month - 1 ||
    parsed.getFullYear() !== year
  ) {
    return null;
  }

  return parsed;
};

// Commandes acceptées, prêtes ou livrées
const isIncludedInSales = (status: Order["status"]) => {
  return (
    status === "processing" ||
    status === "ready" ||
    status === "delivered"
  );
};

export default function SalesChart({ orders }: SalesChartProps) {
  const [period, setPeriod] = useState<Period>("week");

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  // CALCUL DES VENTES

  const chartData = useMemo(() => {
    const now = new Date();

    const result: ChartItem[] = [];

    let startDate: Date;
    let numberOfDays: number;

    if (period === "week") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const day = (startDate.getDay() + 6) % 7;

      startDate.setDate(startDate.getDate() - day);

      numberOfDays = 7;
    } else {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      numberOfDays = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
    }

    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(startDate);

      date.setDate(startDate.getDate() + i);

      const sales = orders.reduce((total, order) => {
        if (!isIncludedInSales(order.status)) {
          return total;
        }

        const orderDate = parseOrderDate(order.date);

        if (!orderDate) return total;

        const sameDay =
          orderDate.getFullYear() === date.getFullYear() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getDate() === date.getDate();

        return sameDay
          ? total + Number(order.total || 0)
          : total;
      }, 0);

      result.push({
        date,

        label:
          period === "week"
            ? date
                .toLocaleDateString("fr-FR", {
                  weekday: "short",
                })
                .replace(".", "")
            : String(date.getDate()),

        value: sales,
      });
    }

    return result;
  }, [orders, period]);

  // TOTAL DES VENTES

  const totalSales = chartData.reduce(
    (total, item) => total + item.value,
    0
  );

  const maxSales = Math.max(
    ...chartData.map((item) => item.value),
    1
  );

  const selectedItem =
    selectedIndex !== null
      ? chartData[selectedIndex]
      : null;

  // CHANGER LA PÉRIODE

  const changePeriod = (newPeriod: Period) => {
    setPeriod(newPeriod);
    setSelectedIndex(null);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Évolution des ventes
          </Text>

          <Text style={styles.subtitle}>
            Analyse de vos performances
          </Text>
        </View>

        <View style={styles.periodBadge}>
          <Text style={styles.periodBadgeText}>
            {period === "week" ? "7 jours" : "Ce mois"}
          </Text>
        </View>
      </View>

      {/* TOTAL */}

      <View style={styles.totalContainer}>
        <View>
          <Text style={styles.totalLabel}>
            Chiffre d'affaires de la période
          </Text>

          <Text style={styles.totalValue}>
            {totalSales.toLocaleString("fr-FR")} DH
          </Text>
        </View>

        <View style={styles.totalIcon}>
          <Wallet size={22} color={COLORS.primary} />
        </View>
      </View>

      {/* FILTRES */}

      <View style={styles.filters}>
        <Pressable
          onPress={() => changePeriod("week")}
          style={[
            styles.filterButton,
            period === "week" && styles.activeFilter,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              period === "week" && styles.activeFilterText,
            ]}
          >
            7 jours
          </Text>
        </Pressable>

        <Pressable
          onPress={() => changePeriod("month")}
          style={[
            styles.filterButton,
            period === "month" && styles.activeFilter,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              period === "month" && styles.activeFilterText,
            ]}
          >
            Ce mois
          </Text>
        </Pressable>
      </View>

      {/* DATE SÉLECTIONNÉE */}

      <View style={styles.selectedContainer}>
        {selectedItem ? (
          <>
            <View>
              <Text style={styles.selectedLabel}>
                Ventes du
              </Text>

              <Text style={styles.selectedDate}>
                {selectedItem.date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })}
              </Text>
            </View>

            <Text style={styles.selectedValue}>
              {selectedItem.value.toLocaleString("fr-FR")} DH
            </Text>
          </>
        ) : (
          <Text style={styles.hint}>
            Touchez une barre pour consulter les ventes
          </Text>
        )}
      </View>

      {/* GRAPHIQUE */}

      <ScrollView
        horizontal={period === "month"}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={period === "month"}
        contentContainerStyle={[
          styles.chartContent,
          period === "month" && styles.monthChartContent,
        ]}
      >
        {chartData.map((item, index) => {
          const isSelected = selectedIndex === index;

          const barHeight =
            item.value > 0
              ? Math.max((item.value / maxSales) * 115, 7)
              : 4;

          return (
            <Pressable
              key={item.date.toISOString()}
              style={[
                styles.barItem,
                period === "week"
                  ? styles.weekBarItem
                  : styles.monthBarItem,
              ]}
              onPress={() =>
                setSelectedIndex(
                  isSelected ? null : index
                )
              }
            >
              <View style={styles.barArea}>
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Check size={11} color={COLORS.white} />
                  </View>
                )}

                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isSelected
                        ? COLORS.dark
                        : item.value > 0
                          ? COLORS.primary
                          : COLORS.empty,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.barLabel,
                  isSelected && styles.activeBarLabel,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* LÉGENDE */}

      <View style={styles.legend}>
        <View style={styles.legendDot} />

        <Text style={styles.legendText}>
          Montant des commandes acceptées et livrées
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 0,
    marginTop: 0,
  },

  // HEADER

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 5,
  },

  periodBadge: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  periodBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.dark,
  },

  // TOTAL

  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginTop: 19,
  },

  totalLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  totalValue: {
    color: COLORS.dark,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginTop: 6,
  },

  totalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  // FILTRES

  filters: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 4,
    marginTop: 17,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 11,
  },

  activeFilter: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: "700",
  },

  activeFilterText: {
    color: COLORS.white,
  },

  // DATE

  selectedContainer: {
    minHeight: 48,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectedLabel: {
    color: COLORS.secondary,
    fontSize: 10,
  },

  selectedDate: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },

  selectedValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  hint: {
    fontSize: 10,
    color: COLORS.secondary,
  },

  // GRAPHIQUE

  chartContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
    paddingTop: 10,
    paddingBottom: 5,
  },

  monthChartContent: {
    paddingRight: 8,
  },

  barItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 145,
  },

  weekBarItem: {
    flex: 1,
  },

  monthBarItem: {
    width: 34,
    marginRight: 5,
  },

  barArea: {
    height: 115,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 13,
    borderRadius: 8,
    minHeight: 4,
  },

  selectedIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.dark,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  barLabel: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 10,
    fontWeight: "600",
  },

  activeBarLabel: {
    color: COLORS.dark,
    fontWeight: "800",
  },

  // LÉGENDE

  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 7,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  legendText: {
    color: COLORS.secondary,
    fontSize: 10,
  },
});