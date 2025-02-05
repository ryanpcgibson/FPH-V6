import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase_types";

const supabaseUrl: string = import.meta.env.VITE_APP_SUPABASE_URL!;
const supabaseAnonKey: string = import.meta.env.VITE_APP_SUPABASE_ANON_KEY!;
const supabaseProjectId = supabaseUrl.replace("https://", "").split(".")[0];

export const supabaseStorageURL = `https://${supabaseProjectId}.supabase.co/storage/v1/upload/resumable`;
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
