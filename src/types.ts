export interface IOptions {
  cancelLastRequest: boolean;
  cancelOnDispose: boolean;
  useLastRequest: boolean;
  cacheTime: number;
}

export interface IUserOptions extends Partial<IOptions> {}

export interface IGlobalOptions extends IUserOptions {}