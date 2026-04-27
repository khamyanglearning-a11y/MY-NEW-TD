import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Type, AlignLeft, Image as ImageIcon, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface ArticleFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<BlogPost>) => void;
  initialData?: BlogPost;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'Culture',
    ...initialData
  });

  const categories = ['Culture', 'History', 'News'];

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
              {initialData ? 'Edit Article' : 'Add New Article'}
            </h2>
            <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest mt-1">
              Article Management
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black text-heritage/40 uppercase tracking-widest ml-4 mb-2 block">Category</span>
              <div className="flex gap-2 p-1 bg-heritage/5 rounded-2xl">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat as any })}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                      formData.category === cat 
                        ? 'bg-white text-heritage shadow-sm' 
                        : 'text-heritage/40 hover:text-heritage/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </label>

            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Article Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Image URL (Unsplash or similar)"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-heritage/20" size={18} />
              <textarea
                placeholder="Short Excerpt"
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20 resize-none"
              />
            </div>

            <div className="relative">
              <textarea
                placeholder="Full Article Content (Markdown supported)"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                rows={8}
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
            className="flex-1 py-4 bg-heritage text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-heritage/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {initialData ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleFormModal;
