<template>
  <NuxtLink
    :to="to"
    class="underline decoration-blue-500 hover:decoration-none cursor-pointer text-gray-700 transition px-3 text-center hover:-translate-y-0.5 active:translate-y-0"
  >
    <div :class="textWrapperStyle">
      <slot>
        <div v-if="icon" :class="icon" class="me-1.5" />
        <p class="button-label">{{ label }}</p>
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

<style scoped>
.button-label {
  display: none;
}

@media screen and (min-width: 769px) {
  .button-label {
    display: block;
  }
}
</style>