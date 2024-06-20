<script setup>
import Multiselect from "vue-multiselect";
import { createClient } from "@supabase/supabase-js";
import { ref, onMounted } from "vue";
const runtimeConfig = useRuntimeConfig();

const supabase = createClient(
  runtimeConfig.public.SUPABASE_PUBLIC_API_BASE,
  runtimeConfig.public.SUPABASE_PUBLIC_ANON
);
const posts = ref([]);
const walls = ref([]);
const me = ref(null);
const profile = ref(null);
const newContent = ref({});
const newLink = ref("");
const newTags = ref([]);
const showNewLink = ref(false);
const notification = ref();
const refresh = ref(0);
const loading = ref(false);
const profileName = ref();

async function getPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
          id,
          note,
          created_at,
          users (
            id,
            name
          ),
          tags (
            walls (
              name
            )
          )
        `
      )
      .limit(10)
      .order("created_at", { ascending: false });
    if (error) throw error;
    posts.value = data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function getWalls() {
  try {
    const { data, error } = await supabase
      .from("walls")
      .select(
        `
          id,
          name
        `
      )
      .eq("user_id", me.value.id);
    if (error) throw error;
    walls.value = data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function createPost(note) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([{ note }])
      .select();
    if (error) throw error;
    else {
      newContent.value = "";
      newLink.value = "";
      refresh.value++;
    }
    return data[0];
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

async function createWall(name) {
  console.log(name);
  try {
    const res = await supabase.from("walls").insert([{ name }]).select();
    if (res.error) throw res.error;
    else {
      let newTag = { id: res.data[0].id, name: res.data[0].name };
      walls.value.push(newTag);
      newTags.value.push(newTag);
    }
  } catch (err) {
    console.error("Error creating wall:", err);
  }
}

async function createTags(post) {
  let convertedTags = newTags.value.map((tag) => ({
    wall_id: tag.id,
    post_id: post.id,
  }));
  console.log(newTags.value);
  const { data, error } = await supabase
    .from("tags")
    .insert(convertedTags)
    .select();

  if (error) {
    console.error("Error inserting tags:", error);
  } else {
    console.log("Tags inserted successfully:", data);
  }
}

function removeTag(tag) {
  newTags.value = newTags.value.filter((obj) => obj.id !== tag.id);
}

async function deletePost(post) {
  const { error } = await supabase.from("posts").delete().eq("id", post.id);
}

async function deletePostTags(post) {
  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("post_id", post.id)
    .select();

  if (error) {
    console.error("Error deleting post tags:", error);
  }
}

async function onSetUsername() {
  console.log(me.value.id, profileName.value);
  const { data, error } = await supabase
    .from("users")
    .update({ name: profileName.value })
    .eq("id", me.value.id)
    .select();

  if (error) {
    console.error("Error setting username:", error);
  } else {
    console.log("Setting username successfully:", data);
    await getUser();
    console.log(me.value);
  }
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
  await createTags(post);
  newTags.value = [];
  getPosts();
}

async function onDelete(post) {
  await deletePostTags(post);
  await deletePost(post);
  await getPosts();
}

function onShare(post) {
  newContent.value = JSON.parse(post.note).content;
  newLink.value = JSON.parse(post.note).link;
  refresh.value++;
}

async function onSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    me.value = null;
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

async function getProfile() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
          id,
          name,
          note
        `
      )
      .eq("id", me.value.id);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return false;
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
    me.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  await getPosts();
  await getUser();
  await getWalls();
  loading.value = false;
});
</script>

<template>
  <div>
    <template v-if="me && !loading">
      <button @click="onSignOut" type="button">Sign Out</button>
      <form v-if="profile && profile.name" @submit.prevent="onPost">
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
            @tag="createWall"
            @remove="removeTag"
            style="margin: 0.5rem 0"
          ></multiselect>
        </div>
        <Dropdown v-if="!showNewLink || !showNewTags">
          <template #dropdown-options>
            <li v-if="!showNewLink" @click="showNewLink = true">Add link</li>
            <li v-if="!showNewTags" @click="showNewTags = true">Add tags</li>
          </template>
        </Dropdown>
        <button type="submit">Post</button>
      </form>
      <form v-else @submit.prevent="onSetUsername">
        <input
          v-model="profileName"
          placeholder="Pick a username"
          type="text"
        />
        <button type="submit">Save</button>
      </form>
    </template>
    <Post
      v-for="post in posts"
      :key="post.id"
      :note="post.note"
      :user="post.users"
      :tags="post.tags"
      :created_at="post.created_at"
      :profile="profile"
      @share="() => onShare(post)"
      @delete="() => onDelete(post)"
      >{{ post }}</Post
    >
  </div>
</template>
