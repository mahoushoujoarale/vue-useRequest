import useRequest from '@/useRequest';
import { describe, test, expect, vi } from 'vitest';
import axios from 'axios';
import { sleep } from '../util';

const mockAxiosGet = vi.spyOn(axios, 'get');

describe('state', () => {
  const url = 'https://api.github.com/repos/mahoushoujoarale/vue-useRequest';
  const getData = async (signal: AbortSignal) => {
    const res = await axios.get<string>(url, { signal })
    return res.data;
  };
  const request = async () => {
    await sleep(100);
    return 'success';
  };

  test('result should not be null when success', async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });
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
    mockAxiosGet.mockResolvedValueOnce({
      data: 'success',
    });
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
    const { loading, run } = useRequest(request);
    expect(loading.value).toBe(false);

    run();

    await sleep(50);

    expect(loading.value).toBe(true);

    await sleep(100);

    expect(loading.value).toBe(false);
  });
});