import { TrendingDown, Calendar, PiggyBank, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TravelInsights({ insights, aiExplanation }) {
  if (!insights) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Holographic AI Research Card */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[#111827] dark:to-[#1e293b] border border-indigo-200 dark:border-slate-800 shadow-[0_8px_30px_rgba(79,70,229,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 text-indigo-600 dark:text-blue-400 rotate-12 transition-transform group-hover:rotate-45 duration-700">
          <Sparkles size={120} />
        </div>
        
        <h3 className="text-sm font-extrabold tracking-widest uppercase text-indigo-900 dark:text-indigo-400 flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-md text-indigo-600 dark:text-indigo-300">
            <Sparkles size={16} />
          </div>
          Lumina AI Research
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 text-[15px] font-medium">
          {aiExplanation}
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/30">
            <PiggyBank size={24} />
          </div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-1">Budget Efficiency</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{insights.budgetUtilization}%</p>
        </div>
        
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30">
            <TrendingDown size={24} />
          </div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-1">Predicted Savings</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{insights.totalSavings}</p>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/20 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center gap-2">
          <Activity size={18} className="text-slate-700 dark:text-slate-300" />
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">Market Intelligence</h4>
        </div>
        <div className="p-5 space-y-5 text-[15px] font-medium">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
              <TrendingDown size={16} />
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">{insights.insight}</p>
          </div>
          
          {insights.alternateSuggestion && (
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shrink-0">
                <Calendar size={16} />
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-snug">{insights.alternateSuggestion}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Predicted Fare Increase (7 days)</span>
            <span className="text-sm font-black text-white bg-rose-500 px-3 py-1 rounded-full shadow-lg shadow-rose-500/30">
              +{insights.predictedIncreasePct}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
