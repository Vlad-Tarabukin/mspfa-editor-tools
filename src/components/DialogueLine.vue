<script setup lang="ts">
import IconUp from "@/components/icons/IconUp.vue";
import IconDown from "@/components/icons/IconDown.vue";
import IconTrash from "@/components/icons/IconTrash.vue";

defineProps<{
  line: {
    character: number,
    text: string
  },
  characters: {
    name: string,
    tag: string
  }[]
}>()

defineEmits(["moveup", "movedown", "delete"]);

</script>

<template>
  <div class="input-group">
    <div class="input-group-text">
      <select class="form-select" :value="line.character" @change="e => line.character = e.target.value">
        <option selected value="-1">No character</option>
        <option v-for="(character, index) in characters" :value="index">{{character.name}}</option>
      </select>
      <div class="d-inline">
        <div class="btn-group float-start" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-dark" @click="$emit('moveup')"><icon-up/></button>
          <button type="button" class="btn btn-outline-dark" @click="$emit('movedown')"><icon-down/></button>
        </div>
        <button type="button" class="btn btn-danger float-end" @click="$emit('delete')"><icon-trash/></button>
      </div>
    </div>
    <textarea class="form-control" :value="line.text" @input="e => line.text = e.target.value"></textarea>
  </div>
</template>

<style scoped>
select {
  width: 10em;
}
textarea {
  min-height: 7em;
}
.input-group-text {
  display: grid;
  grid-template-rows: 1fr 1fr;
}
</style>