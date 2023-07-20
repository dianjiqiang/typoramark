import { cancelShare, createShare, getShares } from "@/service";
import { defineStore } from "pinia";

const useHomeStore = defineStore("home", {
  state: () => ({
    shares: [],
  }),
  actions: {
    // 创建分享
    async createShareAction(sharePath: string, shareCode: string) {
      const result = await createShare(sharePath, shareCode);
      console.log(result);
    },

    // 获取所有分享记录
    async getSharesAction() {
      const result = await getShares();
      if (result?.code === 0) {
        this.shares = result?.data;
      }
    },

    // 取消摸个分享
    async cancelShareAction(shareCode: string) {
      const result = await cancelShare(shareCode);
      this.getSharesAction();
    },
  },
});

export default useHomeStore;
