import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Type, AlignLeft, Video, Layout } from 'lucide-react';
import { Lesson } from '../types';

interface LessonFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Lesson>) => void;
  initialData?: Lesson;
  moduleId: string;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ onClose, onSubmit, initialData, moduleId }) => {
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    content: '',
    videoUrl: '',
    order: 0,
    moduleId,
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
              {initialData ? 'Edit Lesson' : 'Add New Lesson'}
            </h2>
            <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest mt-1">
              Lesson Management
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Lesson Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="YouTube Embed URL (Optional)"
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="number"
                placeholder="Lesson Order (0, 1, 2...)"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <textarea
                placeholder="Lesson Content (Markdown supported)"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-medium text-ink placeholder:text-heritage/20"
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
            className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {initialData ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LessonFormModal;
