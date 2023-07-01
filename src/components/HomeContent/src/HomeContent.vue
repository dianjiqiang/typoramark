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
    <div class="content" v-show="!isEdit" v-html="fileData"></div>
    <div
      ref="editContentRef"
      class="edit-content"
      v-show="isEdit"
      style="overflow: hidden"
      @keydown="changeKeyDown"
    >
      <textarea v-show="!isEdit" ref="editorRef"> </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

import { saveEditMarkdown } from "@/service";

const props = withDefaults(
  defineProps<{
    fileTitle: string;
    fileData: string;
    fileRawData: string;
    isEdit: boolean;
    fileId: string;
  }>(),
  {
    fileTitle: "请先选择文件",
    fileData: "",
    fileRawData: "",
    isEdit: false,
    fileId: "",
  }
);
const emit = defineEmits(["handleClickHidden", "SaveKeydown"]);
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
const editorRef = ref<HTMLTextAreaElement | null>(null);
let simplemde: any;
nextTick(() => {
  simplemde = new SimpleMDE({
    element: editorRef.value,
  });
});

watch(
  () => props.fileRawData,
  (newValue) => {
    if (simplemde) {
      simplemde.value(newValue);
    }
  }
);

const changeKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "s" && props.isEdit && props.fileId) {
    saveEditMarkdown({ text: simplemde.value(), id: props.fileId }).then(
      (res) => {
        if (res.msg) {
          ElMessage(res.msg);
        } else {
          emit("SaveKeydown", res.data);

          ElMessage.success("文件保存成功");
        }
      }
    );
  }
};

watch(
  () => props.isEdit,
  (newVal) => {
    if (newVal) {
      const editContentEl = document.querySelector(
        ".CodeMirror"
      ) as HTMLElement;
      const recurseClick = (clickedEl: HTMLElement) => {
        const children = clickedEl.children;
        if (children.length) {
          for (const child of children) {
            recurseClick(child as HTMLElement);
          }
        } else {
          console.log("click", clickedEl);
          clickedEl.click();
        }
      };
      recurseClick(editContentEl);
    }
  }
);
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
