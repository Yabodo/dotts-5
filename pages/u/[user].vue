<template>
  <div>
    <p>User: {{ $route.params.user }}</p>
    <div>
      <p>
        Walls:
        <NuxtLink
          v-for="wall in user[0]?.walls"
          :to="{
            name: 'w-user-wall',
            params: { user: $route.params.user, wall: wall.name },
          }"
          style="margin-right: 0.1rem"
          >#{{ wall.name }}</NuxtLink
        >
      </p>
    </div>
    <Post
      v-for="post in user[0]?.posts"
      :key="post.id"
      :note="post.note"
      :user="post.users"
      :tags="post.tags"
      :created_at="post.created_at"
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
const user = ref([]);
const me = ref(null);
const paramUser = route.params.user;
async function getProfile() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
          name,
          posts (
            id,
            note,
            created_at,
            users (
              name
            ),
            tags (
              walls (
                name
              )
            )
          ),
          walls (
            name,
            note
          )
        `
      )
      .eq("name", paramUser);
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
