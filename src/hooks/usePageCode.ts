import { selectMenu } from '@/stores/actions/common';
import { useAppDispatch } from './redux';
import { useEffect, useMemo } from 'react';
import { MenuPageCode } from '@/config/constants';
import { findMenu } from '@/utils/tools';

/**
 * 对面包屑导航和边栏选中样式做处理
 * @param {MenuPageCode} code
 */
const usePageCode = (code: MenuPageCode, menuList: TSiderMenuItem[]) => {
  const dispatch = useAppDispatch();
  const menu = useMemo(() => findMenu(code, menuList), [code, menuList]);

  useEffect(() => {
    if (!menu) return;
    dispatch(selectMenu(menu.id));
  }, [menu, menuList]);

  return menu?.breadcrumb || [];
};

export default usePageCode;
