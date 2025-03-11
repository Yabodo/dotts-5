<script setup>
import { ref, onMounted } from "vue";

const { getMyFeed, deletePostById, deletePostTagsByPostId, createFollow, deleteFollow } =
  useSupabaseDatabase();
const localPost = inject("localPost");
const localFollows = inject("localFollows");
const localUser = inject("localUser");
const localInfo = inject("localInfo");

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

watch(localInfo.loading, async (newVal, _oldVal) => {
  await getPosts();
});

async function getPosts() {
  if (localUser.me.value) {
    posts.value = await getMyFeed(localUser.me.value.id);
  }
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
    <MasonryWall v-if="posts.length > 0" :items="posts" :column-width="400" :gap="16" class="my-3">
      <template #default="{ item: post }">
        <Post :post="post" @delete="() => onDelete(post)" @follow="onFollow" @unFollow="onUnFollow" />
      </template>
    </MasonryWall>
    <p v-else>Start posting or <NuxtLink to="f">follow somebody who has posted.</NuxtLink></p>
  </div>
</template>
