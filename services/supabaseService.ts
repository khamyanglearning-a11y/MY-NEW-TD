
import { createClient } from '@supabase/supabase-js';
import { Word, PublicUser, StudentRequest, Book, GalleryImage, Song, Video, Admin, StudentProfile, SavedWord, LessonProgress } from '../types';

const SUPABASE_URL = 'https://sdpujzkddvzbcmmqzrww.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcHVqemtkZHZ6YmNtbXF6cnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzA4MTksImV4cCI6MjA5MDQ0NjgxOX0.Ook9Okhvp1zIsn82B2XerK6y_Tk7ede6VDmeHyBVyYI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  devAuth: {
    async get() {
      const { data, error } = await supabase.from('dev_auth').select('*').eq('id', 'primary_dev').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    async setup(phone: string, pass: string, name: string) {
      const { error } = await supabase.from('dev_auth').upsert({
        id: 'primary_dev',
        phone,
        password: pass,
        name,
        created_at: new Date().toISOString()
      });
      if (error) throw error;
    }
  },
  words: {
    async fetchAll() {
      const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(w => ({
        id: w.id,
        english: w.english,
        assamese: w.assamese,
        taiKhamyang: w.tai_khamyang,
        additionalLang: w.additional_lang,
        pronunciation: w.pronunciation,
        exampleSentence: w.example_sentence,
        sentenceMeaning: w.sentence_meaning,
        category: w.category,
        imageUrl: w.image_url,
        audioUrl: w.audio_url,
        createdAt: w.created_at,
        addedBy: w.added_by
      })) as Word[];
    },
    async upsert(word: Word) {
      const { error } = await supabase.from('words').upsert({
        id: word.id,
        english: word.english,
        assamese: word.assamese,
        tai_khamyang: word.taiKhamyang,
        additional_lang: word.additionalLang,
        pronunciation: word.pronunciation,
        example_sentence: word.exampleSentence,
        sentence_meaning: word.sentenceMeaning,
        category: word.category,
        image_url: word.imageUrl,
        audio_url: word.audioUrl,
        created_at: word.createdAt,
        added_by: word.addedBy
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('words').delete().eq('id', id);
      if (error) throw error;
    }
  },
  staff: {
    async fetchAll() {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) throw error;
      return (data || []).map(s => ({
        name: s.name,
        phone: s.phone,
        password: s.password,
        permissions: s.permissions
      })) as Admin[];
    },
    async upsert(admin: Admin) {
      const { error } = await supabase.from('staff').upsert({
        phone: admin.phone,
        name: admin.name,
        password: admin.password,
        permissions: admin.permissions
      });
      if (error) throw error;
    },
    async delete(phone: string) {
      const { error } = await supabase.from('staff').delete().eq('phone', phone);
      if (error) throw error;
    }
  },
  books: {
    async fetchAll() {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        description: b.description,
        pdfUrl: b.pdf_url,
        addedBy: b.added_by,
        createdAt: b.created_at
      })) as Book[];
    },
    async upsert(book: Book) {
      const { error } = await supabase.from('books').upsert({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        pdf_url: book.pdfUrl,
        added_by: book.addedBy,
        created_at: book.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    }
  },
  gallery: {
    async fetchAll() {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(g => ({
        id: g.id,
        url: g.url,
        caption: g.caption,
        addedBy: g.added_by,
        createdAt: g.created_at
      })) as GalleryImage[];
    },
    async upsert(img: GalleryImage) {
      const { error } = await supabase.from('gallery').upsert({
        id: img.id,
        url: img.url,
        caption: img.caption,
        added_by: img.addedBy,
        created_at: img.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    }
  },
  songs: {
    async fetchAll() {
      const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        audioUrl: s.audio_url,
        addedBy: s.added_by,
        createdAt: s.created_at
      })) as Song[];
    },
    async upsert(song: Song) {
      const { error } = await supabase.from('songs').upsert({
        id: song.id,
        title: song.title,
        artist: song.artist,
        audio_url: song.audioUrl,
        added_by: song.addedBy,
        created_at: song.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
    }
  },
  videos: {
    async fetchAll() {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(v => ({
        id: v.id,
        title: v.title,
        youtubeUrl: v.youtube_url,
        addedBy: v.added_by,
        createdAt: v.created_at
      })) as Video[];
    },
    async upsert(video: Video) {
      const { error } = await supabase.from('videos').upsert({
        id: video.id,
        title: video.title,
        youtube_url: video.youtubeUrl,
        added_by: video.addedBy,
        created_at: video.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    }
  },
  users: {
    async fetchAll() {
      const { data, error } = await supabase.from('community_users').select('*').order('registered_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(u => ({
        id: u.id,
        name: u.name,
        address: u.address,
        phone: u.phone,
        password: u.password,
        joinedAt: u.registered_at,
        avatarUrl: u.avatar_url,
        email: u.email,
        savedWords: u.saved_words || [],
        progress: u.progress || []
      })) as StudentProfile[];
    },
    async upsert(user: StudentProfile) {
      const { error } = await supabase.from('community_users').upsert({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar_url: user.avatarUrl,
        saved_words: user.savedWords,
        progress: user.progress,
        registered_at: user.joinedAt,
        address: user.address,
        password: user.password
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('community_users').delete().eq('id', id);
      if (error) throw error;
    }
  },
  articles: {
    async fetchAll() {
      const { data, error } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        author: a.author,
        category: a.category,
        publishedAt: a.published_at,
        imageUrl: a.image_url,
        readTime: a.read_time,
        addedBy: a.added_by
      }));
    },
    async upsert(article: any) {
      const { error } = await supabase.from('articles').upsert({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        published_at: article.publishedAt,
        image_url: article.imageUrl,
        read_time: article.readTime,
        added_by: article.addedBy
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    }
  },
  lessons: {
    async fetchAll() {
      const { data, error } = await supabase.from('lessons').select('*').order('order', { ascending: true });
      if (error) throw error;
      return (data || []).map(l => ({
        id: l.id,
        title: l.title,
        content: l.content,
        videoUrl: l.video_url,
        order: l.order,
        moduleId: l.module_id
      }));
    },
    async upsert(lesson: any) {
      const { error } = await supabase.from('lessons').upsert({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.videoUrl,
        order: lesson.order,
        module_id: lesson.moduleId
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
    }
  },
  modules: {
    async fetchAll() {
      const { data, error } = await supabase.from('course_modules').select('*').order('order', { ascending: true });
      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        icon: m.icon,
        order: m.order
      }));
    },
    async upsert(module: any) {
      const { error } = await supabase.from('course_modules').upsert({
        id: module.id,
        title: module.title,
        description: module.description,
        icon: module.icon,
        order: module.order
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('course_modules').delete().eq('id', id);
      if (error) throw error;
    }
  },
  about: {
    async get() {
      const { data, error } = await supabase.from('about_content').select('*').eq('id', 'main_about').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        updatedAt: data.updated_at,
        updatedBy: data.updated_by
      };
    },
    async upsert(content: any) {
      const { error } = await supabase.from('about_content').upsert({
        id: 'main_about',
        title: content.title,
        description: content.description,
        image_url: content.imageUrl,
        updated_at: Date.now(),
        updated_by: content.updatedBy
      });
      if (error) throw error;
    }
  },
  messages: {
    async fetchForUser(userId: string) {
      const { data, error } = await supabase.from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('timestamp', { ascending: true });
      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        senderName: m.sender_name,
        text: m.text,
        timestamp: m.timestamp,
        status: m.status,
        isRead: m.is_read
      }));
    },
    async send(msg: any) {
      const { error } = await supabase.from('messages').insert({
        id: Date.now().toString(),
        sender_id: msg.senderId,
        receiver_id: msg.receiverId,
        sender_name: msg.senderName,
        text: msg.text,
        timestamp: Date.now(),
        status: 'sent',
        is_read: false
      });
      if (error) throw error;
    },
    async markAsRead(msgId: string) {
      const { error } = await supabase.from('messages').update({ is_read: true, status: 'seen' }).eq('id', msgId);
      if (error) throw error;
    }
  },
  studentRequests: {
    async fetchAll() {
      const { data, error } = await supabase.from('student_requests').select('*').order('requested_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        password: r.password,
        email: r.email,
        address: r.address,
        photoUrl: r.photo_url,
        status: r.status,
        requestedAt: r.requested_at,
        canAccessExam: r.can_access_exam
      })) as StudentRequest[];
    },
    async upsert(request: StudentRequest) {
      const { error } = await supabase.from('student_requests').upsert({
        id: request.id,
        name: request.name,
        phone: request.phone,
        password: request.password,
        email: request.email,
        address: request.address,
        photo_url: request.photoUrl,
        status: request.status,
        requested_at: request.requestedAt,
        can_access_exam: request.canAccessExam
      });
      if (error) throw error;
    }
  },
  students: {
    async getProfile(phone: string) {
      const { data, error } = await supabase.from('community_users').select('*').eq('phone', phone).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        avatarUrl: data.avatar_url,
        savedWords: data.saved_words || [],
        progress: data.progress || [],
        joinedAt: data.registered_at || data.joined_at
      } as StudentProfile;
    },
    async upsertProfile(profile: StudentProfile) {
      const { error } = await supabase.from('community_users').upsert({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        saved_words: profile.savedWords,
        progress: profile.progress,
        registered_at: profile.joinedAt
      });
      if (error) {
        // Fallback: try without extra fields if they don't exist
        const { error: fallbackError } = await supabase.from('community_users').upsert({
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          registered_at: profile.joinedAt
        });
        if (fallbackError) throw fallbackError;
      }
    },
    async login(phone: string, pass: string) {
      const { data, error } = await supabase.from('community_users').select('*').eq('phone', phone).single();
      if (error) return null;
      if (data && data.password === pass) {
        return {
          id: data.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          avatarUrl: data.avatar_url,
          savedWords: data.saved_words || [],
          progress: data.progress || [],
          joinedAt: data.registered_at || data.joined_at
        } as StudentProfile;
      }
      return null;
    },
    async register(name: string, phone: string, pass: string) {
      const id = Date.now().toString();
      const { error } = await supabase.from('community_users').insert({
        id,
        name,
        phone,
        password: pass,
        registered_at: Date.now(),
        address: 'Student Member'
      });
      if (error) throw error;
      return { id, name, phone, joinedAt: Date.now(), savedWords: [], progress: [] } as StudentProfile;
    }
  }
};
