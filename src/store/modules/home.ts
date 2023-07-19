import { createShare } from "@/service";
import { defineStore } from "pinia";

const useHomeStore = defineStore("home", {
  state: () => ({}),
  actions: {
    async createShareAction(sharePath: string, shareCode: string) {
      const result = await createShare(sharePath, shareCode);
      console.log(result);
    },
  },
});

export default useHomeStore;
