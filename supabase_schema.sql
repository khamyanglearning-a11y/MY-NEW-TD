-- Run this in your Supabase SQL Editor

-- 1. dev_auth table
CREATE TABLE IF NOT EXISTS dev_auth (
    id TEXT PRIMARY KEY,
    phone TEXT,
    password TEXT,
    name TEXT
);

-- 2. words (Dictionary)
CREATE TABLE IF NOT EXISTS words (
    id TEXT PRIMARY KEY,
    english TEXT,
    assamese TEXT,
    tai_khamyang TEXT,
    additional_lang TEXT,
    pronunciation TEXT,
    example_sentence TEXT,
    sentence_meaning TEXT,
    category TEXT,
    added_by TEXT,
    created_at BIGINT,
    image_url TEXT,
    audio_url TEXT,
    is_offline_ready BOOLEAN DEFAULT FALSE
);

-- 3. staff (Admins)
CREATE TABLE IF NOT EXISTS staff (
    phone TEXT PRIMARY KEY,
    name TEXT,
    password TEXT,
    permissions JSONB
);

-- 4. books (Library)
CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT,
    author TEXT,
    description TEXT,
    pdf_url TEXT,
    added_by TEXT,
    created_at BIGINT
);

-- 5. gallery
CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT,
    caption TEXT,
    added_by TEXT,
    created_at BIGINT
);

-- 6. songs
CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT,
    artist TEXT,
    audio_url TEXT,
    added_by TEXT,
    created_at BIGINT
);

-- 7. videos
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT,
    youtube_url TEXT,
    added_by TEXT,
    created_at BIGINT
);

-- 8. community_users (Students/Users)
CREATE TABLE IF NOT EXISTS community_users (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    password TEXT,
    email TEXT,
    address TEXT,
    avatar_url TEXT,
    saved_words JSONB DEFAULT '[]'::jsonb,
    progress JSONB DEFAULT '[]'::jsonb,
    joined_at BIGINT,
    registered_at BIGINT
);

-- 9. articles (Blog)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    category TEXT,
    published_at BIGINT,
    image_url TEXT,
    read_time TEXT,
    added_by TEXT
);

-- 10. lessons (Learning)
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    video_url TEXT,
    "order" INTEGER,
    module_id TEXT
);

-- 11. course_modules
CREATE TABLE IF NOT EXISTS course_modules (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    icon TEXT,
    "order" INTEGER
);

-- 12. about_content
CREATE TABLE IF NOT EXISTS about_content (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT,
    updated_at BIGINT,
    updated_by TEXT
);

-- 13. messages
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    receiver_id TEXT,
    sender_name TEXT,
    text TEXT,
    timestamp BIGINT,
    status TEXT,
    is_read BOOLEAN DEFAULT FALSE
);

-- 14. student_requests
CREATE TABLE IF NOT EXISTS student_requests (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    password TEXT,
    email TEXT,
    address TEXT,
    photo_url TEXT,
    status TEXT,
    requested_at BIGINT,
    can_access_exam BOOLEAN DEFAULT FALSE
);

-- Disable RLS for all tables to make it work immediately (Hardening recommended later)
ALTER TABLE dev_auth DISABLE ROW LEVEL SECURITY;
ALTER TABLE words DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE about_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_requests DISABLE ROW LEVEL SECURITY;

-- Insert the developer account
INSERT INTO dev_auth (id, phone, password, name) 
VALUES ('primary_dev', '6901543900', '9365', 'Developer')
ON CONFLICT (id) DO UPDATE SET phone = EXCLUDED.phone, password = EXCLUDED.password;
