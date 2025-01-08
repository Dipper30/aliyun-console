import { HomeOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { AuthCode, MenuPageCode } from '@/config/constants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAppSelector } from './redux';

/**
 * 对面包屑导航和边栏选中样式做处理
 * @param {MenuPageCode} code
 */
const useSiderMenu = () => {
  const { t } = useTranslation();
  const common = useAppSelector(store => store.common);
  const [siderMenu, setSiderMenu] = useState<TSiderMenuItem[]>([]);
  useEffect(() => {
    setSiderMenu([
      {
        id: MenuPageCode.HOME,
        name: t('page.home'),
        abbr: 'Home',
        icon: HomeOutlined,
        auth: [AuthCode.LOGIN_ADMIN],
        path: '/',
      },
      {
        id: MenuPageCode.USER,
        name: t('page.user'),
        abbr: 'User',
        icon: UserOutlined,
        children: [
          {
            id: MenuPageCode.USER_LIST,
            name: t('page.user-list'),
            breadcrumb: [{ text: t('page.user-list') }],
            abbr: 'List',
            icon: UserOutlined,
            auth: [AuthCode.LOGIN_ADMIN],
            path: '/user/list',
          },
        ],
      },
      {
        id: MenuPageCode.ACCESS,
        name: t('page.access'),
        abbr: 'access',
        icon: KeyOutlined,
        children: [
          {
            id: MenuPageCode.AUTH_LIST,
            name: t('page.auth'),
            breadcrumb: [{ text: t('page.auth') }],
            abbr: 'List',
            auth: [AuthCode.LOGIN_ADMIN],
            path: '/access/auth',
          },
          {
            id: MenuPageCode.ROLE_LIST,
            name: t('page.role'),
            breadcrumb: [{ text: t('page.role') }],
            abbr: 'Role',
            auth: [AuthCode.LOGIN_ADMIN],
            path: '/access/role',
          },
        ],
      },
    ]);
  }, [common.language]);

  return [siderMenu];
};

export default useSiderMenu;
