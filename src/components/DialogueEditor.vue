<script setup lang="ts">
import {reactive, ref, watch} from "vue"
import DialogueLine from "@/components/DialogueLine.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import DialogueCharacter from "@/components/DialogueCharacter.vue";
import DialogueWrapper from "@/components/DialogueWrapper.vue";
import "../LocalStorageSave"
import LocalStorageSave from "@/LocalStorageSave";
import IconTrash from "@/components/icons/IconTrash.vue";

const localStorageKey = "dialogue-data";
const defaultLine = () => ({
  character: -1,
  text: ""
})
const defaultCharacter = () => ({
  name: "arsenicCatnip",
  tag: "nepeta"
})
const defaultWrapper = () => ({
  name: "Spoiler",
  prefix: "[spoiler open=\"Open\" close=\"Close\"]",
  suffix: "[/spoiler]"
})

const props = defineProps<{
  setClipboardText: (value: string) => void
}>();

const dialogue = reactive<{
  wrapper: number,
  lines: {
    character: number,
    text: string
  }[]
}>({
  wrapper: -1,
  lines: [defaultLine()]
})

const characters = reactive<{
  name: string,
  tag: string
}[]>([defaultCharacter()])

const wrappers = reactive<{
  name: string,
  prefix: string,
  suffix: string
}[]>([defaultWrapper()])

const showClearModal = ref(false);

function moveLine(oldIndex: number, newIndex: number) {
  if (newIndex >= 0 && newIndex < dialogue.lines.length) {
    const movedLine = dialogue.lines[newIndex];
    dialogue.lines[newIndex] = dialogue.lines[oldIndex];
    dialogue.lines[oldIndex] = movedLine;
  }
}

function deleteCharacter(index) {
  characters.splice(index, 1);
  dialogue.lines = dialogue.lines.map(line => {
    if (line.character == index) {
      line.character = -1;
    } else if (line.character > index) {
      line.character--;
    }
    return line;
  })
}

function deleteWrapper(index) {
  wrappers.splice(index, 1);
  if (dialogue.wrapper == index) {
    dialogue.wrapper = -1;
  }
}

function saveChanges() {
  const wrapper = dialogue.wrapper != -1 ? wrappers[dialogue.wrapper] : undefined;
  props.setClipboardText((wrapper ? wrapper.prefix + "\n" : "") + dialogue.lines.map(line => {
    if (line.character != -1) {
      const character = characters[line.character];
      return `<${character.tag}>${character.name}: ${line.text}</${character.tag}>`;
    }
    return line.text;
  }).join("\n\n") + (wrapper ? "\n" + wrapper.suffix : ""));

  let data = [];
  // Dialogue part
  data.push(dialogue.wrapper);
  data.push(dialogue.lines.length);
  for (let i = 0; i < dialogue.lines.length; i++) {
    data.push(dialogue.lines[i].character);
    data.push(dialogue.lines[i].text);
  }
  // Characters part
  data.push(characters.length);
  for (let i = 0; i < characters.length; i++) {
    data.push(characters[i].name);
    data.push(characters[i].tag);
  }
  // Wrappers part
  data.push(wrappers.length);
  for (let i = 0; i < wrappers.length; i++) {
    data.push(wrappers[i].name);
    data.push(wrappers[i].prefix);
    data.push(wrappers[i].suffix);
  }

  LocalStorageSave.save(localStorageKey, data);
}

try {
  const save = new LocalStorageSave(localStorageKey);
  if (save.isLoaded()) {
    dialogue.wrapper = parseInt(save.getItem());
    const linesAmount = parseInt(save.getItem());
    dialogue.lines = [];
    for (let i = 0; i < linesAmount; i++) {
      dialogue.lines.push({
        character: parseInt(save.getItem()),
        text: save.getItem()
      })
    }
    const charactersAmount = parseInt(save.getItem());
    characters.splice(0, characters.length);
    for (let i = 0; i < charactersAmount; i++) {
      characters.push({
        name: save.getItem(),
        tag: save.getItem()
      });
    }
    const wrappersAmount = parseInt(save.getItem());
    wrappers.splice(0, wrappers.length);
    for (let i = 0; i < wrappersAmount; i++) {
      wrappers.push({
        name: save.getItem(),
        prefix: save.getItem(),
        suffix: save.getItem()
      });
    }
    saveChanges();
  }
} catch (e) {
  console.error(e);
  localStorage.removeItem(localStorageKey);
}

watch(dialogue.lines, saveChanges);
watch(() => dialogue.wrapper, saveChanges);
watch(characters, saveChanges);
watch(wrappers, saveChanges);

</script>

<template>
  <select class="form-select mb-2" :value="dialogue.wrapper" @change="e => dialogue.wrapper = e.target.value">
    <option selected :value="-1">No wrapper</option>
    <option v-for="(wrapper, index) in wrappers" :value="index">{{ wrapper.name }}</option>
  </select>
  <dialogue-line v-for="(line, index) in dialogue.lines" :characters :line class="mb-2"
                 @delete="() => {
                   dialogue.lines.splice(index, 1);
                 }"
                 @moveup="moveLine(index, index - 1)" @movedown="moveLine(index, index + 1)"/>
  <button type="button" class="btn btn-success" @click="dialogue.lines.push(defaultLine())">
    <icon-plus/> Add new line
  </button>
  <button type="button" class="btn btn-danger mx-2" @click="showClearModal = true">
    <icon-trash/> Clear dialogue
  </button>
  <div style="display:block;" v-show="showClearModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Clear dialogue</h5>
          <button type="button" class="btn-close" @click="showClearModal = false"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to clear the dialogue?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showClearModal = false">Cancel</button>
          <button type="button" class="btn btn-danger" @click="() => {
            dialogue.lines.splice(0, dialogue.lines.length);
            showClearModal = false;
          }">Clear</button>
        </div>
      </div>
    </div>
  </div>

  <teleport to="#editor-sidebar" defer>
    <h4>Characters</h4>
    <dialogue-character v-for="(character, index) in characters" :character @delete="deleteCharacter(index)"/>
    <button type="button" class="btn btn-success mb-2" @click="characters.push(defaultCharacter())">
      <icon-plus/>
      Add new character
    </button>
    <h4>Wrappers</h4>
    <dialogue-wrapper v-for="(wrapper, index) in wrappers" :wrapper @delete="deleteWrapper(index)"/>
    <button type="button" class="btn btn-success" @click="wrappers.push(defaultWrapper())">
      <icon-plus/>
      Add new wrapper
    </button>
  </teleport>
</template>

<style scoped>

</style>