import { Palette, Globe, Info, Download } from 'lucide-react';
import { AppSettings, ThemeColor, Expense } from '../types';
import { cn } from '../utils/cn';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  expenses: Expense[];
}

export function Settings({ settings, updateSettings, expenses }: SettingsProps) {
  const themes: { id: ThemeColor; label: string; colorClass: string }[] = [
    { id: 'green', label: 'Emerald', colorClass: 'bg-emerald-500' },
    { id: 'blue', label: 'Ocean', colorClass: 'bg-blue-500' },
    { id: 'purple', label: 'Amethyst', colorClass: 'bg-purple-500' },
    { id: 'orange', label: 'Sunset', colorClass: 'bg-orange-500' },
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Time,Amount,Description\n"
      + expenses.map(e => {
          const date = new Date(e.timestamp);
          return `${date.toLocaleDateString()},${date.toLocaleTimeString()},${e.amount},"${e.description.replace(/"/g, '""')}"`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 pb-20 overflow-y-auto">
      <div className="px-6 pt-12 pb-8 bg-neutral-900 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Settings</h1>
      </div>

      <div className="flex-1 px-4 pt-8 space-y-8">
        
        {/* Appearance */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-400 px-2">
            <Palette className="w-5 h-5" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Appearance</h2>
          </div>
          <div className="bg-neutral-900 rounded-3xl p-4 shadow-sm border border-neutral-800/50">
            <div className="grid grid-cols-4 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ themeColor: theme.id })}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    theme.colorClass,
                    settings.themeColor === theme.id ? "ring-4 ring-neutral-800 ring-offset-2 ring-offset-neutral-950 scale-110" : "opacity-80 group-hover:opacity-100"
                  )}>
                    {settings.themeColor === theme.id && (
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-400 px-2">
            <Globe className="w-5 h-5" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Preferences</h2>
          </div>
          <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-neutral-800/50 divide-y divide-neutral-800/50">
            <div className="flex items-center justify-between p-4">
              <span className="text-neutral-200 font-medium">Language</span>
              <select 
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="bg-neutral-800 text-neutral-200 border-none rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-theme-accent outline-none"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors text-left"
            >
              <span className="text-neutral-200 font-medium">Export Data (CSV)</span>
              <Download className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </section>

        {/* About */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-400 px-2">
            <Info className="w-5 h-5" />
            <h2 className="text-sm font-medium uppercase tracking-wider">About</h2>
          </div>
          <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800/50 text-center space-y-2">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg shadow-theme-accent/20 bg-neutral-800 flex items-center justify-center">
              <img src="/logo.png" alt="KhataBook Logo" className="w-full h-full object-cover" onError={(e) => {
                // Fallback if image is not yet uploaded
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-bold text-3xl">K</span>';
              }} />
            </div>
            <h3 className="text-xl font-semibold text-white">KhataBook</h3>
            <p className="text-neutral-500 text-sm">Version 1.0.0</p>
            <p className="text-neutral-400 text-sm mt-4">
              A simple, fast, and beautiful way to track your daily expenses without the stress of budgeting.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
