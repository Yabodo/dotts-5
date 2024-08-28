<template>
  <div class="editorWrapper">
    <div id="editor" class="editor"></div>
  </div>
</template>

<script setup>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import paragraph from "@editorjs/paragraph";
import quote from "@editorjs/quote";
import warning from "@editorjs/warning";
import delimiter from "@editorjs/delimiter";
import list from "@editorjs/list";
import nestedList from "@editorjs/nested-list";
import checklist from "@editorjs/checklist";
import simpleImage from "@editorjs/simple-image";
import table from "@editorjs/table";
import code from "@editorjs/code";
import raw from "@editorjs/raw";
import marker from "@editorjs/marker";
import inlineCode from "@editorjs/inline-code";
import underline from "@editorjs/underline";
import textVariantTune from "@editorjs/text-variant-tune";

import { onMounted } from "vue";

const editor = ref();

const props = defineProps({
  modelValue: {
    default: {},
  },
});

function focusOnEditor() {
  if (editor) {
    editor.value.focus(true);
  }
}

const emit = defineEmits(["update:modelValue"]);
onMounted(() => {
  editor.value = new EditorJS({
    holder: "editor",
    placeholder: "Write whatever!",
    minHeight: 0,
    tools: {
      Header: {
        class: Header,
        inlineToolbar: true,
      },
      paragraph: {
        class: paragraph,
        inlineToolbar: true,
        config: {
          preserveBlank: true,
        },
      },
      quote: {
        class: quote,
        inlineToolbar: true,
      },
      warning: {
        class: warning,
        inlineToolbar: true,
      },
      delimiter: {
        class: delimiter,
        inlineToolbar: true,
      },
      list: {
        class: list,
        inlineToolbar: true,
      },
      nestedList: {
        class: nestedList,
        inlineToolbar: true,
      },
      checklist: {
        class: checklist,
        inlineToolbar: true,
      },
      simpleImage: {
        class: simpleImage,
        inlineToolbar: true,
      },
      table: {
        class: table,
        inlineToolbar: true,
      },
      code: {
        class: code,
        inlineToolbar: true,
      },
      raw: {
        class: raw,
        inlineToolbar: true,
      },
      marker: {
        class: marker,
        inlineToolbar: true,
      },
      inlineCode: {
        class: inlineCode,
        inlineToolbar: true,
      },
      underline: {
        class: underline,
        inlineToolbar: true,
      },
      textVariantTune: {
        class: textVariantTune,
        inlineToolbar: true,
      },
    },
    onChange: (api, event) => {
      api.saver.save().then(async (data) => {
        emit("update:modelValue", data);
      });
    },
    data: props.modelValue,
    logLevel: "ERROR",
  });
});
</script>

<style scoped>
.editorWrapper {
  border: 1px #e4e4e4 solid;
  border-radius: 5px;
}

.editor :deep(.ce-toolbar__content .ce-toolbar__actions) {
  display: none;
}

.editor :deep(.ce-block__content) {
  max-width: unset;
  padding: 0 0.4em;
}
</style>
