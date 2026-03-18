import { format, isToday, isYesterday } from 'date-fns';
import { Expense } from '../types';
import { cn } from '../utils/cn';

interface HomeProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function Home({ expenses, onDelete }: HomeProps) {
  const todayExpenses = expenses.filter((e) => isToday(e.timestamp));
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group expenses by date
  const grouped = expenses.reduce((acc, expense) => {
    const dateStr = format(expense.timestamp, 'yyyy-MM-dd');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatGroupDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 pb-20 overflow-y-auto">
      <div className="px-6 pt-12 pb-8 bg-neutral-900 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <h1 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Today's Spend</h1>
        <div className="text-5xl font-semibold tracking-tight text-white flex items-baseline gap-1">
          <span className="text-2xl text-neutral-500 font-normal">₹</span>
          {todayTotal.toFixed(2)}
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 space-y-8">
        {sortedDates.length === 0 ? (
          <div className="text-center text-neutral-500 mt-12">
            <p>No expenses yet.</p>
            <p className="text-sm mt-2">Tap the + button to add one.</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const dayExpenses = grouped[dateStr];
            const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex justify-between items-end px-2">
                  <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                    {formatGroupDate(dateStr)}
                  </h2>
                  <span className="text-sm font-medium text-neutral-500">
                    ₹{dayTotal.toFixed(2)}
                  </span>
                </div>
                <div className="bg-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-800/50 shadow-sm">
                  {dayExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-200 text-lg">
                          {expense.description || 'Expense'}
                        </span>
                        <span className="text-xs text-neutral-500 mt-0.5">
                          {format(expense.timestamp, 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-neutral-100 text-lg">
                          ₹{expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-2 -mr-2"
                          aria-label="Delete expense"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
