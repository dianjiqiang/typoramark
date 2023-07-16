<template>
  <div class="home-content">
    <!-- <div
      class="test-scrolltop"
      style="position: fixed; top: 10px; z-index: 9; opacity: 1"
    >
      {{ testScrollTop }}
    </div> -->
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

import * as _ from "lodash";

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
type EditerHeader = {
  offset: number;
  el: Element;
};
type ActiveHeader = {
  offset: number;
  el: Element;
};
const contentRef = ref<HTMLDivElement | null>(null);
// const testScrollTop = ref(0);
let editerHeaders: EditerHeader[] | HTMLHeadingElement[] = [];
let outlineLinks: HTMLAnchorElement[] = [];
let lastActiveOutline: Element | null = null;
let lastActiveHeader: ActiveHeader | null = null;
const updateEditerHeaders = () => {
  nextTick(() => {
    const h1s = document.querySelectorAll<HTMLHeadingElement>(".content h1");
    const h2s = document.querySelectorAll<HTMLHeadingElement>(".content h2");
    const h3s = document.querySelectorAll<HTMLHeadingElement>(".content h3");
    const h4s = document.querySelectorAll<HTMLHeadingElement>(".content h4");
    const h5s = document.querySelectorAll<HTMLHeadingElement>(".content h5");
    const h6s = document.querySelectorAll<HTMLHeadingElement>(".content h6");
    editerHeaders = [...h1s, ...h2s, ...h3s, ...h4s, ...h5s, ...h6s];
    // console.log(editerHeaders);
  });
};
const updateOutlineLinks = () => {
  nextTick(() => {
    const links =
      document.querySelectorAll<HTMLAnchorElement>(".content-tree a");
    outlineLinks = [...links];
    // console.log(outlineLinks);
  });
};
const updateEditorContent = () => {
  nextTick(() => {
    for (const header of editerHeaders) {
      const brEl = document.createElement("br");
      const headingEl = header as Element;
      headingEl.after(brEl);
    }
    // for (const header of editerHeaders) {
    //   const spanEl = document.createElement("span");
    //   spanEl.innerText = `(${header.offsetTop})`;
    //   header.after(spanEl);
    // }
    editerHeaders = editerHeaders
      .map((item) => {
        const divEl = item as HTMLDivElement;
        return { offset: divEl?.offsetTop, el: item };
      })
      .sort((a, b) => {
        return a.offset - b.offset;
      }) as EditerHeader[];
  });
};
const waitImageLoaded = (callback: () => void) => {
  nextTick(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>(".content img");
    // console.log(imgs);
    let loadedImgs = 0;
    if (imgs.length === 0 && typeof callback === "function") {
      callback();
      return;
    }
    for (const index in imgs) {
      const imgEl: HTMLImageElement = imgs[index];
      if (typeof imgEl !== "object") continue;
      if (!imgEl.src || !imgEl.src?.trim()) {
        loadedImgs++;
        if (loadedImgs === imgs.length && typeof callback === "function") {
          callback();
        }
        continue;
      }
      imgEl.onload = () => {
        loadedImgs++;
        // console.log(`${imgEl.src} 加载完成`);
        if (loadedImgs === imgs.length && typeof callback === "function") {
          callback();
          // console.log("所有图片加载完成");
        }
      };
      imgEl.onerror = () => {
        loadedImgs++;
        // console.log(`${imgEl.src} 加载失败`);
        if (loadedImgs === imgs.length && typeof callback === "function") {
          callback();
          // console.log("所有图片加载完成");
        }
      };
    }
  });
};
const resetData = () => {
  editerHeaders = [];
  outlineLinks = [];
  lastActiveHeader = null;
  lastActiveOutline = null;
};
watch(
  () => props.fileData,
  () => {
    const callback = () => {
      updateEditerHeaders();
      updateOutlineLinks();
      updateEditorContent();
    };
    resetData();
    waitImageLoaded(callback);
  }
);
const scrollCallback = (e: Event) => {
  const targetElement = e.target as HTMLDivElement;
  const scrollTop = targetElement.scrollTop;
  // testScrollTop.value = scrollTop;
  let activeHeader: ActiveHeader | null = null;
  for (const link of outlineLinks) {
    link?.parentElement?.parentElement?.classList.remove("is-focusable");
  }
  for (const index in editerHeaders) {
    const currentHeader = editerHeaders[index] as ActiveHeader;
    const ctOffset = currentHeader?.offset;
    // console.log(ctOffset);
    if (scrollTop <= ctOffset) {
      activeHeader = currentHeader;
      break;
    }
  }
  if (lastActiveOutline) {
    lastActiveOutline.classList.remove("a-active");
  }
  if (lastActiveHeader) {
    lastActiveHeader.el.classList.remove("a-active");
  }
  if (activeHeader) {
    lastActiveHeader = activeHeader;
    const targetOutlineLink = outlineLinks.find((item) => {
      return item.textContent === activeHeader?.el?.textContent;
    });
    if (targetOutlineLink) {
      targetOutlineLink.classList.add("a-active");
      lastActiveOutline = targetOutlineLink;
      // location.hash = targetOutlineLink?.textContent;
    }
    // console.log("targetOutlineLink", targetOutlineLink);
  }
};
const _scrollCallback = _.debounce(scrollCallback, 300);
onMounted(() => {
  contentRef.value?.addEventListener("scroll", _scrollCallback);
});
onUnmounted(() => {
  contentRef.value?.removeEventListener("scroll", _scrollCallback);
});
defineExpose({ updateOutlineLinks });
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
    position: relative;
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
