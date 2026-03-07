import { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpenseContext } from "../../Context.tsx/ExpenseContext";

const CATEGORIES = ["Food", "Shopping", "Transport", "Bills", "Other"];

export default function Planning() {
  const { budgets, setBudget, expenses } = useContext(ExpenseContext);

  const [income, setIncome] = useState(
    budgets.income ? String(budgets.income) : "",
  );
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>(
    Object.fromEntries(
      CATEGORIES.map((c) => [
        c,
        budgets.categories[c] ? String(budgets.categories[c]) : "",
      ]),
    ),
  );

  const totalBudgeted = CATEGORIES.reduce(
    (sum, c) => sum + (parseFloat(categoryInputs[c]) || 0),
    0,
  );

  const now = new Date();
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = (parseFloat(income) || budgets.income) - totalSpent;

  const handleSave = () => {
    const parsedIncome = parseFloat(income) || 0;
    const parsedCategories = Object.fromEntries(
      CATEGORIES.map((c) => [c, parseFloat(categoryInputs[c]) || 0]),
    );
    setBudget(parsedIncome, parsedCategories);
    Alert.alert("Saved ✓", "Your budget has been saved!");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.title}>Planning</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>This Month</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>₹{budgets.income || 0}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Spent</Text>
          <Text style={styles.summaryValue}>₹{totalSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[styles.summaryValue, remaining < 0 && styles.negative]}>
            ₹{remaining.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Monthly Income</Text>
      <TextInput
        style={styles.input}
        placeholder="₹ Enter your income"
        placeholderTextColor="#9ab88a"
        value={income}
        onChangeText={setIncome}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Category Budgets</Text>
      {CATEGORIES.map((cat) => (
        <View key={cat} style={styles.categoryRow}>
          <Text style={styles.categoryLabel}>{cat}</Text>
          <TextInput
            style={styles.categoryInput}
            placeholder="₹ 0"
            placeholderTextColor="#9ab88a"
            value={categoryInputs[cat]}
            onChangeText={(val) =>
              setCategoryInputs((prev) => ({ ...prev, [cat]: val }))
            }
            keyboardType="numeric"
          />
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Budgeted</Text>
        <Text style={styles.totalValue}>₹{totalBudgeted.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Budget</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#6E8B59",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    color: "#DCE6C8",
    fontSize: 14,
  },
  summaryValue: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  negative: {
    color: "#f4a0a0",
  },
  divider: {
    height: 1,
    backgroundColor: "#7a9a65",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6E8B59",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#DCE6C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    color: "#3a3a3a",
    fontSize: 15,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DCE6C8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3a3a3a",
  },
  categoryInput: {
    color: "#6E8B59",
    fontSize: 15,
    minWidth: 80,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#DCE6C8",
    marginTop: 4,
    marginBottom: 20,
  },
  totalLabel: {
    fontWeight: "600",
    color: "#3a3a3a",
    fontSize: 15,
  },
  totalValue: {
    fontWeight: "700",
    color: "#6E8B59",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#9BB979",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
