export interface IOptions {
  cancelLastRequest: boolean;
  cancelOnDispose: boolean;
  useLastRequest: boolean;
  cacheTime: number;

  onSuccess?: <T>(result: T) => void;
  onError?: (error: Error) => void;
  onBefore?: () => void;
  onAfter?: () => void;
}

export interface IUserOptions extends Partial<IOptions> {}

export interface IGlobalOptions extends IUserOptions {}