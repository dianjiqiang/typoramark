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
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <h1 id="标题1">标题1</h1>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
      <div>2</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    fileTitle: string;
  }>(),
  {
    fileTitle: "请先选择文件",
  }
);
const emit = defineEmits(["handleClickHidden"]);
const isHiddenMenu = ref(false);

const openMenu = (e: boolean) => {
  isHiddenMenu.value = e;
  emit("handleClickHidden", e);
};
</script>

<style scoped lang="scss">
.home-content {
  flex: 1;
  height: 100%;

  .content {
    box-sizing: border-box;
    padding: 30px 30px 50px;
    height: calc(100vh - 50px);
    scroll-behavior: smooth;
    overflow-y: auto;
  }
  .icon {
    display: flex;
  }
}
</style>
