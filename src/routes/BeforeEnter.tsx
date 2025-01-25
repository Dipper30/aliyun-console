import { configApi } from '@/api';
import Loading from '@/components/common/Loading';
import { MenuPageCode, STORAGE_KEY } from '@/config/constants';
import { selectMenu } from '@/stores/actions/common';
import { setUser } from '@/stores/actions/user';
import { isSignedIn, handleResult } from '@/utils';
import { getLocalStorage, setLocalStorage } from '@/utils/tools';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type BeforeEnterProps = {
  children: JSX.Element;
  options?: {
    requireLogin?: boolean;
    requireRole?: number[];
    rootPage?: MenuPageCode;
  };
};

const BeforeEnter: React.FC<BeforeEnterProps> = props => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const autoLogin = async () => {
    const res = await configApi.loginByToken();
    if (!handleResult(res)) relogin();
    else {
      const { id, username, role, auth } = res.data.user;
      const newUser = { id, username, role, auth };
      dispatch(setUser(newUser));
      setLocalStorage(STORAGE_KEY.TOKEN, res.data.token);
    }
  };

  useEffect(() => {
    if (props?.options?.requireLogin !== false && !isSignedIn()) {
      // 检查本地token
      if (getLocalStorage(STORAGE_KEY.TOKEN)) {
        autoLogin();
      } else {
        relogin();
      }
    }
    if (props.options?.rootPage) {
      dispatch(selectMenu(props.options.rootPage));
    }
  }, []);

  const relogin = () => {
    navigate('/passport');
  };

  return user && user.id > 0 ? props.children : <Loading />;
};

export default BeforeEnter;
