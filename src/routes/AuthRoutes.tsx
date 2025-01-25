import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { lazyComponent } from '.';

const AuthList = lazy(() => import('@/pages/Auth/AuthList'));
const RoleList = lazy(() => import('@/pages/Auth/RoleList'));

const AuthRoutes = () => {
  return (
    <Route key={3} path='access'>
      <Route index element={lazyComponent(AuthList)} />
      <Route path='auth' element={lazyComponent(AuthList)} />
      <Route path='role' element={lazyComponent(RoleList)} />
    </Route>
  );
};

export default AuthRoutes;
