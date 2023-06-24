<template>
  <div class="utils-components">
    <img
      :src="require('@/assets/setting.jpg')"
      alt=""
      @click="isShowSettingForm"
    />

    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <span>Hi there!</span>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const drawer = ref(false);

const isShowSettingForm = () => {
  drawer.value = true;
};
</script>

<style scoped lang="scss">
.utils-components {
  position: fixed;
  right: 30px;
  bottom: 20px;
  img {
    width: 50px;
    height: 50px;
  }
}
</style>
