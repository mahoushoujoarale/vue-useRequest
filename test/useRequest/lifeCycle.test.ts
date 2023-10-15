import useRequest from '@/useRequest';
import { describe, test, expect, vi } from 'vitest';
import axios from 'axios';
import { sleep } from '../util';

const mockAxiosGet = vi.spyOn(axios, 'get');

describe('life cycle', () => {
  const url = 'https://api.github.com/repos/mahoushoujoarale/vue-useRequest';
  const getData = async (signal: AbortSignal) => {
    const res = await axios.get<string>(url, { signal })
    return res.data;
  };
  const request = async () => {
    await sleep(100);
    return 'success';
  };

  test('onBefore should been triggered once when success', async () => {
    const onBefore = vi.fn();
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });

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
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });

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
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });

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
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });

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

  test('onCancel should been triggered when cancel', async () => {
    const onCancel = vi.fn();

    const { run, cancel } = useRequest(request, {
      cacheTime: 10,
      onCancel,
    });

    run();
    setTimeout(() => cancel(), 20);

    await sleep(120);

    expect(onCancel).toBeCalledTimes(1);
  });
});