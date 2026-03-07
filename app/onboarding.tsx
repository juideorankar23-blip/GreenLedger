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
import { ExpenseContext } from "../Context.tsx/ExpenseContext";

const CURRENCIES = ["₹ INR", "$ USD", "€ EUR", "£ GBP"];
const MONTHLY_GOALS = [
  "Save more",
  "Track spending",
  "Reduce debt",
  "Build an emergency fund",
];

export default function Onboarding() {
  const { loadProfile } = useContext(ExpenseContext);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [currency, setCurrency] = useState("₹ INR");
  const [goal, setGoal] = useState("");

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      Alert.alert("Required", "Please enter your name to continue.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    if (!goal) {
      Alert.alert("Required", "Please select a financial goal.");
      return;
    }
    try {
      const profileData = { name: name.trim(), dob, currency, goal };
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
      await loadProfile();
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Could not save profile. Please try again.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* PROGRESS DOTS */}
      <View style={styles.dots}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, step === i && styles.activeDot]} />
        ))}
      </View>

      {/* STEP 1 — Name & DOB */}
      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.emoji}></Text>
          <Text style={styles.heading}>Welcome to GreenLedger</Text>
          <Text style={styles.subheading}>
            Let&apos;s set up your profile first
          </Text>

          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9ab88a"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Date of Birth</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{
                backgroundColor: "#DCE6C8",
                border: "none",
                borderRadius: 12,
                padding: "14px",
                marginBottom: 20,
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
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9ab88a"
              value={dob}
              onChangeText={setDob}
              keyboardType="numeric"
            />
          )}
        </View>
      )}

      {/* STEP 2 — Currency */}
      {step === 2 && (
        <View style={styles.step}>
          <Text style={styles.emoji}>💱</Text>
          <Text style={styles.heading}>Your Currency</Text>
          <Text style={styles.subheading}>What currency do you use daily?</Text>

          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.optionCard,
                currency === c && styles.optionCardActive,
              ]}
              onPress={() => setCurrency(c)}
            >
              <Text
                style={[
                  styles.optionText,
                  currency === c && styles.optionTextActive,
                ]}
              >
                {c}
              </Text>
              {currency === c && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* STEP 3 — Financial Goal */}
      {step === 3 && (
        <View style={styles.step}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.heading}>Your Financial Goal</Text>
          <Text style={styles.subheading}>
            What&apos;s your main focus right now?
          </Text>

          {MONTHLY_GOALS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.optionCard, goal === g && styles.optionCardActive]}
              onPress={() => setGoal(g)}
            >
              <Text
                style={[
                  styles.optionText,
                  goal === g && styles.optionTextActive,
                ]}
              >
                {g}
              </Text>
              {goal === g && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep((s) => s - 1)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        {step < 3 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
            <Text style={styles.nextButtonText}>Get Started 🌿</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E0D0",
  },
  content: {
    padding: 28,
    paddingTop: 80,
    paddingBottom: 60,
    flexGrow: 1,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DCE6C8",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#6E8B59",
  },
  step: {
    flex: 1,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3a3a3a",
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#6E8B59",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    color: "#6E8B59",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#DCE6C8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    color: "#3a3a3a",
    fontSize: 15,
  },
  optionCard: {
    backgroundColor: "#DCE6C8",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionCardActive: {
    backgroundColor: "#6E8B59",
  },
  optionText: {
    fontSize: 16,
    color: "#3a3a3a",
    fontWeight: "500",
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  check: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  backButton: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#DCE6C8",
    flex: 1,
    alignItems: "center",
  },
  backButtonText: {
    color: "#6E8B59",
    fontWeight: "600",
    fontSize: 15,
  },
  nextButton: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#9BB979",
    flex: 2,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
