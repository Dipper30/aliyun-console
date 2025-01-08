import { configApi } from '@/api'
import { errorMessage, handleResult } from '@/utils'
import { Button, Checkbox, Col, Input, InputNumber, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'

type AddModalProps = {
  visible: boolean
  closeModal: () => void
  setRefresh?: (refresh: boolean) => void
}

const EditModal: React.FC<AddModalProps> = props => {
  const [id, setId] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [auth, setAuth] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [allAuth, setAllAuth] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    if (props.visible) fetchAuth()
  }, [props.visible])

  const onSubmit = async () => {
    // 参数校验
    if (!name || !id) {
      errorMessage('请填写id和name')
      return
    }
    setLoading(true)
    const res = await configApi.createRole({ id, name, description, auth })
    setLoading(false)
    if (handleResult(res)) {
      props.closeModal()
      props.setRefresh && props.setRefresh(true)
    }
  }

  const fetchAuth = async () => {
    const res = await configApi.getAuths()
    if (handleResult(res)) {
      setAllAuth(res.data.auth)
    }
  }

  const onCheckAuth = async (auth: any[]) => {
    setAuth(auth)
  }

  return (
    <Modal
      title='新建角色'
      open={props.visible}
      onCancel={props.closeModal}
      footer={[
        <Button loading={loading} key='submit' type='primary' onClick={onSubmit}>
          添加
        </Button>,
      ]}
    >
      <div className='row'>
        <div className='label'> 角色id </div>
        <div className='input'>
          <InputNumber value={id} min={0} onChange={(e: any) => setId(e)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 角色名 </div>
        <div className='input'>
          <Input placeholder='role_name' value={name} onInput={(e: any) => setName(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 角色描述 </div>
        <div className='input'>
          <Input placeholder='description' value={description} onInput={(e: any) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 角色默认权限 </div>
        <div className='input'>
          <Checkbox.Group style={{ width: '100%' }} onChange={onCheckAuth}>
            {allAuth.map(a => (
              <Row key={a.id}>
                <Col>
                  <Checkbox value={a.id}>{`${a.name} # ${a.id}`}</Checkbox>
                </Col>
              </Row>
            ))}
          </Checkbox.Group>
        </div>
      </div>
    </Modal>
  )
}

export default EditModal
