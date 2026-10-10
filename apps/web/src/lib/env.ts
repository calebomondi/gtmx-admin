// The only place import.meta.env is read.
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  apiOrigin: ((import.meta.env.VITE_API_ORIGIN as string | undefined) ?? "").trim(),
}
