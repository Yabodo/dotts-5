<script setup>
import { createClient } from "@supabase/supabase-js";
import { ref, onMounted } from "vue";
const runtimeConfig = useRuntimeConfig();

const email = ref("");
const password = ref("");
const notification = ref("");

const supabase = createClient(
  runtimeConfig.public.SUPABASE_PUBLIC_API_BASE,
  runtimeConfig.public.SUPABASE_PUBLIC_ANON
);
const me = ref(null);

async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    me.value = user;
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
  await getUser();
});
</script>

<template>
  <LoadingScreen :showLoading="me === null" />
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
