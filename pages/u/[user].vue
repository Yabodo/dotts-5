<template>
  <div>
    <template v-if="host">
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
      <MasonryWall v-if="posts" :items="posts" :column-width="400" :gap="16" class="my-3">
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
const host = ref()
const loading = ref(true)

const paramUser = computed(() => route.params?.user);

onMounted(async () => {
  loading.value = true
  if (paramUser.value) {
    host.value = await getProfileByName(paramUser.value)
  }
  loading.value = false
});

const {
  data: posts,
  refresh: refreshPosts,
} = useAsyncData(
  "posts",
  async () => {
    if (host.value) {
      return getFeedByUserId(host.value.id);
    }
    return [];
  },
  { watch: [host] }
);

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

watchEffect(() => {
  if (localPost.refresh.value) {
    refreshPosts();
  }
});
</script>
