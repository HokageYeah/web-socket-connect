<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <button @click="click">按钮点击websocket</button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
const instance = getCurrentInstance();
const ws = instance!.appContext.config.globalProperties.$ws;
const click = () => {
  const wsUrl = "ws://localhost:9999";
  ws.createWebSocket(wsUrl)
  console.log(ws);
}
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
</style>
