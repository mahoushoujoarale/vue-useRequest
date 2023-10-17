# vue-useRequest

## 前言
在业务开发中，对于网络请求状态，我们往往需要定义result、loading、error三个变量，result用来接收请求的结果，loading表示当前请求是否在进行中，error表示请求是否出错，另外还需要处理缓存请求结果、请求竞态、取消请求等问题。如果没有一个统一网络请求管理工具，上述逻辑将被大量重复开发，并且很难保证一致性。

因此，vue-useRequest的出现正是为了解决上述问题，为开发人员提供一种便利、快速的方式来管理网络请求状态。

## 特性
- 🏟️ 覆盖大部分业务场景
- 🎯 真正取消网络请求
- 🌈 兼容 Vue 2 & 3
- 🤖 兼容 Axios & Fetch
- 🚀 响应式数据
- 🗄 内置请求缓存
- 💧 请求竞态处理
- 🔐 测试行覆盖率100%
- ⚙️ 配置简单
- 📠 完全使用 Typescript 编写，具有强大的类型提示
- ⚡️ 极致轻量化，gzip压缩后不到1kb
- 🍃 对业务代码侵入小
- 📦 开箱即用

## 对比
| 库 | 响应式状态 | 缓存 | 错误重试 | 取消网络请求 | React | Vue2 | Vue3 | Axios | Fetch
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SWR | ✔ | ✔ | ✔ | ❌ | ✔ | ❌ | ❌ | ✔ | ✔ |
| ahooks useRequest | ✔ | ✔ | ✔ | ❌ | ✔ | ❌ | ❌ | ✔ | ✔ |
| TanStack Query | ✔ | ✔ | ✔ | ❌ | ✔ | ✔ | ✔ | ✔ | ✔ |
| vue-request | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ | ✔ | ✔ | ✔ |
| vue-use useFetch | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ | ✔ | ❌ | ✔ |
| vue-useRequest | ✔ | ✔ | ❌ | ✔ | ❌ | ✔ | ✔ | ✔ | ✔ |

## 文档
[vue-useRequest文档](https://mahoushoujoarale.github.io/vue-useRequest-docs/)

## 安装
### npm
```sh
npm install vue-use-request
```

### yarn
```sh
yarn add vue-use-request
```

## 使用
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
const request = async (signal) => {
  const res = await axios.get<string>(url, {
    signal,
  });
  return res.data;
};

const { data, loading, error, run } = useRequest(request);

onMounted(() => {
  run();
});
</script>
```
在上述例子中，`useRequest`接收了一个异步请求函数`request`，返回三个状态值，`result`、`loading`和`error`。`result`、`loading`和`error`都是Vue的[响应式引用shallowRef](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref)，它们的改变会同步到页面上。同时`useRequest`返回了一个`run`函数，通过调用`run`函数可以发起网络请求。异步函数request接收的第一个参数的类型是AbortSignal，它是[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)的signal属性，在useRequest内部会将signal传递给request，request设置好对应的signal后，useRequest就可以通过`AbortController`来控制signal，从而达到真正意义上的取消网络请求的目的。

## 致谢
- [SWR](https://swr.vercel.app)<br/>
- [ahooks](https://ahooks.js.org)<br/>
- [vue-request](https://www.attojs.com)
