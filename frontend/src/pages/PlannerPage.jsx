import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TravelCard from '../components/TravelCard';
import { CheckCircle2, X } from 'lucide-react';

export default function PlannerPage() {
  const [formData, setFormData] = useState({
    source: '', destination: '', startDate: '', endDate: '', 
    students: 1, budget: 5000, accommodation: 'Hostel', priority: 'Lowest Budget'
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/optimize-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        throw new Error("Backend error");
      }
    } catch (error) {
      setTimeout(() => {
        setResults({
          optimized_options: [
            { id: 1, transport_mode: "Train + Hostel", total_cost: formData.students * 2000, time_hours: 16, stay_cost: formData.students * 500, savings: 4000, recommendation_tag: "Recommended" },
            { id: 2, transport_mode: "Flight + Hotel", total_cost: formData.students * 8000, time_hours: 2, stay_cost: formData.students * 2000, savings: 0, recommendation_tag: "Fastest" },
            { id: 3, transport_mode: "Bus + Shared Stay", total_cost: formData.students * 2500, time_hours: 24, stay_cost: formData.students * 500, savings: 3500, recommendation_tag: "Budget Friendly" },
            { id: 4, transport_mode: "Train + Bus + Hostel", total_cost: formData.students * 1800, time_hours: 18, stay_cost: formData.students * 300, savings: 4500, recommendation_tag: "Cheapest" }
          ],
          savings_suggestions: [
            "Traveling one day earlier saves ₹500 per person.",
            "Night train avoids hotel expense."
          ]
        });
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  const handleBook = (option) => {
    setBooking(option);
    const history = JSON.parse(localStorage.getItem('travel_history') || '[]');
    history.push({ ...option, date: new Date().toISOString() });
    localStorage.setItem('travel_history', JSON.stringify(history));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        
        <div className="glass-card p-6 rounded-2xl h-fit lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold mb-6">Plan Trip</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Source</label>
              <input required className="glass-input w-full p-3 rounded-lg" type="text" value={formData.source} onChange={(e)=>setFormData({...formData, source: e.target.value})} placeholder="e.g. Delhi" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Destination</label>
              <input required className="glass-input w-full p-3 rounded-lg" type="text" value={formData.destination} onChange={(e)=>setFormData({...formData, destination: e.target.value})} placeholder="e.g. Mumbai" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Students</label>
                <input className="glass-input w-full p-3 rounded-lg" type="number" min="1" value={formData.students} onChange={(e)=>setFormData({...formData, students: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Budget (₹)</label>
                <input className="glass-input w-full p-3 rounded-lg" type="number" value={formData.budget} onChange={(e)=>setFormData({...formData, budget: parseInt(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Priority</label>
              <select className="glass-input w-full p-3 rounded-lg" value={formData.priority} onChange={(e)=>setFormData({...formData, priority: e.target.value})}>
                <option>Lowest Budget</option>
                <option>Fastest Travel Time</option>
              </select>
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors mt-4 cursor-pointer">
              {loading ? 'Optimizing...' : 'Find Best Routes'}
            </button>
          </form>
        </div>

        <div>
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-xl">Fill out the form to find optimal routes.</p>
            </div>
          )}
          
          {loading && (
            <div className="h-full flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {results && !loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <div className="glass-card p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
                <h3 className="font-bold text-blue-400 mb-2">Smart Suggestions ✨</h3>
                <ul className="list-disc pl-5 text-sm text-blue-200 space-y-1">
                  {results.savings_suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div className="space-y-4">
                {results.optimized_options?.map((opt, i) => (
                  <motion.div key={opt.id || i} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: i*0.1}}>
                    <TravelCard option={opt} onBook={handleBook} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {booking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}
              className="glass-card p-8 rounded-2xl max-w-sm w-full text-center relative border border-emerald-500/30"
            >
              <button onClick={()=>setBooking(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
                <X size={24} />
              </button>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Ticket Booked!</h2>
              <p className="text-slate-300 mb-6">Your {booking.transport_mode} trip has been successfully scheduled.</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-colors cursor-pointer"
              >
                View Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
