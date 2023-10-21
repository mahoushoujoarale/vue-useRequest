export interface IOptions {
  cancelLastRequest: boolean;
  cancelOnDispose: boolean;
  useLastRequest: boolean;
  cacheTime: number;
  retryTimes: number;
}

export interface IGlobalOptions extends Partial<IOptions> {}

export interface IUseRequestOptions<T> extends Partial<IOptions> {
  onSuccess?: (result: T) => void;
  onCache?: (result: T) => void;
  onError?: (error: Error) => void;
  onBefore?: () => void;
  onAfter?: () => void;
  onCancel?: () => void;}
