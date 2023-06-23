import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

import "./assets/css/reset.scss";
import "element-plus/theme-chalk/dark/css-vars.css";

const app = createApp(App);
app.use(store);

app.mount("#app");
