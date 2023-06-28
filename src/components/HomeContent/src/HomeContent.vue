<template>
  <div class="home-content">
    <div class="top">
      <el-card class="content-title-card">
        <div class="icon" style="width: 30px; height: 30px">
          <img
            v-show="!isHiddenMenu"
            @click="() => openMenu(true)"
            :src="require('./收起.png')"
          />
          <img
            v-show="isHiddenMenu"
            :src="require('./展开.png')"
            @click="() => openMenu(false)"
          />
        </div>
        <h3 style="flex: 1; text-align: center">
          {{ fileTitle }}
        </h3>
        <div class="right" style="width: 30px; height: 30px">
          <ThemeButton />
        </div>
      </el-card>
    </div>
    <div class="content">
      <div ref="editorRef" class="yxxfd-editor" @keydown="changeKeyDown"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type Editor from "wangeditor";
import WangEditor from "wangeditor";
import { clearCodeInspan } from "@/utils/format";

// 逆向解析
const converter = new showdown.Converter();

const props = withDefaults(
  defineProps<{
    fileTitle: string;
    fileData: string;
  }>(),
  {
    fileTitle: "请先选择文件",
    fileData: "",
  }
);
const emit = defineEmits(["handleClickHidden"]);
const isHiddenMenu = ref(false);
const width = ref("calc(100vw - 303px)");

const openMenu = (e: boolean) => {
  isHiddenMenu.value = e;
  if (e === false) {
    width.value = "calc(100vw - 303px)";
  } else {
    width.value = "100vw";
  }
  emit("handleClickHidden", e);
};

// 富文本编辑区域
const instance = ref<Editor | null>(null);
const editorRef = ref<HTMLDivElement | null>(null);
let editValue = "";
watch(
  () => props.fileData,
  (newValue) => {
    if (instance.value) {
      instance.value.destroy();
    }
    setTimeout(() => {
      instance.value = new WangEditor(editorRef.value);
      if (!instance.value) return;
      const editor: Editor = instance.value as Editor;
      editor.config.height = "100vh - 160px";
      editor.config.zIndex = 1;
      editor.config.onchange = function (newHtml: string) {
        editValue = newHtml;
      };
      editor.config.menus = [];
      instance.value.create();
      initEditorContent(newValue);
    });
  }
);

const initEditorContent = (htmlStr: string, isFocus = false) => {
  if (!instance.value) return;
  const editor: Editor = instance.value as Editor;
  editor.config.focus = isFocus;
  editor.txt.html(htmlStr);
};

const changeKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "s") {
    // console.log(clearCodeInspan(editValue));
    const mdContent = converter.makeMarkdown(editValue);
    const newMdContent = clearCodeInspan(mdContent);

    console.log(newMdContent);
  }
};
</script>

<style scoped lang="scss">
.home-content {
  flex: 1;
  height: 100%;

  .content {
    box-sizing: border-box;
    width: v-bind(width);
    padding: 30px 30px 50px;
    height: calc(100vh - 60px);
    scroll-behavior: smooth;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .icon {
    display: flex;
  }

  .yxxfd-editor {
    text-align: left;
  }
}
</style>
