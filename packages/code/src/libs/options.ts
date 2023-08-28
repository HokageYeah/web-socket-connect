import { InitOptions } from "../types/optionsType";
import { isEmpty, typeofAny } from "../utils/verifyType";

type keytype = keyof InitOptions;

class Options implements InitOptions {
  vueType = "vue3"; // 默认vue3
  reconnectTimeout = 5000; // 重新进入超时时间
  reconnectInterval = 1000; // 重新进入间隔
  reconnectTimes = 3; // 重新进入次数
  reconnectDelay = 1000; // 重新进入延迟时间
  reconnect = true; // 是否定时重进入
  constructor(options: InitOptions) {
    this.optionsInit(options);
  }
  private optionsInit(options: InitOptions) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        (this as any)[key] = options[key as keytype];
      }
    }
  }
}

/**
 * 验证必填项
 * @param options 入参对象
 */
const validateMustFill = (options: InitOptions) => {
  const validateList = [validateOptionMustFill(options.vueType, "vueType")];
  return validateList.every((item) => !!item);
};
const validateOptionMustFill = (target: any, targetName: string) => {
  if (isEmpty(target)) {
    console.error(`web-socket-connect: 【${targetName}】参数未填`);
    return false;
  }
  return true;
};

// reconnectTimeout?: number; // 重新进入超时时间
// reconnectInterval?: number; // 重新连接间隔
// reconnectTimes?: number; // 重新进入次数
// reconnectDelay?: number; // 重新进入延迟时间
// reconnect?: boolean; // 是否定时重进入
// 教研
const validateInitOption = (options: InitOptions) => {
  const {
    vueType,
    reconnectTimeout,
    reconnectInterval,
    reconnectTimes,
    reconnectDelay,
    reconnect,
  } = options;
  const validateList = [
    validateOption(vueType, "vueType", "string"),
    validateOption(reconnectTimeout, "reconnectTimeout", "number"),
    validateOption(reconnectInterval, "reconnectInterval", "number"),
    validateOption(reconnectTimes, "reconnectTimes", "number"),
    validateOption(reconnectDelay, "reconnectDelay", "number"),
    validateOption(reconnect, "reconnect", "boolean"),
  ];
  return validateList.every((item) => !!item);
};
/**
 * 验证选项的类型是否符合要求
 * @param target 源对象
 * @param targetName 对象名
 * @param expectType 期望类型
 * @returns 是否通过验证
 */
const validateOption = (target: any, targetName: string, type: string) => {
  if (!target || typeofAny(target) == type) return true;
  console.error(
    `web-socket-connect: ${targetName}期望传入${type}类型，目前是${typeofAny(
      target
    )}类型`
  );
  return false;
};

const validateVueType = (options: InitOptions) => {
  const { vueType } = options;
  //  vueType 必须是vue2、或者vue3字符串
  if (vueType !== "vue2" && vueType !== "vue3") {
    console.error(
      `web-socket-connect: vueType传入的值只能是vue2或者vue3的字符串`
    );
    return false;
  }
};

export let options: Options;

export function initOptions(optionsParams: InitOptions) {
  // 必须传递参数教研 + 入参类型校验
  if (
    !validateMustFill(optionsParams) ||
    !validateInitOption(optionsParams) ||
    !validateVueType(optionsParams)
  ) {
    return false;
  }
  //   通过教研后、初始化参数工作
  options = new Options(optionsParams);
  return;
}
