import { isObject } from "./uitls.js";
import { baseHandler } from "./proxy-handler.js";

export function reactive(target) {
  if (!isObject(target)) return target;
  const observed = new Proxy(target, baseHandler);
  return observed;
}
