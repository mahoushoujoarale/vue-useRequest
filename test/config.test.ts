import { setGlobalOptions, getGlobalOptions, defaultOptions } from '@/options';
import { describe, test, expect, afterEach, vi } from 'vitest';
import type { IGlobalOptions } from '@/types';

describe('config', () => {
  afterEach(() => {
    setGlobalOptions({});
  });

  test('should set and get global options correctly', () => {
    const globalConfig: IGlobalOptions = {
      cancelLastRequest: false,
      useLastRequest: true,
    };

    setGlobalOptions(globalConfig);

    const retrievedConfig = getGlobalOptions();
    expect(retrievedConfig).toEqual(globalConfig);
  });

  test('should have default options', () => {
    const options = defaultOptions;

    expect(options.cancelLastRequest).toBe(true);
    expect(options.cancelOnDispose).toBe(true);
    expect(options.useLastRequest).toBe(false);
    expect(options.cacheTime).toBe(0);
    expect(options.retryTimes).toBe(0);
  });

  test('default options should be read only', () => {
    const options = defaultOptions;
    const fn = vi.fn().mockImplementation(() => {
      options.cancelLastRequest = false;
    })

    expect(() => fn()).toThrowError();
  });
});
