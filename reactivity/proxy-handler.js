import { isObject } from "./uitls.js";
import { reactive } from "./reactive.js";
import { track, trigger } from "./effect.js";
const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    const ret = Reflect.get(target, key, receiver);
    // console.log("获取值", target, key);
    track(target, key);
    return isObject(ret) ? reactive(ret) : ret;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const hadKey = Reflect.has(target, key);
    const oldValue = target[key];
    const ret = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      trigger(target, "ADD", key, value, oldValue);
    } else if (oldValue !== value) {
      trigger(target, "SET", key, value, oldValue);
    }
    return ret;
  };
}

export const baseHandler = {
  get,
  set
};
