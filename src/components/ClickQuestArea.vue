<script setup lang="ts">
import {defineProps} from "vue/dist/vue";
import IconTrash from "@/components/icons/IconTrash.vue";

const props = defineProps<{
  area: {
    left: number,
    top: number,
    width: number,
    height: number,
    link: string
  },
  index: number,
}>();

defineEmits(["delete"]);
</script>

<template>
  <h5 class="px-2">Area {{index + 1}}</h5>
  <div class="pb-2" style="display: grid; grid-template-columns: 1fr auto">
    <div class="input-group px-1">
      <span class="input-group-text">Link</span>
      <input type="text" class="form-control" :value="area.link" @input="e => area.link = e.target.value">
    </div>
    <button type="button" class="btn btn-danger mx-1" @click="$emit('delete')">
      <icon-trash/>
    </button>
  </div>
  <div class="area-form">
    <div class="input-group px-1 pb-2">
      <span class="input-group-text">X</span>
      <input type="number" class="form-control" :value="area.left" @input="e => area.left = e.target.value">
    </div>
    <div class="input-group px-1 pb-2">
      <span class="input-group-text">Y</span>
      <input type="number" class="form-control" :value="area.top" @input="e => area.top = e.target.value">
    </div>
    <div class="input-group px-1">
      <span class="input-group-text">Width</span>
      <input type="number" class="form-control" :value="area.width" @input="e => area.width = e.target.value">
    </div>
    <div class="input-group px-1">
      <span class="input-group-text">Height</span>
      <input type="number" class="form-control" :value="area.height" @input="e => area.height = e.target.value">
    </div>
  </div>
</template>

<style scoped>
.area-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>