export interface Expense {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
}

export type ThemeColor = 'green' | 'blue' | 'purple' | 'orange';

export interface AppSettings {
  themeColor: ThemeColor;
  language: string;
}
