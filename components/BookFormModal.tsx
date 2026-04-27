
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { X, BookOpen, User, FileText, Upload, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Book>) => void;
  initialData?: Book;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    description: '',
    pdfUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description,
        pdfUrl: initialData.pdfUrl
      });
    }
  }, [initialData]);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit. Please compress your PDF.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setFormData(prev => ({ ...prev, pdfUrl: base64 }));
      } catch (err) {
        alert("Failed to process file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.pdfUrl) {
      alert("Title, Author, and PDF file are all required.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl p-10 relative overflow-hidden overflow-y-auto max-h-[90vh]"
      >
        {/* Decor */}
        <div className="absolute top-0 inset-x-0 h-2 bg-heritage"></div>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">
              {initialData ? 'Edit Book' : 'Add to Library'}
            </h2>
            <p className="text-heritage/40 text-sm font-medium mt-1">Publish a new PDF book for everyone.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-white rounded-full transition-colors text-heritage/40 hover:text-heritage border border-heritage/10 shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <BookOpen size={10} />
              Book Title
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. History of Tai Peoples"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={10} />
              Author Name
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-2xl outline-none focus:border-accent focus:bg-white transition-all font-bold text-ink"
              placeholder="e.g. Dr. K. Borah"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText size={10} />
              Description (Optional)
            </label>
            <textarea
              className="w-full px-6 py-4 bg-white border-2 border-heritage/10 rounded-3xl outline-none focus:border-accent focus:bg-white transition-all font-medium text-ink h-32 resize-none"
              placeholder="Brief summary of the book content..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Upload size={10} />
              PDF Document (Max 5MB)
            </label>
            <div className="relative group">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed transition-all ${formData.pdfUrl ? 'bg-white border-accent/20' : 'bg-white border-heritage/10 group-hover:border-accent/40'}`}>
                {isUploading ? (
                  <Loader2 className="animate-spin text-heritage" size={32} />
                ) : formData.pdfUrl ? (
                  <div className="flex flex-col items-center text-heritage">
                    <CheckCircle2 size={40} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">PDF Attached Successfully</span>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm text-heritage/20">
                      <Upload size={32} />
                    </div>
                    <span className="text-sm font-bold text-heritage/30">Select PDF File</span>
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
              {initialData ? 'Update Book' : 'Confirm Upload'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookFormModal;
