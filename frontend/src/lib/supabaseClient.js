import { createClient } from '@supabase/supabase-js';
import { getRedirectURL } from '../util/authUtils.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    redirectTo: getRedirectURL(),
  },
});