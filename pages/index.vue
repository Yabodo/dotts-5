<script setup>
import Multiselect from "vue-multiselect";
import { ref, onMounted } from "vue";

const { getFeed, deletePostById, deletePostTagsByPostId, createFollow, deleteFollow } =
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
  posts.value = await getFeed();
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
  <div>
    <Post v-for="post in posts" :post="post" @delete="() => onDelete(post)" @follow="onFollow" @unFollow="onUnFollow" />
  </div>
</template>
