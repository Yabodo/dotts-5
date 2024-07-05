<template>
  <div>
    <p>
      Host:
      <NuxtLink
        :to="{
          name: 'u-user',
          params: { user: paramUser },
        }"
      >
        {{ host?.name }}
      </NuxtLink>
    </p>
    <p>Wall: {{ paramWall }}</p>
    <Post
      v-if="posts"
      v-for="post in posts"
      :post="post"
      :key="localPost.refresh"
    />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const { getFeedByWallNameAndUserId, getProfileByName } = useSupabaseDatabase();
const localPost = inject("localPost");

const posts = ref();
const host = ref(null);
const paramUser = route.params.user;
const paramWall = route.params.wall;

onMounted(async () => {
  host.value = await getProfileByName(paramUser);
  posts.value = await getFeedByWallNameAndUserId(paramWall, host.value?.id);
});

watch(localPost.refresh, async (_newVal, _oldVal) => {
  posts.value = await getFeedByWallNameAndUserId(paramWall, host.value?.id);
});
</script>
