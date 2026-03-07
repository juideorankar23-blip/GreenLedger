import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/next";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useContext } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ExpenseContext } from "../../Context.tsx/ExpenseContext";

export default function Dashboard() {
  const { expenses, deleteExpense, profile } = useContext(ExpenseContext);

  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const name = profile?.name || "there";
  const today = new Date().toDateString();

  const todayTotal = expenses
    .filter((e: any) => new Date(e.date).toDateString() === today)
    .reduce((sum: any, e: any) => sum + e.amount, 0);

  const grouped: Record<string, any[]> = {};
  expenses.forEach((e: any) => {
    const label = new Date(e.date).toDateString();
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(e);
  });

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const formatDateLabel = (dateStr: string) => {
    if (dateStr === today) return "Today";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toDateString()) return "Yesterday";
    return dateStr;
  };

  const exportCSV = async () => {
    const header = "Date,Category,Note,Amount\n";
    const rows = [...expenses]
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .map(
        (e: any) =>
          `${new Date(e.date).toLocaleDateString()},${e.category},"${e.note}",${e.amount}`,
      )
      .join("\n");

    const csv = header + rows;

    if (Platform.OS === "web") {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "greenledger_expenses.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      try {
        const path =
          (FileSystem as any).documentDirectory + "greenledger_expenses.csv";
        await (FileSystem as any).writeAsStringAsync(path, csv, {
          encoding: "utf8",
        });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(path, {
            mimeType: "text/csv",
            dialogTitle: "Export GreenLedger Expenses",
          });
        } else {
          Alert.alert("Saved", `CSV saved to: ${path}`);
        }
      } catch {
        Alert.alert("Error", "Could not export CSV.");
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {name} 👋
        </Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
          <Ionicons name="settings-outline" size={24} color="#6E8B59" />
        </TouchableOpacity>
      </View>

      {/* TODAY SUMMARY CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today&apos;s Spending</Text>
        <Text style={styles.amount}>₹{todayTotal.toFixed(2)}</Text>
      </View>

      {/* CSV EXPORT BUTTON */}
      {expenses.length > 0 && (
        <TouchableOpacity style={styles.csvButton} onPress={exportCSV}>
          <Text style={styles.csvButtonText}>⬇ Export to CSV</Text>
        </TouchableOpacity>
      )}

      {/* ALL EXPENSES GROUPED BY DATE */}
      {expenses.length === 0 ? (
        <Text style={styles.empty}>No expenses yet. Add your first one!</Text>
      ) : (
        sortedDates.map((dateStr) => (
          <View key={dateStr}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateLabel}>{formatDateLabel(dateStr)}</Text>
              <Text style={styles.dateTotals}>
                ₹
                {grouped[dateStr]
                  .reduce((s: any, e: any) => s + e.amount, 0)
                  .toFixed(2)}
              </Text>
            </View>

            {grouped[dateStr].map((e: any) => (
              <View key={e.id} style={styles.expenseItem}>
                <View style={styles.expenseLeft}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{e.category}</Text>
                  </View>
                  <View>
                    <Text style={styles.expenseNote}>
                      {e.note || e.category}
                    </Text>
                    <Text style={styles.expenseAmount}>
                      ₹{e.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/add?id=${e.id}`)}
                  >
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteExpense(e.id)}>
                    <Text style={styles.delete}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))
      )}

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E0D0",
    padding: 20,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#6E8B59",
    flex: 1,
  },
  card: {
    backgroundColor: "#DCE6C8",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#6E8B59",
    marginBottom: 5,
    fontSize: 14,
  },
  amount: {
    fontSize: 26,
    fontWeight: "600",
    color: "#6E8B59",
  },
  csvButton: {
    backgroundColor: "#DCE6C8",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#9BB979",
  },
  csvButtonText: {
    color: "#6E8B59",
    fontWeight: "600",
    fontSize: 14,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6E8B59",
  },
  dateTotals: {
    fontSize: 13,
    color: "#6E8B59",
    fontWeight: "500",
  },
  expenseItem: {
    backgroundColor: "#DCE6C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: "#9BB979",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  expenseNote: {
    color: "#3a3a3a",
    fontSize: 14,
    fontWeight: "500",
  },
  expenseAmount: {
    color: "#6E8B59",
    fontWeight: "600",
    fontSize: 13,
    marginTop: 2,
  },
  delete: {
    fontSize: 16,
    color: "#9ab88a",
  },
  empty: {
    color: "#6E8B59",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#9BB979",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
