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
      <MasonryWall :items="posts" :column-width="400" :gap="16" class="my-3">
        <template #default="{ item: post }">
          <Post
            :post="post"
            @delete="() => onDelete(post)"
            @follow="onFollow"
            @unFollow="onUnFollow"
          />
        </template>
      </MasonryWall>
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
  createFollow,
  deleteFollow
} = useSupabaseDatabase();

const localPost = inject("localPost");
const localFollows = inject("localFollows");

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

async function onFollow(tag) {
  await createFollow(tag.walls.id);
  localFollows.refresh.value++;
}

async function onUnFollow(tag) {
  await deleteFollow(tag.walls.id);
  localFollows.refresh.value++;
}

async function onDelete(post) {
  await deletePostTagsByPostId(post.id);
  await deletePostById(post.id);
  localPost.refresh++;
}

watchEffect(() => {
  if (localPost.refresh) {
    refreshPosts();
  }
});
</script>
