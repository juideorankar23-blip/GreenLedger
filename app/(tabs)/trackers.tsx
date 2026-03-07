import { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ExpenseContext } from "../../Context.tsx/ExpenseContext";

const CATEGORIES = ["Food", "Shopping", "Transport", "Bills", "Other"];

export default function Trackers() {
  const { expenses, budgets } = useContext(ExpenseContext);

  const now = new Date();
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const spentByCategory = CATEGORIES.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat] = monthExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return acc;
    },
    {},
  );

  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.title}>Trackers</Text>
      <Text style={styles.subtitle}>
        This month&apos;s spending by category
      </Text>

      {CATEGORIES.map((cat) => {
        const spent = spentByCategory[cat] || 0;
        const budget = budgets.categories[cat] || 0;
        const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;
        const overBudget = budget > 0 && spent > budget;
        const noBudget = budget === 0;

        return (
          <View key={cat} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{cat}</Text>
              <Text style={[styles.amount, overBudget && styles.over]}>
                {noBudget
                  ? `₹${spent.toFixed(2)} spent`
                  : `₹${spent.toFixed(2)} / ₹${budget}`}
              </Text>
            </View>

            {!noBudget && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` as any },
                    overBudget && styles.progressOver,
                  ]}
                />
              </View>
            )}

            {noBudget && spent === 0 && (
              <Text style={styles.hint}>
                No budget set — go to Planning to add one
              </Text>
            )}

            {overBudget && (
              <Text style={styles.overText}>
                ⚠️ Over budget by ₹{(spent - budget).toFixed(2)}
              </Text>
            )}
          </View>
        );
      })}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent This Month</Text>
        <Text style={styles.totalValue}>₹{totalSpent.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E0D0",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#3a3a3a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6E8B59",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#DCE6C8",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3a3a3a",
  },
  amount: {
    color: "#6E8B59",
    fontSize: 13,
  },
  over: {
    color: "#e07070",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E9E0D0",
    borderRadius: 10,
    marginTop: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#6E8B59",
    borderRadius: 10,
  },
  progressOver: {
    backgroundColor: "#e07070",
  },
  overText: {
    fontSize: 12,
    color: "#e07070",
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    color: "#9ab88a",
    marginTop: 6,
  },
  totalCard: {
    backgroundColor: "#6E8B59",
    padding: 20,
    borderRadius: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#DCE6C8",
    fontSize: 15,
    fontWeight: "500",
  },
  totalValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
