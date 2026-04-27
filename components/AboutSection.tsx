import React from 'react';
import { BookOpen, MapPin, History, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface TaiGroup {
  name: string;
  description: string;
  image: string;
}

const TAI_GROUPS: TaiGroup[] = [
  {
    name: "Tai Khamyang",
    description: "The Tai Khamyang (also known as Shyam) are a distinct community living mostly in the Tinsukia, Dibrugarh, and Jorhat districts. They are one of the smaller Tai groups but hold immensely deep knowledge of ancient Tai Buddhism and traditional agriculture. They speak the Khamyang language and follow the Theravada Buddhist faith.",
    image: "https://images.unsplash.com/photo-1543734057-7977a45b98a5?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Khamti",
    description: "The Tai Khamti are known as 'Great Tai' and were once powerful rulers in the Upper Chindwin region. Today, they primarily inhabit the Namsai and Lohit districts of Arunachal Pradesh. They are renowned for their intricate wood carvings, Buddhist literature, and vibrant festivals like Poi Pee Mau.",
    image: "https://images.unsplash.com/photo-1588065053424-df3531b7829a?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Phake",
    description: "Inhabiting mostly the bank of the river Buridihing, the Tai Phake community (Phakial) is famous for preserving their traditional lifestyle. Their villages like Nam Phake are living museums of Tai culture, featuring Chang-ghars (stilt houses) and beautiful hand-woven textiles made by the village women.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Turung",
    description: "The Tai Turung are the largest group among the Tai people of Assam. They migrated from the Mung-Ma-Lung region and have assimilated deeply with the local culture while maintaining their identity through language and religious practices. They are primarily found in the Golaghat and Karbi Anglong districts.",
    image: "https://images.unsplash.com/photo-1621359670612-4c69837a5f36?q=80&w=1200&auto=format&fit=crop" 
  }
];

const AboutSection: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  return (
    <div className="space-y-12">
      {/* Introduction Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-heritage/5 border border-heritage/5 text-center"
      >
        <div className="w-20 h-20 bg-white text-heritage rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-heritage/10">
           <BookOpen size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-ink tracking-tight mb-4">Tai Heritage Archive</h2>
        <p className="text-heritage/60 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          The Tai community of Northeast India represents a unique cultural thread connecting the Brahmaputra valley to South East Asia. Discover the various Tai groups preserving their ancient traditions today.
        </p>
      </motion.div>

      {/* Tai Groups Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TAI_GROUPS.map((group, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-heritage/5 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={group.image} 
                alt={group.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="w-12 h-1 bg-accent rounded-full mb-3"></div>
                <h3 className="text-4xl font-serif font-bold text-white tracking-tighter">{group.name}</h3>
              </div>
            </div>
            <div className="p-8 flex-1">
              <p className="text-heritage/60 leading-relaxed font-medium text-lg mb-6">{group.description}</p>
              <div className="pt-6 border-t border-heritage/10 flex items-center justify-between">
                <span className="text-[10px] font-bold text-heritage/20 uppercase tracking-[0.2em]">Heritage Profile</span>
                <div className="flex items-center gap-2 text-accent">
                  <History size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">Historical Entry</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Village Deep Dive Feature - Simplified */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ink rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-heritage/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <MapPin className="text-accent" size={32} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight mb-4">Historical Settlements</h2>
          <p className="text-white/40 max-w-2xl mx-auto mb-10 font-medium text-lg leading-relaxed">
            Major villages that serve as cultural hubs for the Tai people of Assam and Arunachal Pradesh.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Pather Gaon", 
              "Chalapathar", 
              "Nam Phake Village", 
              "Borkhamti", 
              "Ningroo", 
              "Tipam Phake", 
              "Borpather", 
              "Faneng Village"
            ].map((v, i) => (
              <div 
                key={i} 
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/60"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSection;
