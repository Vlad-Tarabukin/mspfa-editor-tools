<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import IconEyedropper from "@/components/icons/IconEyedropper.vue";
import ClickQuestArea from "@/components/ClickQuestArea.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import LocalStorageSave from "@/LocalStorageSave";
const colors: string[] = ["#000", "#fff", "#dc3545", "#fd7e14", "#ffc107", "#198754", "#0dcaf0", "#0d6efd", "#6f42c1"];
const localStorageKey = "clickquest-data";
enum ImageState {
  Error, // If image was loaded with error or src passed to image is empty string
  Loading,
  Loaded
}

const props = defineProps<{
  setClipboardText: (value: string) => void
}>();

function defaultArea() {
  return ({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    link: storyId.value != "" ? `https://mspfa.com/?s=${storyId.value}&p=` : ""
  });
}

const imageSource = ref("");
const imageState = ref(ImageState.Error);
const storyId = ref("");
const storyName = ref("");
const color = ref(0);
const areas = reactive<{
  left: number,
  top: number,
  width: number,
  height: number,
  link: string
}[]>([]);
const isCreatingArea = ref(false);
const isResizingArea = ref(false);

function saveChanges() {
  props.setClipboardText(
      "<img src=\"" + imageSource.value + "\" alt=\"\" usemap=\"#clickQuestMap\">\n" +
      "<map name=\"clickQuestMap\">\n" +
      areas.map(area =>
          `\t<area shape="rect" coords="${area.left}, ${area.top}, ${area.left + area.width}, ${area.left + area.height}" href="${area.link}" alt="">`
      ).join("\n") + "\n</map>");

  let data = [];
  data.push(imageSource.value);
  data.push(storyId.value);
  data.push(color.value);
  data.push(areas.length);
  for (let i = 0; i < areas.length; i++) {
    data.push(areas[i].left);
    data.push(areas[i].top);
    data.push(areas[i].width);
    data.push(areas[i].height);
    data.push(areas[i].link);
  }

  LocalStorageSave.save(localStorageKey, data);
}

async function setStoryId(value: string) {
  const newId = parseInt(value);
  if (!isNaN(newId) && newId > 0) {
    if (value.split("").every(c => !isNaN(parseInt(c)))) {
      storyId.value = String(value);
      storyName.value = "";
      await fetch("https://mspfa.com/", {
        headers: {
          "accept": "application/json",
          "content-type": "application/x-www-form-urlencoded"
        },
        referrer: "https://mspfa.com/",
        body: "do=story&s=" + storyId.value,
        method: "POST"
      }).then(response => {
        if (!response.ok) {
          throw new Error("Can't connect to MSPFA. Status code: " + response.status);
        }
        return response.json();
      }).then(response => {
        storyName.value = response.n;
      }).catch(e => {
        storyName.value = undefined;
        console.error(e);
      })
    }
  }
}

function getMousePos(event: MouseEvent): {x: number, y: number} {
  const rect = document.getElementById("click-quest-image").getBoundingClientRect();
  return {
    x: Math.round(event.x - rect.x),
    y: Math.round(event.y - rect.y)
  }
}

function createArea(event: MouseEvent) {
  if (isCreatingArea.value) {
    isCreatingArea.value = false;
    isResizingArea.value = true;
    const pos = getMousePos(event);
    areas.push(defaultArea());
    areas[areas.length - 1].left = pos.x;
    areas[areas.length - 1].top = pos.y;
    saveChanges();
  }
}

function resizeArea(event: MouseEvent) {
  if (isResizingArea.value) {
    const pos = getMousePos(event);
    areas[areas.length - 1].width = pos.x - areas[areas.length - 1].left;
    areas[areas.length - 1].height = pos.y - areas[areas.length - 1].top;
    saveChanges();
  }
}

try {
  const save = new LocalStorageSave(localStorageKey);
  if (save.isLoaded()) {
    imageSource.value = save.getItem();
    storyId.value = save.getItem();
    color.value = parseInt(save.getItem());
    const areasAmount = parseInt(save.getItem());
    for (let i = 0; i < areasAmount; i++) {
      areas.push({
        left: parseInt(save.getItem()),
        top: parseInt(save.getItem()),
        width: parseInt(save.getItem()),
        height: parseInt(save.getItem()),
        link: save.getItem()
      })
    }
    saveChanges();
  }
} catch (e) {
  console.error(e);
  localStorage.removeItem(localStorageKey);
}

