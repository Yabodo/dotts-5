<template>
  <div>
    <p>User: {{ paramUser }}</p>
    <Post
      v-if="user"
      v-for="tag in user[0]?.tags"
      :key="tag.posts.id"
      :note="tag.posts.note"
      :user="tag.posts.users"
      :tags="tag.posts.tags"
      :created_at="tag.posts.created_at"
      >{{ post }}</Post
    >
  </div>
</template>

<script setup>
import { createClient } from "@supabase/supabase-js";
import { useRoute } from "vue-router";
const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const supabase = createClient(
  runtimeConfig.public.SUPABASE_PUBLIC_API_BASE,
  runtimeConfig.public.SUPABASE_PUBLIC_ANON
);
const user = ref();
const me = ref(null);
const paramUser = route.params.user;
const paramWall = route.params.wall;
async function getProfile() {
  try {
    const { data, error } = await supabase
      .from("walls")
      .select(
        `
          name,
          tags (
            posts (
              id,
              created_at,
              note,
              users (
                name
              ),
              tags (
                walls (
                  name
                )
              )
            )
          )
        `
      )
      .eq("name", paramWall)
      .order("created_at", { ascending: false });

    if (error) throw error;
    user.value = data;
  } catch (error) {
    console.error("Error fetching user:", error);
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
  await getUser();
  await getProfile();
});
</script>
