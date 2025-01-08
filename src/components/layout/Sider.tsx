import { useCallback, useMemo } from 'react';
import { Dropdown, MenuProps, Switch } from 'antd';
import SiderHead from './SiderHead';
import SiderMenuItem from './SiderMenuItem';
import useTheme from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { LANGUAGE } from '@/config/constants';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import { changeLanguage as changeLanguageAction } from '@/stores/actions/common';
import { changeLanguage } from 'i18next';
import useSiderMenu from '@/hooks/useSiderMenu';

type SiderProps = {
  collapsed: boolean;
};

const Sider: React.FC<SiderProps> = props => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const common = useAppSelector(store => store.common);
  const [theme, changeTheme] = useTheme();
  const auth: number[] = useAppSelector(state => state.user?.auth || []);
  const [rawMenu] = useSiderMenu();

  const shakeMenu = useCallback(
    (menu: any[]) => {
      const n = [];
      for (const item of menu) {
        // 判断是否有权限
        let hasAccess = true;
        if (item.auth) {
          for (const authToCheck of item.auth) {
            if (!auth.includes(authToCheck)) {
              hasAccess = false;
              break;
            }
          }
        }
        if (hasAccess) {
          const menuItem: any = {
            id: item.id,
            name: item.name,
            icon: item.icon,
            auth: item.auth,
            path: item.path,
            abbr: item.abbr,
          };
          if (item.children) {
            menuItem.children = shakeMenu(item.children);
          }
          n.push(menuItem);
        }
      }
      return n;
    },
    [rawMenu],
  );

  const menu = useMemo(() => {
    const res = shakeMenu(rawMenu);
    return res;
  }, [rawMenu]);

  const handleChangeTheme = (checked: boolean) => {
    changeTheme(checked ? 'dark' : 'light');
  };

  const switchLanguage = (lang: LANGUAGE) => {
    changeLanguage(lang);
    dispatch(changeLanguageAction(lang));
  };

  const languages: MenuProps['items'] = [
    {
      label: (
        <div className={common.language === LANGUAGE.EN ? 'selected' : ''} onClick={() => switchLanguage(LANGUAGE.EN)}>
          {t('lang.en')}
        </div>
      ),
      key: LANGUAGE.EN,
    },
    {
      label: (
        <div
          className={common.language === LANGUAGE.ZH_CN ? 'selected' : ''}
          onClick={() => switchLanguage(LANGUAGE.ZH_CN)}
        >
          {t('lang.zhCN')}
        </div>
      ),
      key: LANGUAGE.ZH_CN,
    },
  ];
  const languageAbbre = useMemo(() => {
    if (common.language === LANGUAGE.ZH_CN) return t('lang.zhCN-abbre');
    return t('lang.en-abbre');
  }, [common.language]);

  return (
    <div className={`sider-container${props.collapsed ? ' collapsed' : ''}`}>
      <SiderHead collapsed={props.collapsed} />

      <div className='menu-list'>
        {menu && menu.map((item, index: number) => <SiderMenuItem key={index} menuItem={item} />)}
      </div>

      <div className='sider-footer'>
        <div className='language-selector'>
          <Dropdown menu={{ items: languages }} trigger={['click']}>
            <div className='language-drop-down-button'>
              <GlobalOutlined /> <span className='text'>{languageAbbre}</span>
            </div>
          </Dropdown>
        </div>
        <div className='theme-selector'>
          <Switch
            className={`${theme === 'dark' ? 'dark' : 'light'}`}
            checkedChildren={t('day')}
            unCheckedChildren={t('night')}
            defaultChecked={theme == 'dark'}
            onChange={handleChangeTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Sider;
