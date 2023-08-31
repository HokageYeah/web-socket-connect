import { InitOptions } from "./src/types/optionsType";
import { initOptions } from "./src/libs/options";
import { webSocketClass } from "./src/libs/webSocketClass";

const install = (app: any, option: InitOptions) => {
  if (!initOptions(option)) return;
  if (option.vueType === "vue2") {
    app.prototype.$ws = new webSocketClass();
  } else {
    app.config.globalProperties.$ws = new webSocketClass();
  }
};

export default { install };
export * from "./src/libs/webSocketClass";
export * from "./src/libs/options";

