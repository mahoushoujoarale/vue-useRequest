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

  const resolve = (result: IResult, signal?: AbortSignal) => {
    if (signal?.aborted) {
      return result;
    }
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
      return error;
    }
    state.result.value = null;
    state.error.value = error;
    setLoadingState(false);
    mergedOptions.onError?.(error);
    mergedOptions.onAfter?.();
    return error;
  };

  const setLoadingState = (loading: boolean) => {
    state.loading.value = loading;
    isFetching = loading;
  };

  const run = async (...args: IParams) => {
    mergedOptions.onBefore?.();
    if (mergedOptions.useLastRequest && isFetching) {
      // 等待进行中的请求完成
      return;
    }
    if (mergedOptions.cacheTime > 0 && Date.now() - lastCacheTime < mergedOptions.cacheTime) {
      // 缓存有效期内不再请求，展示一下loading动画即可
      setLoadingState(true);
      const res = await new Promise(resolve => setTimeout(() => {
        setLoadingState(false);
        mergedOptions.onSuccess?.(result.value);
        mergedOptions.onCache?.(result.value);
        mergedOptions.onAfter?.();
        resolve(result.value);
      }, 20));
      return res;
    }
    if (mergedOptions.cancelLastRequest && isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }
    setLoadingState(true);
    try {
      const currentAbortController = abortController;
      const res = await request(...args, currentAbortController?.signal);
      resolve(res, currentAbortController?.signal);
      return res;
    } catch (error) {
      reject(error as Error);
      return error;
    }
  };
  
  const cancel = () => {
    setLoadingState(false);
    abortController?.abort('cancel request');
  };

  onScopeDispose(() => {
    if (mergedOptions.cancelOnDispose && isFetching) {
      // 销毁前取消请求
      cancel();
    }
  });

  return { result, loading, error, run, cancel };
};

export default useRequest;
