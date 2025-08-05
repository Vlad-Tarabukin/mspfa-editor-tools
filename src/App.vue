<script setup lang="ts">
import DialogueEditor from "@/components/DialogueEditor.vue";
import {ref} from "vue";
import IconClipboard from "@/components/icons/IconClipboard.vue";
import ClickQuestEditor from "@/components/ClickQuestEditor.vue";
import NavBarButton from "@/components/NavBarButton.vue";

const clipboardText = ref("");
const editor = ref(0);
function setClipboardText(value: string) {
  clipboardText.value = value;
}

function copyToClipboard() {
  navigator.clipboard.writeText(clipboardText.value);
}

const setEditor = (value: number) => editor.value = value;

</script>

<template>
  <div id="root">
    <header>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#" @click="e => {
            editor = 0;
            e.preventDefault();
          }">MSPFA Editor's tools</a>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <nav-bar-button :editor :set-editor text="Dialogue" :editor-index="1"/>
              <nav-bar-button :editor :set-editor text="Click quest" :editor-index="2"/>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <div id="editors" class="p-2">
        <dialogue-editor v-if="editor == 1" :set-clipboard-text/>
        <click-quest-editor v-else-if="editor == 2" :set-clipboard-text/>
        <div v-else id="welcome-page">
          <h3>MSPFA Editor's Tools</h3>
          <p>MSPFA Editor's Tools is a website with some useful tools for people
            who write stories on <a href="https://mspfa.com/">MSPaint Fan Adventures</a>.
          </p>
          <h5>Dialogue Editor</h5>
          <p>Dialogue Editor is used for writing dialogues, where each character has a different text colors or effects.
            This can be achieved via creating HTML tags in CSS of your comic.
            Also the editor can pack dialogues in wrappers like spoiler or any other element you want.
          </p>
          <h5>Click Quest Editor</h5>
          <p>Click Quest Editor is used for creating pages, where user can click on different areas of image
            in order to get to other pages of comic or even to other websites.
          </p>
        </div>
      </div>
      <div id="sidebar" class="p-2">
        <div id="editor-sidebar"></div>
        <span class="d-flex justify-content-center my-2">
          <button type="button" class="btn btn-success" @click="copyToClipboard"><icon-clipboard/> Copy BBCode to clipboard</button>
        </span>
        <textarea readonly class="form-control" :value="clipboardText"></textarea>
      </div>
    </main>
  </div>
</template>

<style scoped>
#root {
  position: absolute;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: min-content 1fr;
  overflow-y: hidden;
}
#sidebar {
  height: 100%;
  background-color: whitesmoke;
  border-left: silver 2px solid;
  display: grid;
  grid-template-rows: 1fr min-content 15em;
}
#editor-sidebar {
  overflow-y: scroll;
  overflow-x: hidden;
}
.navbar {
  font-family: "Courier New", serif;
  font-weight: bolder;
  background-image: linear-gradient(#8bff47, #66e819);
}
main {
  display: grid;
  grid-template-columns: 70% 30%;
}
textarea {
  resize: none;
  white-space: pre;
}
</style>
