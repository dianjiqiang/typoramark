import { verifyAccessKey } from "@/service";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

const useSystemStore = defineStore("system", {
  state: () => ({
    isAuth: false,
  }),
  actions: {
    async requestAuthAction(accessKey: string, callback: () => void) {
      const result = await verifyAccessKey(accessKey);
      const isAuth = result.code === 0;
      this.isAuth = isAuth;
      if (isAuth) {
        localStorage.setItem("accessKey", accessKey);
        ElMessage.success("授权成功！");
      } else {
        ElMessage.error(result?.msg || "授权失败，请检查口令是否正确");
      }
      if (typeof callback === "function") {
        callback();
      }
    },
  },
});

export default useSystemStore;
