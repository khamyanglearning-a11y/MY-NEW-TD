
import React, { useState } from 'react';
import { X, Youtube, Save, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoFormModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; youtubeUrl: string }) => void;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSave = () => {
    if (!title.trim() || !url.trim()) {
      alert("Please enter both a title and a YouTube URL.");
      return;
    }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert("Please provide a valid YouTube link.");
      return;
    }
    onSubmit({ title: title.trim(), youtubeUrl: url.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 relative overflow-hidden"
      >
        {/* Decor */}
        <div className="absolute top-0 inset-x-0 h-2 bg-heritage"></div>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Feature Video</h2>
            <p className="text-heritage/40 text-sm font-medium mt-1">Add a YouTube link to the gallery.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-heritage/5 rounded-full transition-colors text-heritage/40 hover:text-heritage">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Video size={10} />
              Video Title
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-heritage/5 border-2 border-transparent rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Tai Khamyang New Year Celebration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Youtube size={10} />
              YouTube URL
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-heritage/5 border-2 border-transparent rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-heritage/5 hover:bg-heritage/10 text-heritage/40 rounded-2xl font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="heritage-button flex-2 py-4 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Add Video
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoFormModal;
