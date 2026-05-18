import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, CreditCard, CheckCircle, Ticket, Download, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import axios from 'axios';

export default function BookingWizard({ route, travelers, onClose }) {
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState(Array(travelers).fill({ name: '', age: '' }));
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleBook = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/routes/book', {
        routeId: route.id,
        passengers,
        contactInfo: { email: 'user@example.com' }
      });
      setBookingResult(response.data);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const steps = [
    { num: 1, title: 'Passengers' },
    { num: 2, title: 'Seats' },
    { num: 3, title: 'Payment' },
    { num: 4, title: 'Ticket' }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-xl transition-opacity"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#0f172a] rounded-[2rem] w-full max-w-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-500" /> Secure Checkout
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Powered by Lumina OS</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors border border-transparent dark:border-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {steps.map(s => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  step > s.num ? 'bg-blue-500 text-white border-none' : 
                  step === s.num ? 'bg-blue-600 text-white border-2 border-white dark:border-slate-900 ring-2 ring-blue-500' : 
                  'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s.num ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 dark:bg-[#0a0f1c]/50">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-blue-900 dark:text-blue-100 tracking-tight">{route.mode} — {route.subMode}</h3>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">{travelers} Passenger{travelers > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">Total Group Fare</p>
                    <p className="text-3xl font-black text-blue-900 dark:text-blue-100 tracking-tighter">₹{route.totalCost}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {passengers.map((p, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <User size={20} />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 block">Full Name</label>
                          <input type="text" placeholder="John Doe" className="w-full bg-transparent outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600" value={p.name} onChange={e => handlePassengerChange(i, 'name', e.target.value)} />
                        </div>
                        <div className="sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 block">Age</label>
                          <input type="number" placeholder="e.g. 21" className="w-full bg-transparent outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600" value={p.age} onChange={e => handlePassengerChange(i, 'age', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-inner rotate-12">
                  <Ticket size={48} className="text-indigo-600 dark:text-indigo-400 -rotate-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Auto-Assigning Best Seats</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                  Lumina AI is assigning seats together for your group based on the optimum Comfort Score <span className="font-bold text-slate-700 dark:text-slate-300">({route.comfortScore}/10)</span>.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]"></div>
                  
                  <h3 className="text-xl font-black flex items-center gap-3 mb-8 text-slate-900 dark:text-white">
                    <CreditCard className="text-blue-500" /> Fare Breakdown
                  </h3>
                  
                  <div className="space-y-5 text-sm font-medium">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Base Fare ({travelers} × ₹{route.pricePerPerson})</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{Math.round(route.totalCost * 0.85)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Taxes & Platform Fees</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{Math.round(route.totalCost * 0.15)}</span>
                    </div>
                    {travelers >= 4 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50">
                        <span className="font-bold">Group Booking Discount Applied</span>
                        <span className="font-black">-₹{Math.round(route.totalCost * 0.10)}</span>
                      </div>
                    )}
                    
                    <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-2 border-dashed border-b-2 bg-transparent"></div>
                    
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Payable</span>
                      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        ₹{route.totalCost}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && bookingResult && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-8">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/30"
                >
                  <CheckCircle size={48} />
                </motion.div>
                
                <div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your seats are secured.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 dark:bg-[#0a0f1c] rounded-full"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-slate-50 dark:bg-[#0a0f1c] rounded-full"></div>
                  
                  <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">e-Ticket PNR</div>
                  <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-widest mb-8 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl">
                    {bookingResult.bookingId}
                  </div>

                  <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-sm mx-auto mb-8 border border-slate-100 dark:border-slate-700">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingResult.bookingId}`} alt="Ticket QR" className="w-full h-full opacity-90" />
                  </div>
                  
                  <button className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Download size={18} /> Download Ticket PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex justify-between items-center relative z-20">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {step === 1 ? 'Cancel Booking' : 'Go Back'}
            </button>
            
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : handleBook()}
              disabled={isProcessing || (step === 1 && passengers.some(p => !p.name || !p.age))}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 px-8 py-3.5 rounded-2xl font-extrabold transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 group"
            >
              {isProcessing ? 'Processing Secure Payment...' : step === 3 ? 'Pay Securely' : 'Continue'} 
              {!isProcessing && step < 3 && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
