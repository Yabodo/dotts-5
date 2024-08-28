<template>
  <button
    v-if="!to"
    type="button"
    :class="buttonCss"
  >
    <div :class="textWrapperStyle">
      <slot>
        <div v-if="icon" :class="[icon, iconCss]" />
        {{ label }}
      </slot>
    </div>
  </button>
  <NuxtLink
    v-else
    :to="to"
    :class="buttonCss"
  >
    <div :class="textWrapperStyle">
      <slot>
        <div v-if="icon" :class="[icon, iconCss]" />
        {{ label }}
      </slot>
    </div>
  </NuxtLink>
</template>

<script setup>
const buttonCss = "text-blue-600 hover:text-white cursor-pointer bg-white hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 border border-2 border-inside border-blue-600 rounded-lg px-3 -py-1.5 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
const iconCss = "me-1.5"

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