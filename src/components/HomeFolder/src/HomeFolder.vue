<template>
  <div>
    <el-card class="box-card">
      <h3 style="text-align: center; margin: 30px">
        {{ activeName }}
      </h3>
      <div
        v-show="activeName === '文件'"
        class="tree fill-tree"
        style="padding: 10px 30px"
      >
        <el-tree :data="folderData" @node-click="handleTreeClick" />
      </div>
      <div
        class="content-tree tree"
        v-show="activeName !== '文件'"
        style="padding: 10px 30px"
      >
        <el-tree :data="outlineData" @node-click="handleTreeContentClick">
          <template #default="value">
            <a :href="'#' + value.data.label" draggable="false">{{
              value.data.label
            }}</a>
          </template>
        </el-tree>
      </div>

      <div class="footer">
        <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="文件" name="文件"></el-tab-pane>
          <el-tab-pane label="大纲" name="大纲"></el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type {
  folderInFileType,
  FolderType,
  outlineType,
} from "@/store/modules/file";
import type { TabsPaneContext } from "element-plus";

defineProps<{
  folderData: folderInFileType;
  outlineData: outlineType[];
}>();
const emit = defineEmits(["handleTreeClick"]);

// 树
const handleTreeClick = (e: FolderType) => {
  if (!e.type) {
    return;
  }
  emit("handleTreeClick", e);
};
// 大纲树
const handleTreeContentClick = (e: outlineType) => {
  console.log(e);
};

// footer
const activeName = ref("文件");
const handleClick = (tab: TabsPaneContext) => {
  activeName.value = tab.props.name as string;
};
</script>

<style scoped lang="scss">
.home-folder {
  width: 300px;
  height: 100vh;

  .box-card {
    position: relative;

    width: 100%;
    height: 100%;
    border: none;

    .el-card__body {
      padding: 0 !important;
    }
    .tree {
      height: calc(100vh - 145px);
    }
  }
}
</style>
