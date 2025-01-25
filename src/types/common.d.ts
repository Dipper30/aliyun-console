/// <reference types="vite/client" />

type TThemeProperty = {
  // 背景色
  surface1: string;
  surface2: string;
  surface3: string;
  surface_hover: string;
  surface_hover_dark: string;
  surface_hover_light: string;

  // 文字
  text1: string;
  text1_hover: string;
  text2: string;
  text3: string;

  // 元素主色
  prime1: string;
  prime2: string;
  prime3: string;
  prime_hover: string;

  // 元素辅色
  second1: string;
  second2: string;
  second3: string;
  second_hover: string;

  // 边框
  border_dark: string;
  border_light: string;

  // 固定色
  green: string;
  green_hover: string;
  pink: string;
  red: string;
  blue: string;
  grey: string;

  sider1?: string;
  sider2?: string;
  sider3?: string;

  [key: string]: string;
};

type TThemeType = {
  light: TThemeProperty;
  dark: TThemeProperty;
};

interface ImgResponse {
  name: string;
  data: string;
  id: string;
  picType: string;
  type: string;
}

// type APIResponse<T = any, S extends boolean = any> = {
//   success: boolean
//   code: number
//   msg: string
//   errMsg: S extends true ? undefined : string | undefined
//   data: S extends true ? T : T | undefined
// }

type APIResponse<T = any> =
  | {
      success: true;
      code: number;
      msg: string;
      data: NonNullable<T>;
      hideMsg?: boolean;
    }
  | {
      success: false;
      code: number;
      msg: string;
      errMsg?: string;
      data: T;
      hideMsg?: boolean;
    };

// | {
//     success: false
//     code: number
//     msg: string
//     errMsg?: string
//     data?: T
//   }

type SuccessfulAPIResponse<T = any> = APIResponse<T, true>;

type APIPromise<T> = Promise<APIResponse<T>>;

interface SocketResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface SiderMenuItem {
  id: number;
  name: string;
  abbr: string;
  auth?: number[];
  icon?: any;
  path?: string;
  children?: SiderMenuItem[];
}

interface SiderSubMenuItem {
  id: number;
  name: string;
  abbr: string;
  auth?: number[];
  path?: string;
}
interface SearchBoxConfig {
  type: string;
  label: string;
  value: string;
  placeholder?: string;
  prop?: string;
  dynamic?: string;
  width?: number;
  selections?: SelectorOptionConfig[];
  optionName?: string;
  options?: any;
}

interface OperationConfig {
  title: string | Function;
  buttons?: { label: string; eventName: string; auth?: number[] }[];
  render?: any;
}

interface SelectorOptionConfig {
  value: any;
  label: string;
}

interface TableColumnConfig {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  fixed?: string;
  render?: (...args) => JSX.Element;
}

interface TableConfig {
  indexed: boolean;
  columns: ColumnsType<any>;
}

interface ATableConfig {
  filter?: any;
  filterOptions?: SearchBoxConfig[];
  operation?: OperationConfig;
  table: TableConfig;
}

interface ABreadCrumbConfig {
  route?: string;
  text: string;
}

type TCommon = {
  selectedMenu: number;
  menuCollapsed: boolean;
  theme: keyof TThemeType;
  language: LANGUAGE;
};

type TStoreAction<T, D> = {
  type: T;
  data: D;
};

type TSiderMenuItem = {
  id: number;
  name: string;
  abbr: string;
  auth?: number[];
  breadcrumb?: ABreadCrumbConfig[];
  icon?: any;
  path?: string;
  children?: TSiderMenuItem[];
};

type Pagination = {
  page: number;
  size: number;
};
