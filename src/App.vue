<template>
  <div class="verify-identity" v-show="!isAuth">
    <h1 class="title">typoramark</h1>
    <el-input
      placeholder="请输入口令(keyie)"
      size="large"
      type="password"
      v-model="inputCode"
    />
    <el-button size="large" @click="handleVerifyAccessKey">确认</el-button>
  </div>
  <div class="app" v-show="isAuth">
    <HomeFolder
      class="home-folder"
      v-show="!isHidden"
      :folderData="folderData"
      @handleTreeClick="handleTreeClick"
      @handleExpandOutline="handleExpandOutline"
      :outlineData="outlineData"
    />
    <HomeContent
      ref="homeContentRef"
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
import { onMounted, ref, onUnmounted, computed, watch } from "vue";

import HomeFolder from "./components/HomeFolder";
import HomeContent from "./components/HomeContent";
import { formatMarkdown } from "./utils/format";
import useThemeStore from "./store/modules/theme";
import useSystemStore from "./store/modules/system";
import UtilsComponents from "./components/UtilsComponents";
import { getHomeMdFile, getFileTree } from "./service";

import type {
  folderInFileType,
  FolderType,
  outlineType,
} from "./store/modules/file";

import cryptoJs from "crypto-js";
import { storeToRefs } from "pinia";

// 点击了隐藏menu
const isHidden = ref(false);
const handleClickHidden = (e: boolean) => {
  isHidden.value = e;
};

const folderData = ref<folderInFileType>([]); // 这里不是采用ref定义的  应该是 storeToRefs 这里懒了, 就写伪代码
onMounted(async () => {
  const res = await getFileTree();
  folderData.value = res.data || [];
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
      outlineData.value = formatMarkdown(res.data?.content);
      fileRawData.value = res.data?.raw;
      fileData.value = res.data?.content;
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

// 处理展开大纲的事件
const homeContentRef = ref();
const handleExpandOutline = () => {
  // 调用子组件更新大纲元素的方法
  if (typeof homeContentRef.value?.updateOutlineLinks === "function") {
    homeContentRef.value?.updateOutlineLinks();
  }
};

// 权限验证
const systemStore = useSystemStore();
const { isAuth } = storeToRefs(systemStore);
const inputCode = ref("");
const handleVerifyAccessKey = (event = null) => {
  if (event && !inputCode.value) return;
  const localKey = localStorage.getItem("accessKey");
  const md5Key = cryptoJs.MD5(inputCode.value).toString();
  const accessKey = localKey || md5Key;
  const callback = () => (inputCode.value = "");
  systemStore.requestAuthAction(accessKey, callback);
};
const handleAuthChange = async (newVal: boolean) => {
  if (newVal) {
    const res = await getFileTree();
    folderData.value = res.data;
  } else {
    handleVerifyAccessKey();
  }
};
watch(isAuth, handleAuthChange, { immediate: true });
</script>

<style scoped lang="scss">
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.verify-identity {
  display: flex;
  flex-direction: column;
  width: 34vw;
  position: fixed;
  left: 50%;
  top: 36%;
  transform: translate(-50%, -50%);
  text-align: center;
  border: 1px solid #eee;
  padding: 60px 0px;
  box-shadow: 0 0 15px 6px #f7f7f7;
  border-radius: 10px;
  opacity: 0;
  animation: fadeIn 0.4s 0.4s forwards;
  .title {
    margin-top: 0px;
    margin-bottom: 30px;
  }
  .el-input {
    margin-bottom: 20px;
  }
  .el-input,
  .el-button {
    width: 50%;
    margin: 10px auto;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    top: -100vh;
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    top: 36vh;
  }
}
</style>
