import {
  getShareCodeTree,
  registerUser,
  testUserLogin,
} from "./../../service/modules/login";
import { userLogin } from "@/service/modules/login";
import { defineStore } from "pinia";
import { folderInFileType } from "./file";
import { ElMessage } from "element-plus";

type IState = {
  userInfo: {
    name: string;
    token: string;
  } | null;
  sharedFileTree: folderInFileType[] | null;
  activeSharer: string | null;
  shareCode: string | null;
};

type ICallback = (result: any) => void;

const useLoginStore = defineStore("login", {
  state: (): IState => ({
    userInfo: null,
    sharedFileTree: null,
    activeSharer: null,
    shareCode: null,
  }),
  getters: {
    isGuest(): boolean {
      return !this.userInfo;
    },
  },
  actions: {
    // 用户登录
    async userLoginAction(
      name: string,
      password: string,
      onSuccess?: ICallback
    ) {
      const result = await userLogin(name, password);
      if (result?.code !== 0) return;
      const userInfo = result?.data;
      this.userInfo = userInfo;
      localStorage.setItem("token", userInfo?.token);
      localStorage.setItem("name", userInfo?.name);
      if (typeof onSuccess === "function") {
        onSuccess(result);
      }
    },

    // 测试用户登录
    async testUserLoginAction(onSuccess?: ICallback) {
      const result = await testUserLogin();
      if (result?.code !== 0) return;
      const userInfo = result?.data;
      this.userInfo = userInfo;
      localStorage.setItem("token", userInfo?.token);
      localStorage.setItem("name", userInfo?.name);
      if (typeof onSuccess === "function") {
        onSuccess(result);
      }
    },

    // 获取分享的文件树
    async getShareCodeTreeAction(shareCode: string, onSuccess: ICallback) {
      const result = await getShareCodeTree(shareCode);
      const { code, data } = result;
      if (code === 0) {
        this.sharedFileTree = data?.files || [];
        this.activeSharer = data?.sharer;
        if (!this.sharedFileTree?.length) {
          ElMessage.info("该分享码未包含任何文件，请换个分享码试一试~");
        } else {
          typeof onSuccess === "function" && onSuccess(result);
        }
      }
    },

    // 注册用户
    async registerUserAction(
      name: string,
      password: string,
      code: string,
      onSuccess: ICallback
    ) {
      const result = await registerUser(name, password, code);
      if (result?.code === 0) {
        await this.userLoginAction(name, password);
        typeof onSuccess === "function" && onSuccess(result);
      }
    },
  },
});

export default useLoginStore;
