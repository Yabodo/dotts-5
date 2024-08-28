<template>
  <button
    v-if="!to"
    :class="buttonClass"
  >
    <div :class="labelWrapperClass">
      <slot>
        <div :class="icon" />
      </slot>
    </div>
  </button>
  <NuxtLink
    v-else
    :to="to"
    :class="buttonClass"
  >
    <div :class="labelWrapperClass">
      <slot>
        <div :class="icon" />
      </slot>
    </div>
  </NuxtLink>
</template>

<script setup>
const buttonClass = "cursor-pointer text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 rounded-lg px-3 py-0.5 text-center border-0 transition-transform hover:-translate-y-1 active:translate-y-0";
const labelWrapperClass = "py-2 flex items-center justify-center";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  to: {
    type: [String, Object],
  }
});
</script>
