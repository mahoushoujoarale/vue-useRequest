import useRequest from '../src/useRequest';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

const mockAxiosGet = vi.spyOn(axios, 'get');

describe('useRequest', async () => {
  beforeEach(() => {
    
  });
  const url = 'https://api.github.com/repos/mahoushoujoarale/vue-useRequest';
  const getData = async (signal?: AbortSignal) => {
    const res = await axios.get(url, { signal })
    return res;
  };

  test('state should be correct when success', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: 'success' });
    const { result, loading, error, run } = useRequest(getData);

    expect(result.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();

    await run();

    expect(result.value).not.toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  test('state should be correct when fail', async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error('error'));
    const { result, loading, error, run } = useRequest(getData);

    expect(result.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();

    await run();

    expect(result.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).not.toBeNull();
  });

  test('onBefore should been trigger once when success', async () => {
    const onBefore = () => {
      expect(loading.value).toBe(false);
    };
    mockAxiosGet.mockResolvedValueOnce({ data: 'success' });

    const { result, loading, error, run } = useRequest(getData, {
      onBefore,
    });

    await run();

    expect(result.value).not.toBeNull();
    expect(onBefore).toBeCalledTimes(1);
  });

  test('onBefore should been trigger once when fail', async () => {
    const onBefore = () => {
      expect(loading.value).toBe(false);
    };
    mockAxiosGet.mockRejectedValueOnce(new Error('error'));

    const { result, loading, error, run } = useRequest(getData, {
      onBefore,
    });

    await run();

    expect(error.value).not.toBeNull();
    expect(onBefore).toBeCalledTimes(1);
  });

  test('onAfter should been trigger once when success', async () => {
    const onAfter = () => {
      expect(loading.value).toBe(false);
    };
    mockAxiosGet.mockResolvedValueOnce({ data: 'success' });

    const { result, loading, error, run } = useRequest(getData, {
      onAfter,
    });

    await run();

    expect(result.value).not.toBeNull();
    expect(onAfter).toBeCalledTimes(1);
  });

  test('onAfter should been trigger once when fail', async () => {
    const onAfter = () => {
      expect(loading.value).toBe(false);
    };
    mockAxiosGet.mockRejectedValueOnce(new Error('error'));

    const { result, loading, error, run } = useRequest(getData, {
      onAfter,
    });

    await run();

    expect(error.value).not.toBeNull();
    expect(onAfter).toBeCalledTimes(1);
  });

  test('onSuccess should been trigger once when success', async () => {
    const onSuccess = () => {
      expect(loading.value).toBe(false);
      expect(result.value).not.toBeNull();
      expect(error.value).toBeNull();
    };
    mockAxiosGet.mockResolvedValueOnce({ data: 'success' });

    const { result, loading, error, run } = useRequest(getData, {
      onSuccess,
    });

    await run();

    expect(result.value).not.toBeNull();
    expect(onSuccess).toBeCalledTimes(1);
  });

  test('onSuccess should not been trigger when fail', async () => {
    const onSuccess = () => {
      expect(loading.value).toBe(false);
      expect(result.value).not.toBeNull();
      expect(error.value).toBeNull();
    };
    mockAxiosGet.mockRejectedValueOnce(new Error('error'));

    const { result, loading, error, run } = useRequest(getData, {
      onSuccess,
    });

    await run();

    expect(error.value).not.toBeNull();
    expect(onSuccess).toBeCalledTimes(0);
  });

  test('onError should not been trigger when success', async () => {
    const onError = () => {
      expect(loading.value).toBe(false);
      expect(result.value).toBeNull();
      expect(error.value).not.toBeNull();
    };
    mockAxiosGet.mockResolvedValueOnce({ data: 'success' });

    const { result, loading, error, run } = useRequest(getData, {
      onError,
    });

    await run();

    expect(result.value).not.toBeNull();
    expect(onError).toBeCalledTimes(0);
  });

  test('onError should not been trigger when fail', async () => {
    const onError = () => {
      expect(loading.value).toBe(false);
      expect(result.value).toBeNull();
      expect(error.value).not.toBeNull();
    };
    mockAxiosGet.mockRejectedValueOnce(new Error('error'));

    const { result, loading, error, run } = useRequest(getData, {
      onError,
    });

    await run();

    expect(error.value).not.toBeNull();
    expect(onError).toBeCalledTimes(1);
  });
});