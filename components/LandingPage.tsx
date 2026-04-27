
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Book, Languages, Image, Music, Video, ArrowRight, Sparkles, Newspaper, Settings } from 'lucide-react';
import { db } from '../services/database';
import { AboutContent } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LandingPageProps {
  onExplore: () => void;
  onDictionary: () => void;
  onLearning: () => void;
  onBlog: () => void;
  onEditAbout: () => void;
  staffRole?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onExplore, onDictionary, onLearning, onBlog, onEditAbout, staffRole }) => {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const isStaff = staffRole === 'owner' || staffRole === 'admin';

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await db.about.get();
        if (data) setAbout(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="min-h-screen bg-paper overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-p-blue/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-p-pink/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-p-purple/15 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-paper/50 backdrop-blur-md text-heritage font-bold text-[10px] uppercase tracking-[0.3em] border border-ink/5 shadow-soft">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Digital Heritage Archive
            </div>
            
            <h1 className="text-7xl md:text-[11rem] font-bold text-ink tracking-[-0.04em] leading-[0.8] uppercase">
              Tai <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-heritage via-accent to-heritage bg-[length:200%_auto] animate-gradient">Hub</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-ink/80 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
              A vibrant digital sanctuary dedicated to the preservation of Tai Khamyang language, culture, and history.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
              <button 
                onClick={onDictionary}
                className="heritage-button w-full sm:w-auto px-14 py-6 text-[12px] tracking-[0.2em] uppercase shadow-2xl shadow-heritage/20"
              >
                Open Dictionary
              </button>
              <button 
                onClick={onLearning}
                className="w-full sm:w-auto px-14 py-6 bg-paper/50 backdrop-blur-md text-ink rounded-full font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-paper transition-all active:scale-95 border border-ink/5 shadow-soft"
              >
                Start Learning
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-ink/40">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-heritage/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-p-green/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-heritage/40">The Mission</span>
                <h2 className="text-6xl md:text-8xl font-bold text-ink tracking-tighter uppercase leading-none">
                  {about?.title || "Preserving Heritage"}
                </h2>
                <div className="w-24 h-2 bg-gradient-to-r from-heritage to-accent rounded-full"></div>
              </div>
              
              <div className="space-y-8 text-xl text-ink/80 font-medium leading-relaxed tracking-tight">
                {about?.description ? (
                  about.description.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Tai Hub is a dedicated platform designed to bridge the gap between ancient traditions and modern digital accessibility.
                    </p>
                    <p>
                      We provide tools to explore and master the Tai heritage, from a comprehensive dictionary to historical archives.
                    </p>
                  </>
                )}
              </div>
              
              {isStaff && (
                <button 
                  onClick={onEditAbout}
                  className="accent-button px-10 py-5 flex items-center gap-3 shadow-xl shadow-accent/20"
                >
                  <Settings className="w-5 h-5" />
                  Edit Content
                </button>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-ink/5 border border-white/20 group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-heritage/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img 
                src={about?.imageUrl || "https://images.unsplash.com/photo-1543734057-7977a45b98a5?q=80&w=2070&auto=format&fit=crop"} 
                alt="Tai Culture" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-muted/50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-p-yellow/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
          <div className="text-center space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-heritage/40">Ecosystem</span>
            <h2 className="text-6xl font-bold text-ink tracking-tighter uppercase">Digital <span className="text-accent">Tools</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Languages className="w-6 h-6 text-heritage" />, title: "Dictionary", desc: "Multi-language search.", color: "bg-p-blue" },
              { icon: <Book className="w-6 h-6 text-accent" />, title: "Library", desc: "Digital manuscripts.", color: "bg-p-pink" },
              { icon: <Image className="w-6 h-6 text-heritage" />, title: "Gallery", desc: "Visual archives.", color: "bg-p-purple" },
              { icon: <Music className="w-6 h-6 text-accent" />, title: "Audio", desc: "Native pronunciations.", color: "bg-p-green" },
              { icon: <Video className="w-6 h-6 text-heritage" />, title: "Video", desc: "Cultural documentaries.", color: "bg-p-yellow" },
              { icon: <Sparkles className="w-6 h-6 text-accent" />, title: "Learning", desc: "Interactive modules.", color: "bg-p-blue" },
              { icon: <Newspaper className="w-6 h-6 text-heritage" />, title: "Blog", desc: "Community news.", color: "bg-p-pink" },
              { icon: <ArrowRight className="w-6 h-6 text-accent" />, title: "More", desc: "Constant updates.", color: "bg-p-purple" },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="p-12 bg-paper rounded-[3rem] border border-ink/5 hover:border-heritage/20 transition-all duration-500 group cursor-pointer shadow-soft hover:shadow-2xl"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-soft", feature.color)}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-lg text-ink/60 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 grayscale opacity-20 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-ink rounded-2xl flex items-center justify-center text-paper font-bold text-sm">T</div>
            <span className="text-2xl font-bold tracking-tighter text-ink uppercase">Tai Hub</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8">
              <button onClick={onDictionary} className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors">Dictionary</button>
              <button onClick={onLearning} className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors">Academy</button>
              <button onClick={onBlog} className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors">Media</button>
            </div>
            <div className="h-px w-full md:w-40 bg-ink/5"></div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-ink/40 text-[9px] font-bold uppercase tracking-[0.3em]">
                © 2026 Tai Hub Heritage Project.
              </p>
              <button 
                onClick={onExplore}
                className="text-[9px] font-bold text-ink/10 uppercase tracking-[0.5em] hover:text-ink/30 transition-all"
              >
                System Access
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
