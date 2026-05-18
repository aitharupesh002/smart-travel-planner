import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, LayoutDashboard, Sparkles } from 'lucide-react';
import TravelForm from '../components/TravelForm';
import MapSection from '../components/MapSection';
import ResultCard from '../components/ResultCard';
import TravelInsights from '../components/TravelInsights';
import BookingWizard from '../components/BookingWizard';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bookingRoute, setBookingRoute] = useState(null);
  const [travelers, setTravelers] = useState(1);

  const handleSearch = async (formData) => {
    setLoading(true);
    setError(null);
    setTravelers(formData.travelers);
    try {
      const response = await axios.post('https://smart-travel-planner-d7im.onrender.com/api/routes/calculate', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to connect to the server. Please ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid-slate-900 [mask-image:linear-gradient(to_bottom,transparent,black)] dark:[mask-image:linear-gradient(to_bottom,transparent,white)] opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-600/10 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-slate-200 dark:border-slate-700"
          >
            <Sparkles size={16} className="text-yellow-500" />
            <span className="text-sm font-semibold">Introducing Lumina OS 2.0</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Travel smarter with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient-x">
              AI-Powered Routing
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            Real-time dynamic pricing, intelligent group budget optimization, and predictive market insights wrapped in a beautiful interface.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
        <TravelForm onSubmit={handleSearch} loading={loading} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-4 glass-panel text-red-600 dark:text-red-400 rounded-2xl text-center border-red-200 dark:border-red-900/50 shadow-lg"
            >
              <div className="font-semibold">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Map & AI Insights */}
              <div className="lg:col-span-5 space-y-6">
                <MapSection mapData={result.mapData} />
                <TravelInsights insights={result.insights} aiExplanation={result.aiExplanation} />
              </div>

              {/* Right Column: Routes */}
              <div className="lg:col-span-7">
                <div className="glass p-6 md:p-8 rounded-[2rem]">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold flex items-center gap-3">
                      <LayoutDashboard className="text-indigo-500" /> Optimal Routes
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        {travelers} Travelers
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6 max-h-[800px] overflow-y-auto pr-3 custom-scrollbar">
                    {result.routes.map((route, index) => (
                      <ResultCard key={route.id} route={route} index={index} onBook={setBookingRoute} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {bookingRoute && (
          <BookingWizard
            route={bookingRoute}
            travelers={travelers}
            onClose={() => setBookingRoute(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
