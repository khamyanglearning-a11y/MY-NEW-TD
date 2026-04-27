
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Languages, 
  MessageCircle, 
  GraduationCap, 
  PlayCircle, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { CourseModule, Lesson, User } from '../types';
import { db } from '../services/database';

interface LearningCourseProps {
  user: User | null;
  onLessonComplete?: (lessonId: string) => void;
  completedLessonIds?: string[];
  onAddModule: () => void;
  onEditModule: (module: CourseModule) => void;
  onDeleteModule: (id: string) => void;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
}

const LearningCourse: React.FC<LearningCourseProps> = ({ 
  user, onLessonComplete, completedLessonIds = [],
  onAddModule, onEditModule, onDeleteModule,
  onAddLesson, onEditLesson, onDeleteLesson
}) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, l] = await Promise.all([
          db.modules.fetchAll(),
          db.lessons.fetchAll()
        ]);
        setModules(m);
        setLessons(l);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages': return <Languages className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'MessageCircle': return <MessageCircle className="w-6 h-6" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6" />;
      case 'PlayCircle': return <PlayCircle className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
  const isStaff = user?.role === 'owner' || user?.role === 'admin';

  const moduleLessons = selectedModule ? lessons.filter(l => l.moduleId === selectedModule.id).sort((a, b) => a.order - b.order) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {!selectedModule ? (
          <motion.div
            key="modules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="flex justify-between items-end">
              <div className="text-left space-y-4">
                <h1 className="text-5xl font-black text-ink tracking-tighter">Tai Language Course</h1>
                <p className="text-heritage/60 text-lg font-medium max-w-2xl">
                  A structured journey to master the Tai Khamyang language, from basic alphabets to fluent conversations.
                </p>
              </div>
              {isStaff && (
                <button
                  onClick={onAddModule}
                  className="flex items-center gap-2 px-6 py-3 bg-heritage text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-heritage/90 transition-all"
                >
                  <Plus size={18} />
                  Add Module
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-heritage/5 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((module, i) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative"
                  >
                    {isStaff && (
                      <div className="absolute top-6 right-6 z-10 flex gap-2">
                        <button
                          onClick={() => onEditModule(module)}
                          className="p-2 bg-white/90 backdrop-blur-md text-heritage hover:bg-white rounded-xl shadow-sm transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteModule(module.id)}
                          className="p-2 bg-white/90 backdrop-blur-md text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="w-full p-8 rounded-[2.5rem] bg-white border border-heritage/10 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-600/5 transition-all text-left flex flex-col h-full"
                    >
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        {getIcon(module.icon)}
                      </div>
                      <h3 className="text-2xl font-black text-ink mb-3 tracking-tight">{module.title}</h3>
                      <p className="text-heritage/60 font-medium leading-relaxed mb-8 flex-1">{module.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                          {lessons.filter(l => l.moduleId === module.id).length} Lessons
                        </span>
                        <ChevronRight className="w-5 h-5 text-heritage/20 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-heritage/5 rounded-[3rem] border border-dashed border-heritage/20">
                <BookOpen className="w-12 h-12 text-heritage/20 mx-auto mb-4" />
                <h3 className="text-xl font-black text-ink">No modules found</h3>
                <p className="text-heritage/40 font-medium">Developer will add lessons soon.</p>
              </div>
            )}
          </motion.div>
        ) : !selectedLesson ? (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <button 
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-heritage/40 hover:text-ink font-black text-xs uppercase tracking-widest transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </button>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-100">
                  Module
                </div>
                <h2 className="text-5xl font-black text-ink tracking-tighter leading-none">
                  {selectedModule.title}
                </h2>
                <p className="text-xl text-heritage/60 font-medium leading-relaxed">
                  {selectedModule.description}
                </p>
              </div>

              <div className="w-full md:w-[450px] space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-heritage/40 uppercase tracking-[0.3em]">Curriculum</h3>
                  {isStaff && (
                    <button
                      onClick={() => onAddLesson(selectedModule.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all"
                    >
                      <Plus size={14} />
                      Add Lesson
                    </button>
                  )}
                </div>
                {moduleLessons.length > 0 ? (
                  moduleLessons.map((lesson, i) => (
                    <div key={lesson.id} className="relative group">
                      {isStaff && (
                        <div className="absolute top-4 right-12 z-10 flex gap-2">
                          <button
                            onClick={() => onEditLesson(lesson)}
                            className="p-1.5 bg-white/90 backdrop-blur-md text-heritage hover:bg-white rounded-lg shadow-sm transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => onDeleteLesson(lesson.id)}
                            className="p-1.5 bg-white/90 backdrop-blur-md text-red-500 hover:bg-white rounded-lg shadow-sm transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="w-full p-6 rounded-3xl bg-white border border-heritage/10 hover:border-blue-200 hover:shadow-xl transition-all text-left flex items-center gap-6"
                      >
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-ink leading-tight">{lesson.title}</h4>
                          <p className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest mt-1">
                            {lesson.videoUrl ? 'Video Lesson' : 'Text Content'}
                          </p>
                        </div>
                        {completedLessonIds.includes(lesson.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-heritage/20 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-heritage/5 rounded-3xl border border-dashed border-heritage/20">
                    <p className="text-heritage/40 font-medium text-sm">No lessons in this module yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <button 
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-heritage/40 hover:text-ink font-black text-xs uppercase tracking-widest transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Module
            </button>

            <div className="bg-white rounded-[3rem] border border-heritage/10 overflow-hidden shadow-2xl">
              {selectedLesson.videoUrl && (
                <div className="aspect-video bg-ink">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedLesson.videoUrl} 
                    title={selectedLesson.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <div className="p-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
                      Lesson {selectedLesson.order}
                    </span>
                    <span className="text-heritage/20">•</span>
                    <span className="text-[10px] font-black text-heritage/40 uppercase tracking-widest">
                      {selectedModule.title}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-ink tracking-tighter">
                    {selectedLesson.title}
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none text-heritage/70 font-medium leading-relaxed">
                  {selectedLesson.content}
                </div>

                <div className="pt-12 border-t border-heritage/10 flex items-center justify-between">
                  <button 
                    onClick={() => onLessonComplete?.(selectedLesson.id)}
                    className={cn(
                      "flex items-center gap-3 transition-all",
                      completedLessonIds.includes(selectedLesson.id) ? "text-emerald-600" : "text-heritage/20 hover:text-emerald-600"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest">
                      {completedLessonIds.includes(selectedLesson.id) ? 'Lesson Completed' : 'Mark as Complete'}
                    </span>
                  </button>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedLesson(null)}
                      className="px-6 py-3 bg-white border border-heritage/10 text-heritage rounded-xl font-bold text-sm hover:bg-heritage/10 transition-all"
                    >
                      Previous
                    </button>
                    <button 
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningCourse;
