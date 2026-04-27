
import React, { useState } from 'react';
import { User } from '../types';
import { 
  Home,
  Book, 
  Image as ImageIcon, 
  Music, 
  Tv, 
  LayoutDashboard, 
  Languages, 
  GraduationCap,
  Newspaper,
  Menu, 
  X, 
  LogOut, 
  UserCircle,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  user: User | null;
  activeTab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard' | 'learning' | 'blog' | 'profile';
  onTabChange: (tab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard' | 'learning' | 'blog' | 'profile') => void;
  onLoginClick: (type: 'staff' | 'developer' | 'public') => void;
  onLogout: () => void;
  onSyncClick: () => void;
  onMessagesClick: () => void;
  isSyncing: boolean;
  isOnline: boolean;
  unreadCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  activeTab, 
  onTabChange, 
  onLogout, 
  onLoginClick,
  isDarkMode,
  onToggleDarkMode,
  onHomeClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allTabs: { id: typeof activeTab, label: string, icon: React.ReactNode, permissionKey?: string }[] = [
    { id: 'dictionary', label: 'Dictionary', icon: <Languages size={18} />, permissionKey: 'dictionary' },
    { id: 'learning', label: 'Learning', icon: <GraduationCap size={18} /> },
    { id: 'blog', label: 'Media Hub', icon: <Newspaper size={18} /> },
    { id: 'dashboard', label: 'Portal', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={18} /> }
  ];

  const visibleTabs = allTabs.filter(t => {
    if (user?.role === 'owner') return t.id !== 'profile';
    if (!user) return t.id !== 'dashboard' && t.id !== 'profile';
    
    if (user.role === 'admin') {
      if (t.id === 'dashboard') return true;
      if (t.id === 'profile') return false;
      return ['dictionary', 'learning', 'blog'].includes(t.id);
    }

    if (user.role === 'student') {
      if (t.id === 'dashboard') return false;
      return true;
    }

    return t.id !== 'dashboard' && t.id !== 'profile';
  });

  return (
    <nav className="bg-paper/80 backdrop-blur-xl border-b border-ink/5 sticky top-0 z-50 transition-all px-4 sm:px-6 shadow-soft">
      <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onHomeClick}>
            <div className="w-12 h-12 bg-gradient-to-br from-heritage to-accent rounded-2xl flex items-center justify-center text-white font-bold text-2xl transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-heritage/20">T</div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-ink tracking-tighter leading-none">Tai<span className="text-heritage">Hub</span></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-ink/50 font-bold">Digital Sanctuary</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-muted/50 p-1.5 rounded-3xl border border-ink/5 shadow-inner">
            <button 
              onClick={onHomeClick}
              className="px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-ink/60 hover:text-heritage hover:bg-paper transition-all"
            >
              <Home size={14} />
              <span>Home</span>
            </button>
            {visibleTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all",
                  activeTab === tab.id 
                    ? "bg-paper text-heritage shadow-soft border border-heritage/10" 
                    : "text-ink/60 hover:text-heritage hover:bg-paper/50"
                )}
              >
                {tab.icon}
                <span>
                  {tab.id === 'dashboard' ? (user?.role === 'owner' ? 'Developer' : 'Staff') : tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={onToggleDarkMode}
            className="p-3 text-ink/60 hover:text-heritage hover:bg-paper rounded-2xl transition-all shadow-soft border border-transparent hover:border-heritage/10"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 sm:gap-6 pl-3 sm:pl-6 border-l border-ink/5">
              <div 
                className="hidden sm:flex flex-col items-end cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => user.role === 'student' && onTabChange('profile')}
              >
                <span className="text-[9px] font-bold text-heritage/40 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={10} />
                  {user.role === 'owner' ? 'Root' : user.role === 'student' ? 'Member' : 'Staff'}
                </span>
                <span className="text-base font-bold text-ink leading-none">{user.name}</span>
              </div>
              <button 
                onClick={onLogout} 
                className="p-3 text-ink/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all shadow-soft border border-transparent hover:border-red-500/20"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => onLoginClick('staff')} 
                className="heritage-button px-10 py-4 text-[11px] tracking-[0.2em] uppercase shadow-xl shadow-heritage/20"
              >
                Login
              </button>
            </div>
          )}

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-ink/40 hover:text-heritage hover:bg-paper rounded-2xl transition-all shadow-soft"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-t border-ink/5 bg-paper/95 backdrop-blur-xl overflow-hidden rounded-b-[2rem] shadow-2xl"
          >
            <div className="p-6 space-y-3">
              <button 
                onClick={() => { onHomeClick(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-ink/40 hover:bg-muted hover:text-heritage transition-all"
              >
                <Home size={20} />
                <span className="font-bold text-[11px] uppercase tracking-widest">Home</span>
              </button>
              {visibleTabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all",
                    activeTab === tab.id 
                      ? "bg-heritage text-white shadow-lg shadow-heritage/20" 
                      : "text-ink/40 hover:bg-muted hover:text-heritage"
                  )}
                >
                  {tab.icon}
                  <span className="font-bold text-[11px] uppercase tracking-widest">
                    {tab.id === 'dashboard' ? (user?.role === 'owner' ? 'Developer' : 'Staff') : tab.label}
                  </span>
                </button>
              ))}
              {!user && (
                <button 
                  onClick={() => { onLoginClick('staff'); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-4 px-8 py-5 rounded-3xl bg-heritage text-white transition-all shadow-xl shadow-heritage/20"
                >
                  <UserCircle size={20} />
                  <span className="font-bold text-[11px] uppercase tracking-widest">Login Portal</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;