import './index.scss'

type APopoverItemProps = {
  text: string
  trigger?: Function
}

const APopoverItem: React.FC<APopoverItemProps> = props => {
  return (
    <div className='a-popover-item' onClick={() => props.trigger?.()}>
      {props.text}
    </div>
  )
}

export default APopoverItem
