<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div class="socketContent">{{ content }}</div>
    <button @click="click">按钮点击创建webSocket链接</button>
    <button @click="clickReconnect">按钮点击重连reConnectSocket</button>
    <button @click="clickSend">按钮点击发送消息</button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
defineOptions({
  name: "App",
});
import { getCurrentInstance, onMounted, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
const instance = getCurrentInstance();
const ws = instance!.appContext.config.globalProperties.$ws;
const content = ref<string>("");
let socketObj = {
  msg: "<h1>我是的款式简单快乐是假的理科生简单说两句</h1>",
  method: "webSocket_device_transport",
  sn: "webSocketCallBackYeah",
};
onMounted(() => {});
const click = () => {
  const wsUrl = "ws://localhost:9999";
  // const wsUrl = "";
  ws.createWebSocket(wsUrl);
  console.log(ws.isConnect);
};
const clickReconnect = () => {
  ws.reConnectWebSocket();
};
const clickSend = () => {
  ws.sendSock(
    socketObj,
    (e: any) => {
      console.log("设置了=====>", e);
    },
    "webSocketCallBackYeah"
  );
  ws.setSockFn("webSocketCallBackTypeWriter", (e: any) => {
    debugger;
    content.value += e.msg;
    console.log("毁掉了=====>", e);
  });
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
button {
  margin: 10px;
  border: 1px solid red;
}
.socketContent {
  min-height: 20px;
  width: 300px;
  border: 1px solid orange;
  margin: 0 auto;
  text-align: left;
}
</style>
