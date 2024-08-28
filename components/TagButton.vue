<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  id: {
    type: Number,
    required: true
  },
  user: {
    type: Object,
    default: () => ({}),
  },
  menu: {
    type: Array,
    default: () => [],
  },
});

const localFollows = inject("localFollows");

const menuVisible = ref(false);

const visibleMenuItems = computed(() => {
  return props.menu.filter((item) => item.visibility !== false && item.visibility !== null);
});

const hasVisibleMenuItems = computed(() => {
  return visibleMenuItems.value.length > 0;
});

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

const handleMenuItemClick = (item) => {
  if (item.action) {
    item.action();
  }
  menuVisible.value = false;
};

const isWallFollowed = computed(() => {
  return localFollows.follows.value.includes(props.id)
});
</script>

<template>
  <div v-if="label" class="relative inline-flex items-center border border-solid border-inside rounded-lg py-1 px-2 mx-1" :class="isWallFollowed ? 'border-blue-500' : 'border-stone-400'">
    <div v-if="hasVisibleMenuItems" class="flex items-center cursor-pointer" @click="toggleMenu">
      <span v-if="isWallFollowed" class="i-tabler-check text-sm text-blue-500 "/>
      <span class="cursor-pointer text-stone-600 mx-2" style="pointer-events: unset;">
      {{ label }}</span>
      <span class="i-tabler-dots text-stone-600"/>
    </div>
    <NuxtLink
      v-else
      :to="{
        name: 'w-user-wall',
        params: { user: user?.name || 'NULL', wall: label },
      }"
      style="margin-right: 0.1rem"
    >
      <span v-if="isWallFollowed" class="i-tabler-check text-sm text-blue-500 "/>
      <span class="cursor-pointer text-stone-600 mx-2" style="pointer-events: unset;">
        {{ label }}
      </span>
    </NuxtLink>
    <div v-if="menuVisible" class="tag-menu-dropdown">
      <div
        v-for="(item, index) in visibleMenuItems"
        :key="index"
        @click="handleMenuItemClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>

a {
  color: inherit;
  text-decoration: none;
}

a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
}

.tag-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.tag-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1;
}

.tag-menu-dropdown div {
  padding: 4px 8px;
  cursor: pointer;
}

.tag-menu-dropdown div:hover {
  background-color: #f0f0f0;
}
</style>
