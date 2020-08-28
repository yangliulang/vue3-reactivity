import { computed, reactive, ref, effect } from "./reactivity/index.js";

const state = reactive({ name: "yangyong", arr: [1, 2, 3, 4] });

effect(() => {
  console.log(JSON.stringify(state.arr));
});
state.arr.push(90);
// state.age = 30;
