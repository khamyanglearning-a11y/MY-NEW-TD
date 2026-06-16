
import React from 'react';
import { 
  Languages, 
  GraduationCap, 
  Book, 
  Image as ImageIcon, 
  Tv, 
  Music, 
  LayoutDashboard, 
  UserCircle,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  user: User | null;
  activeTab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard' | 'learning' | 'blog' | 'profile';
  onTabChange: (tab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard' | 'learning' | 'blog' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, activeTab, onTabChange }) => {
  const allTabs: { id: typeof activeTab, label: string, icon: React.ReactNode, permissionKey?: string }[] = [
    { id: 'dictionary', label: 'Dict', icon: <Languages size={20} />, permissionKey: 'dictionary' },
    { id: 'learning', label: 'Learn', icon: <GraduationCap size={20} /> },
    { id: 'blog', label: 'Media', icon: <Newspaper size={20} /> },
    { id: 'dashboard', label: 'Portal', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> }
  ];

  const visibleTabs = allTabs.filter(t => {
    if (user?.role === 'owner') return t.id !== 'profile';
    if (!user) return t.id === 'dictionary';
    
    if (user.role === 'admin') {
      if (t.id === 'dashboard') return true;
      if (t.id === 'profile') return false;
      return true;
    }

    if (user.role === 'student') {
      if (t.id === 'dashboard') return false;
      return true;
    }

    return t.id === 'dictionary';
  });

  // Display all visible tabs (should be 5 or fewer now)
  const displayTabs = visibleTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black z-50 px-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {displayTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative",
              activeTab === tab.id 
                ? "text-heritage" 
                : "text-heritage/40"
            )}
          >
            <motion.div 
              animate={activeTab === tab.id ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
              className={cn(
                "p-1 rounded-xl transition-all",
                activeTab === tab.id && "bg-white border border-black shadow-sm"
              )}
            >
              {tab.icon}
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="bottom-nav-indicator"
                className="w-1 h-1 bg-heritage rounded-full absolute bottom-1" 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
