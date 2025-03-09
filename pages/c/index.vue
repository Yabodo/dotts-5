<script setup>
import { ref, onMounted, computed } from "vue";

const { getAllMyFriends, removeFriend, addFriend, getFriendRequests, acceptFriend, rejectFriend, searchUsers } =
  useSupabaseDatabase();
const localUser = inject("localUser");
const localInfo = inject("localInfo");

const friends = ref([]);
const friendRequests = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const searchResults = ref([]);
const isSearching = ref(false);
const showOthers = ref(false);

onMounted(async () => {
  loading.value = true;
  await getFriends();
  await getRequests();
  if (friends.value.length == 0 && friendRequests.length == 0) {
    showOthers = true
  }
  loading.value = false;
});

watch(localInfo.loading, async (newVal, _oldVal) => {
  await getFriends();
  await getRequests();
});

watch(searchTerm, async (newVal) => {
  if (newVal.length >= 2) {
    isSearching.value = true;
    searchResults.value = await searchUsers(newVal);
  } else {
    isSearching.value = false;
    searchResults.value = [];
  }
});

async function getFriends() {
  if (localUser.me.value) {
    friends.value = await getAllMyFriends();
  }
}

async function getRequests() {
  if (localUser.me.value) {
    friendRequests.value = await getFriendRequests(localUser.me.value.id);
  }
}

async function onDelete(friend) {
  await removeFriend(friend.id);
  await getFriends();
}

async function onAddFriend(friend) {
  searchTerm.value = ''
  await addFriend(friend.id);
  await getFriends();
}

async function onAccept(userId) {
  await acceptFriend(userId);
  await getFriends();
  await getRequests();
}

async function onReject(userId) {
  await rejectFriend(userId);
  await getRequests();
}

const activeFriends = computed(() => {
  return friends.value.filter(friend => 
    !(friend.friendship_direction === 'incoming' && friend.friendship_status === 'pending') && 
    !['rejected', 'blocked', 'pending'].includes(friend.friendship_status)
  );
});

const otherFriends = computed(() => {
  return friends.value.filter(friend => 
    !(friend.friendship_direction === 'incoming' && friend.friendship_status === 'pending') && 
    ['rejected', 'blocked', 'pending'].includes(friend.friendship_status)
  );
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Search Section -->
    <div class="mb-8">
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <div class="i-tabler-search text-gray-500" />
        </div>
        <input
          v-model="searchTerm"
          type="search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search for users..."
        />
      </div>
      
      <!-- Search Results -->
      <div v-if="isSearching && searchResults.length > 0" class="mt-4 space-y-4">
        <div v-for="user in searchResults" :key="user.id" 
             class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div class="flex items-center">
            <div class="i-tabler-user text-2xl text-gray-600 mr-3" />
            <span class="font-medium">{{ user.name }}</span>
          </div>
          <ButtonPrimary
            v-if="user.friendship_status == 'none'"
            @click="onAddFriend(user)"
            label="Add Friend"
            icon="i-tabler-user-plus"
          />
          <p v-else-if="user.friendship_status == 'accepted'" style="text-transform: capitalize;">Friend</p>
          <p v-else style="text-transform: capitalize;">{{ user.friendship_status }}</p>
        </div>
      </div>
    </div>

    <!-- Friend Requests Section -->
    <div v-if="friendRequests && friendRequests.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Friend Requests</h2>
      <div class="space-y-4">
        <div v-for="request in friendRequests" :key="request.id" 
             class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div class="flex items-center">
            <div class="i-tabler-user-circle text-2xl text-gray-600 mr-3" />
            <span class="font-medium">{{ request.name || 'Unknown User' }}</span>
          </div>
          <div class="flex gap-2">
            <ButtonPrimary 
              @click="onAccept(request.user_id)"
              label="Accept"
              icon="i-tabler-check"
            />
            <ButtonSecondary
              @click="onReject(request.user_id)"
              label="Reject"
              icon="i-tabler-x"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeFriends.length < 1 && otherFriends.length < 1" class="text-gray-500 text-center py-8">
      You don't seem to have any friends. Feel free to add some!
    </div>
    <!-- Friends List Section -->
    <div>
      <h2 v-if="!(activeFriends.length < 1 && otherFriends.length < 1)" class="text-xl font-semibold mb-4">My Friends</h2>
      <div class="space-y-4">
        <template v-for="friend in activeFriends" :key="friend.id">
          <div v-if="!(friend.friendship_direction == 'incoming' && friend.friendship_status == 'pending') && !['rejected', 'blocked', 'pending'].includes(friend.friendship_status)" class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div class="flex items-center">
              <div class="i-tabler-user text-2xl text-gray-600 mr-3" />
              <div>
                <NuxtLink 
                  :to="{ name: 'u-user', params: { user: friend.name }}" 
                  class="font-medium hover:text-blue-600"
                >
                  {{ friend.name }}
                </NuxtLink>
                <p class="user-note">
                  {{ friend.note }}
                </p>
              </div>
            </div>
            <div v-if="friend.friendship_status == 'accepted'" class="flex gap-2">
              <ButtonTransparentIcon
                @click="onDelete(friend)"
                icon="i-tabler-user-minus"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Others List Section -->
    <div>
      <div class="space-y-4">
        <ButtonSecondary
          v-if="!(activeFriends.length < 1 && otherFriends.length < 1)"
          @click="showOthers = !showOthers"
          label="Show others"
          icon="i-tabler-user-cancel"
          class="w-full mt-4"
        />
        <template v-if="showOthers" v-for="friend in otherFriends" :key="friend.id">
          <div v-if="!(friend.friendship_direction == 'incoming' && friend.friendship_status == 'pending') && ['rejected', 'blocked', 'pending'].includes(friend.friendship_status)" class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div class="flex items-center">
              <div class="i-tabler-user text-2xl text-gray-600 mr-3" />
              <div>
                <NuxtLink 
                  :to="{ name: 'u-user', params: { user: friend.name }}" 
                  class="font-medium hover:text-blue-600"
                >
                  {{ friend.name }}
                </NuxtLink>
                <p class="user-note">
                  {{ friend.note }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <p style="text-transform: capitalize;">{{ friend.friendship_status }}</p>
              <ButtonTransparentIcon
                @click="onDelete(friend)"
                icon="i-tabler-user-minus"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-note {
  inline-size: 30vw;
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