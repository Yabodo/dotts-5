<template>
  <p v-if="runtimeConfig.public.ANNOUNCEMENT && runtimeConfig.public.ANNOUNCEMENT != ''" class="text-orange-700 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 my-0 py-1 px-4">
    Announcement: {{ runtimeConfig.public.ANNOUNCEMENT }}
  </p>
  <p v-else class="text-blue-700 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 my-0 py-1 px-4">
    "{{ (Quote.getQuote()).text }}" - {{ (Quote.getQuote()).author }}
  </p>
</template>

<script setup>
import Quote from 'inspirational-quotes'

const runtimeConfig = useRuntimeConfig()
</script>
