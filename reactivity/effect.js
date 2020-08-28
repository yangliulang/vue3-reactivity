export function effect(callback, options = {}) {
  const effect = createReactiveEffect(callback, options);
  if (!options.lazy) {
    effect();
  }
  return effect;
}
let uid = 0;
let activeEffect;
const effectStack = [];
function createReactiveEffect(callback, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return callback();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.options = options;
  effect.uid = uid++;
  effect.deps = [];
  return effect;
}

// 当发生取值操作的时候收集
const targetMap = new WeakMap();
export function track(target, key) {
  // 根据target获取它对于的映射表
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  //   通过key在target上寻找它的依赖 effect执行函数
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect);
    // activeEffect.deps.push(deps);
  }
}
// 触发依赖更新
export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  function run(effects) {
    effects && effects.forEach((effect) => effect && effect());
  }
  if (key !== null) {
    run(depsMap.get(key));
  }
  if (type === "ADD") {
    run(depsMap.get(Array.isArray(target) ? "length" : ""));
  }
}
