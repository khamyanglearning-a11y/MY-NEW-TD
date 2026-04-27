
import { db as supabaseDb } from './supabaseService';
import { demoDb } from './demoService';

// Set this to true to use the local demo database (localStorage)
// Set to false to use the real Supabase database
export const DEMO_MODE = false;

export const db = DEMO_MODE ? demoDb : supabaseDb;
