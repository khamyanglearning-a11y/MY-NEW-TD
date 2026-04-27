
import React, { useState } from 'react';
import { X, Music, User, Upload, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SongFormModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; artist: string; audioUrl: string }) => void;
}

const SongFormModal: React.FC<SongFormModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert("Only audio files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit. Please upload a smaller MP3.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setAudioUrl(base64);
      } catch (err) {
        alert("Failed to process audio file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!title || !artist || !audioUrl) {
      alert("Please provide Title, Artist, and Upload the Song.");
      return;
    }
    onSubmit({ title, artist, audioUrl });
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
            <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Add Music</h2>
            <p className="text-heritage/40 text-sm font-medium mt-1">Add a traditional song to the hub.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-white rounded-full transition-colors text-heritage/40 hover:text-heritage border border-heritage/10 shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Music size={10} />
              Song Title
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Traditional Folk Song"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={10} />
              Artist / Singer
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Community Voices"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Upload size={10} />
              Audio File (MP3 Max 5MB)
            </label>
            <div className="relative group">
              <input 
                type="file" 
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center py-10 rounded-3xl border-2 border-dashed transition-all overflow-hidden ${audioUrl ? 'bg-white border-accent/20' : 'bg-white border-heritage/10 group-hover:border-accent/40'}`}>
                {isUploading ? (
                  <Loader2 className="animate-spin text-heritage" size={32} />
                ) : audioUrl ? (
                  <div className="flex flex-col items-center text-heritage">
                    <CheckCircle2 size={40} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Ready to Upload</span>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm text-heritage/20">
                      <Upload size={32} />
                    </div>
                    <span className="text-sm font-bold text-heritage/30">Select MP3 File</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-heritage/10 hover:bg-white text-heritage/40 rounded-2xl font-bold transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="heritage-button flex-2 py-4 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Upload Song
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SongFormModal;