watch(imageSource, saveChanges);
watch(storyId, saveChanges);
watch(color, saveChanges);
watch(areas, saveChanges);

</script>

<template>
  <div class="d-flex h-100 w-100 justify-content-center align-items-center">
    <div :class="['img-thumbnail', imageState == ImageState.Loaded ? null : 'image-not-loaded']"
      @mousedown="e => createArea(e)" @mousemove="e => resizeArea(e)" @mouseup="isResizingArea = false">
      <img :src="imageSource" loading="eager" alt="" draggable="false" id="click-quest-image"
           @error="imageState = ImageState.Error"
           @loadstart="imageState = ImageState.Loading"
           @load="imageState = ImageState.Loaded" v-show="imageState == ImageState.Loaded">
      <div class="image-placeholder text-secondary" v-show="imageState != ImageState.Loaded">
        <div class="spinner-border" role="status" v-if="imageState == ImageState.Loading"/>
        <p v-else-if="imageSource === ''">
          Pass the image link in the field at the right<br>
          (The image has to fit in MSPFA page without any resize)
        </p>
        <p v-else>There was an error loading the image :(</p>
      </div>
      <div v-if="imageState == ImageState.Loaded" v-for="(area, index) in areas" class="area border border-2"
            :style="{left: area.left + 'px', top: area.top + 'px',
             width: area.width + 'px', height: area.height + 'px'}"><p class="mx-1">{{index + 1}}</p></div>
    </div>
  </div>
  <teleport to="#editor-sidebar" defer>
    <div class="color-buttons mb-2">
      <button class="btn mx-1" v-for="(c, index) in colors"
              :style="{backgroundColor: c, color: index == 1 ? 'black' : 'white'}" @click="color = index">
        <icon-eyedropper :style="{transform: color == index ? 'scale(180%)' : 'none'}"/></button>
    </div>
    <div class="input-group mb-2">
      <span class="input-group-text">Image link</span>
      <input type="text" class="form-control" :value="imageSource" @input="e => imageSource = e.target.value">
    </div>
    <div class="input-group mb-2">
      <span class="input-group-text">Story id (unnecessary)</span>
      <input type="text" class="form-control" :value="storyId" @input="e => {
        const value = e.target.value;
        if (value != '') {
          setStoryId(e.target.value);
          e.target.value = storyId;
        } else {
          storyId = value;
        }
      }">
    </div>
    <div class="form-text mx-2">
      <p v-if="storyId == ''">
        Enter the story id if you want to create areas with links to pages of the story.
        (Story id is a number after "https://mspfa.com/?s=" in the address of a story)
      </p>
      <p v-else-if="storyName == undefined" class="text-danger">
        No such story with this id.
      </p>
      <p v-else-if="storyName != ''">
        Story name: "{{storyName}}".
      </p>
      <p v-else>
        Loading...
      </p>
    </div>
    <h4>Areas</h4>
    <ul class="list-group mb-2">
      <li class="list-group-item" v-for="(area, index) in areas">
        <click-quest-area :area :index @delete="() => {
          areas.splice(index, 1);
          saveChanges();
        }"/>
      </li>
      <li class="list-group-item" v-if="areas.length == 0">No areas</li>
    </ul>
    <button type="button" class="btn btn-success" @click="isCreatingArea = !isCreatingArea">
      <icon-plus/> {{isCreatingArea ? "Click again to cancel" : "Add new area"}}
    </button>
  </teleport>
</template>

<style scoped>
.img-thumbnail {
  width: min-content;
  height: min-content;
  position: relative;
}
.area {
  user-select: none;
  font-weight: bolder;
  position: absolute;
  z-index: 2;
  opacity: 0.7;
  background-image: linear-gradient(v-bind(colors[color]) -200%, rgba(0, 0, 0, 0) 150%);
  color: v-bind(colors[color]);
  --bs-border-color: v-bind(colors[color]);
}
.color-buttons {
  display: grid;
  grid-template-columns: repeat(v-bind(colors.length), 1fr);
}
.image-not-loaded {
  width: 600px;
  height: 400px;
}
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--bs-gray-300);
}
</style>