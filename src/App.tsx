import '@/i18n/config';
import AppRouter from '@/routes';
import { useAppDispatch } from './hooks/redux';
import { changeLanguage } from '@/stores/actions/common';
import { getLocalLanguage } from './utils/tools';
import { LANGUAGE } from './config/constants';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(changeLanguage(getLocalLanguage() as LANGUAGE));
  return <AppRouter />;
};

export default App;
