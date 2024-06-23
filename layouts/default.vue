<script setup>
import { createClient } from "@supabase/supabase-js";
import { ref, onMounted } from "vue";
const runtimeConfig = useRuntimeConfig();

const email = ref("");
const password = ref("");
const notification = ref("");
const loading = ref(true);

const supabase = createClient(
  runtimeConfig.public.SUPABASE_PUBLIC_API_BASE,
  runtimeConfig.public.SUPABASE_PUBLIC_ANON
);
const me = ref(null);
const profile = ref(null);

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
    console.log(me.value, profile.value);
  } catch (error) {
    console.error("Error getting user:", error);
    me.value = false;
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
  } catch (error) {
    notification.value = error.message;
    console.error("Error signing up:", error);
  }
}

onMounted(async () => {
  loading.value = true;
  await getUser();
  loading.value = false;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(getUser);
  onUnmounted(() => {
    subscription.unsubscribe();
  });
});
</script>

<template>
  <LoadingScreen :showLoading="loading" />
  <div>
    <NuxtLink to="/" style="text-decoration: none; color: black">{{
      me ? `Welcome, ${me.email}` : "Please sign in"
    }}</NuxtLink>
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
    <slot />
  </div>
</template>
