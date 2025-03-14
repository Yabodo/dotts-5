<script setup>
import { ref, onMounted, watch } from "vue";

const {
  getUser,
  user,
  profile,
  notification
} = useSupabaseDatabase();

const { addNotification } = useNotifications()

const loading = ref(true);
const modalSetUsername = ref();
const username = ref("")
const refresh = ref(0)

provide("localUser", { me: user, profile });
provide("localInfo", { loading, notification })

async function getProfile() {
  if (!user.value?.id) return null;
  await getProfileById(user.value.id);
  username.value = profile.value.name
  refresh.value++
}

onMounted(async () => {
  loading.value = true;
  await getUser();
  loading.value = false;
});

watch(
  () => user.value,
  async (newValue, _oldValue) => {
    loading.value = true;
    if (newValue && user.value) {
      await getProfile();
      if (profile.value && !profile.value.name) {
        modalSetUsername.value?.open();
      }
    }
    loading.value = false;
  },
  { deep: true }
);

watch(
  () => notification.value,
  (newValue, _oldValue) => {
    if (newValue) {
      addNotification(newValue);
    }
  }
);
</script>

<template>
  <LoadingScreen :showLoading="loading" />
  <NotificationSystem />
  <QuoteBar v-if="!loading" />
  <div class="p-3 max-w-screen-xl mx-auto" v-if="!loading">
    <NavigationBar />
    <template v-if="!user">
      <ModalLogin />
    </template>
    <template v-else>
      <ModalSetUsername ref="modalSetUsername" />
    </template>
    <NuxtPage v-if="user" />
  </div>
</template>

<style scoped>
input, textarea {
  font-family: Arial, sans-serif;
}

:deep(::placeholder) {
  color: gray;
  font-family: Arial, sans-serif;
}

:deep(.ce-paragraph[data-placeholder]:empty::before) {
  font-family: Arial, sans-serif;
  color: gray;
}

:deep(.multiselect__input::placeholder) {
  color: gray;
  font-family: Arial, sans-serif;
}

:deep(span.multiselect__placeholder) {
  color: gray;
  font-family: Arial, sans-serif;
}

.user-note {
  inline-size: 30vw;
  margin-bottom: 0;
  margin-top: 0.25rem;
  overflow: hidden;
}

@media screen and (min-width: 481px) {
  .user-note {
    inline-size: 50vw;
  }
}

@media screen and (min-width: 769px) {
  .user-note {
    inline-size: 70vw;
  }
}

@media screen and (min-width: 1025px) {
  .user-note {
    inline-size: 720px;
  }
}

@media screen and (min-width: 1201px) {
  .user-note {
    inline-size: 720px;
  }
}
</style>
