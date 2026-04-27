import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Type, AlignLeft, Layout, Languages, BookOpen, MessageCircle, GraduationCap, PlayCircle } from 'lucide-react';
import { CourseModule } from '../types';

interface ModuleFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<CourseModule>) => void;
  initialData?: CourseModule;
}

const ModuleFormModal: React.FC<ModuleFormModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<CourseModule>>({
    title: '',
    description: '',
    icon: 'BookOpen',
    order: 0,
    ...initialData
  });

  const icons = [
    { name: 'Languages', label: 'Language' },
    { name: 'BookOpen', label: 'Book' },
    { name: 'MessageCircle', label: 'Chat' },
    { name: 'GraduationCap', label: 'Graduation' },
    { name: 'PlayCircle', label: 'Video' }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-heritage/5 flex justify-between items-center bg-heritage/5">
          <div>
            <h2 className="text-2xl font-black text-ink tracking-tight">
              {initialData ? 'Edit Module' : 'Add New Module'}
            </h2>
            <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest mt-1">
              Course Management
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black text-heritage/40 uppercase tracking-widest ml-4 mb-2 block">Module Icon</span>
              <div className="grid grid-cols-5 gap-2 p-1 bg-heritage/5 rounded-2xl">
                {icons.map(icon => (
                  <button
                    key={icon.name}
                    onClick={() => setFormData({ ...formData, icon: icon.name })}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                      formData.icon === icon.name 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-heritage/40 hover:text-heritage/60'
                    }`}
                  >
                    {icon.name === 'Languages' && <Languages size={18} />}
                    {icon.name === 'BookOpen' && <BookOpen size={18} />}
                    {icon.name === 'MessageCircle' && <MessageCircle size={18} />}
                    {icon.name === 'GraduationCap' && <GraduationCap size={18} />}
                    {icon.name === 'PlayCircle' && <PlayCircle size={18} />}
                    {icon.label}
                  </button>
                ))}
              </div>
            </label>

            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Module Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-heritage/20" size={18} />
              <textarea
                placeholder="Module Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20 resize-none"
              />
            </div>

            <div className="relative">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="number"
                placeholder="Display Order (0, 1, 2...)"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
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
            {initialData ? 'Update Module' : 'Create Module'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModuleFormModal;
