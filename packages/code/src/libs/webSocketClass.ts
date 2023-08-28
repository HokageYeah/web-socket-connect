import { options } from "./options";

export class webSocketClass {
  websock: WebSocket | null = null;
  rec: number | undefined; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
  isConnect = false; //咯安姐标识， 避免重复连接
  checkMsg = "hearbeat"; // 心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理

  constructor() {
    this.createWebSocket();
  }
  public createWebSocket() {}
}
