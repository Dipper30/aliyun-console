import { LANGUAGE, MenuPageCode } from '@/config/constants';
import { CommonAction } from '@/types/store-action';

export const selectMenu = (id: MenuPageCode) => ({ type: CommonAction.SELECT_MENU, data: id });

export const toggleMenu = (data: boolean) => ({ type: CommonAction.TOGGLE_MENU, data });

export const changeTheme = (data: keyof TThemeType) => ({ type: CommonAction.CHANGE_THEME, data });

export const changeLanguage = (data: LANGUAGE) => ({ type: CommonAction.CHANGE_LANGUAGE, data });
