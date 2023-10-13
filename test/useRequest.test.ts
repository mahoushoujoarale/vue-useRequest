import useRequest from '../src/useRequest';
import { describe, test, expect, vi } from 'vitest';
import axios from 'axios';
import { sleep } from './util';

const mockAxiosGet = vi.spyOn(axios, 'get');

describe('useRequest', async () => {
  const url = 'https://api.github.com/repos/mahoushoujoarale/vue-useRequest';
  const getData = async (signal?: AbortSignal) => {
    const res = await axios.get(url, { signal })
    return res;
  };

  describe('function', () => {
    test('run should work', async () => {
      mockAxiosGet.mockResolvedValueOnce('success');
      const { result, run } = useRequest(getData);
  
      await run();
  
      expect(result.value).toBe('success');
    });

    test('cancel should work', async () => {
      const request = async () => {
        await sleep(100);
        return 'success';
      };
      const { result, run, cancel } = useRequest(request);
  
      run();
      setTimeout(() => cancel(), 20);

      await sleep(120);
  
      expect(result.value).toBeNull();
    });

    test('should cancel last request when cancelLastRequest is true', async () => {
      const request = async (message: string) => {
        await sleep(100);
        return message;
      };
      const { result, loading, run } = useRequest(request, {
        cancelLastRequest: true,
      });
  
      run('first');
      setTimeout(() => run('second'), 50);
  
      await sleep(120);
      expect(result.value).toBeNull();
      expect(loading.value).toBe(true);
  
      await sleep(50);
      expect(result.value).toBe('second');
      expect(loading.value).toBe(false);
    });

    test('should cancel current request when useLastRequest is true', async () => {
      const request = async (message: string) => {
        await sleep(100);
        return message;
      };
      const { result, loading, run } = useRequest(request, {
        useLastRequest: true,
      });
  
      run('first');
      setTimeout(() => run('second'), 50);
  
      await sleep(120);
      expect(result.value).toBe('first');
      expect(loading.value).toBe(false);
  
      await sleep(50);
      expect(result.value).toBe('first');
      expect(loading.value).toBe(false);
    });
  });

  describe('state', () => {
    test('result should not be null when success', async () => {
      mockAxiosGet.mockResolvedValueOnce('success');
      const { result, run } = useRequest(getData);
  
      expect(result.value).toBeNull();
  
      await run();
  
      expect(result.value).toBe('success');
    });
  
    test('result should be null when fail', async () => {
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
      const { result, run } = useRequest(getData);
  
      expect(result.value).toBeNull();
  
      await run();
  
      expect(result.value).toBeNull();
    });

    test('error should be null when success', async () => {
      mockAxiosGet.mockResolvedValueOnce('success');
      const { error, run } = useRequest(getData);
  
      expect(error.value).toBeNull();
  
      await run();
  
      expect(error.value).toBeNull();
    });

    test('error should not be null when fail', async () => {
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
      const { error, run } = useRequest(getData);
  
      expect(error.value).toBeNull();
  
      await run();

      expect(error.value?.message).toBe('error');
    });

    test('loading should be correct', async () => {
      const request = async () => {
        await sleep(100);
        return 'success';
      };
      const { loading, run } = useRequest(request);
  
      expect(loading.value).toBe(false);

      run();

      await sleep(50);
      expect(loading.value).toBe(true);

      await sleep(100);
      expect(loading.value).toBe(false);
    });
  });

  describe('life cycle', () => {
    test('onBefore should been triggered once when success', async () => {
      const onBefore = vi.fn();
      mockAxiosGet.mockResolvedValueOnce('success');
  
      const { run } = useRequest(getData, {
        onBefore,
      });
  
      await run();
  
      expect(onBefore).toBeCalledTimes(1);
    });
  
    test('onBefore should been triggered once when fail', async () => {
      const onBefore = vi.fn();
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
  
      const { run } = useRequest(getData, {
        onBefore,
      });
  
      await run();
  
      expect(onBefore).toBeCalledTimes(1);
    });
  
    test('onAfter should been triggered once when success', async () => {
      const onAfter = vi.fn();
      mockAxiosGet.mockResolvedValueOnce('success');
  
      const { run } = useRequest(getData, {
        onAfter,
      });
  
      await run();
  
      expect(onAfter).toBeCalledTimes(1);
    });
  
    test('onAfter should been triggered once when fail', async () => {
      const onAfter = vi.fn();
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
  
      const { run } = useRequest(getData, {
        onAfter,
      });
  
      await run();
  
      expect(onAfter).toBeCalledTimes(1);
    });
  
    test('onSuccess should been triggered once when success', async () => {
      const onSuccess = vi.fn();
      mockAxiosGet.mockResolvedValueOnce('success');
  
      const { run } = useRequest(getData, {
        onSuccess,
      });
  
      await run();
  
      expect(onSuccess).toBeCalledTimes(1);
    });
  
    test('onSuccess should not been triggered when fail', async () => {
      const onSuccess = vi.fn();
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
  
      const { run } = useRequest(getData, {
        onSuccess,
      });
  
      await run();
  
      expect(onSuccess).toBeCalledTimes(0);
    });
  
    test('onError should not been triggered when success', async () => {
      const onError = vi.fn();
      mockAxiosGet.mockResolvedValueOnce('success');
  
      const { run } = useRequest(getData, {
        onError,
      });
  
      await run();
  
      expect(onError).toBeCalledTimes(0);
    });
  
    test('onError should not been triggered when fail', async () => {
      const onError = vi.fn();
      mockAxiosGet.mockRejectedValueOnce(new Error('error'));
  
      const { run } = useRequest(getData, {
        onError,
      });
  
      await run();
  
      expect(onError).toBeCalledTimes(1);
    });

    test('onCache should been triggered when cache is not expired', async () => {
      const onCache = vi.fn();
      const request = async () => {
        await sleep(100);
        return 'success';
      };
      const { run } = useRequest(request, {
        cacheTime: 500,
        onCache,
      });
  
      await run();
      expect(onCache).toBeCalledTimes(0);

      await run();
      expect(onCache).toBeCalledTimes(1);
    });

    test('onCache should not been triggered when cache is expired', async () => {
      const onCache = vi.fn();
      const request = async () => {
        await sleep(100);
        return 'success';
      };
      const { run } = useRequest(request, {
        cacheTime: 10,
        onCache,
      });
  
      await run();
      expect(onCache).toBeCalledTimes(0);

      await sleep(20);

      await run();
      expect(onCache).toBeCalledTimes(0);
    });
  });

  // describe('options', () => {
    
  // });
});