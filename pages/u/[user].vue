<template>
  <div>
    <p v-if="pending">Loading...</p>
    <template v-else-if="host">
      <p>
        Host:
        <NuxtLink
          :to="{
            name: 'u-user',
            params: { user: paramUser },
          }"
        >
          {{ host.name }}
        </NuxtLink>
      </p>
      <Post
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @delete="() => onDelete(post)"
      />
    </template>
    <p v-else>User not found</p>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useAsyncData } from "#app";

const route = useRoute();
const {
  getFeedByUserId,
  getProfileByName,
  deletePostById,
  deletePostTagsByPostId,
} = useSupabaseDatabase();
const localPost = inject("localPost");

const paramUser = computed(() => route.params.user);

const {
  data: host,
  pending: hostPending,
  refresh: refreshHost,
} = useAsyncData("host", () => getProfileByName(paramUser.value), {
  watch: [paramUser],
});

const {
  data: posts,
  pending: postsPending,
  refresh: refreshPosts,
} = useAsyncData(
  "posts",
  async () => {
    const hostData = await getProfileByName(paramUser.value);
    if (hostData) {
      return getFeedByUserId(hostData.id);
    }
    return [];
  },
  { watch: [paramUser] }
);

const pending = computed(() => hostPending.value || postsPending.value);

async function onDelete(post) {
  await deletePostTagsByPostId(post.id);
  await deletePostById(post.id);
  await getPosts();
}

watchEffect(() => {
  if (localPost.refresh) {
    refreshPosts();
  }
});
</script>
