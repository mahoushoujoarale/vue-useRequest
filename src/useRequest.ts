import { onScopeDispose, shallowRef } from 'vue-demi';
import type { IUseRequestOptions } from './types';
import { defaultOptions, getGlobalOptions } from './options';

const useRequest = <P extends unknown[], R>(request: (signal:AbortSignal, ...args: P) => Promise<R>, options?: IUseRequestOptions) => {
  type IParams = P;
  type IResult = R;

  const mergedOptions = { ...defaultOptions, ...getGlobalOptions(), ...options };
  const result = shallowRef<IResult | null>(null);
  const loading = shallowRef(false);
  const error = shallowRef<Error | null>(null);
  const state = { result, loading, error };
  let abortController = new AbortController();
  let isFetching = false;
  let lastCacheTime = 0;
  let memorizedResult: IResult | null = null;
  let retryCount = 0;

  const handleSuccess = (result: IResult) => {
    state.result.value = result;
    state.error.value = null;
    setLoadingState(false);

    lastCacheTime = Date.now();
    memorizedResult = result;

    mergedOptions.onSuccess?.(result);
    mergedOptions.onAfter?.();
  };

  const handleError = (error: Error, ...args: IParams) => {
    if (error.message === 'canceled') {
      // 取消请求不做处理
      return;
    }

    if (mergedOptions.retryTimes > retryCount) {
      // 错误重试
      retryCount++;
      runRequest(...args);
      return;
    }

    state.result.value = null;
    state.error.value = error;
    setLoadingState(false);

    mergedOptions.onError?.(error);
    mergedOptions.onAfter?.();
  };

  const setLoadingState = (loading: boolean) => {
    state.loading.value = loading;
    isFetching = loading;
  };

  const runRequest = async (...args: IParams) => {
    try {
      const currentAbortController = abortController;
      const res = await request(currentAbortController.signal, ...args);
      if (currentAbortController.signal.aborted) {
        throw new Error('canceled');
      }
      handleSuccess(res);
      return res;
    } catch (error) {
      handleError(error as Error, ...args);
      return error as Error;
    }
  };

  const run = async (...args: IParams) => {
    if (mergedOptions.useLastRequest && isFetching) {
      // 等待进行中的请求完成
      return new Error('waiting for last request');
    }

    mergedOptions.onBefore?.();
    retryCount = 0;

    if (memorizedResult && Date.now() - lastCacheTime < mergedOptions.cacheTime) {
      // 缓存有效期内不再请求，展示一下loading动画即可
      setLoadingState(true);
      await new Promise(handleSuccess => setTimeout(() => {
        mergedOptions.onCache?.(memorizedResult);
        handleSuccess(memorizedResult);
      }, 20));
      return memorizedResult;
    }

    if (mergedOptions.cancelLastRequest && isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }

    setLoadingState(true);

    const res = await runRequest(...args);
    return res;
  };

  const forceRun = async (...args: IParams) => {
    mergedOptions.onBefore?.();
    retryCount = 0;

    if (isFetching) {
      // 取消上一次请求
      cancel();
      abortController = new AbortController();
    }

    setLoadingState(true);

    const res = await runRequest(...args);
    return res;
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
