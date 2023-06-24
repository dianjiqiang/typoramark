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
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import HomeFolder from "./components/HomeFolder";
import HomeContent from "./components/HomeContent";
import { formatMarkdown } from "./utils/format";
import useThemeStore from "./store/modules/theme";

import { getHomeMutatildata } from "./service/modules/home";

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
  // 1. dispatch vuex 获取 Folder 数据
  // 2. 将数据传递到组件中
  const res: folderInFileType = [
    {
      id: "1",
      label: "文件夹1",
      path: "/wenjianjia1",
      type: 0,
      children: [
        {
          id: "2",
          label: "js入门",
          path: "/wenjianjia1/jsrumen.md",
          type: 1,
        },
        {
          id: "3",
          label: "js进阶",
          path: "/wenjianjia1/jsjinjie.md",
          type: 1,
        },
      ],
    },
  ] as folderInFileType;
  folderData.value = res;
  console.log(folderData.value);
});
// 树点击
const outlineData = ref<outlineType[]>([]);
const fileTitle = ref<string>();
let fileData = ref<any>("");
const handleTreeClick = (e: FolderType) => {
  const path = e.path;
  fileTitle.value = e.label;
  // 拿着path或者id 去 dispatch 发送请求 获取大纲数据
  console.log(path);
  // 获取到对应的大纲信息和详细内容
  // outlineData.value = [
  //   {
  //     id: "1",
  //     label: "标题1",
  //     type: 1, // 一级标题
  //     children: [
  //       {
  //         id: "2",
  //         label: "标题1-1",
  //         type: 2, // 一级标题
  //         children: [
  //           {
  //             id: "2",
  //             label: "标题1-1-1",
  //             type: 3, // 一级标题
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  // 获取到详细内容后 返回
  import("./JS高级.md").then((res) => {
    fileData.value = res;
    outlineData.value = formatMarkdown(fileData.value.default);
    fileData.value = fileData.value.default;
  });
};

// 获取主题
const themeStore = useThemeStore();
themeStore.initializeThemeData();
</script>

<style scoped lang="scss">
.app {
  display: flex;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
}
</style>
