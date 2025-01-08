import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { lazyComponent, routeBefore } from '.'

const UserList = lazy(() => import('@/pages/User/UserList'))
const UserDetail = lazy(() => import('@/pages/User/UserDetail'))

const UserRoutes = () => {
  return (
    <Route key={2} path='user'>
      <Route index element={lazyComponent(UserList)} />
      <Route path='list' element={lazyComponent(UserList)} />
      <Route path=':id' element={routeBefore(UserDetail)} />
    </Route>
  )
}

export default UserRoutes
