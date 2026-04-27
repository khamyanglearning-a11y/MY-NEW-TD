
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Bookmark, 
  TrendingUp, 
  Award,
  Settings,
  LogOut,
  ChevronRight,
  BookOpen,
  Volume2,
  Download,
  CheckCircle,
  Camera
} from 'lucide-react';
import { StudentProfile, Word } from '../types';
import ProfileEditModal from './ProfileEditModal';

interface StudentProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => Promise<void>;
  words: Word[];
  onDownloadOffline: () => void;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ profile, onUpdateProfile, words, onDownloadOffline }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const savedWordsList = words.filter(w => profile.savedWords.some(sw => sw.wordId === w.id));
  
  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Audio playback failed:", e));
  };
  
  const completionPercentage = Math.round((profile.progress.length / 15) * 100); // Assuming 15 lessons total

  const handleUpdate = async (data: Partial<StudentProfile>) => {
    await onUpdateProfile({ ...profile, ...data });
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-heritage/10 p-10 shadow-2xl shadow-blue-600/5 text-center space-y-6"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-ink tracking-tighter">{profile.name}</h2>
              <p className="text-heritage/40 text-xs font-black uppercase tracking-widest">Student Member</p>
            </div>

            <div className="pt-6 border-t border-heritage/10 space-y-4 text-left">
              <div className="flex items-center gap-4 text-heritage/60">
                <div className="w-10 h-10 bg-white border border-heritage/10 rounded-xl flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                <span className="text-sm font-bold">+91 {profile.phone}</span>
              </div>
              {profile.email && (
                <div className="flex items-center gap-4 text-heritage/60">
                  <div className="w-10 h-10 bg-white border border-heritage/10 rounded-xl flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                  <span className="text-sm font-bold">{profile.email}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-heritage/60">
                <div className="w-10 h-10 bg-white border border-heritage/10 rounded-xl flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
                <span className="text-sm font-bold">Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="py-4 bg-white text-heritage rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-heritage/10 transition-all flex items-center justify-center gap-2 border border-heritage/10"
              >
                <Settings className="w-3 h-3" />
                Edit
              </button>
              <button 
                onClick={onDownloadOffline}
                className="py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-100"
              >
                <Download className="w-3 h-3" />
                Offline
              </button>
            </div>
          </motion.div>

          <div className="bg-ink rounded-[2.5rem] p-8 text-white space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Learning Stats</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-black">{completionPercentage}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Course Completion</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Saved Words */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-black text-ink tracking-tighter">Saved Words</h2>
              </div>
              <span className="text-xs font-black text-heritage/40 uppercase tracking-widest">{savedWordsList.length} Words</span>
            </div>

            {savedWordsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedWordsList.map(word => (
                  <motion.div 
                    key={word.id}
                    className="p-6 bg-white rounded-3xl border border-heritage/10 hover:border-blue-200 hover:shadow-xl transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xl font-black text-ink tracking-tight">{word.taiKhamyang}</h4>
                      <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest">{word.english}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {word.audioUrl && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(word.audioUrl!);
                          }}
                          className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                          title="Play Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-heritage/20 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-white border border-heritage/10 rounded-[3rem] text-center space-y-4">
                <p className="text-heritage/60 font-medium">You haven't saved any words yet.</p>
                <button className="text-blue-600 font-black text-xs uppercase tracking-widest">Browse Dictionary</button>
              </div>
            )}
          </section>

          {/* Recent Progress */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-ink tracking-tighter">Recent Progress</h2>
            </div>

            <div className="space-y-4">
              {profile.progress.length > 0 ? (
                profile.progress.slice(-3).reverse().map((prog, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-heritage/10">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-ink leading-tight">Lesson Completed</h4>
                      <p className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest mt-1">
                        {new Date(prog.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 bg-white border border-heritage/10 rounded-[3rem] text-center space-y-4">
                  <p className="text-heritage/60 font-medium">Start your first lesson to track progress!</p>
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Go to Course</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <ProfileEditModal 
            profile={profile} 
            onClose={() => setIsEditModalOpen(false)} 
            onSubmit={handleUpdate} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProfileView;
