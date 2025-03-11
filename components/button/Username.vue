<template>
    <NuxtLink
      :to="to"
      class="underline decoration-blue-500 hover:decoration-none cursor-pointer text-gray-700 transition hover:-translate-y-0.5 active:translate-y-0"
    >
      <slot>
        <div v-if="icon" :class="icon" class="me-1.5" />
        {{ label }}
      </slot>
    </NuxtLink>
  </template>
  
  <script setup>
  const props = defineProps({
    icon: {
      type: String,
    },
    label: {
      type: String,
      required: true
    },
    to: {
      type: [String, Object],
    }
  });
  </script>