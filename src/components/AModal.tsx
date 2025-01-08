import { Modal } from 'antd'

type AModalProps = {
  title: string
  visible: boolean
  children: JSX.Element
}

const AModal: React.FC<AModalProps> = props => {
  return (
    <Modal title={props.title} open={props.visible}>
      {props.children}
    </Modal>
  )
}

export default AModal
