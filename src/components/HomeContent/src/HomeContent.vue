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
      <div v-html="fileData"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
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
}
</style>
