import './index.scss'

type PanelProps = {
  children: React.ReactNode
  title?: string
  titleNode?: React.ReactNode
  className?: string
}

const Panel: React.FC<PanelProps> = props => {
  return (
    <div className={`a-panel ${props.className}`}>
      {props.titleNode && <div>{props.titleNode}</div>}
      {!props.titleNode && props.title && <div className='title'>{props.title}</div>}
      {props.children}
    </div>
  )
}

export default Panel
