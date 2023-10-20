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

  const isAbortError = (error: Error) => {
    return error.message === 'canceled' || error.name === 'AbortError';
  };

  const handleSuccess = (result: IResult) => {
    state.result.value = result;
    state.error.value = null;
    setLoadingState(false);

    lastCacheTime = Date.now();
    memorizedResult = result;

    mergedOptions.onSuccess?.(result);
    mergedOptions.onAfter?.();
  };

  const handleError = (error: Error) => {
    if (isAbortError(error)) {
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
    const currentAbortController = abortController;
    while (retryCount <= mergedOptions.retryTimes) {
      try {
        const res = await request(currentAbortController.signal, ...args);
        if (currentAbortController.signal.aborted) {
          return new Error('canceled');
        }
        handleSuccess(res);
        return res;
      } catch (error) {
        if (isAbortError(error as Error)) {
          return error as Error;
        }
        if (retryCount === mergedOptions.retryTimes) {
          handleError(error as Error);
          return error as Error;
        }
      }
      retryCount++;
    }
    return new Error('unexpected error');
  };

  const run = async (...args: IParams) => {
    if (mergedOptions.useLastRequest && isFetching) {
      return new Error('waiting for last request');
    }

    mergedOptions.onBefore?.();
    retryCount = 0;

    if (memorizedResult && Date.now() - lastCacheTime < mergedOptions.cacheTime) {
      setLoadingState(true);
      await new Promise(handleSuccess => setTimeout(() => {
        mergedOptions.onCache?.(memorizedResult);
        handleSuccess(memorizedResult);
      }, 20));
      return memorizedResult;
    }

    if (mergedOptions.cancelLastRequest && isFetching) {
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
      cancel();
    }
  });

  return { result, loading, error, run, forceRun, cancel };
};

export default useRequest;
