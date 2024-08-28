<template>
  <div v-html="html" class="whitespace-normal"></div>
</template>

<script setup>
import { ref, computed } from "vue";
import EditorJSParser from "editorjs-html";

const props = defineProps({
  note: Object, // Editor.js saved data
});

function renderTable(blockData) {
  let html =
    '<div class="bg-gray-100 flex items-center justify-center"><table class="min-w-max w-full bg-white overflow-hidden">';

  if (Array.isArray(blockData.data.content)) {
    blockData.data.content.forEach((row) => {
      html += '<tr class="text-sm text-left text-gray-700 border-b">';
      if (Array.isArray(row)) {
        row.forEach((cell) => {
          html += `<td class="p-4">${cell}</td>`;
        });
      }
      html += "</tr>";
    });
  }

  html += "</table></div>";
  return html;
}

function renderWarning(blockData) {
  return `
    <div id="alert-additional-content-1" class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
      <div class="flex items-center">
        <svg class="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span class="sr-only">Info</span>
        <h3 class="text-lg font-medium">${blockData.data.title}</h3>
      </div>
      <div class="mt-2 mb-4 text-sm">
        ${blockData.data.message}
      </div>
    </div>
  `;
}

function renderQuote(blockData) {
  return `
    <blockquote class="p-4 border-l-4 border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 italic my-4 rounded-lg shadow-md">
      <p class="mb-2">${blockData.data.text}</p>
      <cite class="block text-sm text-right dark:text-gray-400">— ${blockData.data.caption}</cite>
    </blockquote>
  `;
}

function renderParagraph(blockData) {
  return blockData.data.text.trim() === ""
    ? "<br />"
    : `<p>${blockData.data.text}</p>`;
}

function renderChecklist(blockData) {
  const tasks = blockData.data.items
    .map((item) => {
      return `
      <label class="custom-label flex mt-2 ml-3">
        <div class="bg-white shadow w-6 h-6 p-1 flex justify-center items-center mr-2 relative">
            <input type="checkbox" class="absolute opacity-0 w-full h-full top-0 left-0" ${
              item.checked ? "checked" : ""
            }>
            <svg class="w-4 h-4 text-green-600 pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              item.checked ? "" : "hidden"
            }" viewBox="0 0 172 172">
              <g fill="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal">
                <path d="M0 172V0h172v172z"/>
                <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" stroke-width="1"/>
              </g>
            </svg>
        </div>
        <span class="select-none"> ${item.text}</span>
      </label>
    `;
    })
    .join("");

  return `
    <div class="flex flex-col w-full border border-gray-400 shadow-lg overflow-hidden m-auto pb-4">
      ${tasks}
    </div>
  `;
}

function renderNestedList(blockData) {
  let currentNumbering = [];

  function renderItems(items, depth = 0) {
    const baseStyle = "pl-5";
    const listItemStyle = "mb-2";

    if (blockData.data.style === "ordered") {
      if (currentNumbering.length <= depth) {
        currentNumbering.push(0);
      }

      return items
        .map((item, index) => {
          currentNumbering[depth] = index + 1;
          const numberingString = currentNumbering
            .slice(0, depth + 1)
            .join(".");
          const subList =
            item.items && item.items.length
              ? `<ol class="${baseStyle}">${renderItems(
                  item.items,
                  depth + 1
                )}</ol>`
              : "";

          return `<li class="${listItemStyle}">${numberingString}. ${item.content}${subList}</li>`;
        })
        .join("");
    } else {
      return items
        .map((item) => {
          const subList =
            item.items && item.items.length
              ? `<ul class="${baseStyle} list-disc list-inside">${renderItems(
                  item.items,
                  depth + 1
                )}</ul>`
              : "";

          return `<li class="${listItemStyle}">${item.content}${subList}</li>`;
        })
        .join("");
    }
  }

  const content = renderItems(blockData.data.items);
  const baseListStyle = "list-inside my-4";
  const unorderedListStyle = `${baseListStyle} list-disc`;

  return blockData.data.style === "ordered"
    ? `<ol class="${baseListStyle}">${content}</ol>`
    : `<ul class="${unorderedListStyle}">${content}</ul>`;
}

function renderHeader(blockData) {
  const { level, text } = blockData.data;

  const baseStyles = "font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-100";
  let specificStyles = "";

  switch (level) {
    case 1:
      specificStyles = "text-4xl";
      break;
    case 2:
      specificStyles = "text-3xl";
      break;
    case 3:
      specificStyles = "text-2xl";
      break;
    case 4:
      specificStyles = "text-xl";
      break;
    case 5:
      specificStyles = "text-lg";
      break;
    case 6:
      specificStyles = "text-base";
      break;
    default:
      specificStyles = "text-base";
  }

  return `<h${level} class="${baseStyles} ${specificStyles}">${text}</h${level}>`;
}

function renderLink(blockData) {
  const { link, meta } = blockData.data;

  // Check if metadata exists or provide fallback
  const title = meta?.title || "No title found";
  const description = meta?.description || "No description found";
  const anchor = new URL(link).hostname;

  return `
    <div class="p-4 my-4 border border-gray-200 rounded shadow">
      <a href="${link}" target="_blank" rel="nofollow noindex noreferrer" class="block hover:text-blue-600">
        <div class="font-semibold">${title}</div>
        <p class="mt-2 text-sm text-gray-500">${description}</p>
        <span class="mt-2 block text-xs text-gray-400">${anchor}</span>
      </a>
    </div>
  `;
}

function renderDelimiter() {
  return `
    <hr class="border-t border-gray-300 my-8">
  `;
}

function renderImage(blockData) {
  const imageUrl = blockData.data.file.url;
  const caption = blockData.data.caption || "";
  const stretched = blockData.data.stretched
    ? "w-full"
    : "max-w-md w-full mx-auto";
  const withBackground = blockData.data.withBackground ? "bg-gray-200 p-2" : "";
  const withBorder = blockData.data.withBorder ? "border border-gray-300" : "";

  const imgClasses = `block ${stretched} ${withBackground} ${withBorder}`;
  const captionClasses = "text-center text-sm text-gray-600 mt-2";

  return `
    <div class="my-4">
      <img src="${imageUrl}" alt="${caption}" class="${imgClasses}" />
      <figcaption class="${captionClasses}">${caption}</figcaption>
    </div>
  `;
}

const parser = EditorJSParser({
  table: renderTable,
  quote: renderQuote,
  checklist: renderChecklist,
  nestedList: renderNestedList,
  header: renderHeader,
  link: renderLink,
  delimiter: renderDelimiter,
  image: renderImage,
  // ... add other block handlers as needed
});

const html = computed(() => {
  let output = "";
  if (props.note && Array.isArray(props.note.blocks)) {
    props.note.blocks.forEach((block) => {
      switch (block.type) {
        case "table":
          output += renderTable(block);
          break;
        case "quote":
          output += renderQuote(block);
          break;
        case "paragraph":
          output += renderParagraph(block);
          break;
        case "warning":
          output += renderWarning(block);
          break;
        case "checklist":
          output += renderChecklist(block);
          break;
        case "nestedList":
          output += renderNestedList(block);
          break;
        case "Header":
          output += renderHeader(block);
          break;
        case "link":
          output += renderLink(block);
          break;
        case "delimiter":
          output += renderDelimiter();
          break;
        case "image":
          output += renderImage(block);
          break;
        // ... handle other block types as needed
        default:
          console.warn(`Unhandled block type: ${block.type}`);
      }
    });
  }
  return output;
});
</script>
