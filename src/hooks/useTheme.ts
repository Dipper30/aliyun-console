import { themeColors } from '@/config/theme';
import { changeTheme as changeThemeAction } from '@/stores/actions/common';
import { useAppDispatch, useAppSelector } from './redux';

const useTheme = () => {
  const theme = useAppSelector(state => state.common.theme);
  const dispatch = useAppDispatch();

  const changeTheme = (newTheme: keyof TThemeType) => {
    const body = document.getElementsByTagName('body')[0];
    const colorSettings = themeColors[newTheme];
    for (const key in colorSettings) {
      body.style.setProperty(`--${key}`, colorSettings[key as keyof TThemeProperty]);
    }
    dispatch(changeThemeAction(newTheme));
  };

  return [theme, changeTheme] as const;
};

export default useTheme;
