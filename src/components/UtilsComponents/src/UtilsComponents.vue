<template>
  <div class="utils-components">
    <img
      :src="require('@/assets/setting.jpg')"
      alt=""
      @click="isShowSettingForm"
    />

    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <h3>创建文件夹</h3>
      <el-input v-model="folderName" placeholder="请输入文件夹名"></el-input>
      <div style="display: flex; justify-content: center">
        <el-button
          @click="handleCreateFolder"
          type="primary"
          style="margin-top: 20px; width: 300px"
          size="large"
          >创建</el-button
        >
      </div>

      <h3>上传文件</h3>
      <div>
        <label class="flex">
          <span class="label">请选择文件夹: </span>
          <el-select v-model="pathValue" placeholder="请选择文件夹">
            <el-option
              v-for="(item, index) in folderValue"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </label>
        <el-upload
          :auto-upload="false"
          :limit="1"
          :onChange="changeFileUpload"
          style="margin-top: 20px"
        >
          <template #trigger>
            <el-button type="primary">请选择文件</el-button>
          </template>
        </el-upload>
        <div style="display: flex; justify-content: center">
          <el-button
            @click="uploadFile"
            type="primary"
            style="margin-top: 20px; width: 300px"
            size="large"
            >确认上传</el-button
          >
        </div>
      </div>

      <h3>重命名文件夹</h3>
      <label class="flex">
        <span class="label">请选择文件夹: </span>
        <el-select v-model="renameFolder" placeholder="请选择文件夹">
          <el-option
            v-for="(item, index) in folderValue"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </label>
      <label class="flex" style="margin-top: 20px">
        <span class="label">请输入文件夹名:</span>
        <el-input
          style="width: 200px"
          v-model="newNameFile"
          placeholder="请输入文件夹名"
        ></el-input>
      </label>
      <div style="display: flex; justify-content: center">
        <el-button
          @click="handleRenameFolder"
          type="primary"
          style="margin-top: 20px; width: 300px"
          size="large"
          >重命名</el-button
        >
      </div>

      <h3>删除文件夹</h3>
      <label class="flex">
        <span class="label">请选择文件夹: </span>
        <el-select v-model="deletePath" placeholder="请选择文件夹">
          <el-option
            v-for="(item, index) in folderValue"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </label>
      <div style="display: flex; justify-content: center">
        <el-button
          @click="handleRemoveFolder"
          type="danger"
          style="margin-top: 20px; width: 300px"
          size="large"
          >删除</el-button
        >
      </div>

      <h3>下载Markdown文件</h3>
      <label class="flex">
        <span class="label">请选择文件: </span>
        <el-select v-model="downloadMarkDownFileId" placeholder="请选择文件夹">
          <el-option
            v-for="(item, index) in fileValue"
            :key="index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </label>
      <div style="display: flex; justify-content: center">
        <a
          :href="'http://www.meant.cc:11235/markdown/' + downloadMarkDownFileId"
          target="_blank"
        >
          <el-button
            type="primary"
            style="margin-top: 20px; width: 300px"
            size="large"
            >下载</el-button
          >
        </a>
      </div>

      <h3>删除Markdown文件</h3>
      <label class="flex">
        <span class="label">请选择文件: </span>
        <el-select v-model="deleteMarkDownFileId" placeholder="请选择文件">
          <el-option
            v-for="(item, index) in fileValue"
            :key="index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </label>
      <div style="display: flex; justify-content: center">
        <el-button
          @click="handleDeleteMarkDown"
          type="danger"
          style="margin-top: 20px; width: 300px"
          size="large"
          >删除</el-button
        >
      </div>

      <h3>重命名markdown文件</h3>
      <label class="flex">
        <span class="label">请选择文件: </span>
        <el-select v-model="renameFileId" placeholder="请选择文件">
          <el-option
            v-for="(item, index) in fileValue"
            :key="index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </label>
      <label class="flex" style="margin-top: 20px">
        <span class="label">请输入文件名:</span>
        <el-input
          style="width: 200px"
          v-model="newRenameFile"
          placeholder="请输入文件名"
        ></el-input>
      </label>
      <div style="display: flex; justify-content: center">
        <el-button
          @click="handleRenameMarkDown"
          type="primary"
          style="margin-top: 20px; width: 300px"
          size="large"
          >重命名</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { UploadFile } from "element-plus";

