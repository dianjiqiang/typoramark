<template>
  <div class="app">
    <HomeFolder
      class="home-folder"
      v-show="!isHidden"
      :folderData="folderData"
      @handleTreeClick="handleTreeClick"
      :outlineData="outlineData"
    />
    <HomeContent
      :fileTitle="fileTitle"
      @handleClickHidden="handleClickHidden"
      :fileData="fileData"
      :fileRawData="fileRawData"
      :isEdit="isEdit"
      :fileId="fileId"
      @SaveKeydown="SaveKeydown"
    />
    <UtilsComponents
      @createSuccessFolder="createSuccessFolder"
      :folderData="folderData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";

import HomeFolder from "./components/HomeFolder";
import HomeContent from "./components/HomeContent";
import { formatMarkdown } from "./utils/format";
import useThemeStore from "./store/modules/theme";
import UtilsComponents from "./components/UtilsComponents";
import { getHomeMdFile, getFileTree } from "./service";

import type {
  folderInFileType,
  FolderType,
  outlineType,
} from "./store/modules/file";

// 点击了隐藏menu
const isHidden = ref(false);
const handleClickHidden = (e: boolean) => {
  isHidden.value = e;
};

const folderData = ref<folderInFileType>([]); // 这里不是采用ref定义的  应该是 storeToRefs 这里懒了, 就写伪代码
onMounted(async () => {
  const res = await getFileTree();
  folderData.value = res.data;
});
// 树点击
const outlineData = ref<outlineType[]>([]);
const fileTitle = ref<string>();
const fileRawData = ref<string>();
const fileId = ref<string>();
let fileData = ref<string>("");
const handleTreeClick = (e: FolderType) => {
  if (e.type === "file") {
    fileTitle.value = e.label;
    fileId.value = e.id;
    // 获取到详细内容后 返回
    getHomeMdFile(e.name).then((res) => {
      outlineData.value = formatMarkdown(res.data.content);
      fileRawData.value = res.data.raw;
      fileData.value = res.data.content;
    });
  }
};

// 获取主题
const themeStore = useThemeStore();
themeStore.initializeThemeData();

// 进入 取消捕获 ctrl+s  进入 开始捕获编辑模式
const isEdit = ref<boolean>(false);
const keydownFn = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
  } else if (event.ctrlKey && event.key === "/") {
    // 开启编辑模式
    isEdit.value = !isEdit.value;
  }
};
onMounted(() => {
  window.addEventListener("keydown", keydownFn);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keydownFn);
});

// 创建文件夹
const createSuccessFolder = async () => {
  const res = await getFileTree();
  folderData.value = res.data;
};

// 子组件保存文件
const SaveKeydown = (value: string) => {
  fileData.value = value;
};
</script>

<style scoped lang="scss">
.app {
  display: flex;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
}
</style>
