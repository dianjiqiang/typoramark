import { defineStore } from "pinia";

const useThemeStore = defineStore("theme", {
  state() {
    return {
      themeData: "light",
    };
  },
  actions: {
    changeThemeData(theme: string) {
      this.themeData = theme;

      window.localStorage.setItem("themeData", theme);
    },
    initializeThemeData() {
      if (window.localStorage.getItem("themeData")) {
        this.themeData = window.localStorage.getItem("themeData") as string;

        document.documentElement.classList.remove("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add(this.themeData);
      } else {
        window.localStorage.setItem("themeData", "light");
        document.documentElement.classList.add(this.themeData);

        document.documentElement.classList.remove("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    },
  },
});

export default useThemeStore;
