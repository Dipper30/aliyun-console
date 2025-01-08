import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { APopoverItem } from '@/components/snippets'
import { configApi } from '@/api'
import { handleResult } from '@/utils'
import { deleteLocalStorage } from '@/utils/tools'
import { STORAGE_KEY } from '@/config/constants'

type HeaderProps = {
  collapsed: boolean
}

const Header: React.FC<HeaderProps> = props => {
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.user)
  const { t } = useTranslation()
  const checkDetail = () => {
    navigate(`user/${user.id}`)
  }

  const logout = async () => {
    const res = await configApi.logout()
    if (
      handleResult(res, {
        successMessage: '已登出当前账号',
      })
    ) {
      deleteLocalStorage(STORAGE_KEY.TOKEN)
      navigate('/passport')
    }
  }

  const userPopoverContent = (
    <div className='w-24'>
      <APopoverItem text='个人中心' trigger={checkDetail} />
      <APopoverItem text={t('logout')} trigger={logout} />
    </div>
  )

  return (
    <div className={`header-container${props.collapsed ? ' collapsed' : ''}`}>
      <div className='title'>{t('title')}</div>
      <div>
        <Popover placement='bottomLeft' content={userPopoverContent} arrow={false}>
          <div className='user'>{user?.username}</div>
        </Popover>
      </div>
    </div>
  )
}

export default Header
