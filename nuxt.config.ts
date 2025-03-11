// https://nuxt.com/docs/api/configuration/nuxt-config
import { presetIcons, presetUno, presetWind } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetForms } from '@julr/unocss-preset-forms'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Dotts.org',
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      ],
      meta: [
        { name: 'description', content: 'Making history!' }
      ],
    },
  },

  build: {
    transpile: ['@yeger/vue-masonry-wall']
  },

  css: [
    '@/assets/css/main.css'
  ],

  modules: [
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      ANNOUNCEMENT: process.env.ANNOUNCEMENT,
      SUPABASE_PUBLIC_API_BASE: process.env.SUPABASE_PUBLIC_API_BASE,
      SUPABASE_PUBLIC_ANON: process.env.SUPABASE_ANON,
    },
    SUPABASE_API_SECRET: process.env.SUPABASE_API_SECRET,
  },

  plugins: [
    "~/plugins/multiselect.js",
    "~/plugins/vue-masonry-wall.ts",
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  unocss: {
    shortcuts: [
      [
        'btn-blue',
        'cursor-pointer text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 rounded-lg px-3 py-0.5 text-center border-0 transition-transform hover:-translate-y-0.75 active:translate-y-0'
      ],
    ],
    theme: {
      colors: {
        brand: {
          primary: 'hsl(var(--hue, 217) 78% 51%)',
          primaryLight: 'hsl(var(--hue, 217) 78% 51%)',
        },
      },
      extend: {
        spacing: {
          'button-padding': 'var(--vs-button-padding)',
        },
      },
    },
    presets: [
      presetUno(),
      presetWind(),
      presetIcons({
        scale: 1.2,
        warn: true,
        collections: {
          tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
        },
      }),
      presetAnimations(),
      presetForms()
    ],
    content: {
      pipeline: {
        include: [
          // the default
          /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
          // include js/ts files
          'src/**/*.{js,ts}',
        ],
      },
    },
  },

  compatibilityDate: '2025-03-09',
});