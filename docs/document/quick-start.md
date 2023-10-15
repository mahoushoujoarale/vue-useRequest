# 快速开始

## 📦 安装
### npm
```sh
npm install vue-use-request
```

### yarn
```sh
yarn add vue-use-request
```

## 🔨 使用
```vue
<template>
  <div>
    <div style="max-height: 200px">resutl: {{ result }}</div>
    <div>loading: {{ loading }}</div>
    <div>error: {{ error }}</div>
    <button @click="run"></button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import axios from 'axios';
import useRequest from 'vue-use-request';

const url = 'https://api.github.com/repos/mahoushoujoarale/vue-useRequest';
const request = async (signal: AbortSignal) => {
  return axios.get(url, {
    signal,
  })
};

const { data, loading, error, run } = useRequest(request);

onMounted(() => {
  run();
});
</script>
```
在上述例子中，`useRequest`接收了一个异步请求函数`request`，返回三个状态值，`result`、`loading`和`error`。`result`、`loading`和`error`都是Vue的[响应式引用shallowRef](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref)，它们的改变会同步到页面上。同时`useRequest`返回了一个`run`函数，通过调用`run`函数可以发起网络请求。异步函数request接收的第一个参数的类型是AbortSignal，它是[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)的signal属性，在useRequest内部会将signal传递给request，request设置好对应的signal后，useRequest就可以通过`AbortController`来控制signal，从而达到真正意义上的取消网络请求的目的。
