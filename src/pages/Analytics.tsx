import { useState, useMemo } from 'react';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import { Expense, AppSettings } from '../types';
import { cn } from '../utils/cn';

interface AnalyticsProps {
  expenses: Expense[];
  settings: AppSettings;
}

export function Analytics({ expenses, settings }: AnalyticsProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    return last7Days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter(
        (e) => format(e.timestamp, 'yyyy-MM-dd') === dateStr
      );
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        date: format(date, 'EEE'), // Mon, Tue, etc.
        fullDate: format(date, 'MMM d'),
        amount: total,
      };
    });
  }, [expenses]);

  const total7Days = chartData.reduce((sum, d) => sum + d.amount, 0);
  const averageDaily = total7Days / 7;

  // Monthly logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const monthlyExpenses = expenses.filter(e => isSameMonth(new Date(e.timestamp), currentMonth));
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getDayTotal = (date: Date) => {
    return expenses
      .filter(e => isSameDay(new Date(e.timestamp), date))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const currentTotal = viewMode === 'weekly' ? total7Days : monthlyTotal;
  const currentSubtitle = viewMode === 'weekly' 
    ? `Avg. ₹${averageDaily.toFixed(2)} / day`
    : `${monthlyExpenses.length} expenses this month`;
  const currentTitle = viewMode === 'weekly' ? 'Last 7 Days' : 'This Month';

  const getThemeColor = () => {
    switch (settings.themeColor) {
      case 'green': return '#10b981';
      case 'blue': return '#3b82f6';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f97316';
      default: return '#10b981';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 pb-20 overflow-y-auto">
      <div className="px-6 pt-12 pb-8 bg-neutral-900 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <h1 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">{currentTitle}</h1>
        <div className="text-5xl font-semibold tracking-tight text-white flex items-baseline gap-1">
          <span className="text-2xl text-neutral-500 font-normal">₹</span>
          {currentTotal.toFixed(2)}
        </div>
        <p className="text-neutral-500 text-sm mt-2">
          {currentSubtitle}
        </p>
      </div>

      <div className="flex-1 px-4 pt-6">
        <div className="flex bg-neutral-900 p-1 rounded-xl mb-6 shadow-sm border border-neutral-800/50">
          <button
            onClick={() => setViewMode('weekly')}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors", viewMode === 'weekly' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
          >
            <BarChart2 className="w-4 h-4" /> Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors", viewMode === 'monthly' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
          >
            <CalendarIcon className="w-4 h-4" /> Monthly
          </button>
        </div>

        {viewMode === 'weekly' ? (
          <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800/50">
            <h2 className="text-lg font-medium text-neutral-200 mb-6">Weekly Overview</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#737373', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#737373', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#262626' }}
                    contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '12px', color: '#f5f5f5' }}
                    itemStyle={{ color: '#f5f5f5', fontWeight: 600 }}
                    labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
                    formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spent']}
                    labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getThemeColor()} fillOpacity={entry.amount > 0 ? 1 : 0.2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-3xl p-5 shadow-sm border border-neutral-800/50">
            <div className="flex justify-between items-center mb-6 px-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-medium text-neutral-200">{format(currentMonth, 'MMMM yyyy')}</h2>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-neutral-500 py-1">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const dayTotal = getDayTotal(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col items-center justify-start p-1 h-12 rounded-lg border border-transparent transition-colors",
                      !isCurrentMonth && "opacity-30",
                      isTodayDate && "bg-neutral-800 border-neutral-700",
                      dayTotal > 0 && !isTodayDate && "bg-neutral-800/30"
                    )}
                  >
                    <span className={cn("text-xs mb-0.5", isTodayDate ? "text-theme-accent font-bold" : "text-neutral-300")}>
                      {format(day, 'd')}
                    </span>
                    {dayTotal > 0 && (
                      <span className="text-[9px] text-neutral-400 font-medium truncate w-full text-center">
                        ₹{dayTotal >= 1000 ? (dayTotal/1000).toFixed(1)+'k' : Math.round(dayTotal)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
