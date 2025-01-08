import './SiderHead.scss'
import Logo from '@/assets/images/logo.svg'
// import PillLogo from '@/assets/images/pill-logo.svg'

type SiderHeadProps = {
  collapsed: boolean
}

const SiderHead: React.FC<SiderHeadProps> = props => {
  return (
    <div className={`sider-head-container${props.collapsed ? ' collapsed' : ''}`}>
      {props.collapsed ? <img src={Logo} alt='header-image' /> : <img src={Logo} alt='header-image' />}
    </div>
  )
}

export default SiderHead
