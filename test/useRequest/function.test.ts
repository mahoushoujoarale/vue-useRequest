import useRequest from '@/useRequest';
import { describe, test, expect, vi } from 'vitest';
import { sleep } from '../util';
import { mount } from '@vue/test-utils';
import Demo from '../component/demo.vue';

describe('function', () => {
  const request = async (signal: AbortSignal, message = 'success') => {
    await sleep(100);
    return message;
  };

  test('run should work', async () => {
    const { run } = useRequest(request);

    const res = await run();
    expect(res).toBe('success');
  });

  test('cancel should work', async () => {
    const { result, run, cancel } = useRequest(request);

    run();
    setTimeout(() => cancel(), 20);

    await sleep(120);

    expect(result.value).toBeNull();
  });

  test('should cancel last request when cancelLastRequest is true', async () => {
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

  test('should not cancel last request when cancelLastRequest is false', async () => {
    const { result, loading, run } = useRequest(request, {
      cancelLastRequest: false,
    });

    run('first');
    setTimeout(() => run('second'), 50);

    await sleep(120);

    expect(result.value).toBe('first');
    expect(loading.value).toBe(false);

    await sleep(50);

    expect(result.value).toBe('second');
    expect(loading.value).toBe(false);
  });

  test('should cancel current request when useLastRequest is true', async () => {
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

  test('should use cache when cache is not expired', async () => {
    const { result, run } = useRequest(request, {
      cacheTime: 500,
    });

    await run('first');
    expect(result.value).toBe('first');

    await sleep(50);

    await run('second');
    expect(result.value).toBe('first');
  });

  test('should ignore cache when cache is expired', async () => {
    const { result, run } = useRequest(request, {
      cacheTime: 50,
    });

    await run('first');
    expect(result.value).toBe('first');

    await sleep(100);

    await run('second');
    expect(result.value).toBe('second');
  });

  test('forceRun should cancel last request even though useLastRequest is true', async () => {
    const { result, loading, run, forceRun } = useRequest(request, {
      useLastRequest: true,
    });

    run('first');
    setTimeout(() => forceRun('second'), 50);

    await sleep(120);

    expect(result.value).toBeNull();
    expect(loading.value).toBe(true);

    await sleep(50);

    expect(result.value).toBe('second');
    expect(loading.value).toBe(false);
  });

  test('forceRun should ignore cache', async () => {
    const onCache = vi.fn();

    const { result, run, forceRun } = useRequest(request, {
      cacheTime: 500,
      onCache,
    });

    await run('first');
    expect(onCache).toBeCalledTimes(0);

    await forceRun('second');
    expect(onCache).toBeCalledTimes(0);
    expect(result.value).toBe('second');
  });

  test('forceRun can be canceled', async () => {
    const { result, loading, forceRun, cancel } = useRequest(request);

    forceRun();
    setTimeout(() => cancel(), 50);

    await sleep(120);

    expect(result.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  test('should cancel request when component is unmount if cancelOnDispose is true', async () => {
    const wrapper = mount(Demo, {
      props: {
        cancelOnDispose: true,
      },
    });

    await sleep(80);

    wrapper.unmount();
  
    expect(wrapper.emitted('onCancel')).toHaveLength(1);
  });

  test('should not cancel request when component is unmount if cancelOnDispose is false', async () => {
    const wrapper = mount(Demo, {
      props: {
        cancelOnDispose: false,
      },
    });

    await sleep(80);

    wrapper.unmount();
  
    expect(wrapper.emitted('onCancel')).toBeUndefined();
  });
});