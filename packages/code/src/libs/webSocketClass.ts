import { variableTypeDetection } from "../utils/verifyType";
import { options } from "./options";

interface heartCheckObjType {
  timeout: number;
  timeoutObj: NodeJS.Timer | null;
  start: Function;
  reset: Function;
  stop: Function;
}

export class webSocketClass {
  private websock: WebSocket | null = null;
  public wsUrl: string = "";
  public isConnect = false; //连接标识， 避免重复连接
  private rec: NodeJS.Timeout | undefined; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
  private checkMsg = "hearbeat"; // 心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
  private reconnectTimeout: number; // 重新连接的延迟时间
  private receiveMessageTimeout: number; // 接收消息超时时间
  private reconnectTimes: number; // 重新进入次数
  private heartBeat: boolean; // 是否定时反馈心跳包

  private reconnectInterval: number; // 重新连接间隔
  private reconnectDelay: number; // 重新进入延迟时间
  private reconnect: boolean; // 是否定时重进入
  private heartCheckObj: heartCheckObjType; // 心路后台对象
  private globalCallback = new Map();
  private callBackKey = "";
  private isNavigating = false;
  private receiveTimeout = null;
  num = 0;
  sendNum = 0; //发送消息在没有连接的情况下，重新发送的次数
  private sendRec: NodeJS.Timeout | undefined; //sendRec用来存储延迟请求的代码

  constructor() {
    this.reconnectTimeout = options.reconnectTimeout;
    this.reconnectTimes = options.reconnectTimes;
    this.receiveMessageTimeout = options.receiveMessageTimeout;
    this.heartBeat = options.heartBeat;
    this.heartCheckObj = this.heartCheck();

    this.reconnectInterval = options.reconnectInterval;
    this.reconnectDelay = options.reconnectDelay;
    this.reconnect = options.reconnect;
    window.addEventListener("beforeunload", () => {
      console.warn("beforeunload---");
      this.isNavigating = true;
    });
    window.addEventListener("unload", () => {
      console.warn("unload---");
      this.isNavigating = true;
    });
    window.addEventListener("hashchange", () => {
      console.warn("hashchange---");
      this.isNavigating = true;
    });
    window.addEventListener("popstate", () => {
      this.isNavigating = true;
      console.warn("History changed----");
    });
  }

  public createWebSocket(wsUrl: string, timeOutCallback: Function) {
    try {
      this.wsUrl = wsUrl;
      this.globalCallback.set("timeOutCallback", timeOutCallback);
      console.log("注册了timeOutCallback事件---");
      this.initWebSocket(); //初始化websocket连接
    } catch (error) {
      console.error("尝试创建连接失败");
      this.reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
    }
  }
  //设置关闭连接
  public closeWebSocket() {
    if (this.websock) {
      (this.websock as WebSocket).close();
      this.websock = null;
      this.sendNum = 0;
    } else {
      console.warn("websock is null");
    }
  }
  // 外部调用重新链接方法
  public reConnectWebSocket() {
    this.num = 0;
    this.reConnect();
  }

  // 发送数据
  public sendSock(agentData: any, callback: Function, key: string) {
    if (!this.websock) {
      // initWebSocket();
      this.createWebSocket(
        this.wsUrl,
        this.globalCallback.get("timeOutCallback")
      );
    }
    this.callBackKey = key;
    this.globalCallback.set(key, callback);
    console.log(this.websock as WebSocket);
    if (
      (this.websock as WebSocket).readyState ===
      (this.websock as WebSocket).OPEN
    ) {
      // 若是ws开启状态
      this.websocketsend(agentData);
    } else if (
      (this.websock as WebSocket).readyState ===
      (this.websock as WebSocket).CONNECTING
    ) {
      console.log("正在开启状态");
      if (this.sendNum >= this.reconnectTimes) {
        this.closeWebSocket();
        const callback = this.globalCallback.get("timeOutCallback");
        callback();
        return;
      }
      this.sendRec && clearTimeout(this.sendRec);
      // 若是 正在开启状态，则等待2s后重新调用
      this.sendRec = setTimeout(() => {
        this.sendSock(agentData, callback, key);
        this.sendNum++;
      }, 2000);
    } else {
      console.log("若未开启");
      if (this.sendNum >= this.reconnectTimes) {
        this.closeWebSocket();
        const callback = this.globalCallback.get("timeOutCallback");
        callback();
        return;
      }
      this.sendRec && clearTimeout(this.sendRec);
      // 若未开启 ，则等待2s后重新调用
      this.sendRec = setTimeout(() => {
        this.sendSock(agentData, callback, key);
        this.sendNum++;
      }, 2000);
    }
  }
  //  获取回调函数
  public setSockFn(key: string, callback: Function) {
    this.globalCallback.set(key, callback);
  }

