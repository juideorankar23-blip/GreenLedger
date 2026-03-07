import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ExpenseContext } from "../../Context.tsx/ExpenseContext";

const CURRENCIES = ["₹ INR", "$ USD", "€ EUR", "£ GBP"];

export default function Settings() {
  const { profile, loadProfile, expenses } = useContext(ExpenseContext);

  const [name, setName] = useState(profile?.name || "");
  const [dob, setDob] = useState(profile?.dob || "");
  const [currency, setCurrency] = useState(profile?.currency || "₹ INR");
  const [goal, setGoal] = useState(profile?.goal || "");
  const [saved, setSaved] = useState(false);

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Name cannot be empty.");
      return;
    }
    try {
      const updated = { name: name.trim(), dob, currency, goal };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updated));
      await loadProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      Alert.alert("Error", "Could not save profile.");
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your expenses and budget settings. Your profile will be kept. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("expenses");
            await AsyncStorage.removeItem("budgets");
            Alert.alert("Done", "All expense data has been cleared.");
          },
        },
      ],
    );
  };

  const resetApp = () => {
    Alert.alert(
      "Reset App",
      "This will delete everything including your profile and take you back to onboarding. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/onboarding");
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.title}>Settings</Text>

      {/* PROFILE SECTION */}
      <Text style={styles.sectionTitle}>Your Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#9ab88a"
        />

        <Text style={styles.label}>Date of Birth</Text>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={{
              backgroundColor: "#E9E0D0",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              marginBottom: 16,
              color: dob ? "#3a3a3a" : "#9ab88a",
              fontSize: 15,
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box" as any,
              outline: "none",
              display: "block",
            }}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9ab88a"
            keyboardType="numeric"
          />
        )}

        <Text style={styles.label}>Goal</Text>
        <TextInput
          style={styles.input}
          value={goal}
          onChangeText={setGoal}
          placeholder="Your financial goal"
          placeholderTextColor="#9ab88a"
        />

        <Text style={styles.label}>Currency</Text>
        <View style={styles.chips}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, currency === c && styles.activeChip]}
              onPress={() => setCurrency(c)}
            >
              <Text
                style={[
                  styles.chipText,
                  currency === c && styles.activeChipText,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATS SECTION */}
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.card}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Expenses Logged</Text>
          <Text style={styles.statValue}>{expenses.length}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Spent (All Time)</Text>
          <Text style={styles.statValue}>
            ₹{expenses.reduce((s: any, e: any) => s + e.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Member Since</Text>
          <Text style={styles.statValue}>{profile?.dob || "—"}</Text>
        </View>
      </View>

      {/* DANGER ZONE */}
      <Text style={styles.sectionTitle}>Data</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Text style={styles.dangerButtonText}>
            🗑 Clear All Expenses & Budgets
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.dangerButton} onPress={resetApp}>
          <Text style={styles.dangerButtonText}>⚠️ Reset App & Start Over</Text>
        </TouchableOpacity>
      </View>

      {/* APP INFO */}
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.card}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>App Name</Text>
          <Text style={styles.statValue}>GreenLedger</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Version</Text>
          <Text style={styles.statValue}>1.0.0</Text>
        </View>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6E8B59",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#DCE6C8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
  },
  label: {
    color: "#6E8B59",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#E9E0D0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    color: "#3a3a3a",
    fontSize: 15,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#E9E0D0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipText: {
    color: "#6E8B59",
    fontSize: 13,
  },
  activeChip: {
    backgroundColor: "#9BB979",
  },
  activeChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#9BB979",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statLabel: {
    color: "#3a3a3a",
    fontSize: 14,
  },
  statValue: {
    color: "#6E8B59",
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9E0D0",
  },
  dangerButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#c0614a",
    fontWeight: "600",
    fontSize: 14,
  },
});
