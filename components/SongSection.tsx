import React, { useState, useRef } from 'react';
import { Song, User } from '../types';
import { Music, Play, Pause, Plus, Trash2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SongSectionProps {
  songs: Song[];
  user: User | null;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

const SongSection: React.FC<SongSectionProps> = ({ songs, user, onAddClick, onDeleteClick }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canManage = user?.role === 'owner' || user?.permissions?.songs;

  const handlePlayPause = (song: Song) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.play();
        setPlayingId(song.id);
      }
    }
  };

  return (
    <div className="space-y-8">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Cultural Music</h2>
          <p className="text-heritage/60 font-medium">Listen to traditional songs and community voices.</p>
        </div>
        {canManage && (
          <button 
            onClick={onAddClick}
            className="heritage-button flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto"
          >
            <Plus size={20} />
            Add New Song
          </button>
        )}
      </div>

      {songs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-heritage/10 shadow-inner"
        >
          <div className="w-24 h-24 bg-white border border-heritage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <VolumeX className="text-heritage/20" size={40} />
          </div>
          <p className="text-heritage/40 text-xl font-serif font-bold">No music yet.</p>
          <p className="text-heritage/30 text-sm mt-1">Staff can start adding songs to this collection.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {songs.map((song, idx) => (
              <motion.div 
                key={song.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group bg-white rounded-[24px] p-5 border-2 transition-all duration-300 flex items-center gap-4 ${playingId === song.id ? 'border-heritage/20 shadow-lg shadow-heritage/5' : 'border-transparent hover:border-heritage/5 shadow-sm'}`}
              >
                <button 
                  onClick={() => handlePlayPause(song)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 ${playingId === song.id ? 'bg-heritage text-white animate-pulse' : 'bg-ink text-white hover:bg-heritage'}`}
                >
                  {playingId === song.id ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif font-bold text-ink truncate">{song.title}</h3>
                  <p className="text-sm font-bold text-heritage/30 uppercase tracking-widest">{song.artist}</p>
                </div>

                {canManage && (
                  <button 
                    onClick={() => onDeleteClick(song.id)}
                    className="p-3 text-heritage/20 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SongSection;
