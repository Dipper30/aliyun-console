import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './ABreadCrumb.scss'
import { useAppDispatch } from '@/hooks/redux'
import { selectMenu } from '@/stores/actions/common'

type ABreadCrumbProps = {
  config: ABreadCrumbConfig[]
}

const ABreadCrumb: React.FC<ABreadCrumbProps> = props => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const directTo = (id: number, path: string) => {
    dispatch(selectMenu(id))
    navigate(path)
  }

  return props.config ? (
    <div className='a-breadcrumb-container'>
      <div className='nav-item'>
        <div className='text clickable' onClick={() => directTo(1, '/')}>
          <HomeOutlined />
        </div>
        {props.config.length > 0 ? <div className='separator'>/</div> : <></>}
      </div>
      {props.config.map((b, index) => {
        return (
          <div className='nav-item' key={index}>
            {b.route ? (
              <div className='text clickable' onClick={() => navigate(b.route as string)}>
                {b.text}
              </div>
            ) : (
              <div className='text'>{b.text}</div>
            )}
            {index == props.config.length - 1 ? <></> : <div className='separator'>/</div>}
          </div>
        )
      })}
    </div>
  ) : (
    <></>
  )
}

export default ABreadCrumb
