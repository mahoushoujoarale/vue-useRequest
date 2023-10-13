import { setGlobalOptions, getGlobalOptions, defaultOptions, defaultRunOptions } from '../src/options';
import { describe, test, expect, afterEach } from 'vitest';
import { IGlobalOptions } from '../src/types';

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
  });

  test('should have default runOptions', () => {
    const options = defaultRunOptions;
    expect(options.force).toBe(false);
  });
});