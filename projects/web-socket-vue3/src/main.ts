import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import webSocketConnect from "web-socket-connect";

const app = createApp(App);
app.use(webSocketConnect, {
  vueType: "vue333",
});
app.mount("#app");
