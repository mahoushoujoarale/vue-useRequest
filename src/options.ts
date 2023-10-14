import type { IGlobalOptions, IOptions } from './types';

const GLOBAL_OPTIONS: IGlobalOptions = {};

export const setGlobalOptions = (config: IGlobalOptions) => {
  Object.keys(config).forEach(key => {
    GLOBAL_OPTIONS[key] = config[key];
  });
};

export const getGlobalOptions = () => {
  return GLOBAL_OPTIONS;
};

export const defaultOptions: IOptions = Object.freeze({
  cancelLastRequest: true,
  cancelOnDispose: true,
  useLastRequest: false,
  cacheTime: 0,
});
