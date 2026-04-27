import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { Search, Mic, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  words: Word[];
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, words }) => {
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.onresult = (event: any) => {
        onChange(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Voice search not supported in this browser.");
    if (isListening) recognitionRef.current.stop();
    else { setIsListening(true); recognitionRef.current.start(); }
  };

  const suggestions = value.trim().length > 0 
    ? words.filter(w => 
        w.english.toLowerCase().includes(value.toLowerCase()) || 
        w.assamese.includes(value) || 
        w.taiKhamyang.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto mb-20 px-4">
      <div className="flex items-center gap-6">
        <div ref={containerRef} className="relative flex-1 group">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none z-10">
            <Search className={cn("h-6 w-6 transition-colors", isListening ? 'text-heritage' : 'text-ink/20')} />
          </div>
          <input
            type="text"
            className={cn(
              "block w-full pl-16 pr-14 py-7 bg-paper/80 backdrop-blur-md border border-ink/5 rounded-[2.5rem] transition-all outline-none text-xl font-medium shadow-soft placeholder:text-ink/50",
              isListening ? "border-heritage ring-8 ring-heritage/5" : "focus:border-heritage/30 focus:ring-8 focus:ring-heritage/5"
            )}
            placeholder={isListening ? "Listening..." : "Search heritage archive..."}
            value={value}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
          />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-6 bg-paper/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-ink/5 overflow-hidden z-[100]"
              >
                <div className="p-4 space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSuggestionClick(s.english)}
                      className="w-full px-8 py-5 text-left hover:bg-p-blue/30 rounded-2xl transition-all flex items-center justify-between group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-ink tracking-tight group-hover/item:text-heritage transition-colors">{s.english}</span>
                        <div className="flex gap-6 mt-2 opacity-40">
                          <span className="text-[10px] font-bold uppercase tracking-widest assamese">{s.assamese}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{s.taiKhamyang}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-paper shadow-soft flex items-center justify-center group-hover/item:bg-heritage group-hover/item:text-white transition-all group-hover/item:translate-x-1">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {value && (
            <div className="absolute inset-y-0 right-6 flex items-center">
              <button 
                onClick={() => onChange('')} 
                className="p-2 text-ink/20 hover:text-red-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleListening}
          className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 rounded-[2.5rem] transition-all active:scale-95 flex items-center justify-center border shrink-0 shadow-soft",
            isListening 
              ? 'bg-heritage text-white border-heritage animate-pulse shadow-lg shadow-heritage/20' 
              : 'bg-paper text-ink/30 hover:text-heritage hover:border-heritage/20 transition-all border-ink/5'
          )}
          title="Voice Search"
        >
          <Mic size={28} />
        </button>
      </div>
      
      <div className="flex justify-center gap-12 mt-10">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-p-blue group-hover:scale-150 transition-transform"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 group-hover:text-ink/40 transition-colors">English</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-p-pink group-hover:scale-150 transition-transform"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 group-hover:text-ink/40 transition-colors assamese">অসমীয়া</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-p-green group-hover:scale-150 transition-transform"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 group-hover:text-ink/40 transition-colors">Tai Khamyang</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
