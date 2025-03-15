<script setup>
import { ref, onMounted, watch } from "vue";

const {
  getProfileById,
  updateUserNote,
  updateUsername,
  getUser,
  user,
  profile,
  notification
} = useSupabaseDatabase();

const { addNotification } = useNotifications()

const changeName = ref(false)
const changeNote = ref(false)
const username = ref("")
const userNote = ref("");
const loading = ref(true);
const modalSetUsername = ref();
const refresh = ref(0)

provide("localUser", { me: user, profile });
provide("localInfo", { loading, notification })

async function getProfile() {
  if (!user.value?.id) return null;
  await getProfileById(user.value.id);
  userNote.value = profile.value.note
  username.value = profile.value.name
  refresh.value++
}

async function onSaveNote() {
  if (profile.value.note != userNote.value) {
    try {
      await updateUserNote(user.value.id, userNote.value);
      await getProfile()
      notification.value = "Your description was successfully updated!";
      changeNote.value = false
    } catch (error) {
      addNotification("Error updating description.", 'error');
    }
  } else {
    changeNote.value = false
  }
}

async function onSaveName() {
  if (profile.value.name != username.value) {
    try {
      await updateUsername(user.value.id, username.value);
      await getProfile()
      notification.value = "Your nickname was successfully updated!";
      changeName.value = false
    } catch (error) {
      addNotification("Error updating nickname.", 'error');
    }
  } else {
    changeName.value = false
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
    if (newValue && user.value) {
      await getProfile();
      // Check if the profile is loaded and if the username is not set
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
      <div v-if="profile?.name" class="my-10 max-w-4xl mx-auto">
        <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div class="i-tabler-user text-2xl text-gray-600 mr-3 w-12" />
          <div class="flex-1">
            <div v-if="changeName" class="flex">
              <input v-model="username" id="username" name="username" type="text" autocomplete="nickname" class="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
              <ButtonPrimaryIcon @click="onSaveName" icon="i-tabler-device-floppy" class="ms-2" />
            </div>
            <p v-else @click="changeName = true" class="user-note">
              {{ profile.name }}
            </p>
            
            <div v-if="changeNote" class="flex">
              <input v-model="userNote" id="note" name="note" type="text" class="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
              <ButtonPrimaryIcon @click="onSaveNote" icon="i-tabler-device-floppy" class="ms-2" />
            </div>
            <p v-else-if="!changeNote && (!profile.note || !profile.note.trim())" @click="changeNote = true" class="user-note text-gray-500">
              Feel free to add your user description :)
            </p>
            <p v-else @click="changeNote = true" class="user-note">
              {{ profile.note }}
            </p>
          </div>
        </div>
      </div>
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
