import { LANGUAGE, MenuPageCode, STORAGE_KEY } from '@/config/constants';
import { CommonAction } from '@/types/store-action';
import { setLocalStorage } from '@/utils/tools';

const initialState: TCommon = {
  selectedMenu: MenuPageCode.HOME,
  menuCollapsed: false,
  theme: 'dark',
  language: LANGUAGE.EN,
};

const commonReducer = (preState: TCommon = initialState, action: any): TCommon => {
  const { type, data } = action;
  switch (type) {
    case CommonAction.SELECT_MENU:
      return { ...preState, selectedMenu: data };
    case CommonAction.TOGGLE_MENU:
      return { ...preState, menuCollapsed: data };
    case CommonAction.CHANGE_THEME:
      // 更换主题色
      setLocalStorage(STORAGE_KEY.THEME, data);
      return { ...preState, theme: data };
    case CommonAction.CHANGE_LANGUAGE:
      // 更换主题色
      setLocalStorage(STORAGE_KEY.LANG, data);
      return { ...preState, language: data };
    default:
      return preState;
  }
};

export default commonReducer;
