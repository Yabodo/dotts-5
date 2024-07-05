import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const useSupabaseClient = () => {
  if (supabase) return supabase;

  const runtimeConfig = useRuntimeConfig();
  const supabaseUrl = runtimeConfig.public.SUPABASE_PUBLIC_API_BASE;
  const supabaseKey = runtimeConfig.public.SUPABASE_PUBLIC_ANON;

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};
