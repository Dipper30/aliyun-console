import EmptyImg from '@/assets/images/pages/empty.png'

const Empty: React.FC<any> = () => {
  return (
    <div className='common-page empty-page'>
      <img src={EmptyImg} alt='empty' />
    </div>
  )
}

export default Empty
