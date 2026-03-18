import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from './store';
import { Home } from './pages/Home';
import { AddExpense } from './pages/AddExpense';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const { expenses, settings, addExpense, deleteExpense, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState('home');

  const variants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
  };

  return (
    <div className="h-[100dvh] w-full bg-neutral-950 flex justify-center overflow-hidden font-sans selection:bg-theme-accent/30">
      <div className="w-full max-w-md h-full relative bg-neutral-950 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Home expenses={expenses} onDelete={deleteExpense} />
              </motion.div>
            )}
            {activeTab === 'add' && (
              <motion.div 
                key="add"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-40 bg-neutral-950"
              >
                <AddExpense 
                  onAdd={addExpense} 
                  onCancel={() => setActiveTab('home')} 
                />
              </motion.div>
            )}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Analytics expenses={expenses} settings={settings} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Settings 
                  settings={settings} 
                  updateSettings={updateSettings} 
                  expenses={expenses}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <AnimatePresence>
          {activeTab !== 'add' && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 z-50"
            >
              <BottomNav activeTab={activeTab} onChange={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
