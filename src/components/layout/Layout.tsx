import Content from './Content'
import Header from './Header'
import Sider from './Sider'
import './Layout.scss'

type LayoutProps = {
  children: any
}
const collapsed = false
const Layout: React.FC<LayoutProps> = props => {
  // const collapsed = useSelector((state: any) => state.config.collapsed)

  return (
    <div className='layout-container'>
      <Header collapsed={collapsed} />
      <Sider collapsed={collapsed} />
      <Content collapsed={collapsed}>{props.children}</Content>
    </div>
  )
}

export default Layout
