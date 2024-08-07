<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
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
</script>

<template>
  <div v-if="label" class="tag">
    <div v-if="hasVisibleMenuItems" class="tag-wrapper" @click="toggleMenu">
      <span class="tag-label">#{{ label }}</span>
      <span class="tag-menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </span>
    </div>
    <NuxtLink
      v-else
      :to="{
        name: 'w-user-wall',
        params: { user: user?.name || 'NULL', wall: label },
      }"
      style="margin-right: 0.1rem"
    >
      <span class="tag-label">#{{ label }}</span>
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
.tag {
  display: inline-flex;
  align-items: center;
  background-color: #efefef;
  border: 1px solid #767676;
  border-radius: 3px;
  padding: 4px 12px;
  margin: 4px;
  font-size: 14px;
  position: relative;
}

.tag-label {
  margin-right: 4px;
  cursor: pointer;
  pointer-events: unset;
}

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

.tag-menu {
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
