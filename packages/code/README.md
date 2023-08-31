<div align="center">
    <h1>web-socket-connect 前端socket插件</h1>
    <p>
    前端socket插件，提供socket心跳检测、失败重连、手动关闭、发送数据、接受数据等功能
   </p>
</div>



## 说明
>  ### 1、插件入参说明：


  | 入参              | 类型    | 是否必传 | 说明                                          |
  | :---------------- | :------ | :------- | :-------------------------------------------- |
  | vueType           | string  | 必传     | 告诉插件是vue2 还是vue3。 只能传vue2 或者vue3 |
  | reconnectTimeout  | number  | 非必传   | 重新进入超时时间 默认5s                       |
  | reconnectTimes    | number  | 非必传   | 重新进入次数 默认3次                          |
  | heartBeat         | boolean | 非必传   | 是否发送心跳包       默认true                 |
  | reconnectInterval | number  | 非必传   | 重新连接间隔                                  |
  | reconnectDelay    | number  | 非必传   | 重新进入延迟时间                              |
  | reconnect         | boolean | 非必传   | 是否定时重进入                                |

  发送给后端心跳包字段为：hearbeat

## 举例
```shell
const app = createApp(App);
app.use(webSocketConnect, {
  vueType: "vue3",
  heartBeat: false
});
app.mount("#app");
```


