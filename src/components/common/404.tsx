import PageNotFound from '@/assets/images/pages/404.png'
import { useNavigate } from 'react-router-dom'

type Page404Props = {
  //
}

const Page404: React.FC<Page404Props> = () => {
  const navigate = useNavigate()

  return (
    <div className='common-page 404-page'>
      <img src={PageNotFound} alt='404page' />
      <p className='text'>
        <a onClick={() => navigate('/')}>回到首页</a>
      </p>
    </div>
  )
}

export default Page404
