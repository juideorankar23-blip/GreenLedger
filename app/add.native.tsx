import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpenseContext } from "../Context.tsx/ExpenseContext";

export default function AddExpense() {
  const { addExpense, editExpense, expenses } = useContext(ExpenseContext);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Pre-fill if editing
  useEffect(() => {
    if (id) {
      const existing = expenses.find((e) => e.id === id);
      if (existing) {
        setCategory(existing.category);
        setNote(existing.note);
        setAmount(String(existing.amount));
        setDate(new Date(existing.date));
      }
    }
  }, [id, expenses]);

  const handleSubmit = () => {
    if (!amount || !category) return;

    const expense = {
      id: id ?? Date.now().toString(),
      category,
      note,
      amount: parseFloat(amount),
      date,
    };

    if (isEditing) {
      editExpense(expense);
    } else {
      addExpense(expense);
    }

    router.replace("/(tabs)");
  };

  const categories = ["Food", "Shopping", "Transport", "Bills", "Other"];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {isEditing ? "Edit Expense" : "Add Expense"}
      </Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.activeChip]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[styles.chipText, category === c && styles.activeChipText]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Note</Text>
      <TextInput
        placeholder="Coffee, groceries etc"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        placeholder="₹ Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate?: Date) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEditing ? "Save Changes" : "Add Expense"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E0D0",
    padding: 25,
    paddingTop: 70,
  },
  backButton: { fontSize: 18, color: "#6E8B59", marginBottom: 10 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#6E8B59",
    marginBottom: 30,
  },
  label: { color: "#6E8B59", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#DCE6C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    color: "#6E8B59",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  chip: {
    backgroundColor: "#DCE6C8",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: { color: "#6E8B59" },
  activeChip: { backgroundColor: "#9BB979" },
  activeChipText: { color: "#fff", fontWeight: "600" },
  dateButton: {
    backgroundColor: "#DCE6C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateText: { color: "#6E8B59" },
  button: {
    backgroundColor: "#9BB979",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
