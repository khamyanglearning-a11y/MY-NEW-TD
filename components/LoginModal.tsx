
import React, { useState } from 'react';
import { MessageSquare, Lock, Phone, Key, X, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (phoneNumber: string, otp: string) => void;
  expectedOtp: string | null;
  onOtpGenerated: (otp: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, expectedOtp, onOtpGenerated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpEntry, setOtpEntry] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSending, setIsSending] = useState(false);
  const [smsNotification, setSmsNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    
    setIsSending(true);
    
    // 1. Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    onOtpGenerated(newOtp);

    // 2. Use a standard SMS message
    const message = `Your TaiHub verification code is ${newOtp}. Please do not share this with anyone.`;

    // 3. Simulate network delay
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      
      // 4. Show the "Realistic" SMS Notification
      setSmsNotification({ show: true, message });
      
      // Auto-hide notification after 8 seconds
      setTimeout(() => {
        setSmsNotification(prev => ({ ...prev, show: false }));
      }, 8000);
    }, 1500);
  };

  const handleVerify = () => {
    if (otpEntry.length !== 6) {
      alert('Please enter a 6-digit OTP.');
      return;
    }
    onLogin(phoneNumber, otpEntry);
  };

  return (
    <>
      {/* REALISTIC SMS NOTIFICATION BUBBLE */}
      <AnimatePresence>
        {smsNotification.show && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-4 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-ink/95 backdrop-blur-md text-white p-5 rounded-3xl shadow-2xl border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 bg-heritage rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Messages • Now</span>
                  <button onClick={() => setSmsNotification({ ...smsNotification, show: false })} className="text-white/40 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm font-medium leading-relaxed">{smsNotification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl p-10 relative overflow-hidden"
        >
          {/* Decor */}
          <div className="absolute top-0 inset-x-0 h-2 bg-heritage"></div>
          
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-white border border-heritage/10 text-heritage rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
              <Lock size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-ink tracking-tight">Access Panel</h2>
            <p className="text-sm text-heritage/40 mt-3 font-medium">
              {step === 'phone' ? 'Enter your phone to receive a code' : 'Code sent to your device'}
            </p>
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div 
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Phone size={10} />
                    Phone Number
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-heritage/30 font-bold transition-colors group-focus-within:text-accent">+91</span>
                    <input
                      type="tel"
                      className="w-full pl-16 pr-6 py-5 bg-white border border-heritage/10 rounded-[24px] outline-none focus:border-accent focus:bg-white transition-all text-2xl font-bold text-ink tracking-widest"
                      placeholder="0000000000"
                      value={phoneNumber}
                      autoFocus
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Key size={10} />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-5 bg-white border border-heritage/10 rounded-[24px] outline-none focus:border-accent focus:bg-white transition-all text-center text-4xl font-serif font-bold text-ink tracking-[0.4em]"
                    placeholder="------"
                    value={otpEntry}
                    autoFocus
                    onChange={(e) => setOtpEntry(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="pt-4 flex flex-col gap-4">
              <button 
                onClick={step === 'phone' ? handleSendOtp : handleVerify}
                disabled={isSending}
                className="heritage-button w-full py-6 text-lg flex items-center justify-center gap-3"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    {step === 'phone' ? <MessageSquare size={20} /> : <ShieldCheck size={20} />}
                    {step === 'phone' ? 'Send OTP' : 'Login Securely'}
                  </>
                )}
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-4 text-heritage/40 rounded-2xl font-bold hover:text-heritage transition-colors text-sm"
              >
                Cancel Access
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 justify-center opacity-20">
              <div className="h-px bg-heritage flex-1"></div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-heritage">Secure Protocol v2.0</span>
              <div className="h-px bg-heritage flex-1"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginModal;
