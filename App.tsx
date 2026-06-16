import React, { useState, useEffect } from 'react';
import { Word, User, Admin, Book, PublicUser, GalleryImage, Song, Video, StudentRequest, StudentProfile, BlogPost, CourseModule, Lesson, AboutContent, Message } from './types';
import { INITIAL_WORDS } from './constants';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WordList from './components/WordList';
import WordFormModal from './components/WordFormModal';
import AdminPanel from './components/AdminPanel';
import SignInPage from './components/SignInPage';
import BookSection from './components/BookSection';
import BookFormModal from './components/BookFormModal';
import GallerySection from './components/GallerySection';
import GalleryFormModal from './components/GalleryFormModal';
import SongSection from './components/SongSection';
import SongFormModal from './components/SongFormModal';
import VideoSection from './components/VideoSection';
import VideoFormModal from './components/VideoFormModal';
import PublicStatsHeader from './components/PublicStatsHeader';
import DeveloperRegisterPage from './components/DeveloperRegisterPage';
import LandingPage from './components/LandingPage';
import LearningCourse from './components/LearningCourse';
import BlogSection from './components/BlogSection';
import StudentProfileView from './components/StudentProfileView';
import BottomNav from './components/BottomNav';
import ArticleFormModal from './components/ArticleFormModal';
import ModuleFormModal from './components/ModuleFormModal';
import LessonFormModal from './components/LessonFormModal';
import AboutFormModal from './components/AboutFormModal';
import MessageModal from './components/MessageModal';
import { db, DEMO_MODE } from './services/database';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

type AppTab = 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard' | 'learning' | 'blog' | 'profile';

