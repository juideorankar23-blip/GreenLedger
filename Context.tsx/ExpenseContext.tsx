import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type Expense = {
  id: string;
  category: string;
  note: string;
  amount: number;
  date: Date;
};

type Budgets = {
  income: number;
  categories: Record<string, number>;
};

type UserProfile = {
  name: string;
  dob: string;
  currency: string;
  goal: string;
} | null;

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  editExpense: (expense: Expense) => void;
  budgets: Budgets;
  setBudget: (income: number, categories: Record<string, number>) => void;
  profile: UserProfile;
  loadProfile: () => Promise<void>;
};

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  addExpense: () => {},
  deleteExpense: () => {},
  editExpense: () => {},
  budgets: { income: 0, categories: {} },
  setBudget: () => {},
  profile: null,
  loadProfile: async () => {},
});

export const ExpenseProvider = ({ children }: any) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budgets>({
    income: 0,
    categories: {},
  });
  const [profile, setProfile] = useState<UserProfile>(null);

  useEffect(() => {
    loadExpenses();
    loadBudgets();
    loadProfile();
  }, []);

  const loadExpenses = async () => {
    try {
      const saved = await AsyncStorage.getItem("expenses");
      if (saved) {
        const parsed = JSON.parse(saved);
        setExpenses(
          parsed.map((item: any) => ({ ...item, date: new Date(item.date) })),
        );
      }
    } catch (e) {
      console.log("Error loading expenses", e);
    }
  };

  const loadBudgets = async () => {
    try {
      const saved = await AsyncStorage.getItem("budgets");
      if (saved) setBudgets(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading budgets", e);
    }
  };

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem("userProfile");
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading profile", e);
    }
  };

  const saveExpenses = async (data: Expense[]) => {
    try {
      await AsyncStorage.setItem("expenses", JSON.stringify(data));
    } catch (e) {
      console.log("Error saving expenses", e);
    }
  };

  const saveBudgets = async (data: Budgets) => {
    try {
      await AsyncStorage.setItem("budgets", JSON.stringify(data));
    } catch (e) {
      console.log("Error saving budgets", e);
    }
  };

  const addExpense = (expense: Expense) => {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  const editExpense = (updatedExpense: Expense) => {
    const updated = expenses.map((item) =>
      item.id === updatedExpense.id ? updatedExpense : item,
    );
    setExpenses(updated);
    saveExpenses(updated);
  };

  const setBudget = (income: number, categories: Record<string, number>) => {
    const updated = { income, categories };
    setBudgets(updated);
    saveBudgets(updated);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        editExpense,
        budgets,
        setBudget,
        profile,
        loadProfile,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
