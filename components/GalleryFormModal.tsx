
import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryFormModalProps {
  onClose: () => void;
  onSubmit: (data: { url: string; caption: string }) => void;
}

const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ onClose, onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
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
      if (!file.type.startsWith('image/')) {
        alert("Only image files are allowed.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        alert("Image size exceeds 3MB limit.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setUrl(base64);
      } catch (err) {
        alert("Failed to process image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!url || !caption) {
      alert("Please upload an image and provide a caption.");
      return;
    }
    onSubmit({ url, caption });
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
            <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Add Photo</h2>
            <p className="text-heritage/40 text-sm font-medium mt-1">Share a moment with the community.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-white rounded-full transition-colors text-heritage/40 hover:text-heritage border border-heritage/10 shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1">Photo Caption</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Traditional Bihu Celebration"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1">Select Image</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden ${url ? 'border-accent/20' : 'bg-white border-heritage/10 group-hover:border-accent/40'}`}>
                {isUploading ? (
                  <Loader2 className="animate-spin text-heritage" size={32} />
                ) : url ? (
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm text-heritage/20">
                      <ImageIcon size={32} />
                    </div>
                    <span className="text-sm font-bold text-heritage/30">Tap to Upload Image</span>
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
              Add to Gallery
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryFormModal;