const canAccessTab = (tab: AppTab, user: User | null) => {
  if (tab === 'dictionary') return true;
  if (!user) return false;
  if (tab === 'dashboard') return user.role === 'owner' || user.role === 'admin';
  if (tab === 'profile') return user.role === 'student';
  return true;
};

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<StudentProfile[]>([]);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]); 
  
  const [devConfig, setDevConfig] = useState<{ phone: string, password: string, name: string } | null>(null);
  const [isDevChecking, setIsDevChecking] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setDevConfig({ phone: '6901543900', password: '9365', name: 'Developer' });
    }
  }, []);

  const [activeTab, setActiveTab] = useState<AppTab>('dictionary');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginIntent, setLoginIntent] = useState<'staff' | 'developer' | 'public'>('developer');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const [editingWord, setEditingWord] = useState<Word | undefined>(undefined);
  const [editingArticle, setEditingArticle] = useState<BlogPost | undefined>(undefined);
  const [editingModule, setEditingModule] = useState<CourseModule | undefined>(undefined);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>(undefined);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSettingUpDev, setIsSettingUpDev] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('taihub_theme') === 'dark';
  });

  const loadCoreData = async () => {
    setIsSyncing(true);
    try {
      const [devAuth, cloudWords, cloudBooks, cloudGallery, cloudSongs, cloudVideos, cloudUsers, cloudRequests, cloudStaff, about] = await Promise.all([
        db.devAuth.get(),
        db.words.fetchAll(),
        db.books.fetchAll(),
        db.gallery.fetchAll(),
        db.songs.fetchAll(),
        db.videos.fetchAll(),
        db.users.fetchAll(),
        db.studentRequests.fetchAll(),
        db.staff.fetchAll(),
        db.about.get()
      ]);
      setDevConfig(devAuth);
      setWords(cloudWords.length > 0 ? cloudWords : INITIAL_WORDS);
      setBooks(cloudBooks);
      setGallery(cloudGallery);
      setSongs(cloudSongs);
      setVideos(cloudVideos);
      setRegisteredUsers(cloudUsers);
      setStudentRequests(cloudRequests);
      setAdmins(cloudStaff);
      setAboutContent(about);
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setIsSyncing(false);
      setIsDevChecking(false);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taihub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taihub_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    loadCoreData();
  }, [isOnline]);

  useEffect(() => {
    const savedSession = localStorage.getItem('dictionary_current_session');
    if (savedSession) {
      try { setCurrentUser(JSON.parse(savedSession)); } catch (e) { setCurrentUser(null); }
    }
    const savedProfile = localStorage.getItem('student_profile');
    if (savedProfile) {
      try { setStudentProfile(JSON.parse(savedProfile)); } catch (e) { setStudentProfile(null); }
    }
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('dictionary_current_session', JSON.stringify(currentUser));
    else localStorage.removeItem('dictionary_current_session');
  }, [currentUser]);

  useEffect(() => {
    if (studentProfile) localStorage.setItem('student_profile', JSON.stringify(studentProfile));
    else localStorage.removeItem('student_profile');
  }, [studentProfile]);

  const handleLogout = () => {
    localStorage.removeItem('dictionary_current_session');
    localStorage.removeItem('student_profile');
    setCurrentUser(null);
    setStudentProfile(null);
    setIsLogoutModalOpen(false);
    setActiveTab('dictionary');
  };

  const openMemberLogin = () => {
    setLoginIntent('public');
    setIsLoggingIn(true);
  };

  const handleTabChange = (tab: AppTab) => {
    if (!canAccessTab(tab, currentUser)) {
      openMemberLogin();
      return;
    }
    setActiveTab(tab);
  };

  const handleProtectedLandingTab = (tab: AppTab) => {
    if (!canAccessTab(tab, currentUser)) {
      setShowLanding(false);
      openMemberLogin();
      return;
    }
    setShowLanding(false);
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!canAccessTab(activeTab, currentUser)) {
      setActiveTab('dictionary');
    }
  }, [activeTab, currentUser]);

  const handleLoginSuccess = async (p: string, pass: string, intent: 'staff' | 'developer' | 'public', name?: string, isRegistering?: boolean) => {
    const cleanPhone = p.replace(/\D/g, '');
    
    // Developer login logic
    if (intent === 'developer') {
      if (!devConfig) {
        setIsSettingUpDev(true);
        setIsLoggingIn(false);
        return;
      }
      
      if (cleanPhone.endsWith(devConfig.phone.slice(-10)) && pass === devConfig.password) {
        setCurrentUser({ id: cleanPhone, username: cleanPhone, name: devConfig.name, role: 'owner', permissions: { dictionary: true, library: true, gallery: true, songs: true, videos: true, exams: true } });
        setActiveTab('dashboard');
        setIsLoggingIn(false);
        return;
      } else {
        alert("Invalid Developer Credentials.");
        return;
      }
    }

    // Public login/register logic
    if (intent === 'public') {
      try {
        let profile: StudentProfile | null = null;
        
        if (isRegistering && name) {
          profile = await db.students.register(name, cleanPhone, pass);
          if (profile) {
            const updatedUsers = await db.users.fetchAll();
            setRegisteredUsers(updatedUsers);
          }
        } else {
          profile = await db.students.login(cleanPhone, pass);
        }

        if (profile) {
          setStudentProfile(profile);
          setCurrentUser({ id: profile.id, username: profile.phone, name: profile.name, role: 'student' });
          setIsLoggingIn(false);
          setActiveTab('learning');
        } else {
          alert(isRegistering ? "Registration failed. This phone number might already be registered." : "Invalid credentials or account not found.");
        }
      } catch (e: any) {
        console.error("Auth error:", e);
        alert(`Authentication failed: ${e.message || 'Unknown error'}`);
      }
      return;
    }

    // Staff login logic
    const staff = admins.find(a => a.phone.endsWith(cleanPhone.slice(-10)));
    if (staff && staff.password === pass) { 
      setCurrentUser({ id: cleanPhone, username: cleanPhone, name: staff.name, role: 'admin', permissions: staff.permissions }); 
      setActiveTab('dashboard'); 
      setIsLoggingIn(false);
    } else {
      alert("Invalid Credentials. Please check phone and password.");
    }
  };

  const handleDevSetup = async (phone: string, pass: string, name: string) => {
    try {
      await db.devAuth.setup(phone, pass, name);
      setDevConfig({ phone, password: pass, name });
      setIsSettingUpDev(false);
      // Auto login after setup
      setCurrentUser({ id: phone, username: phone, name: name, role: 'owner', permissions: { dictionary: true, library: true, gallery: true, songs: true, videos: true, exams: true } });
      setActiveTab('dashboard');
    } catch (e) {
      alert("Failed to setup Developer credentials.");
    }
  };

  const handleUpdateDevSecurity = async (phone: string, pass: string) => {
    if (!devConfig) return;
    try {
      await db.devAuth.setup(phone, pass, devConfig.name);
      setDevConfig({ ...devConfig, phone, password: pass });
      alert("Developer credentials updated successfully.");
    } catch (e) {
      alert("Update failed.");
    }
  };

  const handleSaveAdmin = async (admin: Admin) => {
    try {
      await db.staff.upsert(admin);
      setAdmins(prev => prev.find(p => p.phone === admin.phone) ? prev.map(p => p.phone === admin.phone ? admin : p) : [...prev, admin]);
    } catch (e) {
      alert("Failed to save staff member.");
    }
  };

  const handleRemoveAdmin = async (phone: string) => {
    try {
      await db.staff.delete(phone);
      setAdmins(prev => prev.filter(a => a.phone !== phone));
    } catch (e) {
      alert("Failed to remove staff member.");
    }
  };

  const handleWordSubmit = async (data: Partial<Word>) => {
    const finalWord = { ...data, id: editingWord?.id || Date.now().toString(), createdAt: editingWord?.createdAt || Date.now(), addedBy: currentUser?.name || 'Owner', category: data.category || 'General' } as Word;
    try { 
      await db.words.upsert(finalWord); 
      setWords(prev => editingWord ? prev.map(w => w.id === finalWord.id ? finalWord : w) : [finalWord, ...prev]); 
      setIsWordModalOpen(false); 
      setEditingWord(undefined); 
    } catch (e) { 
      alert("Save failed."); 
    }
  };

  const handleBookSubmit = async (data: Partial<Book>) => {
    const finalBook = { 
      ...data, 
      id: Date.now().toString(), 
      createdAt: Date.now(), 
      addedBy: currentUser?.name || 'Staff' 
    } as Book;
    try {
      await db.books.upsert(finalBook);
      setBooks(prev => [finalBook, ...prev]);
      setIsBookModalOpen(false);
    } catch (e) {
      alert("Book upload failed.");
    }
  };

  const handleGallerySubmit = async (data: { url: string; caption: string }) => {
    const finalImage = {
      id: Date.now().toString(),
      url: data.url,
      caption: data.caption,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as GalleryImage;
    try {
      await db.gallery.upsert(finalImage);
      setGallery(prev => [finalImage, ...prev]);
      setIsGalleryModalOpen(false);
    } catch (e) {
      alert("Gallery upload failed.");
    }
  };

  const handleSongSubmit = async (data: { title: string; artist: string; audioUrl: string }) => {
    const finalSong = {
      id: Date.now().toString(),
      title: data.title,
      artist: data.artist,
      audioUrl: data.audioUrl,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as Song;
    try {
      await db.songs.upsert(finalSong);
      setSongs(prev => [finalSong, ...prev]);
      setIsSongModalOpen(false);
    } catch (e) {
      alert("Song upload failed.");
    }
  };

  const handleVideoSubmit = async (data: { title: string; youtubeUrl: string }) => {
    const finalVideo = {
      id: Date.now().toString(),
      title: data.title,
      youtubeUrl: data.youtubeUrl,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as Video;
    try {
      await db.videos.upsert(finalVideo);
      setVideos(prev => [finalVideo, ...prev]);
      setIsVideoModalOpen(false);
    } catch (e) {
      alert("Video link failed.");
    }
  };

  const handleArticleSubmit = async (data: Partial<BlogPost>) => {
    const finalArticle = {
      ...data,
      id: editingArticle?.id || Date.now().toString(),
      publishedAt: editingArticle?.publishedAt || Date.now(),
      addedBy: currentUser?.name || 'Staff'
    } as BlogPost;
    try {
      await db.articles.upsert(finalArticle);
      setIsArticleModalOpen(false);
      setEditingArticle(undefined);
      loadCoreData();
    } catch (e) {
      alert("Article save failed.");
    }
  };

  const handleModuleSubmit = async (data: Partial<CourseModule>) => {
    const finalModule = {
      ...data,
      id: editingModule?.id || Date.now().toString(),
      order: data.order || 0
    } as CourseModule;
    try {
      await db.modules.upsert(finalModule);
      setIsModuleModalOpen(false);
      setEditingModule(undefined);
      loadCoreData();
    } catch (e) {
      alert("Module save failed.");
    }
  };

  const handleLessonSubmit = async (data: Partial<Lesson>) => {
    const finalLesson = {
      ...data,
      id: editingLesson?.id || Date.now().toString(),
      moduleId: activeModuleId || '',
      order: data.order || 0
    } as Lesson;
    try {
      await db.lessons.upsert(finalLesson);
      setIsLessonModalOpen(false);
      setEditingLesson(undefined);
      setActiveModuleId(null);
      loadCoreData();
    } catch (e) {
      alert("Lesson save failed.");
    }
  };

  const handleAboutSubmit = async (data: Partial<AboutContent>) => {
    try {
      await db.about.upsert(data as AboutContent);
      setAboutContent(data as AboutContent);
      setIsAboutModalOpen(false);
    } catch (e) {
      alert("About content update failed.");
    }
  };

  const handleSaveWord = async (wordId: string) => {
    if (!studentProfile) {
      setLoginIntent('public');
      setIsLoggingIn(true);
      return;
    }

    const isAlreadySaved = studentProfile.savedWords.some(sw => sw.wordId === wordId);
    let newSavedWords = [...studentProfile.savedWords];

    if (isAlreadySaved) {
      newSavedWords = newSavedWords.filter(sw => sw.wordId !== wordId);
    } else {
      newSavedWords.push({ wordId, savedAt: Date.now() });
    }

    const updatedProfile = { ...studentProfile, savedWords: newSavedWords };
    try {
      await db.students.upsertProfile(updatedProfile);
      setStudentProfile(updatedProfile);
    } catch (e) {
      console.error("Failed to save word:", e);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!studentProfile) return;

    const isAlreadyCompleted = studentProfile.progress.some(p => p.lessonId === lessonId);
    if (isAlreadyCompleted) return;

    const updatedProfile = {
      ...studentProfile,
      progress: [...studentProfile.progress, { lessonId, completedAt: Date.now() }]
    };
    try {
      await db.students.upsertProfile(updatedProfile);
      setStudentProfile(updatedProfile);
    } catch (e) {
      console.error("Failed to update progress:", e);
    }
  };

  const handleDownloadOffline = () => {
    if (!studentProfile) return;
    localStorage.setItem('taihub_offline_words', JSON.stringify(words));
    alert("Word meanings downloaded for offline use! You can now access them even without internet.");
  };

  const canEditDictionary = currentUser?.role === 'owner' || !!currentUser?.permissions?.dictionary;

  if (isDevChecking) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif italic text-ink/60">Initializing TaiHub...</p>
        </div>
      </div>
    );
  }

  if (isSettingUpDev) {
    return (
      <div className="fixed inset-0 z-[300] bg-paper">
        <div className="absolute top-8 right-8 z-10">
          <button 
            onClick={() => setIsSettingUpDev(false)}
            className="p-4 bg-white dark:bg-muted border border-ink/5 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowLeft size={24} className="text-ink" />
          </button>
        </div>
        <DeveloperRegisterPage onSetup={handleDevSetup} />
      </div>
    );
  }

  if (showLanding) {
    return (
      <LandingPage 
        onExplore={() => setShowLanding(false)} 
        onDictionary={() => { setShowLanding(false); setActiveTab('dictionary'); }} 
        onLearning={() => handleProtectedLandingTab('learning')}
        onBlog={() => handleProtectedLandingTab('blog')}
        onEditAbout={() => setIsAboutModalOpen(true)}
        staffRole={currentUser?.role}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-12 bg-paper transition-colors duration-300 selection:bg-ink selection:text-paper">
      <Navbar 
        user={currentUser} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLoginClick={(i) => { setLoginIntent(i); setIsLoggingIn(true); }} 
        onLogout={() => setIsLogoutModalOpen(true)} 
        onSyncClick={() => {}} 
        onMessagesClick={() => setIsMessageModalOpen(true)} 
        isSyncing={isSyncing} 
        isOnline={isOnline} 
        unreadCount={0} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        onHomeClick={() => setShowLanding(true)} 
      />

      {isLoggingIn && (
        <SignInPage 
          onClose={() => setIsLoggingIn(false)} 
          onLogin={handleLoginSuccess} 
          intent={loginIntent} 
          onIntentChange={setLoginIntent}
          devConfig={devConfig}
        />
      )}

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner') && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminPanel 
                user={currentUser} 
                admins={admins} 
                words={words} 
                books={books} 
                photos={gallery} 
                songs={songs} 
                videos={videos} 
                registeredUsers={registeredUsers} 
                stats={{ words: words.length, books: books.length, photos: gallery.length, songs: songs.length, videos: videos.length }} 
                onSaveAdmin={handleSaveAdmin} 
                onRemoveAdmin={handleRemoveAdmin} 
                onAddWord={() => { setEditingWord(undefined); setIsWordModalOpen(true); }} 
                onEditWord={(w) => { setEditingWord(w); setIsWordModalOpen(true); }}
                onDeleteWord={async (id) => { 
                  await db.words.delete(id); 
                  setWords(prev => prev.filter(w => w.id !== id)); 
                }} 
                onAddBook={() => setIsBookModalOpen(true)} 
                onEditBook={() => {}}
                onDeleteBook={async (id) => { 
                  await db.books.delete(id); 
                  setBooks(prev => prev.filter(b => b.id !== id)); 
                }} 
                onAddPhoto={() => setIsGalleryModalOpen(true)} 
                onEditPhoto={() => {}}
                onDeletePhoto={async (id) => { 
                  await db.gallery.delete(id); 
                  setGallery(prev => prev.filter(g => g.id !== id)); 
                }} 
                onAddSong={() => setIsSongModalOpen(true)} 
                onEditSong={() => {}}
                onDeleteSong={async (id) => { 
                  await db.songs.delete(id); 
                  setSongs(prev => prev.filter(s => s.id !== id)); 
                }} 
                onAddVideo={() => setIsVideoModalOpen(true)} 
                onEditVideo={() => {}}
                onDeleteVideo={async (id) => { 
                  await db.videos.delete(id); 
                  setVideos(prev => prev.filter(v => v.id !== id)); 
                }} 
                onUpdateDevCredentials={handleUpdateDevSecurity} 
                currentDevPhone={devConfig?.phone || ''} 
                onDeleteUser={async (id) => { 
                  await db.users.delete(id); 
                  setRegisteredUsers(prev => prev.filter(u => u.id !== id)); 
                }}
                onEditUser={async (user) => { /* Implement user edit if needed */ }}
                onAddArticle={() => { setEditingArticle(undefined); setIsArticleModalOpen(true); }}
                onAddModule={() => { setEditingModule(undefined); setIsModuleModalOpen(true); }}
                onAddLesson={() => { setEditingLesson(undefined); setIsLessonModalOpen(true); }}
                onEditAbout={() => setIsAboutModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'dictionary' && (
            <motion.div 
              key="dictionary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-serif font-bold tracking-tight">Dictionary</h1>
                <p className="text-ink/60 max-w-lg mx-auto">Explore the rich heritage of the Tai language through our digital lexicon.</p>
              </div>

              <div className="space-y-8">
                <SearchBar value={searchQuery} onChange={setSearchQuery} words={words} />
                <WordList 
                  words={words.filter(w => w.english.toLowerCase().includes(searchQuery.toLowerCase()) || w.assamese.includes(searchQuery))} 
                  canEdit={canEditDictionary} 
                  canDelete={currentUser?.role === 'owner'} 
                  onEdit={(w) => {setEditingWord(w); setIsWordModalOpen(true);}} 
                  onDelete={async (id) => { 
                    await db.words.delete(id); 
                    setWords(prev => prev.filter(w => w.id !== id)); 
                  }} 
                  onGenerateImage={async () => {}} 
                  isOnline={isOnline}
                  onSaveWord={handleSaveWord}
                  savedWordIds={studentProfile?.savedWords.map(sw => sw.wordId) || []}
                  isLoggedIn={!!studentProfile || !!currentUser}
                  onLoginRequired={() => { setLoginIntent('public'); setIsLoggingIn(true); }}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'learning' && (
            currentUser ? (
              <motion.div key="learning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="text-center space-y-4 mb-12">
                  <h1 className="text-5xl font-serif font-bold tracking-tight">Academy</h1>
                  <p className="text-ink/60 max-w-lg mx-auto">Master the language through structured lessons and interactive modules.</p>
                </div>
                <LearningCourse 
                  user={currentUser}
                  onLessonComplete={handleLessonComplete} 
                  completedLessonIds={studentProfile?.progress.map(p => p.lessonId) || []} 
                  onAddModule={() => setIsModuleModalOpen(true)}
                  onEditModule={(m) => { setEditingModule(m); setIsModuleModalOpen(true); }}
                  onDeleteModule={async (id) => { 
                    await db.modules.delete(id); 
                    loadCoreData();
                  }}
                  onAddLesson={(mid) => { setActiveModuleId(mid); setIsLessonModalOpen(true); }}
                  onEditLesson={(l) => { setEditingLesson(l); setActiveModuleId(l.moduleId); setIsLessonModalOpen(true); }}
                  onDeleteLesson={async (id) => { 
                    await db.lessons.delete(id); 
                    loadCoreData();
                  }}
                />
              </motion.div>
            ) : (
              <motion.div key="learning-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SignInPage 
                  onLogin={handleLoginSuccess} 
                  onClose={() => setActiveTab('dictionary')} 
                  intent="public" 
                  onIntentChange={setLoginIntent}
                  devConfig={devConfig}
                />
              </motion.div>
            )
          )}

          {activeTab === 'blog' && (
            currentUser ? (
              <motion.div key="blog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="text-center space-y-4 mb-12">
                  <h1 className="text-5xl font-serif font-bold tracking-tight">Media Hub</h1>
                  <p className="text-ink/60 max-w-lg mx-auto">Discover books, songs, videos, and stories from our community.</p>
                </div>
                <BlogSection 
                  books={books}
                  gallery={gallery}
                  songs={songs}
                  videos={videos}
                  user={currentUser}
                  onAddBook={() => setIsBookModalOpen(true)}
                  onDeleteBook={async (id) => { 
                    await db.books.delete(id); 
                    setBooks(prev => prev.filter(b => b.id !== id)); 
                  }}
                  onAddPhoto={() => setIsGalleryModalOpen(true)}
                  onDeletePhoto={async (id) => { 
                    await db.gallery.delete(id); 
                    setGallery(prev => prev.filter(i => i.id !== id)); 
                  }}
                  onAddSong={() => setIsSongModalOpen(true)}
                  onDeleteSong={async (id) => { 
                    await db.songs.delete(id); 
                    setSongs(prev => prev.filter(s => s.id !== id)); 
                  }}
                  onAddVideo={() => setIsVideoModalOpen(true)}
                  onDeleteVideo={async (id) => { 
                    await db.videos.delete(id); 
                    setVideos(prev => prev.filter(v => v.id !== id)); 
                  }}
                  onAddArticle={() => setIsArticleModalOpen(true)}
                  onEditArticle={(a) => { setEditingArticle(a); setIsArticleModalOpen(true); }}
                  onDeleteArticle={async (id) => { 
                    await db.articles.delete(id); 
                    loadCoreData();
                  }}
                />
              </motion.div>
            ) : (
              <motion.div key="blog-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SignInPage 
                  onLogin={handleLoginSuccess} 
                  onClose={() => setActiveTab('dictionary')} 
                  intent="public" 
                  onIntentChange={setLoginIntent}
                  devConfig={devConfig}
                />
              </motion.div>
            )
          )}

          {activeTab === 'profile' && (
            currentUser ? (
              studentProfile ? (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <StudentProfileView 
                    profile={studentProfile} 
                    onUpdateProfile={async (p) => { 
                      await db.students.upsertProfile(p); 
                      setStudentProfile(p); 
                    }} 
                    words={words} 
                    onDownloadOffline={handleDownloadOffline}
                  />
                </motion.div>
              ) : (
                <motion.div key="profile-restricted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <h2 className="text-2xl font-serif font-bold mb-4">Member Account Required</h2>
                  <p className="text-ink/60 mb-8">This section is for community members only. Admin and developers use the Portal.</p>
                  <button onClick={() => setActiveTab('dictionary')} className="heritage-button px-8 py-3">Back to Dictionary</button>
                </motion.div>
              )
            ) : (
              <motion.div key="profile-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SignInPage 
                  onLogin={handleLoginSuccess} 
                  onClose={() => setActiveTab('dictionary')} 
                  intent="public" 
                  onIntentChange={setLoginIntent}
                  devConfig={devConfig}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-muted rounded-[2.5rem] w-full max-w-sm shadow-2xl p-10 text-center space-y-8 border border-ink/5"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-ink">Sign Out</h2>
              <p className="text-ink/60">Are you sure you want to end your session?</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleLogout} className="w-full py-5 bg-ink text-paper rounded-2xl font-bold shadow-lg">Yes, Logout</button>
              <button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-4 text-ink/60 font-bold">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
      {isWordModalOpen && <WordFormModal onClose={() => { setIsWordModalOpen(false); setEditingWord(undefined); }} onSubmit={handleWordSubmit} canDelete={currentUser?.role === 'owner' || false} existingWords={words} isOnline={isOnline} initialData={editingWord} />}
      {isBookModalOpen && <BookFormModal onClose={() => setIsBookModalOpen(false)} onSubmit={handleBookSubmit} />}
      {isGalleryModalOpen && <GalleryFormModal onClose={() => setIsGalleryModalOpen(false)} onSubmit={handleGallerySubmit} />}
      {isSongModalOpen && <SongFormModal onClose={() => setIsSongModalOpen(false)} onSubmit={handleSongSubmit} />}
      {isVideoModalOpen && <VideoFormModal onClose={() => setIsVideoModalOpen(false)} onSubmit={handleVideoSubmit} />}
      {isArticleModalOpen && <ArticleFormModal onClose={() => { setIsArticleModalOpen(false); setEditingArticle(undefined); }} onSubmit={handleArticleSubmit} initialData={editingArticle} />}
      {isModuleModalOpen && <ModuleFormModal onClose={() => { setIsModuleModalOpen(false); setEditingModule(undefined); }} onSubmit={handleModuleSubmit} initialData={editingModule} />}
      {isLessonModalOpen && <LessonFormModal onClose={() => { setIsLessonModalOpen(false); setEditingLesson(undefined); setActiveModuleId(null); }} onSubmit={handleLessonSubmit} initialData={editingLesson} moduleId={activeModuleId || ''} />}
      {isAboutModalOpen && <AboutFormModal onClose={() => setIsAboutModalOpen(false)} onSubmit={handleAboutSubmit} initialData={aboutContent || undefined} />}
      {isMessageModalOpen && currentUser && <MessageModal user={currentUser} onClose={() => setIsMessageModalOpen(false)} />}
      
      {!showLanding && (
        <BottomNav user={currentUser} activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default App;
