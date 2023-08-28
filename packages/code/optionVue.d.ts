import { webSocketClass } from "./src/libs/webSocketClass";
import { InitOptions } from "./src/types/optionsType";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $ws: webSocketClass;
  }
}


declare module 'vue' {
  interface Vue {
    $ws: webSocketClass;
  }
}

declare module 'web-socket-connec' {
  export function install(app: any, option: InitOptions): void;
}