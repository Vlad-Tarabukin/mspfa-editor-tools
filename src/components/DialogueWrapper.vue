<script setup lang="ts">

import IconTrash from "@/components/icons/IconTrash.vue";

defineProps<{
  wrapper: {
    name: string,
    prefix: string,
    suffix: string
  }
}>();

defineEmits(["delete"]);
</script>

<template>
  <div class="mb-1 single-row">
    <div class="input-group">
      <span class="input-group-text">Name</span>
      <input type="text" class="form-control" :value="wrapper.name" @input="e => wrapper.name = e.target.value">
    </div>
    <span class="mx-1"/>
    <button type="button" class="btn btn-danger" @click="$emit('delete')"><icon-trash/></button>
  </div>
  <div class="input-group mb-1">
    <span class="input-group-text">Prefix</span>
    <input type="text" class="form-control" :value="wrapper.prefix" @input="e => wrapper.prefix = e.target.value">
  </div>
  <div class="input-group mb-2">
    <span class="input-group-text">Suffix</span>
    <input type="text" class="form-control" :value="wrapper.suffix" @input="e => wrapper.suffix = e.target.value">
  </div>
</template>

<style scoped>
.single-row {
  display: grid;
  grid-template-columns: 1fr min-content min-content;
}
.input-group-text {
  width: min-content;
}
</style>