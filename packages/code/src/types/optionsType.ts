// ws 配置
export interface WSConfig {
  wsUrl: string; // ws 地址
}
// 初始化插件 配置
export interface InitOptions {
  vueType: string; // 必传 告诉插件是vue2 还是vue3。 只能传vue2 或者vue3
  reconnectTimeout?: number; // 重新进入超时时间
  receiveMessageTimeout?: number; // 接收消息超时时间
  reconnectTimes?: number; // 重新进入次数
  heartBeat?: boolean; // 是否发送心跳包
  
  reconnectInterval?: number; // 重新连接间隔
  reconnectDelay?: number; // 重新进入延迟时间
  reconnect?: boolean; // 是否定时重进入
}
