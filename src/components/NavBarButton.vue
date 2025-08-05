<script setup lang="ts">
const props = defineProps<{
  editorIndex: number,
  text: string,
  editor: number,
  setEditor: (value: number) => void
}>();
</script>

<template>
  <li class="nav-item">
    <button :class="'nav-link' + (editor == editorIndex ? ' active' : '')" @click="setEditor(editorIndex)">{{text}}</button>
  </li>
</template>