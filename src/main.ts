import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

import "./assets/css/reset.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import router from "./router";

const app = createApp(App);
app.use(store);
app.use(router);

app.mount("#app");
