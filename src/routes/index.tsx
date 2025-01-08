import React, { FC, LazyExoticComponent, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import BeforeEnter from './BeforeEnter'
import UserRoutes from './UserRoutes'
import AuthRoutes from './AuthRoutes'
import Layout from '@/components/layout/Layout'

import Home from '@/pages/Home'
// components
import Page404 from '@/components/common/404'
import Loading from '@/components/common/Loading'
import Passport from '@/pages/Passport'
import useTheme from '@/hooks/useTheme'
import { getLocalStorage } from '@/utils/tools'
import { STORAGE_KEY } from '@/config/constants'

type RouteOption = {
  requireLogin?: boolean
  requireRole?: number[]
}

export const routeBefore = (Node: LazyExoticComponent<FC<any>>, options?: RouteOption) => (
  <BeforeEnter options={options}>
    <React.Suspense fallback={<Loading />}>
      <Node />
    </React.Suspense>
  </BeforeEnter>
)

export const lazyComponent = (Node: LazyExoticComponent<FC<any>>) => (
  <React.Suspense fallback={<Loading />}>
    <Node />
  </React.Suspense>
)

const Router: React.FC = () => {
  const [theme, changeTheme] = useTheme()

  useEffect(() => {
    const localTheme = getLocalStorage(STORAGE_KEY.THEME)
    if ((localTheme && localTheme == 'dark') || (localTheme == 'light' && theme != localTheme)) {
      changeTheme(localTheme)
    } else if (!localTheme) {
      changeTheme('dark')
    }
  }, [theme])

  const LayoutRouter = (
    <BeforeEnter options={{ requireLogin: true, requireRole: [1, 2] }}>
      <Layout>
        &nbsp;
        <Outlet />
        &nbsp;
      </Layout>
    </BeforeEnter>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/passport' element={<Passport />} />
        <Route path='/' element={LayoutRouter}>
          {/* home */}
          {/* routeBefore(Home, { requireLogin: true, requireRole: [1, 2] }) */}
          <Route index key={1} element={<Home />} />
          <Route path='home' key={1} element={<Home />} />

          {/* user */}
          {UserRoutes()}

          {/* auth */}
          {AuthRoutes()}
        </Route>

        <Route path='*' element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
