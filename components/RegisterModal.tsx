
import React, { useState } from 'react';
import { UserPlus, MapPin, Phone, User, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (name: string, address: string, phone: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || address.length < 5 || phone.length !== 10) {
      alert("Please fill all fields correctly. Phone must be 10 digits.");
      return;
    }
    onRegister(name, address, phone);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 relative overflow-hidden"
      >
        {/* Decor */}
        <div className="absolute top-0 inset-x-0 h-2 bg-heritage"></div>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white text-heritage rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-heritage/10">
            <UserPlus size={40} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-ink tracking-tight">Registration</h2>
          <p className="text-heritage/40 text-sm font-medium mt-2">Join the TaiHub community today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={10} />
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={10} />
              Complete Address
            </label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Village, District, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Phone size={10} />
              Phone Number
            </label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-heritage/30 font-bold transition-colors group-focus-within:text-accent">+91</span>
              <input
                type="tel"
                required
                className="w-full pl-16 pr-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink tracking-widest"
                placeholder="0000000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button 
              type="submit"
              className="heritage-button w-full py-5 text-lg flex items-center justify-center gap-3"
            >
              Complete Registration
              <ArrowRight size={20} />
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-4 text-heritage/40 font-bold hover:text-heritage transition-colors text-sm flex items-center justify-center gap-2"
            >
              <X size={16} />
              Go Back
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterModal;
