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
    <MasonryWall :items="posts" :column-width="400" :gap="16" class="my-3">
      <template #default="{ item: post }">
        <Post
          :post="post"
          :key="localPost.refresh"
          @delete="() => onDelete(post)"
          @follow="onFollow"
          @unFollow="onUnFollow"
        />
      </template>
    </MasonryWall>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const { getFeedByWallNameAndUserId, getProfileByName, createFollow, deleteFollow, deletePostTagsByPostId, deletePostById } = useSupabaseDatabase();

const localPost = inject("localPost");
const localFollows = inject("localFollows");

const posts = ref();
const host = ref(null);
const paramUser = route.params.user;
const paramWall = route.params.wall;

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
  localPost.refresh.value++;
}

onMounted(async () => {
  host.value = await getProfileByName(paramUser);
  posts.value = await getFeedByWallNameAndUserId(paramWall, host.value?.id);
});

watch(localPost.refresh, async (_newVal, _oldVal) => {
  posts.value = await getFeedByWallNameAndUserId(paramWall, host.value?.id);
});
</script>
