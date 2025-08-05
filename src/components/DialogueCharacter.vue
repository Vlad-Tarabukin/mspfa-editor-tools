<script setup lang="ts">
import {defineProps} from "vue/dist/vue";

import IconTrash from "@/components/icons/IconTrash.vue";

defineProps<{
  character: {
    name: string,
    tag: string
  }
}>();

defineEmits(["delete"]);
</script>

<template>
  <div class="mb-2 single-row">
    <div class="input-group">
      <span class="input-group-text">Name</span>
      <input type="text" class="form-control" :value="character.name" @input="e => character.name = e.target.value">
    </div>
    <div class="input-group px-2">
      <span class="input-group-text">HTML Tag</span>
      <input type="text" class="form-control" :value="character.tag" @input="e => character.tag = e.target.value">
    </div>
    <button type="button" class="btn btn-danger pr-2" @click="$emit('delete')"><icon-trash/></button>
  </div>
</template>

<style scoped>
.single-row {
  display: grid;
  grid-template-columns: 1fr 1fr min-content;
}
</style>