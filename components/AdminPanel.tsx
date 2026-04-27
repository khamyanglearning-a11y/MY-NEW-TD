
import React, { useState, useMemo, useEffect } from 'react';
import { Admin, AdminPermissions, PublicUser, User, Word, Book, GalleryImage, Song, Video, StudentProfile } from '../types';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  ShieldAlert, 
  BookOpen, 
  Image as ImageIcon, 
  Music, 
  Video as VideoIcon, 
  Trash2, 
  Edit3,
  Plus, 
  Lock, 
  Phone, 
  Key,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Fingerprint,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface AdminPanelProps {
  user: User;
  admins: Admin[];
  words: Word[];
  books: Book[];
  photos: GalleryImage[];
  songs: Song[];
  videos: Video[];
  registeredUsers: StudentProfile[];
  onSaveAdmin: (admin: Admin) => void;
  onRemoveAdmin: (phoneNumber: string) => void;
  onAddWord: () => void;
  onEditWord: (word: Word) => void;
  onDeleteWord: (id: string) => void;
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onAddPhoto: () => void;
  onEditPhoto: (photo: GalleryImage) => void;
  onAddSong: () => void;
  onEditSong: (song: Song) => void;
  onAddVideo: () => void;
  onEditVideo: (video: Video) => void;
  onDeleteBook: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteSong: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  onUpdateDevCredentials: (phone: string, pass: string) => void;
  onEditUser: (user: StudentProfile) => void;
  onDeleteUser: (id: string) => void;
  onAddArticle: () => void;
  onAddModule: () => void;
  onAddLesson: () => void;
  onEditAbout: () => void;
  currentDevPhone: string;
  stats: {
    words: number;
    books: number;
    photos: number;
    songs: number;
    videos: number;
  };
}

const PublicUsersManager: React.FC<{ users: StudentProfile[], onEdit: (u: StudentProfile) => void, onDelete: (id: string) => void }> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="space-y-12">
      <div className="px-4">
        <h3 className="text-5xl font-bold text-ink tracking-tighter uppercase leading-none mb-4">Members</h3>
        <p className="text-ink/60 font-medium text-lg tracking-tight">Manage registered community members.</p>
      </div>

      <div className="bg-white dark:bg-muted rounded-[3rem] border border-ink/5 overflow-hidden shadow-2xl shadow-ink/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-ink/5">
              <tr className="text-[9px] font-bold text-ink/40 uppercase tracking-[0.3em]">
                <th className="px-12 py-8">Member</th>
                <th className="px-12 py-8">Phone</th>
                <th className="px-12 py-8">Key</th>
                <th className="px-12 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-12 py-20 text-center text-ink/20 font-medium italic text-lg">
                    No members registered yet.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-ink text-paper rounded-[1.5rem] flex items-center justify-center font-bold overflow-hidden shadow-xl shadow-ink/10">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-xl">{u.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-ink text-xl tracking-tight">{u.name}</div>
                          <div className="text-ink/20 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">ID: {u.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-3 text-ink font-bold text-lg tracking-tight">
                        <Phone size={14} className="text-ink/10" />
                        {u.phone}
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-3 text-ink/40 font-mono font-bold bg-muted/50 px-4 py-2 rounded-xl w-fit border border-ink/5">
                        <Key size={14} className="text-ink/10" />
                        {u.password}
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(u)} className="p-3 text-ink/10 hover:text-ink hover:bg-muted rounded-xl transition-all">
                          <Edit3 size={20} />
                        </button>
                        <button onClick={() => onDelete(u.id)} className="p-3 text-ink/10 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PERMISSION_LABELS: Record<keyof AdminPermissions, { label: string, icon: React.ReactNode, color: string }> = {
  dictionary: { label: 'Dictionary', icon: <BookOpen size={14} />, color: 'ink' },
  library: { label: 'Library', icon: <BookOpen size={14} />, color: 'ink' },
  gallery: { label: 'Gallery', icon: <ImageIcon size={14} />, color: 'ink' },
  songs: { label: 'Songs', icon: <Music size={14} />, color: 'ink' },
  videos: { label: 'Videos', icon: <VideoIcon size={14} />, color: 'ink' },
  exams: { label: 'Exams', icon: <ShieldAlert size={14} />, color: 'ink' }
};

type ContentType = 'words' | 'books' | 'photos' | 'songs' | 'videos';

