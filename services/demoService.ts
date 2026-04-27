
import { Word, Book, GalleryImage, Song, Video, Admin, StudentProfile, StudentRequest, BlogPost, CourseModule, Lesson, AboutContent, Message } from '../types';
import { INITIAL_WORDS } from '../constants';

const STORAGE_KEYS = {
  WORDS: 'taihub_demo_words',
  BOOKS: 'taihub_demo_books',
  GALLERY: 'taihub_demo_gallery',
  SONGS: 'taihub_demo_songs',
  VIDEOS: 'taihub_demo_videos',
  STAFF: 'taihub_demo_staff',
  USERS: 'taihub_demo_users',
  ARTICLES: 'taihub_demo_articles',
  MODULES: 'taihub_demo_modules',
  LESSONS: 'taihub_demo_lessons',
  ABOUT: 'taihub_demo_about',
  MESSAGES: 'taihub_demo_messages',
  REQUESTS: 'taihub_demo_requests',
  DEV_AUTH: 'taihub_demo_dev_auth'
};

const getLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const demoDb = {
  devAuth: {
    async get() {
      return getLocal(STORAGE_KEYS.DEV_AUTH, { phone: '6901543900', password: '9365', name: 'Developer' });
    },
    async setup(phone: string, pass: string, name: string) {
      setLocal(STORAGE_KEYS.DEV_AUTH, { phone, password: pass, name });
    }
  },
  words: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.WORDS, INITIAL_WORDS);
    },
    async upsert(word: Word) {
      const words = await this.fetchAll();
      const index = words.findIndex(w => w.id === word.id);
      if (index >= 0) words[index] = word;
      else words.unshift(word);
      setLocal(STORAGE_KEYS.WORDS, words);
    },
    async delete(id: string) {
      const words = await this.fetchAll();
      setLocal(STORAGE_KEYS.WORDS, words.filter(w => w.id !== id));
    }
  },
  staff: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.STAFF, []);
    },
    async upsert(admin: Admin) {
      const staff = await this.fetchAll();
      const index = staff.findIndex(s => s.phone === admin.phone);
      if (index >= 0) staff[index] = admin;
      else staff.push(admin);
      setLocal(STORAGE_KEYS.STAFF, staff);
    },
    async delete(phone: string) {
      const staff = await this.fetchAll();
      setLocal(STORAGE_KEYS.STAFF, staff.filter(s => s.phone !== phone));
    }
  },
  books: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.BOOKS, []);
    },
    async upsert(book: Book) {
      const books = await this.fetchAll();
      const index = books.findIndex(b => b.id === book.id);
      if (index >= 0) books[index] = book;
      else books.unshift(book);
      setLocal(STORAGE_KEYS.BOOKS, books);
    },
    async delete(id: string) {
      const books = await this.fetchAll();
      setLocal(STORAGE_KEYS.BOOKS, books.filter(b => b.id !== id));
    }
  },
  gallery: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.GALLERY, []);
    },
    async upsert(img: GalleryImage) {
      const gallery = await this.fetchAll();
      const index = gallery.findIndex(g => g.id === img.id);
      if (index >= 0) gallery[index] = img;
      else gallery.unshift(img);
      setLocal(STORAGE_KEYS.GALLERY, gallery);
    },
    async delete(id: string) {
      const gallery = await this.fetchAll();
      setLocal(STORAGE_KEYS.GALLERY, gallery.filter(g => g.id !== id));
    }
  },
  songs: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.SONGS, []);
    },
    async upsert(song: Song) {
      const songs = await this.fetchAll();
      const index = songs.findIndex(s => s.id === song.id);
      if (index >= 0) songs[index] = song;
      else songs.unshift(song);
      setLocal(STORAGE_KEYS.SONGS, songs);
    },
    async delete(id: string) {
      const songs = await this.fetchAll();
      setLocal(STORAGE_KEYS.SONGS, songs.filter(s => s.id !== id));
    }
  },
  videos: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.VIDEOS, []);
    },
    async upsert(video: Video) {
      const videos = await this.fetchAll();
      const index = videos.findIndex(v => v.id === video.id);
      if (index >= 0) videos[index] = video;
      else videos.unshift(video);
      setLocal(STORAGE_KEYS.VIDEOS, videos);
    },
    async delete(id: string) {
      const videos = await this.fetchAll();
      setLocal(STORAGE_KEYS.VIDEOS, videos.filter(v => v.id !== id));
    }
  },
  users: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.USERS, []);
    },
    async upsert(user: StudentProfile) {
      const users = await this.fetchAll();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) users[index] = user;
      else users.push(user);
      setLocal(STORAGE_KEYS.USERS, users);
    },
    async delete(id: string) {
      const users = await this.fetchAll();
      setLocal(STORAGE_KEYS.USERS, users.filter(u => u.id !== id));
    }
  },
  articles: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.ARTICLES, []);
    },
    async upsert(article: BlogPost) {
      const articles = await this.fetchAll();
      const index = articles.findIndex(a => a.id === article.id);
      if (index >= 0) articles[index] = article;
      else articles.unshift(article);
      setLocal(STORAGE_KEYS.ARTICLES, articles);
    },
    async delete(id: string) {
      const articles = await this.fetchAll();
      setLocal(STORAGE_KEYS.ARTICLES, articles.filter(a => a.id !== id));
    }
  },
  modules: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.MODULES, []);
    },
    async upsert(module: CourseModule) {
      const modules = await this.fetchAll();
      const index = modules.findIndex(m => m.id === module.id);
      if (index >= 0) modules[index] = module;
      else modules.push(module);
      setLocal(STORAGE_KEYS.MODULES, modules);
    },
    async delete(id: string) {
      const modules = await this.fetchAll();
      setLocal(STORAGE_KEYS.MODULES, modules.filter(m => m.id !== id));
    }
  },
  lessons: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.LESSONS, []);
    },
    async upsert(lesson: Lesson) {
      const lessons = await this.fetchAll();
      const index = lessons.findIndex(l => l.id === lesson.id);
      if (index >= 0) lessons[index] = lesson;
      else lessons.push(lesson);
      setLocal(STORAGE_KEYS.LESSONS, lessons);
    },
    async delete(id: string) {
      const lessons = await this.fetchAll();
      setLocal(STORAGE_KEYS.LESSONS, lessons.filter(l => l.id !== id));
    }
  },
  about: {
    async get() {
      return getLocal(STORAGE_KEYS.ABOUT, null);
    },
    async upsert(content: AboutContent) {
      setLocal(STORAGE_KEYS.ABOUT, content);
    }
  },
  studentRequests: {
    async fetchAll() {
      return getLocal(STORAGE_KEYS.REQUESTS, []);
    },
    async upsert(request: StudentRequest) {
      const requests = await this.fetchAll();
      const index = requests.findIndex(r => r.id === request.id);
      if (index >= 0) requests[index] = request;
      else requests.unshift(request);
      setLocal(STORAGE_KEYS.REQUESTS, requests);
    }
  },
  students: {
    async getProfile(phone: string) {
      const users = getLocal<StudentProfile[]>(STORAGE_KEYS.USERS, []);
      return users.find(u => u.phone === phone) || null;
    },
    async login(phone: string, pass: string) {
      const users = getLocal<StudentProfile[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.phone === phone);
      if (user && user.password === pass) return user;
      return null;
    },
    async register(name: string, phone: string, pass: string) {
      const id = Date.now().toString();
      const newUser: StudentProfile = {
        id,
        name,
        phone,
        password: pass,
        joinedAt: Date.now(),
        savedWords: [],
        progress: [],
        address: 'Demo Student'
      };
      const users = getLocal<StudentProfile[]>(STORAGE_KEYS.USERS, []);
      users.push(newUser);
      setLocal(STORAGE_KEYS.USERS, users);
      return newUser;
    },
    async upsertProfile(profile: StudentProfile) {
      const users = getLocal<StudentProfile[]>(STORAGE_KEYS.USERS, []);
      const index = users.findIndex(u => u.id === profile.id);
      if (index >= 0) users[index] = profile;
      else users.push(profile);
      setLocal(STORAGE_KEYS.USERS, users);
    }
  },
  messages: {
    async fetchForUser(userId: string) {
      const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
      return all.filter(m => m.receiverId === userId || m.senderId === userId);
    },
    async send(msg: Message) {
      const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
      all.push(msg);
      setLocal(STORAGE_KEYS.MESSAGES, all);
    },
    async markAsRead(msgId: string) {
      const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
      const index = all.findIndex(m => m.id === msgId);
      if (index >= 0) {
        all[index].isRead = true;
        all[index].status = 'seen';
        setLocal(STORAGE_KEYS.MESSAGES, all);
      }
    }
  }
};
