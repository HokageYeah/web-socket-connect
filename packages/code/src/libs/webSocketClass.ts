import { options } from "./options";

export class webSocketClass {
  websock: WebSocket | null = null;
  wsUrl: string = "";
  rec: number | undefined; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
  isConnect = false; //连接标识， 避免重复连接
  checkMsg = "hearbeat"; // 心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
  reconnectTimeout: number; // 重新进入超时时间
  reconnectTimes: number; // 重新进入次数
  reconnectInterval: number; // 重新连接间隔
  reconnectDelay: number; // 重新进入延迟时间
  reconnect: boolean; // 是否定时重进入
  heartBeat: boolean; // 是否定时反馈心跳包
  num = 0;
  constructor() {
    this.reconnectTimeout = options.reconnectTimeout;
    this.reconnectInterval = options.reconnectInterval;
    this.reconnectTimes = options.reconnectTimes;
    this.reconnectDelay = options.reconnectDelay;
    this.reconnect = options.reconnect;
    this.heartBeat = options.heartBeat;
  }

  public createWebSocket(wsUrl: string) {
    try {
      this.wsUrl = wsUrl;
      this.initWebSocket(); //初始化websocket连接
    } catch (error) {
      console.log("尝试创建连接失败");
      // reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
    }
  }
  private initWebSocket() {
    const that = this;
    this.websock = new WebSocket(this.wsUrl);
    // 监听服务端消息推送过来
    this.websock.onmessage = function (e: MessageEvent<any>) {
      debugger;
      // websocketonmessage(e);
    };
    // 监听服务端消息通道关闭
    this.websock.onclose = function (e: CloseEvent) {
      debugger;
      // websocketclose(e);
    };
    // 创建 websocket 连接
    this.websock.onopen = function (e: Event) {
      debugger;
      // websocketOpen(e);
    };

    // 连接发生错误的回调方法
    this.websock.onerror = function () {
      debugger;
      console.log("WebSocket连接发生错误");
      that.isConnect = false; //连接断开修改标识
      that.reConnect(); //连接错误 需要重连
    };
  }
  // 定义重新连接函数
  private reConnect() {
    if (this.isConnect || this.num >= this.reconnectTimes) return;
    console.log("尝试重新连接");
    this.rec && clearTimeout(this.rec);
    // 延迟5秒重连  避免过多次过频繁请求重连
    this.rec = setTimeout(() => {
      this.createWebSocket(this.wsUrl);
      this.num++;
    }, this.reconnectTimeout);
  }
}
