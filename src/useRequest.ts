import { onScopeDispose, shallowRef } from 'vue-demi';
import { IUserOptions } from './types';
import { defaultOptions, getGlobalOptions } from './options';

type ReturnParams<T extends (...args: any) => any> = T extends ((...args: infer R) => any) ? R : any;
type ReturnPromise<T> = T extends Promise<infer R> ? R : T;

const useRequest = <K extends (...args: any[]) => Promise<any>>(request: K, options?: IUserOptions) => {
  type IParams = ReturnParams<K>
  type IResult = ReturnPromise<ReturnType<K>>

  const mergedOptions = { ...defaultOptions, ...getGlobalOptions(), ...options };
  const result = shallowRef<null | IResult>(null);
  const loading = shallowRef(false);
  const error = shallowRef<null | Error>(null);
  const state = { result, loading, error };
  let abortController = mergedOptions.cancelLastRequest ? new AbortController() : undefined;
  let isFetching = false;
  let lastCacheTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const resolve = (result: IResult) => {
    state.result.value = result;
    state.error.value = null;
    setLoadingState(false);
    lastCacheTime = Date.now();
    mergedOptions.onSuccess && mergedOptions.onSuccess(result);
    mergedOptions.onAfter && mergedOptions.onAfter();
    return result;
  };
  const reject = (error: Error) => {
    if (error.message === 'canceled') {
      // 取消请求不做处理
      return;
    }
    state.result.value = null;
    state.error.value = error;
    setLoadingState(false);
    mergedOptions.onError && mergedOptions.onError(error);
    mergedOptions.onAfter && mergedOptions.onAfter();
    return error;
  };

  const setLoadingState = (loading: boolean) => {
    state.loading.value = loading;
    isFetching = loading;
  };

  const run = async (...args: IParams) => {
    mergedOptions.onBefore && mergedOptions.onBefore();
    if (mergedOptions.useLastRequest && isFetching) {
      // 等待进行中的请求完成
      return;
    }
    timer && clearTimeout(timer);
    if (mergedOptions.cacheTime > 0 && Date.now() - lastCacheTime < mergedOptions.cacheTime) {
      // 缓存有效期内不再请求，展示一下loading动画即可
      setLoadingState(true);
      timer = setTimeout(() => {
        setLoadingState(false);
        mergedOptions.onSuccess && mergedOptions.onSuccess(result.value);
        mergedOptions.onAfter && mergedOptions.onAfter();
      }, 20);
      return;
    }
    if (mergedOptions.cancelLastRequest && isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }
    setLoadingState(true);
    const res = await request(...args as any, abortController?.signal).then(resolve, reject);
    return res;
  };
  
  const cancel = () => {
    timer && clearTimeout(timer);
    setLoadingState(false);
    abortController?.abort('cancel request');
  };

  onScopeDispose(() => {
    timer && clearTimeout(timer);
    if (mergedOptions.cancelOnDispose && isFetching) {
      // 销毁前取消请求
      cancel();
    }
  });

  return { result, loading, error, run, cancel };
};

export default useRequest;
