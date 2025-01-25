import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { lazyComponent, routeBefore } from '.';
import { MenuPageCode } from '@/config/constants';

const BucketList = lazy(() => import('@/pages/Cdn/BucketList'));
const BucketDetail = lazy(() => import('@/pages/Cdn/BucketDetail'));

const CdnRoutes = () => {
  return (
    <Route key={4} path='cdn'>
      <Route index path='bucket/list' element={lazyComponent(BucketList)} />
      <Route path='bucket/:name' element={routeBefore(BucketDetail, { rootPage: MenuPageCode.BUCKET_LIST })} />
    </Route>
  );
};

export default CdnRoutes;
