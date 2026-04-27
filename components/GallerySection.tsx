import React from 'react';
import { GalleryImage, User } from '../types';
import { Image as ImageIcon, Plus, Trash2, CameraOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GallerySectionProps {
  images: GalleryImage[];
  user: User | null;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, user, onAddClick, onDeleteClick }) => {
  const canManage = user?.role === 'owner' || user?.permissions?.gallery;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Cultural Gallery</h2>
          <p className="text-heritage/60 font-medium">Capturing the beauty of Tai Khamyang traditions.</p>
        </div>
        {canManage && (
          <button 
            onClick={onAddClick}
            className="heritage-button flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto"
          >
            <Plus size={20} />
            Add Photo
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-heritage/10 shadow-inner"
        >
          <div className="w-24 h-24 bg-white border border-heritage/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CameraOff className="text-heritage/20" size={40} />
          </div>
          <p className="text-heritage/40 text-xl font-serif font-bold">No photos yet.</p>
          <p className="text-heritage/30 text-sm mt-1">Staff can start adding photos to this collection.</p>
        </motion.div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {images.map((image, idx) => (
              <motion.div 
                key={image.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm border border-heritage/5 hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={image.url} 
                  alt={image.caption} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white font-serif font-bold text-lg leading-tight mb-2">{image.caption}</p>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">By {image.addedBy}</span>
                     {canManage && (
                       <button 
                        onClick={() => onDeleteClick(image.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-600 text-white rounded-lg transition-all backdrop-blur-md"
                       >
                         <Trash2 size={16} />
                       </button>
                     )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
