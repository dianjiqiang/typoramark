<template>
  <div class="utils-components">
    <img
      :src="require('@/assets/setting.jpg')"
      alt=""
      @click="isShowSettingForm"
    />

    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <h3>查看分享的文件</h3>
      <div
        style="display: flex; flex-direction: column; align-items: flex-start"
      >
        <el-input
          v-model.trim="shareCode"
          placeholder="请输入分享码"
        ></el-input>
        <el-button
          @click="handleUseShareCode"
          type="primary"
          style="margin-top: 20px; width: 300px"
          size="large"
          >查看分享</el-button
        >
        <el-button
          @click="handleRemoveShareCode"
          type="primary"
          style="margin-top: 20px; width: 300px; margin-left: 0"
          size="large"
          >取消查看</el-button
        >
        <el-button
          @click="handleManageShares"
          type="primary"
          style="margin-top: 20px; width: 300px; margin-left: 0"
          size="large"
          >管理所有分享</el-button
        >
        <el-dialog
          v-model="managerShareDialogVisible"
          title="分享记录"
          width="75%"
        >
          <el-table :data="shares" style="width: 100%" border>
            <el-table-column
              prop="isolateCode"
              label="用户名"
              align="center"
              width="180"
            />
            <el-table-column prop="sharePath" label="分享路径" align="center" />
            <el-table-column
              prop="shareCode"
              label="分享码"
              width="180"
              align="center"
            />
            <el-table-column
              prop="shareTime"
              label="分享时间"
              width="180"
              align="center"
            >
              <template v-slot="scope">
                {{ dayjs(scope.row?.shareTime).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template #default="scope">
                <el-button
                  type="danger"
                  @click="handleCancelShare(scope.row?.shareCode)"
                  >取消分享</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <span class="dialog-footer"> </span>
          </template>
        </el-dialog>
      </div>

      <h3>创建分享</h3>
      <div
        style="display: flex; flex-direction: column; align-items: flex-start"
      >
        <label class="flex">
          <span class="label" style="display: inline-block; width: auto"
            >请选择文件夹:
          </span>
          <el-select v-model.trim="sharedPath" placeholder="请选择文件夹">
            <el-option
              v-for="(item, index) in folderValue"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </label>
        <el-input
          style="margin-top: 20px"
          v-model.trim="createShareCode"
          placeholder="请输入分享码"
        ></el-input>
        <el-button
          @click="handleCreateShare"
          type="primary"
          style="margin-top: 20px; width: 300px; margin-left: 0"
          size="large"
          >创建分享</el-button
        >
        <el-button
          @click="handleShareAll"
          type="primary"
          style="margin-top: 20px; width: 300px; margin-left: 0"
          size="large"
          >分享所有文件和文件夹</el-button
        >
        <el-dialog
          v-model="shareDialogVisible"
          title="确认分享全部文件和文件夹？"
          width="30%"
        >
          <span>稍后你可以查看或者取消该分享</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="shareDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleShareAll">
                确认
              </el-button>
            </span>
          </template></el-dialog
        >
      </div>

      <h3>创建文件夹</h3>
      <el-input v-model="folderName" placeholder="请输入文件夹名"></el-input>
      <div style="display: flex; justify-content: flex-start">
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
        <div style="display: flex; justify-content: flex-start">
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
      <div style="display: flex; justify-content: flex-start">
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
      <div style="display: flex; justify-content: flex-start">
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
            :label="`${item.label} (文件夹: ${item?.folderName})`"
            :value="item.id"
          />
        </el-select>
      </label>
      <div style="display: flex; justify-content: flex-start">
        <a
          :href="`${BASE_URL}/markdown/download/${downloadMarkDownFileId}?authorization=${localStorage.getItem(
            'token'
          )}`"
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
            :label="`${item.label} (文件夹: ${item?.folderName})`"
            :value="item.id"
          />
        </el-select>
      </label>
      <div style="display: flex; justify-content: flex-start">
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
            :label="`${item.label} (文件夹: ${item?.folderName})`"
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
      <div style="display: flex; justify-content: flex-start">
        <el-button
          @click="handleRenameMarkDown"
          type="primary"
          style="margin-top: 20px; width: 300px"
          size="large"
          >重命名</el-button
        >
      </div>

      <h3>退出登录</h3>
      <div style="display: flex; justify-content: flex-start">
        <el-button
          @click="handleLogout"
          type="primary"
          style="margin-top: 20px; width: 300px; margin-left: 0"
          size="large"
          >确认退出</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile } from "element-plus";
import dayjs from "@/utils/dayjs";

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
import { BASE_URL } from "../../../service/config";
import useLoginStore from "@/store/modules/login";
import useHomeStore from "@/store/modules/home";
import router from "@/router";
import { storeToRefs } from "pinia";

const drawer = ref(false);
const emit = defineEmits([
  "createSuccessFolder",
  "getSharedTree",
  "removeSharedTree",
]);
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
      folderName.value = "";
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
    renameFolder.value = "";
    newNameFile.value = "";
  });
};

// 删除文件夹
const deletePath = ref<string>("");
const handleRemoveFolder = () => {
  if (deletePath.value) {
    deleteFolder(deletePath.value).then((res) => {
      if (res.msg) {
        ElMessage.error(res.msg);
        return;
      }
      emit("createSuccessFolder");
      ElMessage.success("删除文件夹成功");
      deletePath.value = "";
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
      ElMessage.success("删除文件成功");
      deleteMarkDownFileId.value = "";
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
      renameFileId.value = "";
      newRenameFile.value = "";
    });
  }
};

// 下载md文件
const localStorage = window.localStorage;

// 查看和取消查看分享的文件
const shareCode = ref("");
watch(shareCode, (newVal) => {
  loginStore.shareCode = newVal;
});
const loginStore = useLoginStore();
const handleUseShareCode = () => {
  const shareCodeValue = shareCode.value;
  if (!shareCodeValue) return;
  const onSuccess = (res: any) => {
    const sharedTree = res?.data?.files;
    const sharer = res?.data?.sharer;
    emit("getSharedTree", sharedTree, sharer);
  };
  loginStore.getShareCodeTreeAction(shareCodeValue, onSuccess);
};
const handleRemoveShareCode = () => {
  emit("removeSharedTree");
};

// 创建分享
const sharedPath = ref("");
const createShareCode = ref("");
const homeStore = useHomeStore();
const handleCreateShare = () => {
  const sharedPathValue = sharedPath.value;
  const shareCodeValue = createShareCode.value;
  if (!sharedPathValue || !shareCodeValue) return;
  homeStore.createShareAction(sharedPathValue, shareCodeValue);
};

// 创建一个包含所有文件和文件夹的分享
const shareDialogVisible = ref(false);
const handleShareAll = () => {
  const sharedPathValue = "/";
  const shareCodeValue = createShareCode.value;
  if (!sharedPathValue || !shareCodeValue) return;
  if (shareDialogVisible.value) {
    homeStore.createShareAction(sharedPathValue, shareCodeValue);
    shareDialogVisible.value = false;
  } else {
    shareDialogVisible.value = true;
  }
};

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("token");
  loginStore.$reset();
  router.replace("/login");
};

// 处理管理分享
const managerShareDialogVisible = ref(false);
const { shares } = storeToRefs(homeStore);
const handleManageShares = () => {
  homeStore.getSharesAction();
  managerShareDialogVisible.value = true;
};

// 处理取消分享
const handleCancelShare = (shareCode: string) => {
  homeStore.cancelShareAction(shareCode);
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
      // width: 130px;
      display: inline-block;
      text-align: right;
      margin-right: 10px;
    }
  }
  h3:not(:first-child) {
    margin-top: 50px;
  }
}
:deep(.el-input) {
  max-width: 300px !important;
}
:deep(.el-drawer__body) {
  padding-left: 40px;
  min-width: 360px;
}
</style>
