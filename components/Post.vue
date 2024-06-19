<script setup>
const props = defineProps({
  note: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  tags: {
    type: Object,
    required: true,
  },
  profile: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["share", "edit", "delete"]);

const onShare = () => {
  emit("share");
};

const onEdit = () => {
  emit("edit");
};

const onDelete = () => {
  emit("delete");
};
</script>

<template>
  <div class="post">
    <div class="content-wrapper">
      <NuxtLink
        :to="{
          name: 'u-user',
          params: { user: props.user.name },
        }"
      >
        {{ props.user.name }}
      </NuxtLink>
      <div style="margin-bottom: 1rem">
        <NoteParser :note="JSON.parse(props.note).content" />
        <a :href="JSON.parse(props.note).link">{{
          JSON.parse(props.note).link
        }}</a>
      </div>
      <div>
        <NuxtLink
          v-for="tag in tags"
          :to="{
            name: 'w-user-wall',
            params: { user: props.user.name, wall: tag.walls.name },
          }"
          style="margin-right: 0.1rem"
          >#{{ tag.walls.name }}</NuxtLink
        >
      </div>
    </div>
    <div class="controls-wrapper">
      <Dropdown v-if="props.profile?.id == props.user.id">
        <template #dropdown-options>
          <li @click="onShare()">Share</li>
          <li @click="onEdit()">Edit</li>
          <li @click="onDelete()">Delete</li>
        </template>
      </Dropdown>
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
