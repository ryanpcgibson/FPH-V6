import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase_types';

const supabaseUrl: string = import.meta.env.VITE_APP_SUPABASE_URL!;
const supabaseAnonKey: string = import.meta.env.VITE_APP_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
