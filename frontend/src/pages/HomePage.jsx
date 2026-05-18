import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col items-center text-center mt-20 mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        >
          Travel Smart, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Save Bigger.
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mb-10"
        >
          The ultimate budget optimizer for students. Find the perfect balance between travel time and costs with our mixed transportation algorithm.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/planner" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-blue-600 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2">
              Start Planning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <FeatureCard icon={<Wallet className="text-blue-400" size={40} />} title="Lowest Budget" desc="We find the absolute cheapest combinations of trains, buses, and stays." />
        <FeatureCard icon={<Clock className="text-purple-400" size={40} />} title="Fastest Time" desc="Prioritize your time with optimal flight and train combinations." />
        <FeatureCard icon={<ShieldCheck className="text-emerald-400" size={40} />} title="Student Friendly" desc="Tailored for students with hostel and shared ride suggestions." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center transition-transform hover:-translate-y-2">
      <div className="bg-slate-800 p-4 rounded-full mb-6 border border-slate-700">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
