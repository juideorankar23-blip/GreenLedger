import { Stack } from "expo-router";
import { ExpenseProvider } from "../Context.tsx/ExpenseContext";

export default function RootLayout() {
  return (
    <ExpenseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ExpenseProvider>
  );
}
