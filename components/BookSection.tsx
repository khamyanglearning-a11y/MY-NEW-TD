import React, { useState } from 'react';
import { Book, User } from '../types';
import { BookOpen, Plus, Trash2, Edit3, FileText, BookX, X, Maximize2, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookSectionProps {
  books: Book[];
  user: User | null;
  onAddClick: () => void;
  onEditClick: (book: Book) => void;
  onDeleteClick: (id: string) => void;
}

const BookSection: React.FC<BookSectionProps> = ({ books, user, onAddClick, onEditClick, onDeleteClick }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  
  const canUpload = user?.role === 'owner' || user?.permissions?.library;
  const canDelete = user?.role === 'owner' || user?.permissions?.library;

  const handleOpenPreview = (base64: string, title: string) => {
    try {
      if (!base64.includes(';base64,')) {
        // If it's a direct URL or just base64 string
        if (base64.startsWith('http')) {
          setPreviewUrl(base64);
          setPreviewTitle(title);
          return;
        }
        // Assume it's a base64 string without data prefix
        base64 = `data:application/pdf;base64,${base64}`;
      }

      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
      setPreviewTitle(title);
    } catch (e) {
      console.error("PDF preview failed", e);
      alert("Failed to open PDF preview. It might be corrupted or too large.");
    }
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Tai Library</h2>
          <p className="text-heritage/60 font-medium">Read books, research papers, and cultural documents.</p>
        </div>
        {canUpload && (
          <button 
            onClick={onAddClick}
            className="heritage-button flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto"
          >
            <Plus size={20} />
            Upload Book PDF
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-heritage/10 shadow-inner"
        >
          <div className="w-24 h-24 bg-white border border-heritage/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookX className="text-heritage/20" size={40} />
          </div>
          <p className="text-heritage/40 text-xl font-serif font-bold">The library is currently empty.</p>
          <p className="text-heritage/30 text-sm mt-1">Staff members can start adding books here.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {books.map((book, idx) => (
              <motion.div 
                key={book.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[32px] p-6 shadow-sm border border-heritage/5 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <div 
                  className="relative aspect-[3/4] bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-heritage/10 shadow-inner group-hover:bg-white transition-colors cursor-pointer"
                  onClick={() => handleOpenPreview(book.pdfUrl, book.title)}
                >
                  <FileText className="w-20 h-20 text-heritage/20 group-hover:text-heritage/40 transition-colors" />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-heritage/60" size={32} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-ink mb-1 line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-accent font-bold text-sm mb-3">by {book.author}</p>
                  <p className="text-heritage/60 text-sm line-clamp-3 leading-relaxed mb-6">{book.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenPreview(book.pdfUrl, book.title)}
                    className="flex-1 bg-ink text-white py-4 rounded-xl font-bold text-sm hover:bg-heritage transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <BookOpen size={18} />
                    Read PDF
                  </button>
                  {canUpload && (
                     <button 
                     onClick={() => onEditClick(book)}
                     className="p-4 text-heritage/60 bg-white hover:bg-white hover:text-accent rounded-xl transition-all border border-heritage/10 shadow-sm"
                   >
                     <Edit3 size={20} />
                   </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => onDeleteClick(book.id)}
                      className="p-4 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-heritage/5 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-heritage/5 rounded-2xl">
                    <FileText size={24} className="text-heritage" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-ink tracking-tight line-clamp-1">
                      {previewTitle}
                    </h2>
                    <p className="text-[10px] font-black text-heritage/40 uppercase tracking-widest mt-0.5">
                      PDF Viewer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-heritage/5 text-heritage/60 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                    title="Open in new tab"
                  >
                    <ExternalLink size={18} />
                    <span className="hidden sm:inline">Open Native</span>
                  </a>
                  <button 
                    onClick={closePreview} 
                    className="p-3 bg-heritage/5 hover:bg-heritage/10 text-heritage rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-heritage/10 relative">
                <iframe 
                  src={`${previewUrl}#toolbar=0`}
                  title={previewTitle}
                  className="w-full h-full border-none"
                />
              </div>
              
              <div className="p-4 bg-white border-t border-heritage/5 flex justify-center">
                <p className="text-[10px] text-heritage/30 font-medium uppercase tracking-tight">
                  Tai Cultural Library &bull; Preservation Project
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookSection;
