import Layout from '@/components/layout/Layout'
import { Outlet } from 'react-router-dom'
import BeforeEnter from './BeforeEnter'

const LayoutRouter: React.FC<any> = () => {
  return (
    <BeforeEnter options={{ requireLogin: true, requireRole: [1, 2] }}>
      <Layout>
        &nbsp;
        <Outlet />
        &nbsp;
      </Layout>
    </BeforeEnter>
  )
}

export default LayoutRouter
