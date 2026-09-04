import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// The secret key that allows reading guestbook entries (only the owner knows this)
export const GUESTBOOK_KEY = 'nee-ennoda-sita-na-unnoda-ram';

// Separate client with the owner key header baked in — used only for reading guestbook entries.
// The RLS SELECT policy checks request.headers for this key.
export const supabaseOwner = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'x-guestbook-key': GUESTBOOK_KEY },
  },
});
