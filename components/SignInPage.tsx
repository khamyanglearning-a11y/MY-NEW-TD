
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserCircle, ArrowLeft, Eye, EyeOff, Lock, Phone, User as UserIcon } from 'lucide-react';

interface SignInPageProps {
  onClose: () => void;
  onLogin: (phoneNumber: string, password: string, intent: 'staff' | 'developer' | 'public', name?: string, isRegistering?: boolean) => void;
  intent: 'staff' | 'developer' | 'public';
  onIntentChange: (intent: 'staff' | 'developer' | 'public') => void;
  devConfig: { phone: string, password: string, name: string } | null;
}

const SignInPage: React.FC<SignInPageProps> = ({ onClose, onLogin, intent: initialIntent, onIntentChange, devConfig }) => {
  const [intent, setIntent] = useState<'staff' | 'developer' | 'public'>(initialIntent);
  const [showChoice, setShowChoice] = useState(initialIntent === 'staff');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    if (password.length < 4) return;
    if (isRegistering && !name) return;
    
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin(phoneNumber, password, intent, name, isRegistering);
      setIsAuthenticating(false);
    }, 800);
  };

  const handleChoice = (newIntent: 'staff' | 'developer' | 'public') => {
    onIntentChange(newIntent);
    if (newIntent === 'developer' && !devConfig) {
      onLogin('', '', 'developer', '', false);
      return;
    }
    setIntent(newIntent);
    setShowChoice(false);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-paper/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute top-8 left-8">
        <button 
          onClick={showChoice ? onClose : () => initialIntent === 'staff' ? setShowChoice(true) : onClose()}
          className="p-3 hover:bg-muted rounded-full transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-muted p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-ink/5">
        <AnimatePresence mode="wait">
          {showChoice ? (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter uppercase">Portal Access</h1>
                <p className="text-ink/40 font-medium">Select your entry point to continue</p>
              </div>
              <div className="grid gap-4">
                <button 
                  onClick={() => handleChoice('public')}
                  className="flex items-center gap-4 p-8 bg-muted/50 hover:bg-ink/5 rounded-[2rem] transition-all text-left group border border-ink/5"
                >
                  <div className="w-14 h-14 bg-ink text-paper rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest">Member Login</h3>
                    <p className="text-xs text-ink/40 mt-1">Access learning & profile</p>
                  </div>
                </button>
                <button 
                  onClick={() => handleChoice('staff')}
                  className="flex items-center gap-4 p-8 bg-muted/50 hover:bg-ink/5 rounded-[2rem] transition-all text-left group border border-ink/5"
                >
                  <div className="w-14 h-14 bg-ink text-paper rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest">Staff Login</h3>
                    <p className="text-xs text-ink/40 mt-1">Management tools</p>
                  </div>
                </button>
                <button 
                  onClick={() => handleChoice('developer')}
                  className="flex items-center gap-4 p-8 bg-muted/50 hover:bg-ink/5 rounded-[2rem] transition-all text-left group border border-ink/5"
                >
                  <div className="w-14 h-14 bg-ink text-paper rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest">{!devConfig ? 'Setup Developer' : 'Developer Login'}</h3>
                    <p className="text-xs text-ink/40 mt-1">{!devConfig ? 'One-time registration' : 'Root system access'}</p>
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter uppercase">
                  {intent === 'developer' ? 'Developer' : intent === 'staff' ? 'Staff' : (isRegistering ? 'Register' : 'Login')}
                </h1>
                <p className="text-ink/40 font-medium">
                  {intent === 'developer' ? 'Authorized root access' : intent === 'staff' ? 'Official portal' : 'Public member access'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {intent === 'public' && isRegistering && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-40">Name</label>
                    <div className="relative">
                      <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-5 bg-muted/50 border border-ink/5 rounded-2xl outline-none focus:border-ink/20 transition-all font-bold text-ink"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-40">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-12 pr-4 py-5 bg-muted/50 border border-ink/5 rounded-2xl outline-none focus:border-ink/20 transition-all font-bold text-ink"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-40">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-5 bg-muted/50 border border-ink/5 rounded-2xl outline-none focus:border-ink/20 transition-all font-bold text-ink"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 hover:text-ink transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-6 bg-ink text-paper rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <div className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin"></div>
                  ) : (
                    isRegistering ? 'Create Account' : 'Secure Entry'
                  )}
                </button>
              </form>

              {intent === 'public' && (
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                >
                  {isRegistering ? 'Already have an account? Login' : 'New member? Register here'}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignInPage;
