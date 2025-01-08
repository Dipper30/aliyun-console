import { configApi } from '@/api'
import { errorMessage, handleResult } from '@/utils'
import { Button, Input, InputNumber, Modal } from 'antd'
import { useState } from 'react'

type AddModalProps = {
  visible: boolean
  closeModal: () => void
  setRefresh?: (refresh: boolean) => void
}

const EditModal: React.FC<AddModalProps> = props => {
  const [id, setId] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async () => {
    if (!name) {
      errorMessage('请填写name')
      return
    }
    setLoading(true)
    const res = await configApi.createAuth({ id, name, description })
    setLoading(false)
    if (handleResult(res)) {
      props.closeModal()
      props.setRefresh && props.setRefresh(true)
    }
  }

  return (
    <Modal
      title='新建权限'
      open={props.visible}
      onCancel={props.closeModal}
      footer={[
        <Button loading={loading} key='submit' type='primary' onClick={onSubmit}>
          添加
        </Button>,
      ]}
    >
      <div className='row'>
        <div className='label'> 权限id </div>
        <div className='input'>
          <InputNumber value={id} min={0} onChange={(e: any) => setId(e)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 权限名 </div>
        <div className='input'>
          <Input placeholder='auth_name' value={name} onInput={(e: any) => setName(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 权限描述 </div>
        <div className='input'>
          <Input placeholder='description' value={description} onInput={(e: any) => setDescription(e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}

export default EditModal
