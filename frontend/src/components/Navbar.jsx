import { Compass, Moon, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="sticky top-0 z-50 glass border-b-0 shadow-sm dark:shadow-none">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Compass size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                LuminaTravel
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-widest uppercase flex items-center gap-1">
                AI Operating System <Sparkles size={10} className="text-yellow-500" />
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <button className="hidden sm:flex px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
