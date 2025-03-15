<script setup>
import { ref, onMounted, watch } from "vue";

const {
  getProfileById,
  getWallsOfUserId,
  getFollowsOfUserId,
  createPost,
  getUser,
  user,
  profile,
  notification
} = useSupabaseDatabase();

const { addNotification } = useNotifications()

const walls = ref([]);
const follows = ref([]);
const newContent = ref("");
const newLink = ref("");
const newTags = ref([]);
const showNewLink = ref(false);
const refresh = ref(0);
const refreshFollows = ref(0);
const loading = ref(true);
const modalSetUsername = ref();

provide("localUser", { me: user, profile });
provide("localPost", { newContent, newLink, newTags, showNewLink, refresh });
provide("localFollows", { follows, refresh: refreshFollows});
provide("localInfo", { loading, notification })

async function getProfile() {
  if (!user.value?.id) return null;
  getProfileById(user.value.id);
}

async function getMyWalls() {
  if (user.value) {
    try {
      walls.value = await getWallsOfUserId(user.value.id);
    } catch (error) {
      addNotification('Error fetching walls.', 'error');
    }
  }
}

async function getMyFollows() {
  if (user.value) {
    try {
      let userFollows = await getFollowsOfUserId(user.value.id);
      follows.value = userFollows.map(obj => obj.wall_id);
    } catch (error) {
      addNotification('Error fetching follows.', 'error');
    }
  } else {
    follows.value = []
  }
}

async function onPost() {
  if (newContent.value === "" && newLink.value === "") {
    addNotification("Please don't make empty posts.", 'warning');
    return;
  }

  try {
    const note = JSON.stringify({
      content: newContent.value,
      link: newLink.value || undefined,
    });

    const post = await createPost(note);

    newContent.value = "";
    newLink.value = "";
    refresh.value++;
    notification.value = "Post created successfully!";
  } catch (error) {
    addNotification("Error creating post.", 'error');
  }
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
    if (newValue) {
      await getProfile();
      await Promise.all([getMyWalls(), getMyFollows()]).catch((error) => {
        console.error(error.message);
      });
      
      // Check if the profile is loaded and if the username is not set
      if (profile.value && !profile.value.name) {
        modalSetUsername.value?.open();
      }
    } else {
      newContent.value = "";
      newLink.value = "";
      newTags.value = [];
      refresh.value++;
      refreshFollows.value++;
    }
    loading.value = false;
  },
  { deep: true }
);

watch(
  () => refreshFollows.value,
  async (_newValue, _oldValue) => {
    await getMyFollows();
  }
);

watch(
  () => newLink.value,
  async (newValue, oldValue) => {
    if (newValue && oldValue == '') {
      showNewLink.value = true
    }
  }
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
      <form v-if="profile?.name" @submit.prevent class="my-10">
        <div class="flex items-center">
          <Editor
            v-model:model-value="newContent"
            :key="refresh"
            style="margin: 0.5rem 0; display: block; flex-grow: 1;"
            class="font-serif"
          />
          <ButtonPrimaryIcon @click="showNewLink = !showNewLink" icon="i-tabler-link" class="ms-2" />
        </div>
        <div class="flex items-stretch">
          <input
            v-if="showNewLink"
            v-model="newLink"
            placeholder="Insert Link"
            type="text"
            class="grow px-2 py-2 text-gray-700 transition-colors duration-200 font-serif"
            style="border: 1px #e4e4e4 solid; border-radius: 5px;"
          />
        </div>
        <ButtonPrimary @click="onPost" label="Post" icon="i-tabler-message" class="my-2" />
      </form>
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
</style>
