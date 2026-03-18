import { useState, useEffect, useCallback } from 'react';
import { Expense, AppSettings, ThemeColor } from './types';

const EXPENSES_KEY = 'minimal_tracker_expenses';
const SETTINGS_KEY = 'minimal_tracker_settings';

const DEFAULT_SETTINGS: AppSettings = {
  themeColor: 'green',
  language: 'en',
};

export function useStore() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(EXPENSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply theme color to root
    document.documentElement.dataset.theme = settings.themeColor;
  }, [settings]);

  const addExpense = useCallback((amount: number, description: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount,
      description,
      timestamp: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    expenses,
    settings,
    addExpense,
    deleteExpense,
    updateSettings,
  };
}
