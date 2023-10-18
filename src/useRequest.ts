import { onScopeDispose, shallowRef } from 'vue-demi';
import type { IUserOptions } from './types';
import { defaultOptions, getGlobalOptions } from './options';

const useRequest = <P extends unknown[], R>(request: (signal:AbortSignal, ...args: P) => Promise<R>, options?: IUserOptions) => {
  type IParams = P;
  type IResult = R;

  const mergedOptions = { ...defaultOptions, ...getGlobalOptions(), ...options };
  const result = shallowRef<null | IResult>(null);
  const loading = shallowRef(false);
  const error = shallowRef<null | Error>(null);
  const state = { result, loading, error };
  let abortController = new AbortController();
  let isFetching = false;
  let lastCacheTime = 0;

  const resolve = (result: IResult) => {
    state.result.value = result;
    state.error.value = null;
    setLoadingState(false);

    lastCacheTime = Date.now();

    mergedOptions.onSuccess?.(result);
    mergedOptions.onAfter?.();

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
    if (mergedOptions.useLastRequest && isFetching) {
      // 等待进行中的请求完成
      return new Error('waiting for last request');
    }

    mergedOptions.onBefore?.();

    if (state.result.value && Date.now() - lastCacheTime < mergedOptions.cacheTime) {
      // 缓存有效期内不再请求，展示一下loading动画即可
      setLoadingState(true);
      await new Promise(resolve => setTimeout(() => {
        mergedOptions.onCache?.(state.result.value);
        resolve(state.result.value);
      }, 20));
      return state.result.value;
    }

    if (mergedOptions.cancelLastRequest && isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }

    setLoadingState(true);

    try {
      const currentAbortController = abortController;
      const res = await request(currentAbortController.signal, ...args);
      if (currentAbortController.signal.aborted) {
        throw new Error('canceled');
      }
      resolve(res);
      return res;
    } catch (error) {
      reject(error as Error);
      return error as Error;
    }
  };

  const forceRun = async (...args: IParams) => {
    mergedOptions.onBefore?.();

    if (isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }

    setLoadingState(true);

    try {
      const currentAbortController = abortController;
      const res = await request(currentAbortController.signal, ...args);
      if (currentAbortController.signal.aborted) {
        throw new Error('canceled');
      }
      resolve(res);
      return res;
    } catch (error) {
      reject(error as Error);
      return error as Error;
    }
  };
  
  const cancel = () => {
    mergedOptions.onCancel?.();
    setLoadingState(false);
    abortController.abort('cancel request');
  };

  onScopeDispose(() => {
    if (mergedOptions.cancelOnDispose && isFetching) {
      // 销毁前取消请求
      cancel();
    }
  });

  return { result, loading, error, run, forceRun, cancel };
};

export default useRequest;
