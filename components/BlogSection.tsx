
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ArrowRight, ArrowLeft, Share2, Bookmark, BookOpen, Image as ImageIcon, Music, Tv, Newspaper, Plus, Edit2, Trash2 } from 'lucide-react';
import { BlogPost, Book, GalleryImage, Song, Video, User } from '../types';
import { db } from '../services/database';
import BookSection from './BookSection';
import GallerySection from './GallerySection';
import SongSection from './SongSection';
import VideoSection from './VideoSection';

interface BlogSectionProps {
  books: Book[];
  gallery: GalleryImage[];
  songs: Song[];
  videos: Video[];
  user: User | null;
  onAddBook: () => void;
  onDeleteBook: (id: string) => void;
  onAddPhoto: () => void;
  onDeletePhoto: (id: string) => void;
  onAddSong: () => void;
  onDeleteSong: (id: string) => void;
  onAddVideo: () => void;
  onDeleteVideo: (id: string) => void;
  onAddArticle: () => void;
  onEditArticle: (article: BlogPost) => void;
  onDeleteArticle: (id: string) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ 
  books, gallery, songs, videos, user,
  onAddBook, onDeleteBook, onAddPhoto, onDeletePhoto, onAddSong, onDeleteSong, onAddVideo, onDeleteVideo,
  onAddArticle, onEditArticle, onDeleteArticle
}) => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'library' | 'gallery' | 'songs' | 'videos'>('articles');
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await db.articles.fetchAll();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = ['All', 'Culture', 'Language', 'History', 'News'];
  const filteredPosts = filter === 'All' ? articles : articles.filter(p => p.category === filter);

  const subTabs = [
    { id: 'articles', label: 'Articles', icon: <Newspaper size={18} /> },
    { id: 'library', label: 'Library', icon: <BookOpen size={18} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'songs', label: 'Music', icon: <Music size={18} /> },
    { id: 'videos', label: 'TV', icon: <Tv size={18} /> }
  ];

  const isStaff = user?.role === 'owner' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tighter">Media & Heritage Blog</h1>
            <p className="text-heritage/60 text-lg font-medium max-w-xl">
              Explore our digital archives, articles, and multimedia heritage.
            </p>
          </div>
          {isStaff && activeSubTab === 'articles' && (
            <button
              onClick={onAddArticle}
              className="flex items-center gap-2 px-6 py-3 bg-heritage text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-heritage/90 transition-all"
            >
              <Plus size={18} />
              Add Article
            </button>
          )}
        </div>

        <div className="flex gap-2 bg-white border border-heritage/10 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveSubTab(tab.id as any); setSelectedPost(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-heritage text-white shadow-lg' : 'text-heritage/40 hover:text-heritage hover:bg-white border border-transparent hover:border-heritage/10'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'articles' ? (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {!selectedPost ? (
              <div className="space-y-12">
                <div className="flex justify-start">
                  <div className="flex gap-2 bg-white border border-heritage/10 p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-sm">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-white text-heritage shadow-sm' : 'text-heritage/40 hover:text-heritage'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-96 bg-heritage/5 rounded-[2.5rem] animate-pulse" />
                    ))}
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPosts.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col bg-white rounded-[2.5rem] border border-heritage/10 overflow-hidden hover:shadow-2xl hover:shadow-heritage/5 transition-all relative"
                      >
                        {isStaff && (
                          <div className="absolute top-6 right-6 z-10 flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); onEditArticle(post); }}
                              className="p-2 bg-white/90 backdrop-blur-md text-heritage hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteArticle(post.id); }}
                              className="p-2 bg-white/90 backdrop-blur-md text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img 
                            src={post.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800"} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-6 left-6">
                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-heritage uppercase tracking-widest shadow-sm">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-[10px] font-bold text-heritage/40 uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                          </div>
                          
                          <h3 className="text-2xl font-black text-ink mb-4 tracking-tight leading-tight group-hover:text-heritage transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-heritage/60 font-medium leading-relaxed mb-8 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <button 
                            onClick={() => setSelectedPost(post)}
                            className="mt-auto flex items-center gap-2 text-heritage font-black text-xs uppercase tracking-widest group/btn"
                          >
                            Read Article
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-heritage/5 rounded-[3rem] border border-dashed border-heritage/20">
                    <Newspaper className="w-12 h-12 text-heritage/20 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-ink">No articles found</h3>
                    <p className="text-heritage/40 font-medium">Developer will add content soon.</p>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                key="post"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-heritage/40 hover:text-ink font-black text-xs uppercase tracking-widest transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </button>

                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-heritage/10 text-heritage rounded-full text-[10px] font-black uppercase tracking-widest border border-heritage/20">
                        {selectedPost.category}
                      </span>
                      <span className="text-heritage/20">•</span>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-heritage/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {selectedPost.readTime}</span>
                      </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-ink tracking-tighter leading-[1.1]">
                      {selectedPost.title}
                    </h1>

                    <div className="flex items-center justify-between py-6 border-y border-heritage/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-heritage/10 rounded-full flex items-center justify-center text-heritage font-black">
                          {selectedPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-ink uppercase tracking-widest">{selectedPost.author}</p>
                          <p className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest">Contributor</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-3 bg-white text-heritage hover:bg-white border border-heritage/10 rounded-2xl transition-all shadow-sm"><Share2 className="w-5 h-5" /></button>
                        <button className="p-3 bg-white text-heritage hover:bg-white border border-heritage/10 rounded-2xl transition-all shadow-sm"><Bookmark className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img 
                      src={selectedPost.imageUrl} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="prose prose-xl max-w-none text-heritage/70 font-medium leading-relaxed space-y-8">
                    {selectedPost.content.split('\n\n').map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>

                  <div className="pt-12 border-t border-heritage/10">
                    <div className="bg-white border border-heritage/10 rounded-[3rem] p-12 text-center space-y-6 shadow-sm">
                      <h4 className="text-2xl font-black text-ink">Enjoyed this article?</h4>
                      <p className="text-heritage/60 font-medium">Join our newsletter to get the latest cultural insights delivered to your inbox.</p>
                      <div className="flex max-w-md mx-auto gap-3">
                        <input type="email" placeholder="your@email.com" className="flex-1 px-6 py-4 bg-white border-transparent rounded-2xl font-bold focus:border-heritage border-2 transition-all outline-none" />
                        <button className="px-8 py-4 bg-heritage text-white rounded-2xl font-black text-sm shadow-lg shadow-heritage/20 hover:bg-heritage/90 transition-all">Subscribe</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : activeSubTab === 'library' ? (
          <motion.div key="library" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <BookSection books={books} user={user} onAddClick={onAddBook} onEditClick={() => {}} onDeleteClick={onDeleteBook} />
          </motion.div>
        ) : activeSubTab === 'gallery' ? (
          <motion.div key="gallery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GallerySection images={gallery} user={user} onAddClick={onAddPhoto} onDeleteClick={onDeletePhoto} />
          </motion.div>
        ) : activeSubTab === 'songs' ? (
          <motion.div key="songs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SongSection songs={songs} user={user} onAddClick={onAddSong} onDeleteClick={onDeleteSong} />
          </motion.div>
        ) : (
          <motion.div key="videos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <VideoSection videos={videos} user={user} onAddClick={onAddVideo} onDeleteClick={onDeleteVideo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSection;
