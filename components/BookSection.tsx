import React from 'react';
import { Book, User } from '../types';
import { BookOpen, Plus, Trash2, Edit3, FileText, BookX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookSectionProps {
  books: Book[];
  user: User | null;
  onAddClick: () => void;
  onEditClick: (book: Book) => void;
  onDeleteClick: (id: string) => void;
}

const BookSection: React.FC<BookSectionProps> = ({ books, user, onAddClick, onEditClick, onDeleteClick }) => {
  const canUpload = user?.role === 'owner' || user?.permissions?.library;
  const canDelete = user?.role === 'owner' || user?.permissions?.library;

  const openPdf = (base64: string) => {
    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (e) {
      console.error("PDF preview failed", e);
      alert("Failed to open PDF. It might be corrupted or too large.");
    }
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
                <div className="relative aspect-[3/4] bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-heritage/10 shadow-inner group-hover:bg-white transition-colors">
                  <FileText className="w-20 h-20 text-heritage/20 group-hover:text-heritage/40 transition-colors" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-ink mb-1 line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-accent font-bold text-sm mb-3">by {book.author}</p>
                  <p className="text-heritage/60 text-sm line-clamp-3 leading-relaxed mb-6">{book.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openPdf(book.pdfUrl)}
                    className="flex-1 bg-ink text-white py-4 rounded-xl font-bold text-sm hover:bg-heritage transition-all shadow-lg active:scale-95"
                  >
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
    </div>
  );
};

export default BookSection;
