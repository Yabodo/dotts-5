<script setup>
import { computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["share", "edit", "delete"]);

const localUser = inject("localUser");
const localPost = inject("localPost");

function parseContent(content) {
  if (!content) return '';
  
  try {
    // Try to parse as JSON
    return JSON.parse(content);
  } catch (e) {
    // If parsing fails, return the original string
    if (typeof content === "string") {
      return content;
    }
    else {
      return { content: {}, link: "" };
    }
  }
}

const parsedNote = computed(() => {
  return parseContent(props.post.note);
});

const onShare = () => {
  emit("share");
  localPost.newContent.value = parsedNote.value.content;
  console.log(localPost.newContent.value)
  localPost.newLink.value = parsedNote.value.link;
  localPost.refresh.value++;
};

const onDelete = () => {
  emit("delete");
};
</script>

<template>
  <div class="p-16px border border-solid border-slate-100 rounded-md flex items-end justify-between shadow-[0_4px_11px_0_rgba(37,44,97,0.15),0_1px_3px_0_rgba(93,100,148,0.2)] bg-gradient-to-b from-white to-stone-50">
    <div class="content-wrapper">
      <ButtonUsername
        v-if="props.post.users?.name"
        :to="{
          name: 'u-user',
          params: { user: props.post.users.name },
        }"
        :label="props.post.users.name"
      />
      <div style="margin-bottom: 1rem">
        <NoteParser :note="parsedNote.content" />
        <a v-if="parsedNote.link" target="_blank" :href="parsedNote.link" class="block w-full overflow-hidden text-blue-600 hover:text-blue-800 underline w-100" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block">
          {{ parsedNote.link }}
        </a>
      </div>
    </div>
    <div class="controls-wrapper me-2">
      <DropdownButton v-if="localUser.me.value?.id === props.post.users?.id">
        <template #dropdown-options>
          <li @click="onShare()">Share</li>
          <li @click="onDelete()">Delete</li>
        </template>
      </DropdownButton>
      <ButtonTransparentIcon v-else @click="onShare()" icon="i-tabler-copy" />
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  max-width: calc(80%)
}
</style>
