import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/main.css";

createApp(App)
  .use(i18n)
  .use(router)
  .mount("#app");
