import { CheckCircle2, IndianRupee, Clock, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultCard({ route, index, onBook }) {
  const isBest = route.isBest;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative p-6 rounded-3xl border flex flex-col justify-between ${
        isBest 
        ? 'border-blue-500/50 bg-blue-50/40 dark:bg-blue-900/10 shadow-[0_8px_30px_rgb(59,130,246,0.12)]' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/50'
      } transition-all`}
    >
      {isBest && (
        <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 uppercase tracking-widest">
          <SparklesIcon size={12} /> Top AI Pick
        </div>
      )}
      
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {route.mode}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{route.subMode}</h3>
            </div>
            
            <div className="mt-4 flex items-center gap-3 w-full">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-900"></div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              </div>
              <div className="flex flex-col justify-between h-14 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <p>Departure Station</p>
                <p>Arrival Station</p>
              </div>
            </div>
          </div>

          <div className="text-right ml-4">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Group Fare</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white flex items-start justify-end gap-0.5 tracking-tighter">
              <span className="text-lg mt-1 text-slate-500">₹</span>{route.totalCost}
            </div>
            <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md inline-flex items-center gap-1 mt-2 border border-slate-200 dark:border-slate-700">
              <UserIcon size={10}/> ₹{route.pricePerPerson} / traveler
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Clock size={14} className="text-blue-500" /> {route.timeHours} hrs
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Zap size={14} className="text-yellow-500" /> Comfort: {route.comfortScore}/10
          </div>
          {route.tags && route.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-xl">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onBook(route)}
          className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold hover:bg-blue-600 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-600 transition-all flex items-center justify-center gap-2 group shadow-md"
        >
          Secure Booking <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// Minimal Icons for local use
function SparklesIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
function UserIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
