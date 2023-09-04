<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div class="socketContent" v-html="content"></div>
    <button @click="click">按钮点击创建webSocket链接</button>
    <button @click="clickReconnect">按钮点击重连reConnectSocket</button>
    <button :disabled="btnDisabled" @click="clickSend">按钮点击发送消息</button>
    <button :disabled="btnDisabled" @click="clickClose">按钮点击关闭</button>
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
let btnDisabled = ref(false);
onMounted(() => {});
// let socketObj = {
//   msg: "<h1>我是的款式简单快乐是假的理科生简单说两句</h1>",
//   method: "webSocket_device_transport",
//   sn: "webSocketCallBackYeah",
// };
let socketObj = {
  type: "lesson",
  user_id: "123",
  question: "静夜思古诗完整版写出来",
};
const clickClose = () => {
  ws.closeWebSocket()
}
const click = () => {
  // const wsUrl = "ws://localhost:9999";
  const wsUrl = 'ws://192.168.3.119:8000';
  // const wsUrl = "";
  ws.createWebSocket(wsUrl);
  console.log(ws.isConnect);
};
const clickReconnect = () => {
  ws.reConnectWebSocket();
};
let contentall = "";
const clickSend = () => {
  ws.sendSock(
    socketObj,
    (jsone: any) => {
      const e = JSON.parse((jsone))
      btnDisabled.value = true;
      contentall += e.content;
      console.log('添加返回数据-----', e);
      console.log('添加-----', e.content);
      console.log('添加jsone-----', jsone);
      // animationFrame();
      if (e.is_end==='true') animationFrame();
      // console.log("设置了=====>", e);
    },
    "webSocketCallBackYeah"
  );
  ws.setSockFn("webSocketCallBackTypeWriter", (e: any) => {
    debugger;
    content.value += e.msg;
    console.log("毁掉了=====>", e);
  });
};

// let index = 0;
// let timer: any;
// const animationFrame = () => {
//   if (timer) return;
//   timer = setInterval(() => {
//     if (index < contentall.length) {
//       const str = contentall.charAt(index);
//       console.log(contentall.charAt(index));
//       content.value += str;
//       index++;
//     } else {
//       console.log('结束了');
//       index = 0;
//       clearInterval(timer);
//       timer = null
//       btnDisabled.value = false
//       return;
//     }
//   }, 100);
// };

const animationFrame = () => {
  let index = 0;
  let requestId: any; // 声明 requestId 变量
  let startTime: number | undefined;
  const interval = 0; // 设置间隔为 100 毫秒
  console.log('查看一下获取的数据-----', contentall);

  const animate = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp;
      // console.log("startTime----", startTime);
    }
    const elapsed = timestamp - <number>startTime;
    // console.log("elapsed----", elapsed);
    if (elapsed >= interval) {
      startTime = timestamp;
      if (index < contentall.length) {
        // console.log("index---", index);
        const str = contentall.charAt(index);
        // console.log(contentall.charAt(index));
        content.value += str;
        index+=1;
      } else {
        console.log("结束了");
        contentall = "";
        cancelAnimationFrame(requestId); // 停止动画
        btnDisabled.value = false;
        requestId = null; // 重置 requestId 变量
        return;
      }
    }
    requestId = requestAnimationFrame(animate);
  };
  if (!requestId) {
    console.log("--------h是颠三倒四");
    requestId = requestAnimationFrame(animate);
  }
};

// const animationFrame = () => {
//   let index = 0;
//   let startTime = performance.now();
//   const interval = 1000; // 设置间隔为 100 毫秒
//   let requestId: any; // 声明 requestId 变量

//   const animate = (timestamp: number) => {
//     const elapsed = timestamp - startTime;
//     console.log('elapsed---',elapsed);
//     if (elapsed >= interval) {
//       startTime = timestamp;
//       if (index < contentall.length) {
//         const str = contentall.charAt(index);
//         console.log(contentall.charAt(index));
//         console.log(index);
//         content.value += str;
//         index++;
//       } else {
//         console.log("结束了hahhaha");
//         cancelAnimationFrame(requestId); // 停止动画
//         requestId = null; // 重置 requestId 变量
//         return;
//       }
//     }

//     requestId = requestAnimationFrame(animate);
//   };

//   requestId = requestAnimationFrame(animate);
// };

// 调用 animationFrame() 启动动画
// animationFrame();

// function customizeSetInterval(callback: Function, interval: number) {
//   let timer: any = null;
//   let startTime = Date.now();
//   let loop = () => {
//     let endTime = Date.now();
//     if (endTime - startTime >= interval) {
//       startTime = endTime = Date.now();
//       callback(timer);
//     }
//     timer = window.requestAnimationFrame(loop);
//   };
//   loop();
//   return timer;
// }

// const animationFrame = () => {
//   let requestId = customizeSetInterval((timer: any) => {
//     console.log(1);
//     if (index < contentall.length) {
//       const str = contentall.charAt(index);
//       console.log(contentall.charAt(index));
//       content.value += str;
//       index++;
//     } else {
//       console.log("结束了");
//       cancelAnimationFrame(requestId); // 停止动画
//       cancelAnimationFrame(timer); // 停止动画
//       // requestId = null; // 重置 requestId 变量
//       return;
//     }
//     // cancelAnimationFrame(timer);
//   }, 200);
// };
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
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
