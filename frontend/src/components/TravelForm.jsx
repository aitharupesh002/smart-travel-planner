import { useState } from 'react';
import { Search, MapPin, IndianRupee, Users, Calendar, Navigation, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TravelForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    travelers: 1,
    totalBudget: 5000,
    budgetPriority: 'false',
    timePriority: 'false',
    comfortPriority: 'false',
    travelType: 'Any'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium";
  const labelClasses = "text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2";

  return (
    <motion.form 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      onSubmit={handleSubmit}
      className="glass p-6 md:p-10 rounded-[2.5rem] w-full max-w-5xl mx-auto -mt-16 relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="space-y-1">
          <label className={labelClasses}>
            <MapPin size={14} className="text-blue-500" /> Source
          </label>
          <input 
            type="text" required placeholder="E.g. Mumbai" 
            className={inputClasses}
            value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}
          />
        </div>
        
        <div className="space-y-1">
          <label className={labelClasses}>
            <MapPin size={14} className="text-purple-500" /> Destination
          </label>
          <input 
            type="text" required placeholder="E.g. Delhi" 
            className={inputClasses}
            value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>
            <Calendar size={14} className="text-indigo-500" /> Travel Date
          </label>
          <input 
            type="date" required 
            className={inputClasses}
            value={formData.travelDate} onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>
            <Users size={14} className="text-emerald-500" /> Travelers
          </label>
          <input 
            type="number" min="1" max="10" required 
            className={inputClasses}
            value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>
            <IndianRupee size={14} className="text-green-500" /> Group Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input 
              type="number" min="500" step="500" required 
              className={`${inputClasses} pl-8`}
              value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>
            <Navigation size={14} className="text-orange-500" /> Transport
          </label>
          <select 
            className={inputClasses}
            value={formData.travelType} onChange={(e) => setFormData({...formData, travelType: e.target.value})}
          >
            <option value="Any">Mixed (Auto)</option>
            <option value="Train">Train Only</option>
            <option value="Bus">Bus Only</option>
            <option value="Flight">Flight Only</option>
          </select>
        </div>

        <div className="space-y-1 lg:col-span-2">
          <label className={labelClasses}>
            <Sparkles size={14} className="text-rose-500" /> AI Optimization Goal
          </label>
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            {['Balanced', 'Lowest Budget', 'Fastest Time', 'Comfort'].map(p => {
              const isActive = (p === 'Lowest Budget' && formData.budgetPriority === 'true') ||
                               (p === 'Fastest Time' && formData.timePriority === 'true') ||
                               (p === 'Comfort' && formData.comfortPriority === 'true') ||
                               (p === 'Balanced' && formData.budgetPriority === 'false' && formData.timePriority === 'false' && formData.comfortPriority === 'false');
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      budgetPriority: p === 'Lowest Budget' ? 'true' : 'false',
                      timePriority: p === 'Fastest Time' ? 'true' : 'false',
                      comfortPriority: p === 'Comfort' ? 'true' : 'false',
                    });
                  }}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button 
          type="submit" 
          disabled={loading}
          className="group relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold py-4 px-12 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 text-lg"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          ) : (
            <Search size={22} className="group-hover:rotate-12 transition-transform" />
          )}
          <span className="relative z-10">{loading ? 'AI Analyzing Market...' : 'Generate Smart Routes'}</span>
          
          {/* Button Hover Glow */}
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity z-0 disabled:hidden"></div>
          <span className="relative z-10 group-hover:text-white transition-colors delay-75 disabled:group-hover:text-current hidden group-hover:block absolute inset-0 py-4 px-12 flex items-center gap-3 justify-center">
            <Search size={22} className="rotate-12" /> Generate Smart Routes
          </span>
        </button>
      </div>
    </motion.form>
  );
}
