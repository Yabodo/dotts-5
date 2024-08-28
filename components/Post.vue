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

const emit = defineEmits(["follow", "unFollow", "share", "edit", "delete"]);

const localUser = inject("localUser");
const localPost = inject("localPost");
const localFollows = inject("localFollows");

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

const onFollow = (tag) => {
  if (localUser.me.value) {
    if (isWallFollowed(tag)) {
      emit("unFollow", tag);
    }
    else if (!isWallFollowed(tag)) {
      emit("follow", tag);
    }
  }
};

function onOpen(tag) {
  if (tag.walls && props.post.users?.name) {
    router.push({
      name: "w-user-wall",
      params: { user: props.post.users.name, wall: tag.walls.name },
    });
  }
}

function isWallFollowed(tag) {
  return localFollows.follows.value.includes(tag.walls.id);
}
</script>

<template>
  <div class="p-16px border border-solid border-slate-100 rounded-md flex items-end justify-between shadow-[0_4px_11px_0_rgba(37,44,97,0.15),0_1px_3px_0_rgba(93,100,148,0.2)] bg-gradient-to-b from-white to-stone-50">
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
        <a v-if="parsedNote.link" target="_blank" :href="parsedNote.link" class="block w-full overflow-hidden text-blue-600 hover:text-blue-800 underline w-100" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block">
          {{ parsedNote.link }}
        </a>
      </div>
      <div>
        <TagButton
          v-for="tag in validTags"
          :key="tag.walls.name"
          :label="tag.walls.name"
          :user="props.post.users"
          :id="tag.walls.id"
          :menu="[
            {
              label: 'Unfollow',
              action: () => onFollow(tag),
              visibility: localUser.me.value?.id !== props.post.users?.id && localUser.me.value && !!isWallFollowed(tag),
            },
            {
              label: 'Follow',
              action: () => onFollow(tag),
              visibility: localUser.me.value?.id !== props.post.users?.id && localUser.me.value && !isWallFollowed(tag),
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
    <div class="controls-wrapper me-2">
      <DropdownButton v-if="localUser.me.value?.id === props.post.users?.id">
        <template #dropdown-options>
          <li @click="onShare()">Share</li>
          <li @click="onEdit()">Edit</li>
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
