<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ['auth']
})

const { getGlobalFeed, deletePostById, deletePostTagsByPostId, createFollow, deleteFollow } =
  useSupabaseDatabase();
const localPost = inject("localPost");
const localFollows = inject("localFollows");

const posts = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await getPosts();
  loading.value = false;
});

watch(localPost.refresh, async (_newVal, _oldVal) => {
  await getPosts();
});

async function getPosts() {
  posts.value = await getGlobalFeed();
}

async function onDelete(post) {
  await deletePostTagsByPostId(post.id);
  await deletePostById(post.id);
  await getPosts();
}

async function onFollow(tag) {
  await createFollow(tag.walls.id);
  localFollows.refresh.value++;
}

async function onUnFollow(tag) {
  await deleteFollow(tag.walls.id);
  localFollows.refresh.value++;
}
</script>

<template>
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
