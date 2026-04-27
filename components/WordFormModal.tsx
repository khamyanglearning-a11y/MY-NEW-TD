
import React, { useState, useRef } from 'react';
import { Word } from '../types';
import { 
  X, 
  Image as ImageIcon, 
  Mic, 
  Square, 
  Upload, 
  Trash2, 
  Languages, 
  BookOpen, 
  Type, 
  Tag, 
  Volume2, 
  Save
} from 'lucide-react';
import { motion } from 'motion/react';

interface WordFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Word>) => void;
  onDelete?: () => void;
  canDelete: boolean;
  initialData?: Word;
  existingWords: Word[];
  isOnline: boolean;
}

const WordFormModal: React.FC<WordFormModalProps> = ({ onClose, onSubmit, onDelete, canDelete, initialData, existingWords, isOnline }) => {
  const [formData, setFormData] = useState<Partial<Word>>(initialData || {
    english: '',
    assamese: '',
    taiKhamyang: '',
    additionalLang: '',
    pronunciation: '',
    exampleSentence: '',
    sentenceMeaning: '',
    audioUrl: '', 
    imageUrl: '',
    category: 'General'
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(initialData?.audioUrl || null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toBase64 = (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64 = await toBase64(blob);
        setFormData(prev => ({ ...prev, audioUrl: base64 }));
        setAudioPreview(base64);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic access denied"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFormSubmit = () => {
    if (!formData.english || !formData.assamese || !formData.taiKhamyang) {
      alert("Please fill English, Assamese, and Tai Khamyang at minimum.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[48px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar border border-white/20"
      >
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-ink tracking-tight">{initialData ? 'Update Record' : 'New Entry'}</h2>
              <p className="text-heritage/40 font-medium mt-2">Populate the 4-language digital dictionary.</p>
            </div>
            <button onClick={onClose} className="p-4 bg-white hover:bg-white rounded-full transition-all text-heritage/40 hover:text-heritage border border-heritage/10 shadow-sm">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-10">
            {/* Visual Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                <ImageIcon size={10} />
                Word Visualization
              </label>
              <div className="relative aspect-[16/7] bg-white rounded-[32px] overflow-hidden border-2 border-dashed border-heritage/10 flex flex-col items-center justify-center group shadow-inner">
                 {formData.imageUrl ? (
                   <div className="relative w-full h-full">
                     <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Uploaded" />
                     <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setFormData(p => ({...p, imageUrl: ''}))}
                          className="px-6 py-3 bg-white text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Remove Image
                        </button>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center space-y-5 p-10">
                     <div className="w-20 h-20 rounded-[24px] bg-white border border-heritage/10 flex items-center justify-center mx-auto text-heritage/20 shadow-sm">
                        <ImageIcon size={40} />
                     </div>
                     <p className="text-sm font-bold text-heritage/30">No visual assigned yet.</p>
                     <label className="heritage-button px-8 py-3 text-[10px] tracking-widest cursor-pointer">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const b = await toBase64(f); setFormData(p => ({...p, imageUrl: b})); } }} />
                     </label>
                   </div>
                 )}
              </div>
            </div>

            {/* Primary Entry */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Type size={10} />
                Primary Word (English)
              </label>
              <input
                name="english"
                value={formData.english}
                onChange={handleChange}
                className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all font-bold text-xl text-ink"
                placeholder="e.g. Traditional House"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Languages size={10} />
                  Assamese Script
                </label>
                <input
                  name="assamese"
                  value={formData.assamese}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all assamese-font text-2xl font-bold text-ink"
                  placeholder="অসমীয়া অৰ্থ"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Languages size={10} />
                  Tai Khamyang
                </label>
                <input
                  name="taiKhamyang"
                  value={formData.taiKhamyang}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all font-bold text-xl text-heritage"
                  placeholder="Tai script"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Languages size={10} />
                  Additional Language
                </label>
                <input
                  name="additionalLang"
                  value={formData.additionalLang}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all font-bold text-lg text-ink"
                  placeholder="e.g. Hindi translation"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Tag size={10} />
                  Classification
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all font-bold text-ink appearance-none"
                  >
                    {['General', 'Nature', 'Food', 'Family', 'Heritage', 'Place', 'Education'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Volume2 size={10} />
                  Pronunciation Guide
                </label>
                <input
                  name="pronunciation"
                  value={formData.pronunciation}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all font-medium italic text-heritage/60"
                  placeholder="e.g. /Tra-di-shun-al/"
                />
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <BookOpen size={10} />
                  Usage Example & Translation
                </label>
                <input
                  name="exampleSentence"
                  value={formData.exampleSentence}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white border-2 border-heritage/10 rounded-[24px] focus:border-accent focus:bg-white outline-none transition-all text-sm font-bold text-ink"
                  placeholder="Sentence using the word..."
                />
                <textarea
                  name="sentenceMeaning"
                  value={formData.sentenceMeaning}
                  onChange={handleChange}
                  className="w-full px-8 py-6 bg-white border-2 border-heritage/10 rounded-[32px] focus:border-accent focus:bg-white outline-none transition-all text-sm font-medium h-32 text-ink resize-none"
                  placeholder="Translation of the example sentence..."
                />
              </div>
            </div>

            <div className="bg-white border border-heritage/10 rounded-[40px] p-10 space-y-8 shadow-sm">
               <h4 className="text-[10px] font-bold text-heritage uppercase tracking-widest text-center">Audio Record / Upload</h4>
               {audioPreview ? (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-white p-6 rounded-[24px] shadow-xl shadow-heritage/5"
                 >
                   <audio src={audioPreview} controls className="h-10 flex-1" />
                   <button 
                    onClick={() => { setAudioPreview(null); setFormData(p => ({...p, audioUrl: ''})); }} 
                    className="ml-4 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                   >
                     <Trash2 size={24} />
                   </button>
                 </motion.div>
               ) : (
                 <div className="grid grid-cols-2 gap-6">
                   <button 
                    onClick={isRecording ? stopRecording : startRecording} 
                    className={`py-8 rounded-[32px] font-bold uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-3 border-2 border-dashed ${isRecording ? 'bg-red-600 text-white border-transparent animate-pulse shadow-xl shadow-red-200' : 'bg-white border-heritage/10 text-heritage hover:bg-white shadow-sm'}`}
                   >
                     {isRecording ? <Square size={24} /> : <Mic size={24} />}
                     {isRecording ? 'Stop Recording' : 'Start Recording'}
                   </button>
                   <label className="py-8 rounded-[32px] bg-white border-2 border-heritage/10 border-dashed text-heritage font-bold uppercase text-[10px] tracking-widest flex flex-col items-center gap-3 cursor-pointer hover:bg-white transition-all shadow-sm">
                      <Upload size={24} />
                      Upload MP3
                      <input type="file" accept="audio/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const b = await toBase64(f); setAudioPreview(b); setFormData(p => ({...p, audioUrl: b})); } }} />
                   </label>
                 </div>
               )}
            </div>

            <div className="flex gap-4 pt-8">
              <button 
                onClick={onClose} 
                className="flex-1 py-6 bg-white border border-heritage/10 text-heritage/40 rounded-[24px] font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleFormSubmit} 
                className="heritage-button flex-1 py-6 text-[10px] flex items-center justify-center gap-3"
              >
                <Save size={18} />
                Save Digital Record
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WordFormModal;
