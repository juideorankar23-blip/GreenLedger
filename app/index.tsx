import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        if (profile) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("./assets/greenledger-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>GreenLedger</Text>
        <Text style={styles.tagline}>Smart budgeting made simple</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E0D0",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 180, height: 180, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: "700", color: "#6E8B59" },
  tagline: { marginTop: 6, fontSize: 16, color: "#6E8B59" },
  content: { alignItems: "center" },
});
