import ErrorImg from '@/assets/images/pages/error.png'

type NoAuthProps = {
  //
}

const NoAuth: React.FC<NoAuthProps> = () => {
  return (
    <div className='common-page no-auth-page'>
      <img src={ErrorImg} alt='no-auth' />
      <p className='text'>Sorry, you are not authorized.</p>
    </div>
  )
}

export default NoAuth
