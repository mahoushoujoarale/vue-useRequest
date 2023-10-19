export interface IOptions {
  cancelLastRequest: boolean;
  cancelOnDispose: boolean;
  useLastRequest: boolean;
  cacheTime: number;
  retryTimes: number;

  onSuccess?: <T>(result: T) => void;
  onCache?: <T>(result: T) => void;
  onError?: (error: Error) => void;
  onBefore?: () => void;
  onAfter?: () => void;
  onCancel?: () => void;
}

export interface IUserOptions extends Partial<IOptions> {}

export interface IGlobalOptions extends IUserOptions {}
