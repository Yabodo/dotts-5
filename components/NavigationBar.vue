<template>
  <header class="bg-white">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row h-16 items-center justify-between">
        <div class="mb-2 md:mb-0 md:flex md:items-center md:gap-12">
          <NuxtLink to="/" class="block text-teal-600">
            <span class="sr-only">Home</span>
            <svg class="h-8" viewBox="0 0 1120 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M640 320L0 0L88 1280H320L640 320Z" fill="#191970"/>
              <path d="M824 640L1008 960L824 1280H456L591.489 873.535L824 640Z" fill="#191970"/>
              <path d="M1108 1120L960 1204V1280H1120L1108 1120Z" fill="#191970"/>
            </svg>
          </NuxtLink>
        </div>

        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global">
            <ul class="flex items-center text-sm m-0 p-0 md:pt-0">
              <ButtonText v-if="useRoute().path !== '/f'" to="/f" label="Friends" icon="i-tabler-heart" />

              <ButtonText v-if="useRoute().path !== '/'" to="/" label="My feed" icon="i-tabler-star" />

              <ButtonText v-if="useRoute().path !== '/g'" to="/g" label="Global feed" icon="i-tabler-world" />

              <ButtonText @click="signOut" v-if="localUser?.me.value" label="Log out" icon="i-tabler-user-minus" />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const {
  signOut
} = useSupabaseDatabase();

const localUser = inject("localUser")
</script>