import {
  createFolder,
  postUploadFile,
  deleteFolder,
  patchRenameFolder,
  downLoadMarkDownFile,
  deleteMarkDownFile,
  renameMarkDownFile,
} from "@/service";

import type { folderInFileType, FileType } from "@/store/modules/file";
import { findFiles } from "@/utils/format";

const drawer = ref(false);
const emit = defineEmits(["createSuccessFolder"]);
const props = withDefaults(
  defineProps<{
    folderData: folderInFileType;
  }>(),
  {
    folderData: () => [],
  }
);

const isShowSettingForm = () => {
  drawer.value = true;
};

// 文件夹名
const folderName = ref<string>("");
const handleCreateFolder = () => {
  createFolder({
    url: "/",
    name: folderName.value,
  }).then((res) => {
    if (res.msg) {
      ElMessage.error(res.msg);
      folderName.value = "";
      return;
    } else {
      ElMessage.success("创建文件夹成功");
      emit("createSuccessFolder");
    }
  });
};

// 上传文件
const pathValue = ref<string>("");
const folderValue = ref<{ label: string; value: string }[]>([]);
const fileValue = ref<FileType[]>([]);
const uploadRef = ref<UploadFile>();
watch(
  () => props.folderData,
  (newVal) => {
    folderValue.value = [];
    newVal.forEach((item) => {
      if (item.type === "dir") {
        folderValue.value.push({
          label: item.id,
          value: "/" + item.id,
        });
      }
    });
    fileValue.value = findFiles(newVal);
  }
);
const changeFileUpload = (uploadFile: UploadFile) => {
  if (uploadRef.value) {
    return;
  }
  uploadRef.value = uploadFile;
};
const uploadFile = () => {
  if (uploadRef.value && pathValue.value) {
    postUploadFile({
      md: uploadRef.value,
      url: pathValue.value,
    }).then((res) => {
      if (res.msg) {
        ElMessage.error(res.msg);
        folderName.value = "";
        return;
      } else {
        ElMessage.success("上传文件成功");
        setTimeout(() => {
          emit("createSuccessFolder");
        }, 1000);
      }
    });
  }
};

// 重命名文件夹
const renameFolder = ref<string>("");
const newNameFile = ref<string>("");
const handleRenameFolder = () => {
  patchRenameFolder({
    oldUrl: renameFolder.value,
    newUrl: "/" + newNameFile.value,
  }).then((res) => {
    if (res.msg) {
      ElMessage.error(res.msg);
    }
    emit("createSuccessFolder");
    ElMessage.success("重命名文件夹成功");
  });
};

// 删除文件夹
const deletePath = ref<string>("");
const handleRemoveFolder = () => {
  if (deletePath.value) {
    deleteFolder(deletePath.value).then((res) => {
      if (res.msg) {
        ElMessage.error(res.msg);
      }
      emit("createSuccessFolder");
      ElMessage.success("删除文件夹成功");
    });
  }
};

// 下载markdown文件
const downloadMarkDownFileId = ref<string>();

// 删除markdown文件
const deleteMarkDownFileId = ref<string>();
const handleDeleteMarkDown = () => {
  if (deleteMarkDownFileId.value) {
    deleteMarkDownFile(deleteMarkDownFileId.value).then((res) => {
      if (res.msg) {
        ElMessage.error(res.msg);
        return;
      }
      ElMessage.error("删除文件成功");

      emit("createSuccessFolder");
    });
  }
};

// 重命名markdown文件
const renameFileId = ref<string>();
const newRenameFile = ref<string>();
const handleRenameMarkDown = () => {
  if (renameFileId.value && newRenameFile.value) {
    renameMarkDownFile({
      id: renameFileId.value,
      newFileName: newRenameFile.value + ".md",
    }).then((res) => {
      if (res.msg) {
        ElMessage.error(res.msg);
        return;
      }
      emit("createSuccessFolder");
      ElMessage.success("重命名文件成功");
    });
  }
};
</script>

<style scoped lang="scss">
.utils-components {
  position: fixed;
  z-index: 9999;
  right: 30px;
  bottom: 20px;
  img {
    width: 50px;
    height: 50px;
  }

  .flex {
    display: flex;
    align-items: center;
    .label {
      width: 130px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>
