# 全局配置
如果你想全局定义`useRequest`的行为，避免在使用时进行大量重复的配置，可以通过使用`setGlobalOptions`来达到这个目的。
```ts
// main.ts
import { setGlobalOptions } from 'vue-use-request';
// ...
setGlobalOptions({
  useLastRequest: true,
  // ...
});

// app.vue
const { result } = useRequest(request, {
  useLastRequest: false, // 覆盖全局配置
});
```
:::tip
配置权重：defaultOptions < setGlobalOptions < 局部自定义options
:::