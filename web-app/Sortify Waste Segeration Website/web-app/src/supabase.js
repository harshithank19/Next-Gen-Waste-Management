// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// ✅ Read from environment (defined in .env.local or .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase environment variables are missing. Check your .env file!");
}

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: helpful debug log
console.log("✅ Supabase client initialized:", supabaseUrl);
