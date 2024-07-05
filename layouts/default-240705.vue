<script setup>
import { ref, onMounted, watch } from "vue";

const {
  getProfileById,
  updateUsername,
  getWallsOfUserId,
  createPost,
  createTags,
  createWall,
  supabase,
} = useSupabaseDatabase();

const email = ref("");
const password = ref("");
const me = ref(null);
const profile = ref(null);
const walls = ref([]);
const newContent = ref({});
const newLink = ref("");
const newTags = ref([]);
const showNewLink = ref(false);
const refresh = ref(0);
const loading = ref(true);
const notification = ref();
const profileName = ref();

provide(/* key */ "localUser", /* value */ { me, profile });
provide("localPost", { newContent, newLink, newTags, showNewLink, refresh });

async function getProfile() {
  try {
    if (!me.value || !me.value.id) return null;
    let res = await getProfileById(me.value.id);
    if (res.error) throw res.error;
    return res;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    me.value = user;
    profile.value = await getProfile();
  } catch (error) {
    console.error("Error getting user:", error);
    me.value = null;
    profile.value = null;
  }
}

async function onSignIn(email, password) {
  try {
    let response;
    if (!password) {
      response = await supabase.auth.signInWithOtp({ email });
    } else {
      response = await supabase.auth.signInWithPassword({ email, password });
    }
    if (response.error) throw response.error;
    notification.value = "Signed in successfully!";
    await getUser();
  } catch (error) {
    notification.value = error.message;
    console.error("Error signing in:", error);
  }
}

async function onSignUp(email, password) {
  try {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    notification.value = "Sign up successful!";
    await getUser();
  } catch (error) {
    notification.value = error.message;
    console.error("Error signing up:", error);
  }
}

async function onSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    me.value = null;
    profile.value = null;
    notification.value = "Signed out successfully!";
  } catch (error) {
    console.error("Error signing out:", error);
    notification.value = "Error signing out. Please try again.";
  }
}

async function onSetUsername() {
  let res = await updateUsername(me.value.id, profileName.value);
  if (res.error) {
    console.error("Error setting username:", res.error);
  } else {
    await getUser();
  }
}

async function getMyWalls() {
  walls.value = await getWallsOfUserId(me.value.id);
}

async function createMyWall(name) {
  let data = await createWall(name);
  let newTag = { id: data[0].id, name: data[0].name };
  walls.value.push(newTag);
  newTags.value.push(newTag);
}

function removeTag(tag) {
  newTags.value = newTags.value.filter((obj) => obj.id !== tag.id);
}

async function onPost() {
  if (newContent.value == "" && newLink.value == "") {
    notification.value = "Please don't make empty posts";
    return;
  }
  const note = JSON.stringify({
    content: newContent.value,
    link: newLink.value ? newLink.value : undefined,
  });
  let post = await createPost(note);
  newContent.value = "";
  newLink.value = "";
  refresh.value++;
  await createTags(
    newTags.value.map((tag) => ({
      wall_id: tag.id,
      post_id: post.id,
    }))
  );
  newTags.value = [];
}

onMounted(async () => {
  loading.value = true;
  await getUser();
  await getMyWalls();
  loading.value = false;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      await getUser();
    } else if (event === "SIGNED_OUT") {
      me.value = null;
      profile.value = null;
    }
  });
});

// Watch for changes in me.value
watch(
  () => me.value,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      profile.value = await getProfile();
    }
  },
  { deep: true }
);
</script>

<template>
  <LoadingScreen :showLoading="loading" />
  <div>
    <NuxtLink to="/" style="text-decoration: none; color: black">
      {{ me ? `Welcome, ${me.email}` : "Please sign in" }}
    </NuxtLink>
    <p>{{ notification }}</p>
    <template v-if="!me">
      <form @submit.prevent>
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" placeholder="Password" type="password" />
        <button @click="onSignIn(email, password)" type="submit">
          Sign in
        </button>
        <button @click="onSignUp(email, password)" type="submit">
          Sign up
        </button>
      </form>
    </template>
    <template v-else>
      <button @click="onSignOut" type="button">Sign Out</button>
      {{ profile }}
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
