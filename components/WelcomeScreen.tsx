import React from 'react';
import { 
  BookOpen, 
  Image as ImageIcon, 
  Music, 
  Languages, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onJoinClick: () => void;
  onStudentJoinClick: () => void;
  onDevLoginClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onJoinClick, onStudentJoinClick, onDevLoginClick }) => {
  const features = [
    {
      title: "Digital Dictionary",
      desc: "Comprehensive 4-language support: Assamese, English, Tai Khamyang, and more.",
      icon: Languages,
      color: "text-heritage",
      bg: "bg-heritage/10"
    },
    {
      title: "Cultural Library",
      desc: "Access PDF books, research papers, and ancient cultural documents.",
      icon: BookOpen,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Traditional Gallery",
      desc: "Explore a curated collection of photos showcasing our heritage and festivals.",
      icon: ImageIcon,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Community Music",
      desc: "Listen to traditional Tai Khamyang folk songs and community recordings.",
      icon: Music,
      color: "text-heritage",
      bg: "bg-heritage/10"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 pb-20 overflow-y-auto">
      {/* Animated Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-heritage/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-xl w-full text-center space-y-8 py-12"
      >
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 6 }}
            className="w-20 h-20 bg-heritage rounded-[2rem] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-2xl shadow-heritage/20 mb-8"
          >
            T
          </motion.div>
          <h1 className="text-5xl font-serif font-bold text-ink tracking-tight mb-2">TaiHub</h1>
          <div className="h-1.5 w-12 bg-accent rounded-full mb-6"></div>
          <p className="text-ink/80 font-medium text-lg px-4 leading-relaxed">
            The Digital Gateway to <span className="text-heritage font-bold">Tai Khamyang</span> Culture, Heritage & Language.
          </p>
        </div>

        {/* Unified Call to Action */}
        <div className="px-4 grid grid-cols-1 gap-4">
          <button 
            onClick={onJoinClick}
            className="w-full py-6 bg-heritage hover:bg-heritage/90 text-white rounded-[2.5rem] font-bold text-xl transition-all shadow-2xl shadow-heritage/20 active:scale-95 flex items-center justify-center gap-4 group"
          >
            Community Hub
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} />
            </div>
          </button>

          <button 
            onClick={onStudentJoinClick}
            className="w-full py-5 bg-accent hover:bg-accent/90 text-white rounded-[2.5rem] font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-4 group"
          >
            Student Login
            <div className="w-8 h-8 bg-heritage text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
              <GraduationCap size={18} />
            </div>
          </button>
          <p className="text-xs font-bold text-ink/50 mt-2 uppercase tracking-widest">Login or Register to Access</p>
        </div>

        {/* Features Preview Section */}
        <div className="space-y-6 pt-8 text-left">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-xs font-bold text-ink/40 uppercase tracking-[0.3em] whitespace-nowrap">What's Inside TaiHub?</h2>
            <div className="h-[1px] bg-ink/5 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((f, idx) => (
              <button
                key={idx}
                onClick={onJoinClick}
                className="group flex items-start gap-4 p-5 bg-white hover:bg-white border border-heritage/10 rounded-3xl transition-all text-left active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-heritage/5"
              >
                <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                  <f.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-serif font-bold text-ink text-lg">{f.title}</h3>
                    <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-lg">
                      <Lock size={10} className="text-accent" />
                      <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Enter to Open</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink/80 font-medium leading-snug">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Staff Portal Link */}
        <div className="pt-8">
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-ink/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-ink/40 uppercase tracking-widest">Administrative Access</span>
            <div className="flex-grow border-t border-ink/5"></div>
          </div>

          <button 
            onClick={onDevLoginClick}
            className="w-full py-4 bg-accent/10 text-accent hover:bg-accent/20 rounded-2xl font-bold text-sm transition-all border border-accent/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} />
            Developer / Staff Login Portal
          </button>
        </div>

        <div className="pt-12 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/80">Secure Community Platform</span>
          <p className="text-[9px] font-medium text-ink/80 max-w-[250px]">Preserving the digital cultural heritage of the Tai Khamyang community for future generations.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
