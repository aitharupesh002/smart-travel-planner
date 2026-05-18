import { CheckCircle, Train, Bus, Plane, Hotel, Navigation, Clock } from 'lucide-react';

export default function TravelCard({ option, onBook }) {
  const getIcon = (mode) => {
    if (mode.includes('Flight')) return <Plane className="text-blue-400" />;
    if (mode.includes('Train')) return <Train className="text-orange-400" />;
    if (mode.includes('Bus')) return <Bus className="text-emerald-400" />;
    return <Navigation className="text-purple-400" />;
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Cheapest': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Fastest': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Budget Friendly': return 'bg-teal-500/20 text-teal-400 border-teal-500/50';
      case 'Recommended': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Mixed Transport': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex-shrink-0">
          {getIcon(option.transport_mode)}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{option.transport_mode}</h3>
            {option.recommendation_tag && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTagColor(option.recommendation_tag)}`}>
                {option.recommendation_tag}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock size={16} /> {option.time_hours} hrs
            </div>
            <div className="flex items-center gap-1">
              <Hotel size={16} /> ₹{option.stay_cost} stay
            </div>
            {option.savings > 0 && (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle size={16} /> Save ₹{option.savings}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
        <div className="text-3xl font-extrabold text-white">
          ₹{option.total_cost}
        </div>
        <button 
          onClick={() => onBook(option)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
