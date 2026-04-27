import React from 'react';
import { Word } from '../types';
import { 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  SearchX,
  Volume2,
  Bookmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WordListProps {
  words: Word[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onGenerateImage: (id: string) => Promise<void>;
  isOnline: boolean;
  onSaveWord?: (id: string) => void;
  savedWordIds?: string[];
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
}

const WordCard: React.FC<{
  word: Word;
  index: number;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onGenerateImage: (id: string) => Promise<void>;
  isOnline: boolean;
  onSaveWord?: (id: string) => void;
  isSaved?: boolean;
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
}> = ({ word, index, canEdit, canDelete, onEdit, onDelete, onGenerateImage, isOnline, onSaveWord, isSaved, isLoggedIn, onLoginRequired }) => {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (onLoginRequired) onLoginRequired();
      else alert("Please login to listen to pronunciations.");
      return;
    }
    if (!word.audioUrl) return;
    const audio = new Audio(word.audioUrl);
    audio.play().catch(err => console.error("Audio failed", err));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-paper rounded-[3rem] border border-ink/5 hover:border-heritage/20 transition-all duration-500 flex flex-col h-full overflow-hidden group shadow-soft hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
        {word.imageUrl ? (
          <img src={word.imageUrl} alt={word.english} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-10">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        
        <div className="absolute top-6 left-6">
          <span className="px-5 py-2 bg-paper/80 backdrop-blur-md text-heritage rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-soft border border-white/20">{word.category}</span>
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-3">
          {onSaveWord && (
            <button 
              onClick={(e) => { e.stopPropagation(); onSaveWord(word.id); }}
              className={cn(
                "w-12 h-12 rounded-2xl transition-all flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20",
                isSaved 
                  ? "bg-heritage text-white shadow-heritage/20" 
                  : "bg-paper/80 text-ink/40 hover:text-heritage hover:bg-paper"
              )}
            >
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          )}
          {word.audioUrl && (
            <button 
              onClick={playAudio} 
              className="w-12 h-12 bg-paper/80 text-heritage rounded-2xl shadow-lg backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all hover:bg-paper"
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-10 space-y-10 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-heritage/40 uppercase tracking-[0.3em] block">English</span>
            <h3 className="text-2xl font-bold text-ink tracking-tight leading-none group-hover:text-heritage transition-colors">{word.english}</h3>
          </div>
          <div className="space-y-3 text-right">
            <span className="text-[9px] font-bold text-accent/40 uppercase tracking-[0.3em] block">Tai Khamyang</span>
            <h3 className="text-3xl font-bold text-ink tracking-tighter leading-none">{word.taiKhamyang}</h3>
          </div>
          <div className="col-span-2 h-px bg-gradient-to-r from-transparent via-ink/5 to-transparent"></div>
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-heritage/40 uppercase tracking-[0.3em] block">Assamese</span>
            <h3 className="text-2xl font-bold text-ink assamese leading-none">{word.assamese}</h3>
          </div>
          <div className="space-y-3 text-right">
            <span className="text-[9px] font-bold text-accent/40 uppercase tracking-[0.3em] block">Other</span>
            <h3 className="text-xl font-bold text-ink/40 leading-none">{word.additionalLang || '—'}</h3>
          </div>
        </div>

        {(word.pronunciation || word.exampleSentence) && (
          <div className="bg-muted/30 rounded-[2.5rem] p-8 space-y-6 border border-ink/5 shadow-inner">
            {word.pronunciation && (
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-heritage/40 uppercase tracking-[0.3em]">Pronunciation</span>
                <span className="text-sm italic font-bold text-heritage/60">/{word.pronunciation}/</span>
              </div>
            )}
            {word.exampleSentence && (
              <div className="space-y-4">
                <p className="text-lg font-medium text-ink/70 leading-relaxed italic tracking-tight">"{word.exampleSentence}"</p>
                {word.sentenceMeaning && (
                  <p className="text-sm text-ink/40 font-medium pl-6 border-l-2 border-heritage/20">{word.sentenceMeaning}</p>
                )}
              </div>
            )}
          </div>
        )}

        {(canEdit || canDelete) && (
          <div className="pt-8 mt-auto border-t border-ink/5 flex items-center justify-end gap-3">
            {canEdit && (
              <button 
                onClick={() => onEdit(word)} 
                className="p-4 text-heritage/40 hover:text-heritage hover:bg-p-blue/30 rounded-2xl transition-all" 
              >
                <Edit3 size={20} />
              </button>
            )}
            {canDelete && (
              <button 
                onClick={() => onDelete(word.id)} 
                className="p-4 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" 
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function WordList({ words, savedWordIds = [], isLoggedIn, onLoginRequired, ...props }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-black">
           <SearchX className="w-10 h-10 text-heritage" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-ink">No words found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {words.map((word, i) => (
        <WordCard 
          key={word.id} 
          word={word} 
          index={i} 
          isSaved={savedWordIds.includes(word.id)}
          isLoggedIn={isLoggedIn}
          onLoginRequired={onLoginRequired}
          {...props} 
        />
      ))}
    </div>
  );
}
