import { useState } from 'react';
import { Check, Delete, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface AddExpenseProps {
  onAdd: (amount: number, description: string) => void;
  onCancel: () => void;
}

export function AddExpense({ onAdd, onCancel }: AddExpenseProps) {
  const [amountStr, setAmountStr] = useState('0');
  const [description, setDescription] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => prev + '.');
      }
    } else {
      setAmountStr((prev) => {
        if (prev === '0') return key;
        // Limit to 2 decimal places
        if (prev.includes('.')) {
          const [, decimal] = prev.split('.');
          if (decimal && decimal.length >= 2) return prev;
        }
        return prev + key;
      });
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(amountStr);
    if (amount > 0) {
      onAdd(amount, description.trim());
      onCancel(); // Go back to home
    }
  };

  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', 'del'
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
      <div className="flex justify-between items-center p-6 pb-2">
        <button onClick={onCancel} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium tracking-wide">Add Expense</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 pb-4">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-neutral-500 text-xl mb-1">₹</span>
          <span className={cn(
            "text-5xl font-semibold tracking-tighter transition-all",
            amountStr === '0' ? 'text-neutral-600' : 'text-white'
          )}>
            {amountStr}
          </span>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="What was this for? (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-neutral-900 border-none rounded-2xl px-6 py-3 text-center text-base text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-theme-accent focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-14 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 flex items-center justify-center text-xl font-medium transition-colors"
            >
              {key === 'del' ? <Delete className="w-5 h-5 text-neutral-400" /> : key}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={parseFloat(amountStr) <= 0}
          className="w-full h-14 rounded-2xl bg-theme-accent text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-theme-accent/20"
        >
          <Check className="w-5 h-5" />
          Save Expense
        </button>
      </div>
    </div>
  );
}
