// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      SUPABASE_PUBLIC_API_BASE: process.env.SUPABASE_PUBLIC_API_BASE,
      SUPABASE_PUBLIC_ANON: process.env.SUPABASE_ANON,
    },
    SUPABASE_API_SECRET: process.env.SUPABASE_API_SECRET,
  },
  plugins: ["~/plugins/multiselect.js"],
});
