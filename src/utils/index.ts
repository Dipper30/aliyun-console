import { message } from 'antd';
import reduxStore from '../stores';

/**
 * 获取环境
 * @returns {ProcessEnv}
 */
export const getEnv = () => import.meta.env.MODE;

export const successMessage = (msg: string, duration?: number) => {
  message.success(msg, duration ?? 3);
};

export const errorMessage = (msg: string, duration?: number) => {
  message.error(msg, duration ?? 3);
};

export const warningMessage = (msg: string, duration?: number) => {
  message.warning(msg, duration ?? 3);
};

export const infoMessage = (msg: string, duration?: number) => {
  message.info(msg, duration ?? 3);
};

export const getToken = () => {
  return localStorage.getItem('token') || null;
};

export const isSignedIn = (): boolean => {
  const store = reduxStore.getState();
  return Boolean(store.user && store.user?.id > 0);
};

export const getUser = (): UserDetail | null => {
  const store = reduxStore.getState();
  return store.user;
};

export const getDispatch = () => {
  return reduxStore.dispatch;
};

export const checkAuth = (userAuth: number[], toCheck: number[]): boolean => {
  for (const auth of toCheck) {
    if (!userAuth.includes(auth)) return false;
  }
  return true;
};

type HandleResultOptions = {
  notifySuccess?: boolean;
  notifyError?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

/**
 * check if the result from request is instance of Error
 * if true, notify error and return false
 * else notify success message and return true
 * @param {APIResponse} res
 * @param {boolean} notifySuccess
 * @returns
 */
export const handleResult = <T = any>(
  res: APIResponse<T>,
  options: HandleResultOptions = {
    notifyError: true,
    notifySuccess: false,
    successMessage: '',
    errorMessage: '',
  },
) => {
  const isErrorRes = !res.success;
  if (isErrorRes && !res.hideMsg) {
    if (options.notifyError !== false) errorMessage(options.errorMessage || res.msg || res.errMsg || 'Internal Error');
  } else {
    if (options.notifySuccess || options.successMessage) {
      successMessage(options.successMessage || res.msg);
    }
  }
  return !isErrorRes;
};

export const createImage = async (imgSrc: string): Promise<CanvasImageSource> => {
  const image = new Image();

  return new Promise(resolve => {
    image.src = imgSrc;
    setTimeout(() => resolve(image), 10);
  });
};

export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) == '[object Object]';
};

export const isArray = (arr: any): boolean => {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

export const deepClone: <T>(obj: T) => T = obj => {
  if (!isObject(obj) && !isArray(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    const arr: any = [];
    for (const o of obj as any) {
      arr.push(deepClone(o));
    }
    return arr;
  }
  if (isObject(obj)) {
    const o: any = {};
    for (const key in obj) {
      o[key] = deepClone(obj[key]);
    }
    return o;
  }
  return obj;
};

export const uniqueArr: <T>(arr: T[], key?: keyof T) => T[] = (arr, key) => {
  if (!arr) return arr;
  if (key === undefined) return [...new Set(arr)];
  const set = new Set();
  const init: typeof arr = [];
  const newArr = arr.reduce((prev, current) => {
    if (!set.has(current[key])) {
      set.add(current[key]);
      prev.push(current);
    }
    return prev;
  }, init);
  return newArr;
};
