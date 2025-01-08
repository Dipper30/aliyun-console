import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { routeBefore } from '.'

const FileSetting = lazy(() => import('@/pages/Setting/FileSetting'))

const SettingRoutes = () => {
  return (
    <Route path='setting'>
      <Route index element={routeBefore(FileSetting)} />
      <Route path='file' element={routeBefore(FileSetting)} />
    </Route>
  )
}

export default SettingRoutes
