<template>
  <button
    v-if="!to"
    class="btn-blue" type
  >
  <div :class="textWrapperStyle">
    <slot>
      <div v-if="icon" :class="icon" class="me-1.5" />
      {{ label }}
    </slot>
  </div>
  </button>
  <NuxtLink
    v-else
    :to="to"
    class="btn-blue" type="button"
  >
  <div :class="textWrapperStyle">
    <slot>
      <div v-if="icon" :class="icon" class="me-1.5" />
      {{ label }}
    </slot>
  </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
  },
  label: {
    type: String,
    required: true
  },
  to: {
    type: [String, Object],
  },
  type: {
    type: String,
    default: "button"
  }
});

const textWrapperStyle = computed(() => {
  if (props.icon) {
    return "py-1 flex items-center justify-center"
  } else {
    return "px-2 py-1 flex items-center justify-center"
  }
})
</script>