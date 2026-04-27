import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Type, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { AboutContent } from '../types';

interface AboutFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<AboutContent>) => void;
  initialData?: AboutContent;
}

const AboutFormModal: React.FC<AboutFormModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<AboutContent>>({
    title: '',
    description: '',
    imageUrl: '',
    ...initialData
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-heritage/5 flex justify-between items-center bg-heritage/5">
          <div>
            <h2 className="text-2xl font-black text-ink tracking-tight">
              Edit About Section
            </h2>
            <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest mt-1">
              Homepage Management
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="About Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-heritage/20" size={18} />
              <textarea
                placeholder="About Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={10}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-heritage/5 border-t border-heritage/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-heritage font-black text-xs uppercase tracking-widest rounded-2xl border border-heritage/10 hover:bg-heritage/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="flex-1 py-4 bg-heritage text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-heritage/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutFormModal;
