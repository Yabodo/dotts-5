<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const {
  getProfileById,
  updateUsername,
  getWallsOfUserId,
  getFollowsOfUserId,
  createPost,
  createTags,
  createWall,
  supabase,
  signIn,
  signUp,
  signOut,
  getUser,
  user,
  profile
} = useSupabaseDatabase();

const email = ref("");
const password = ref("");
const walls = ref([]);
const follows = ref([]);
const newContent = ref("");
const newLink = ref("");
const newTags = ref([]);
const showNewLink = ref(false);
const refresh = ref(0);
const refreshFollows = ref(0);
const loading = ref(true);
const notification = ref("");
const profileName = ref("");

provide("localUser", { me: user, profile });
provide("localPost", { newContent, newLink, newTags, showNewLink, refresh });
provide("localFollows", { follows, refresh: refreshFollows});
provide("localInfo", { loading, notification })

async function getProfile() {
  if (!user.value?.id) return null;
  getProfileById(user.value.id);
}

async function onSetUsername() {
  try {
    const res = await updateUsername(user.value.id, profileName.value);
    if (res.error) throw res.error;
    await getUser();
  } catch (error) {
    console.error("Error setting username:", error);
  }
}

async function getMyWalls() {
  if (user.value) {
    try {
      walls.value = await getWallsOfUserId(user.value.id);
    } catch (error) {
      console.error("Error fetching walls:", error);
    }
  }
}

async function getMyFollows() {
  if (user.value) {
    try {
      let userFollows = await getFollowsOfUserId(user.value.id);
      follows.value = userFollows.map(obj => obj.wall_id);
    } catch (error) {
      console.error("Error fetching follows:", error);
    }
  }
}

async function createMyWall(name: string) {
  try {
    const data = await createWall(name);
    const newTag = { id: data[0].id, name: data[0].name };
    walls.value.push(newTag);
    newTags.value.push(newTag);
  } catch (error) {
    console.error("Error creating wall:", error);
  }
}

function removeTag(tag: any) {
  newTags.value = newTags.value.filter((obj) => obj.id !== tag.id);
}

async function onPost() {
  if (newContent.value === "" && newLink.value === "") {
    notification.value = "Please don't make empty posts";
    return;
  }

  try {
    const note = JSON.stringify({
      content: newContent.value,
      link: newLink.value || undefined,
    });

    const post = await createPost(note);

    await createTags(
      newTags.value.map((tag) => ({
        wall_id: tag.id,
        post_id: post.id,
      }))
    );

    newContent.value = "";
    newLink.value = "";
    newTags.value = [];
    refresh.value++;
    notification.value = "Post created successfully!";
  } catch (error) {
    console.error("Error creating post:", error);
    notification.value = "Error creating post. Please try again.";
  }
}

let authCheckInterval: number | null = null;

onMounted(async () => {
  loading.value = true;
  await getUser();
  await getMyWalls();
  await getMyFollows();
  loading.value = false;
});

watch(
  () => user.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      getProfile()
      getMyWalls()
    }
  },
  { deep: true }
);

watch(
  () => refreshFollows.value,
  async (_newValue, _oldValue) => {
    await getMyFollows();
  }
);
</script>

<template>
  <LoadingScreen :showLoading="loading" />
  <div>
    <NuxtLink to="/" style="text-decoration: none; color: black">
      {{ user ? `Welcome, ${profile?.name}` : "Please sign in" }}
    </NuxtLink>
    <p>{{ notification }}</p>
    <template v-if="!user">
      <form @submit.prevent>
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" placeholder="Password" type="password" />
        <button @click="signIn(email, password)" type="submit">
          Sign in
        </button>
        <button @click="signUp(email, password)" type="submit">
          Sign up
        </button>
      </form>
    </template>
    <template v-else>
      <NuxtLink
        to="/"
        style="margin-right: 0.1rem"
      >
        Global feed
      </NuxtLink>
      <NuxtLink
        to="f"
        style="margin-right: 0.1rem"
      >
        My feed
      </NuxtLink>
      <button @click="signOut" type="button">Sign Out</button>
      <form
        v-if="!profile?.name"
        @submit.prevent="onSetUsername"
        style="margin: 10px 0"
      >
        <input
          v-model="profileName"
          placeholder="Pick a username"
          type="text"
        />
        <button type="submit">Save</button>
      </form>
      <template v-else-if="!loading">
        <form v-if="profile?.name" @submit.prevent="onPost">
          <Editor
            v-model:model-value="newContent"
            :key="refresh"
            style="margin: 0.5rem 0"
          />
          <input
            v-if="showNewLink"
            v-model="newLink"
            placeholder="Insert Link"
            type="text"
            style="margin: 0.5rem 0"
          />
          <div>
            <multiselect
              v-model="newTags"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              :options="walls"
              :multiple="true"
              :taggable="true"
              @tag="createMyWall"
              @remove="removeTag"
              style="margin: 0.5rem 0"
            ></multiselect>
          </div>
          <DropdownButton v-if="!showNewLink">
            <template #dropdown-options>
              <li v-if="!showNewLink" @click="showNewLink = true">Add link</li>
            </template>
          </DropdownButton>
          <button type="submit">Post</button>
        </form>
      </template>
    </template>
    <slot />
  </div>
</template>
