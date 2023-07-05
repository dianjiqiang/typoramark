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
    <div @keydown="changeKeyDown">
      <div
        class="content"
        ref="contentRef"
        v-html="fileData"
        :class="{ isNotShow: isEdit }"
      ></div>
      <textarea class="edit-content" v-show="isEdit" ref="editorRef">
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";

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

const showOpacity = ref<0 | 1>(0);
const showPosition = ref<"absolute" | "">("absolute");
const showHeight = ref<0 | "auto">(0);
const showOverflow = ref<"" | "hidden">("hidden");
watch(
  () => props.isEdit,
  (newVal) => {
    console.log(props.isEdit);

    if (newVal === false) {
      showOpacity.value = 0;
      showPosition.value = "absolute";
      showHeight.value = 0;
      showOverflow.value = "hidden";
    } else {
      showPosition.value = "";
      showOpacity.value = 1;
      showHeight.value = "auto";
      showOverflow.value = "";
    }
  }
);

const changeKeyDown = (event: KeyboardEvent) => {
  console.log("点了");

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

// 大纲高亮
let observer: IntersectionObserver | null = null;
let editerHeaders: any[] = [];
const contentRef = ref<HTMLDivElement | null>(null);
watch(
  () => props.fileData,
  () => {
    nextTick(() => {
      const h1s = document.querySelectorAll(".content h1");
      const h2s = document.querySelectorAll(".content h2");
      const h3s = document.querySelectorAll(".content h3");
      const h4s = document.querySelectorAll(".content h4");
      const h5s = document.querySelectorAll(".content h5");
      const h6s = document.querySelectorAll(".content h6");
      editerHeaders = [...h1s, ...h2s, ...h3s, ...h4s, ...h5s, ...h6s];
      for (const header of editerHeaders) {
        if (observer) {
          observer.observe(header);
        }
      }
    });
  }
);
const scrollCallback = (e: Event) => {
  // console.log(e);
};
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          console.log("enter", entry.target);

          // 目标进入视窗，添加高亮效果
          // entry.target.classList.add("highlight"); // 假设高亮的类名为'highlight'
        } else {
          // 目标离开视窗，移除高亮效果
          // entry.target.classList.remove("highlight");
          console.log("leave", entry.target);
        }
      }
    },
    { root: contentRef.value, rootMargin: "300px 0px 0px 0px" }
  );
  contentRef.value?.addEventListener("scroll", scrollCallback);
});
onUnmounted(() => {
  contentRef.value?.removeEventListener("scroll", scrollCallback);
});
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
  .isNotShow {
    display: none;
  }
}

/* :deep(.editor-toolbar) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
}
:deep(.CodeMirror) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
}
:deep(.editor-preview-side) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
}
:deep(.editor-statusbar) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
}
:deep(.edit-content) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
}
:deep(.CodeMirror-lines) {
  opacity: v-bind(showOpacity);
  position: v-bind(showPosition) !important;
  height: v-bind(showHeight) !important;
  overflow: v-bind(showOverflow) !important;
} */
</style>
