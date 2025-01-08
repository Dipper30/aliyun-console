import { configApi } from '@/api'
import { errorMessage, handleResult } from '@/utils'
import { Button, Checkbox, Col, Input, InputNumber, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'

type EditModalProps = {
  visible: boolean
  roleInfo: RoleItem | undefined
  closeModal: () => void
  setRefresh: (refresh: boolean) => void
}

const EditModal: React.FC<EditModalProps> = props => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [auth, setAuth] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [allAuth, setAllAuth] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    if (props.visible) fetchAuth()
  }, [props.visible])

  useEffect(() => {
    if (props.roleInfo) {
      setName(props.roleInfo.name)
      setDescription(props.roleInfo.description)
      setAuth(props.roleInfo.auth.map(a => a.id))
    }
  }, [props.roleInfo])

  const onSubmit = async () => {
    if (!name) {
      errorMessage('请填写name')
      return
    }
    if (!props.roleInfo || loading) return
    try {
      setLoading(true)
      const res = await configApi.updateRoleById({
        id: props.roleInfo.id,
        name,
        description,
        auth,
      })
      if (handleResult(res)) {
        props.closeModal()
        props.setRefresh(true)
      }
    } finally {
      setLoading(false)
    }
   
  }

  const onCheckAuth = async (auth: any[]) => {
    setAuth(auth)
  }

  const fetchAuth = async () => {
    const res = await configApi.getAuths()
    if (handleResult(res)) {
      setAllAuth(res.data.auth)
    }
  }

  return (
    <Modal
      title='编辑角色'
      open={props.visible}
      onCancel={props.closeModal}
      footer={[
        <Button loading={loading} key='submit' type='primary' onClick={onSubmit}>
          确认修改
        </Button>,
      ]}
    >
      <div className='row'>
        <div className='label'> 角色id </div>
        <div className='input'>
          <InputNumber disabled={true} value={props.roleInfo?.id} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 角色名 </div>
        <div className='input'>
          <Input placeholder='auth_name' value={name} onInput={(e: any) => setName(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 描述 </div>
        <div className='input'>
          <Input placeholder='description' value={description} onInput={(e: any) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 权限 </div>
        <div className='input'>
          <Checkbox.Group
            defaultValue={props.roleInfo?.auth.map(a => a.id)}
            style={{ width: '100%' }}
            onChange={onCheckAuth}
          >
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
