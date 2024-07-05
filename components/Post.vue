<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["share", "edit", "delete"]);

const localUser = inject("localUser");
const localPost = inject("localPost");

const parsedNote = computed(() => {
  try {
    return JSON.parse(props.post.note);
  } catch (error) {
    console.error("Error parsing note:", error);
    return { content: {}, link: "" };
  }
});

const validTags = computed(() => {
  return props.post.tags?.filter((tag) => tag.walls?.name) || [];
});

const onShare = () => {
  emit("share");
  localPost.newContent.value = parsedNote.value.content;
  localPost.newLink.value = parsedNote.value.link;
  localPost.refresh.value++;
};

const onEdit = () => {
  emit("edit");
};

const onDelete = () => {
  emit("delete");
};

function onOpen(tag) {
  if (tag.walls && props.post.users?.name) {
    router.push({
      name: "w-user-wall",
      params: { user: props.post.users.name, wall: tag.walls.name },
    });
  }
}
</script>

<template>
  <div class="post">
    <div class="content-wrapper">
      <NuxtLink
        v-if="props.post.users?.name"
        :to="{
          name: 'u-user',
          params: { user: props.post.users.name },
        }"
      >
        {{ props.post.users.name }}
      </NuxtLink>
      <div style="margin-bottom: 1rem">
        <NoteParser :note="parsedNote.content" />
        <a v-if="parsedNote.link" target="_blank" :href="parsedNote.link">{{
          parsedNote.link
        }}</a>
      </div>
      <div>
        <TagButton
          v-for="tag in validTags"
          :key="tag.walls.name"
          :label="tag.walls.name"
          :user="props.post.users"
          :menu="[
            {
              label: 'Follow',
              action: () => console.log('Follow clicked'),
              visibility: localUser.me.value?.id !== props.post.users?.id,
            },
            {
              label: 'Open',
              action: () => onOpen(tag),
              visibility: localUser.me.value?.id !== props.post.users?.id,
            },
          ]"
        />
      </div>
    </div>
    <div class="controls-wrapper">
      <DropdownButton v-if="localUser.me.value?.id === props.post.users?.id">
        <template #dropdown-options>
          <li @click="onShare()">Share</li>
          <li @click="onEdit()">Edit</li>
          <li @click="onDelete()">Delete</li>
        </template>
      </DropdownButton>
      <button v-else type="button" @click="onShare()">Share</button>
    </div>
  </div>
</template>

<style scoped>
.post {
  margin: 1rem 0;
  padding: 0.4rem;
  border: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
