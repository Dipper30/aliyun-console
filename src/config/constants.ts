export const DEFAULT_PAGE_ROUTE = '/app/me';

export enum PROCESS_ENV {
  DEVELOPMENT = 'development',
  TEST = 'test',
  SIMULATION = 'simulation',
  PRODUCTION = 'production',
}

export enum LANGUAGE {
  EN = 'en',
  ZH_CN = 'zhCN',
}

export const enum MenuPageCode {
  HOME,
  USER,
  USER_LIST,
  USER_DETAIL,
  ACCESS,
  AUTH_LIST,
  ROLE_LIST,
  CDN,
  BUCKET_LIST,
  BUCKET_DETAIL,
}

export enum STORAGE_KEY {
  LANG = 'language',
  TOKEN = 'token',
  THEME = 'theme',
  UID = 'uid',
}

export enum AuthCode {
  LOGIN_ADMIN = 1,
  CREATE_ACCOUNT = 5,
  MODIFY_AUTH = 10,
  MODIFY_ACCOUNT = 15,
  LOGIN_BUZ = 1000,
  LOGIN_CLIENT = 2000,
}

export enum RoleCode {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  BUZ = 50,
  USER = 100,
}

export enum ImageType {
  JPEG = 'jpeg',
  JPG = 'jpg',
  GIF = 'gif',
  WEBP = 'webp',
  SVG = 'svg',
  PNG = 'png',
}
