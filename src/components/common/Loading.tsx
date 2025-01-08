import ALoader from './ALoader'

type LoadingProps = {
  loaderSize?: 'default' | 'large' | 'small'
}

const Loading: React.FC<LoadingProps> = props => {
  return (
    <div className='common-page loading-container'>
      <ALoader size={props.loaderSize} />
      <p className='text'>Loading...</p>
    </div>
  )
}

export default Loading
