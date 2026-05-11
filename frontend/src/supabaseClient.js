import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config Debug:", {
  url: supabaseUrl ? "✓ URL set" : "✗ URL NOT set",
  key: supabaseAnonKey ? "✓ Key set" : "✗ Key NOT set",
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase environment variables are NOT set!\n" +
    "Please create a .env file in the frontend folder with:\n" +
    "VITE_SUPABASE_URL=your_project_url\n" +
    "VITE_SUPABASE_ANON_KEY=your_anon_key\n" +
    "Then restart the dev server: npm run dev"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: false, // session tidak disimpan, harus login ulang tiap buka browser
  },
});