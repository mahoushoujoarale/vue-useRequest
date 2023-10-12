import type { InjectionKey } from 'vue';
import { IGlobalOptions, IOptions } from './types';

const GLOBAL_OPTIONS: IGlobalOptions = {};

export const GLOBAL_OPTIONS_PROVIDE_KEY: InjectionKey<IGlobalOptions> = Symbol(
  'GLOBAL_OPTIONS_PROVIDE_KEY',
);

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
});
