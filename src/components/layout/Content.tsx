type ContentProps = {
  children: any
  collapsed: boolean
}

const Content: React.FC<ContentProps> = props => {
  return <div className={`content-container${props.collapsed ? ' collapsed' : ''}`}>{props.children}</div>
}

export default Content