export default function AdminPanel(props: AdminPanelProps) {
  const { 
    user, admins, words, books, photos, songs, videos, registeredUsers, 
    onSaveAdmin, onRemoveAdmin, stats, onUpdateDevCredentials, currentDevPhone,
    onEditUser, onDeleteUser, onAddArticle, onAddModule, onAddLesson, onEditAbout
  } = props;
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'content' | 'staff' | 'publicUsers' | 'security'>('overview');
  
  const [newDevPhone, setNewDevPhone] = useState(currentDevPhone);
  const [newDevPass, setNewDevPass] = useState('');

  const CONTENT_MAP: Record<ContentType, keyof AdminPermissions> = {
    words: 'dictionary',
    books: 'library',
    photos: 'gallery',
    songs: 'songs',
    videos: 'videos'
  };

  const availableContentTypes = useMemo(() => {
    const list: ContentType[] = ['words', 'books', 'photos', 'songs', 'videos'];
    if (user.role === 'owner') return list;
    return list.filter(type => user.permissions?.[CONTENT_MAP[type]]);
  }, [user]);

  const [contentType, setContentType] = useState<ContentType>(availableContentTypes[0] || 'words');

  useEffect(() => {
    if (!availableContentTypes.includes(contentType) && availableContentTypes.length > 0) {
      setContentType(availableContentTypes[0]);
    }
  }, [availableContentTypes, contentType]);

  const isOwner = user.role === 'owner';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-24 font-sans">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 p-2 bg-muted/50 backdrop-blur-xl rounded-full w-fit border border-ink/5 shadow-2xl shadow-ink/5">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'content', label: 'Content', icon: Database },
          ...(isOwner ? [
            { id: 'staff', label: 'Staff', icon: Users },
            { id: 'publicUsers', label: 'Members', icon: Users },
            { id: 'security', label: 'Security', icon: ShieldAlert }
          ] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500",
              activeSubTab === tab.id 
                ? "bg-ink text-paper shadow-2xl shadow-ink/20 scale-105" 
                : "text-ink/30 hover:text-ink hover:bg-ink/5"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'overview' && (
          <motion.div 
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <motion.div variants={itemVariants} className="bg-white dark:bg-muted p-12 rounded-[3rem] border border-ink/5 flex flex-col justify-center relative overflow-hidden group shadow-2xl shadow-ink/5">
                <div className="absolute top-0 right-0 p-4 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000">
                  <TrendingUp size={240} />
                </div>
                <h3 className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
                  Analytics
                </h3>
                <div className="grid grid-cols-2 gap-y-12 gap-x-8 relative z-10">
                  {[
                    { label: 'Words', value: stats.words, icon: BookOpen },
                    { label: 'Books', value: stats.books, icon: BookOpen },
                    { label: 'Media', value: stats.photos + stats.videos, icon: ImageIcon },
                    { label: 'Music', value: stats.songs, icon: Music }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        {stat.label}
                      </p>
                      <p className="text-5xl font-bold text-ink tracking-tighter">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-2 bg-ink rounded-[3rem] p-16 text-paper relative overflow-hidden flex flex-col justify-center min-h-[450px] shadow-2xl shadow-ink/20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-paper/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="relative z-10 space-y-10">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-paper/5 text-paper/40 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-paper/10 backdrop-blur-md">
                    <Fingerprint size={14} />
                    Verified Access
                  </div>
                  <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
                    Welcome, <br />
                    <span className="text-paper/60">{user.name}</span>
                  </h2>
                  <p className="text-paper/30 font-medium text-xl leading-relaxed max-w-lg tracking-tight">
                    Managing the digital archives of the Tai Khamyang community. {isOwner ? 'Root administrative protocols active.' : 'Staff operational permissions active.'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 ml-2">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Edit3 size={20} />, label: 'Article', action: onAddArticle },
                  { icon: <Plus size={20} />, label: 'Module', action: onAddModule },
                  { icon: <VideoIcon size={20} />, label: 'Lesson', action: onAddLesson },
                  { icon: <LayoutDashboard size={20} />, label: 'About', action: onEditAbout },
                ].map((btn, i) => (
                  <button 
                    key={i}
                    onClick={btn.action} 
                    className="p-8 bg-white dark:bg-muted text-ink rounded-[2rem] border border-ink/5 hover:border-ink/20 transition-all text-left space-y-4 group"
                  >
                    <div className="w-12 h-12 bg-muted dark:bg-paper/5 rounded-2xl flex items-center justify-center text-ink/40 group-hover:text-ink transition-colors">
                      {btn.icon}
                    </div>
                    <p className="font-bold text-[10px] uppercase tracking-widest">Add {btn.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeSubTab === 'content' && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {availableContentTypes.map(type => (
                <button 
                  key={type} 
                  onClick={() => setContentType(type)} 
                  className={cn(
                    "whitespace-nowrap px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all border",
                    contentType === type 
                      ? "bg-ink text-paper border-ink shadow-sm" 
                      : "bg-muted text-ink/40 border-ink/5 hover:text-ink"
                  )}
                >
                  {type === 'words' ? 'Dictionary' : type}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-2">
                <h3 className="text-4xl font-bold text-ink tracking-tighter uppercase">{contentType === 'words' ? 'Dictionary' : contentType}</h3>
                <button 
                  onClick={() => {
                    if (contentType === 'words') props.onAddWord();
                    if (contentType === 'books') props.onAddBook();
                    if (contentType === 'photos') props.onAddPhoto();
                    if (contentType === 'songs') props.onAddSong();
                    if (contentType === 'videos') props.onAddVideo();
                  }} 
                  className="w-full sm:w-auto px-10 py-5 bg-ink text-paper rounded-full font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Add {contentType === 'words' ? 'Word' : contentType.slice(0, -1)}
                </button>
              </div>

              <div className="bg-white dark:bg-muted rounded-[2.5rem] border border-ink/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-ink/5">
                      <tr className="text-[9px] font-bold text-ink/50 uppercase tracking-widest">
                        <th className="px-10 py-6">Entry</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {contentType === 'words' && words.map(w => (
                        <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-10 py-6">
                            <div className="font-bold text-ink text-lg">{w.english}</div>
                            <div className="text-ink/60 text-sm font-medium italic">{w.taiKhamyang}</div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => props.onEditWord(w)} className="p-2 text-ink/20 hover:text-ink transition-colors">
                                <Edit3 size={18} />
                              </button>
                              <button onClick={() => props.onDeleteWord(w.id)} className="p-2 text-ink/20 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'staff' && isOwner && (
          <motion.div 
            key="staff"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
             <StaffManager admins={admins} onSave={onSaveAdmin} onRemove={onRemoveAdmin} />
          </motion.div>
        )}

        {activeSubTab === 'publicUsers' && isOwner && (
          <motion.div 
            key="publicUsers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
             <PublicUsersManager users={registeredUsers} onEdit={onEditUser} onDelete={onDeleteUser} />
          </motion.div>
        )}

        {activeSubTab === 'security' && isOwner && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto"
          >
             <div className="bg-white dark:bg-muted p-12 rounded-[2.5rem] border border-ink/5 space-y-12 relative overflow-hidden">
               <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-ink/5 rounded-full flex items-center justify-center mx-auto text-ink">
                   <Lock size={32} />
                 </div>
                 <h3 className="text-4xl font-bold text-ink tracking-tighter uppercase">Root Security</h3>
                 <p className="text-ink/40 font-medium">Update master administrative credentials.</p>
               </div>

               <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <Phone size={10} />
                      Root Phone
                    </label>
                    <input 
                      className="w-full px-8 py-5 bg-muted/50 rounded-2xl font-bold text-ink outline-none border border-ink/5 focus:border-ink/20 transition-all" 
                      value={newDevPhone} 
                      onChange={e => setNewDevPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <Key size={10} />
                      New Root Password
                    </label>
                    <input 
                      className="w-full px-8 py-5 bg-muted/50 rounded-2xl font-bold text-ink outline-none border border-ink/5 focus:border-ink/20 transition-all" 
                      type="password" 
                      value={newDevPass} 
                      onChange={e => setNewDevPass(e.target.value)} 
                      placeholder="Enter secure password" 
                    />
                  </div>
                  <button 
                    onClick={() => { if(!newDevPass) return alert("Password cannot be empty."); onUpdateDevCredentials(newDevPhone, newDevPass); setNewDevPass(''); }} 
                    className="w-full py-6 bg-ink text-paper rounded-full font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Apply Security Updates
                  </button>
               </div>
               
               <div className="bg-muted/50 p-6 rounded-3xl border border-ink/5">
                 <p className="text-[11px] text-ink/40 text-center font-medium leading-relaxed italic">
                   "Updating these values will immediately change your permanent login credentials across all active sessions."
                 </p>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StaffManager: React.FC<{ admins: Admin[], onSave: (a: Admin) => void, onRemove: (p: string) => void }> = ({ admins, onSave, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [perms, setPerms] = useState<AdminPermissions>({ dictionary: true, library: false, gallery: false, songs: false, videos: false, exams: false });

  const PERMISSION_KEYS: (keyof AdminPermissions)[] = ['dictionary', 'library', 'gallery', 'songs', 'videos'];

  const handleSaveNew = () => {
    if (!name || phone.length !== 10 || !password) return alert("All fields are mandatory.");
    onSave({ name, phone, password, permissions: perms });
    setName(''); setPhone(''); setPassword(''); setIsAdding(false);
    setPerms({ dictionary: true, library: false, gallery: false, songs: false, videos: false, exams: false });
  };

  const handleTogglePermission = (adminPhone: string, key: keyof AdminPermissions) => {
    const admin = admins.find(a => a.phone === adminPhone);
    if (admin) {
      onSave({ ...admin, permissions: { ...admin.permissions, [key]: !admin.permissions[key] } });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-2">
        <div>
          <h3 className="text-4xl font-bold text-ink tracking-tighter uppercase">Staff Directory</h3>
          <p className="text-ink/40 font-medium text-sm">Manage administrative access and permissions.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={cn(
            "w-full sm:w-auto px-10 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            isAdding ? "bg-muted text-ink border border-ink/5" : "bg-ink text-paper shadow-sm"
          )}
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-muted p-10 rounded-[2.5rem] border border-ink/5 space-y-10 mb-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest ml-1">Name</label>
                    <input className="w-full px-6 py-4 bg-muted/50 rounded-2xl font-bold text-ink outline-none border border-ink/5 focus:border-ink/20 transition-all" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest ml-1">Phone</label>
                    <input className="w-full px-6 py-4 bg-muted/50 rounded-2xl font-bold text-ink outline-none border border-ink/5 focus:border-ink/20 transition-all tracking-widest" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 Digits" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest ml-1">Password</label>
                    <input className="w-full px-6 py-4 bg-muted/50 rounded-2xl font-bold text-ink outline-none border border-ink/5 focus:border-ink/20 transition-all" value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure Key" />
                  </div>
               </div>

               <div className="space-y-6">
                 <label className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.3em] block text-center">Permissions</label>
                 <div className="flex flex-wrap justify-center gap-3">
                   {PERMISSION_KEYS.map(key => (
                     <button 
                      key={key} 
                      onClick={() => setPerms(prev => ({...prev, [key]: !prev[key]}))} 
                      className={cn(
                        "px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border",
                        perms[key] 
                          ? "bg-ink text-paper border-ink shadow-sm" 
                          : "bg-muted text-ink/40 border-ink/5 hover:text-ink"
                      )}
                    >
                      {PERMISSION_LABELS[key].icon}
                      {PERMISSION_LABELS[key].label}
                    </button>
                   ))}
                 </div>
               </div>

               <button onClick={handleSaveNew} className="w-full py-6 bg-ink text-paper rounded-full font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">Register Staff Member</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map(admin => (
          <motion.div 
            layout
            key={admin.phone} 
            className="bg-white dark:bg-muted p-8 rounded-[2.5rem] border border-ink/5 group hover:border-ink/20 transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-ink text-paper rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-ink leading-none mb-2">{admin.name}</h4>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={10} />
                    +91 {admin.phone}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onRemove(admin.phone)} 
                className="p-3 text-ink/10 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="space-y-6 relative z-10">
               <div className="h-px bg-ink/5 w-full"></div>
               <div className="flex flex-wrap gap-2">
                 {PERMISSION_KEYS.map(key => (
                   <button 
                    key={key} 
                    onClick={() => handleTogglePermission(admin.phone, key)} 
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-widest transition-all flex items-center gap-1.5 border",
                      admin.permissions[key] 
                        ? "bg-ink/5 text-ink border-ink/10" 
                        : "bg-muted text-ink/20 border-ink/5 grayscale opacity-50"
                    )}
                  >
                    {PERMISSION_LABELS[key].icon}
                    {PERMISSION_LABELS[key].label}
                  </button>
                 ))}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

