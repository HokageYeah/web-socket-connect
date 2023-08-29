import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import webSocketConnect, { webSocketClass } from "web-socket-connect";

declare module "vue" {
  interface ComponentCustomProperties {
    $ws: webSocketClass;
  }
}

const app = createApp(App);
app.use(webSocketConnect, {
  vueType: "vue3",
  heartBeat: false
});
app.mount("#app");
