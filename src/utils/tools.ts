import { LANGUAGE, MenuPageCode, STORAGE_KEY } from '@/config/constants';
import dayjs from 'dayjs';
import moment from 'moment';

/**
 * 防抖 一段时间只执行一次, 并返回异步回调结果
 */
export const asyncDebounce = (fn: any, interval: number = 500) => {
  let timer: any = null;
  return async (...args: any) => {
    if (!timer) {
      // 立即执行
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, interval);
      return await fn(...args);
    } else {
      clearTimeout(timer);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new Promise((resolve: any, reject: any) => {
        timer = setTimeout(async () => {
          clearTimeout(timer);
          timer = null;
          const res = await fn(...args);
          resolve(res);
        }, interval);
      });
    }
  };
};

export const debounce = (fn: any, interval: number = 500) => {
  let timer: any = null;
  return async (...args: any) => {
    if (!timer) {
      // 立即执行
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, interval);
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        clearTimeout(timer);
        timer = null;
        fn(...args);
      }, interval);
    }
  };
};

/**
 * get current unix timestamp
 * @returns current unix timestamp
 */
export const getUnixTS = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

export const getTS = (): number => {
  return Date.now();
};

export const formatTime = (ts?: number | Date | null, format: string = 'YY-MM-DD hh:mm:ss'): string => {
  if (!ts) ts = new Date();
  if (typeof ts === 'number') {
    if (ts?.toString().length === 10) {
      ts = ts * 1000;
    }
  }

  const time = dayjs(ts);
  return time.format(format);
};

/**
 * 根据url解析params
 * @param url
 * @returns { [k: string]: string }
 */
export const getParams = (url: string): { [k: string]: string } => {
  // const pattern = /(?<=\?|&)(?<k>\w+)=(?<v>\w+)/g
  const pattern = /(?<k>\w+)=(?<v>\w+)/g;

  const res = url.matchAll(pattern);
  const arr = [...res];
  const p: { [k: string]: string } = {};
  arr.forEach((a: any[]) => {
    p[a[1]] = a[2];
  });
  return p;
};

/**
 * 混淆明文，返回密文
 * @param pt
 * @returns
 */
export const mixMessage = (pt: string) => {
  return pt;
};

/**
 * 对混淆密文解密
 */
export const decryptMessage = (ct: string) => {
  return ct;
};

/** 获取浏览器语言，不命中则返回 'en' */
export const getBrowserLanguage = () => {
  const nav = window.navigator as any;
  const language = nav.userLanguage || nav.language;
  if (['en-US', 'en', 'en-us', 'en_US', 'en_us'].includes(language)) return LANGUAGE.EN;
  if (['zh', 'zh-cn', 'zh-CN', 'zh_cn', 'zh_CN'].includes(language)) return LANGUAGE.ZH_CN;
  return LANGUAGE.EN;
};

/** 获取本地语言，若无则获取浏览器语言，默认为 'en */
export const getLocalLanguage = () => {
  const localLanguage = getLocalStorage(STORAGE_KEY.LANG);
  if (localLanguage) return localLanguage as keyof typeof LANGUAGE;
  return getBrowserLanguage();
};

export const setLocalLanguage = (language: LANGUAGE) => {
  setLocalStorage(STORAGE_KEY.LANG, language);
};

export const setLocalStorage = (key: STORAGE_KEY, val: string) => {
  localStorage.setItem(key, val);
};

export const getLocalStorage = (key: STORAGE_KEY) => {
  return localStorage.getItem(key);
};

export const deleteLocalStorage = (key: STORAGE_KEY) => {
  return localStorage.removeItem(key);
};

/**
 * 根据 page code 返回 menu 配置信息
 * @param code
 * @returns {TSiderMenuItem}
 */
export const findMenu = (code: MenuPageCode, list: TSiderMenuItem[] = []): TSiderMenuItem | null => {
  if (!list || list.length === 0) return null;
  for (const menu of list) {
    if (menu.id === code) return menu;
    const res = findMenu(code, menu.children || []);
    if (res) return res;
  }
  return null;
};

export const getFileSize = (size: number) => {
  return size > 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(2)}MB`
    : size > 1024
      ? `${(size / 1024).toFixed(2)}KB`
      : `${size.toFixed(2)}KB`;
};

export const getCdnDirName = (dirContext: {
  parents: ModelType.BucketFileDir[];
  current?: ModelType.BucketFileDir;
  children: ModelType.BucketFileDir[];
}) => {
  if (!dirContext.current) {
    return 'root /';
  } else if (!dirContext.parents.length) {
    return `root / ${dirContext.current.name} /`;
  } else return `root / ${dirContext.parents.map(p => p.name).join(' / ')} / ${dirContext.current.name} /`;
};
