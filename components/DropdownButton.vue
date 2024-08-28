<template>
  <div class="dropdown" @click="toggleDropdown">
    <ButtonTransparentIcon v-if="!isOpen" type="button" icon="i-tabler-dots" />
    <ButtonTransparentIcon v-else type="button" icon="i-tabler-minus" />
    <div class="dropdown-menu" v-show="isOpen">
      <slot name="dropdown-options"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Reactive variable to track the dropdown open state
const isOpen = ref(false);

// Method to toggle the dropdown menu visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  background-color: white;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-top: 8px;
  padding: 0.4rem;
  list-style: none;
}

.dropdown-menu li {
  min-width: 20rem;
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f1f1f1;
}
</style>
