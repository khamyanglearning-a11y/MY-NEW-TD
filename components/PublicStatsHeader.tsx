import React from 'react';
import { BookOpen, Image as ImageIcon, Music, Video, Languages } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicStatsHeaderProps {
  stats: {
    words: number;
    books: number;
    photos: number;
    songs: number;
    videos: number;
  };
}

const PublicStatsHeader: React.FC<PublicStatsHeaderProps> = ({ stats }) => {
  const statItems = [
    { label: "Words", value: stats.words, icon: Languages, color: "text-heritage", bg: "!bg-white border-2 border-black" },
    { label: "Books", value: stats.books, icon: BookOpen, color: "text-accent", bg: "!bg-white border-2 border-black" },
    { label: "Photos", value: stats.photos, icon: ImageIcon, color: "text-accent", bg: "!bg-white border-2 border-black" },
    { label: "Songs", value: stats.songs, icon: Music, color: "text-heritage", bg: "!bg-white border-2 border-black" },
    { label: "Videos", value: stats.videos, icon: Video, color: "text-accent", bg: "!bg-white border-2 border-black" }
  ];

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-6 mb-12 sm:mb-16">
      {statItems.map((item, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-2 sm:gap-5 px-3 sm:px-8 py-2.5 sm:py-4 !bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-md sm:shadow-lg transition-all hover:shadow-2xl hover:shadow-heritage/10 group"
        >
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${item.bg} ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
            <item.icon size={14} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-serif font-bold text-ink leading-none">{item.value}</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-ink/40 uppercase tracking-widest">{item.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PublicStatsHeader;
