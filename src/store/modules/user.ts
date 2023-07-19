import { userLogin } from "@/service/modules/login";
import { defineStore } from "pinia";

type IState = {
  userInfo: {
    name: string;
    token: string;
  } | null;
};

type ICallback = (result: any) => void;

const useUserStore = defineStore("user", {
  state: (): IState => ({
    userInfo: null,
  }),
  actions: {
    async userLoginAction(
      name: string,
      password: string,
      onSuccess: ICallback
    ) {
      const result = await userLogin(name, password);
      if (result?.code !== 0) return;
      const userInfo = result?.data;
      this.userInfo = userInfo;
      localStorage.setItem("token", userInfo?.token);
      if (typeof onSuccess === "function") {
        onSuccess(result);
      }
    },
  },
});

export default useUserStore;
