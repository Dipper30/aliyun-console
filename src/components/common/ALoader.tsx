import './ALoader.scss'
import TVLoading from '@/assets/images/gifs/tv-loading.gif'

type ALoaderProps = {
  size?: 'default' | 'large' | 'small'
}

const ALoader: React.FC<ALoaderProps> = props => {
  return (
    <div className={`a-loader-container${props.size ? ` ${props.size}` : ' default'}`}>
      <img src={TVLoading} alt='tv' />
      <div className='a-loader'>
        <div className='a-dot' />
        <div className='a-dot' />
        <div className='a-dot' />
        <div className='a-dot' />
        <div className='a-dot' />
      </div>
    </div>
  )
}

export default ALoader
