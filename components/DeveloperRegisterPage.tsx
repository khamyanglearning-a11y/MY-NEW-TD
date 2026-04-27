
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Phone, Lock, User, ArrowRight } from 'lucide-react';

interface DeveloperRegisterPageProps {
  onSetup: (phone: string, pass: string, name: string) => void;
}

const DeveloperRegisterPage: React.FC<DeveloperRegisterPageProps> = ({ onSetup }) => {
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || pass.length < 4 || !name) {
      alert("Complete all fields. Phone must be 10 digits.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSetup(phone, pass, name);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-p-blue/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-p-pink/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-paper rounded-[3rem] p-10 md:p-12 shadow-2xl border border-ink/5 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-heritage text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-heritage/20">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-ink tracking-tight">System Initiation</h1>
          <p className="text-ink/40 font-medium mt-3">One-time setup for root developer credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full pl-12 pr-6 py-5 bg-muted/50 border border-ink/5 focus:border-heritage/20 focus:bg-paper rounded-2xl outline-none font-bold transition-all text-ink" 
                placeholder="Root Administrator" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                className="w-full pl-12 pr-6 py-5 bg-muted/50 border border-ink/5 focus:border-heritage/20 focus:bg-paper rounded-2xl outline-none font-bold tracking-widest transition-all text-ink" 
                placeholder="10-digit number" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest ml-1">Root Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
              <input 
                type="password" 
                required 
                value={pass} 
                onChange={e => setPass(e.target.value)} 
                className="w-full pl-12 pr-6 py-5 bg-muted/50 border border-ink/5 focus:border-heritage/20 focus:bg-paper rounded-2xl outline-none font-bold transition-all text-ink" 
                placeholder="Minimum 4 characters" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 bg-ink text-paper rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin"></div>
            ) : (
              <>
                Initialize System
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-ink/5 text-center">
          <p className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.4em]">TaiHub Core v3.0 • Secure Infrastructure</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperRegisterPage;