  private websocketsend(agentData: any) {
    if (this.websock) {
      console.log(JSON.stringify(agentData));
      (this.websock as WebSocket).send(JSON.stringify(agentData));

      this.sendRec && clearTimeout(this.sendRec);
      this.sendRec = setTimeout(() => {
        console.log("接收消息超时，WebSocket 连接已关闭");
        this.closeWebSocket();
        const callback = this.globalCallback.get("timeOutCallback");
        callback();
      }, this.receiveMessageTimeout);
    }
  }

  private heartCheck(): heartCheckObjType {
    const that = this;
    return {
      timeout: 5000, //每段时间发送一次心跳包 这里设置为20s
      timeoutObj: null as NodeJS.Timer | null, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）

      start: function () {
        clearInterval(<NodeJS.Timeout>this.timeoutObj);
        this.timeoutObj = setInterval(() => {
          console.log("hearting ....");
          if (that.isConnect) (that.websock as WebSocket).send(that.checkMsg);
        }, this.timeout);
      },

      reset: function () {
        this.start();
      },

      stop: function () {
        clearInterval(<NodeJS.Timeout>this.timeoutObj);
      },
    };
  }
  private initWebSocket() {
    const that = this;
    this.websock = new WebSocket(this.wsUrl);
    // 监听服务端消息推送过来
    this.websock.onmessage = function (e: MessageEvent<any>) {
      if (that.isConnect) that.websocketonmessage(e);
    };
    // 监听服务端消息通道关闭
    this.websock.onclose = function (e: CloseEvent) {
      console.log("我关闭了socket----");
      that.websocketclose(e);
    };
    // 创建 websocket 连接
    this.websock.onopen = function (e: Event) {
      that.websocketOpen(e);
      console.log("打开websock.onopen---");
      //   如果开启心跳检测开关，则心跳检测
      if (that.heartBeat) that.heartCheckObj.start();
    };

    // 连接发生错误的回调方法
    this.websock.onerror = function (e) {
      if (that.isNavigating) {
        console.log("WebSocket error---在页面即将离开或被关闭时");
      } else {
        console.error("WebSocket连接发生错误---", e);
        that.isConnect = false; //连接断开修改标识
        that.reConnect(); //连接错误 需要重连
      }
    };
  }
  // 定义重新连接函数
  private reConnect() {
    if (this.isConnect || this.num >= this.reconnectTimes) return;
    this.rec && clearTimeout(this.rec);
    // 延迟5秒重连  避免过多次过频繁请求重连
    this.rec = setTimeout(() => {
      console.log("尝试重新连接");
      this.num++;
      // this.createWebSocket(this.wsUrl);
      this.createWebSocket(
        this.wsUrl,
        this.globalCallback.get("timeOutCallback")
      );
    }, this.reconnectTimeout);
  }
  // 创建websocket连接
  private websocketOpen(e: Event) {
    this.isConnect = true;
    console.log("webSocket连接成功", e);
  }

  //   接受数据
  private websocketonmessage(e: MessageEvent<any>) {
    console.log("接受数据超时最新-----", e);
    this.sendRec && clearTimeout(this.sendRec);
    // 暂不对返回的数据做处理，全都返回出去
    // let ret = e.data !== "hearbeat" ? JSON.parse(decodeUnicode(e.data)) : e.data;
    let ret = e.data !== "hearbeat" ? e.data : e.data;
    console.log("转换过后的数据------", ret);
    if (!ret && this.heartBeat) {
      this.heartCheckObj.reset();
    } else {
      const callback = this.globalCallback.get(this.callBackKey);
      if (callback && typeof callback === "function") callback(ret);
      //   if (ret.msg === "websocket connect success") {
      //   } else {
      //     if (ret.method === "webSocket_device_transport") {
      //       const callback = this.globalCallback.get(ret.sn);

      //       if (callback && typeof callback === "function") callback(ret);
      //     } else if (ret.method === "webSocket_device_alarm") {
      //       const callback = this.globalCallback.get("deviceAlert");
      //       if (callback && typeof callback === "function") callback(ret);
      //     }
      //   }
    }
  }

  //  关闭socket
  private websocketclose(e: CloseEvent) {
    this.isConnect = false;
    this.heartCheckObj.stop();
    console.log("关闭socket：connection closed (" + e.code + ")");
  }
}

let decodeUnicode = (str: string) => {
  str = str.replace(/\\/g, "%");
  //转换中文
  str = unescape(str);
  //将其他受影响的转换回原来
  str = str.replace(/%/g, "\\");
  //对网址的链接进行处理
  str = str.replace(/\\/g, "");
  return str;
};
