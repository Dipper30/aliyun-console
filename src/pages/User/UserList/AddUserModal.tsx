import { configApi } from '@/api'
import { errorMessage, handleResult } from '@/utils'
import { Button, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'

const { Option } = Select

type AddUserModalProps = {
  visible: boolean
  closeModal: () => void
  setRefresh?: (refresh: boolean) => void
}

const AddUserModal: React.FC<AddUserModalProps> = props => {
  const [username, setUsername] = useState<string>('')
  const [rid, setRid] = useState<number>()
  const [password, setPassword] = useState<string>('')
  const [roleOptions, setRoleOptions] = useState<SelectorOptionConfig[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!props.visible) {
      setUsername('')
      setPassword('')
      setRid(undefined)
    }
  }, [props.visible])

  const onSubmit = async () => {
    // 参数校验
    if (!username || !password || !rid) {
      errorMessage('请填写全部信息')
      return
    }
    const uLen = username.length
    const uPwd = password.length
    if (uLen < 4 || uLen > 18) {
      errorMessage('username 长度在 4 ~ 18 之间')
      return
    }
    if (uPwd < 6 || uLen > 18) {
      errorMessage('password 长度在 6 ~ 18 之间')
      return
    }
    setLoading(true)
    const res = await configApi.createUser({ username, password, rid })
    setLoading(false)
    if (handleResult(res)) {
      props.closeModal()
      props.setRefresh && props.setRefresh(true)
    }
  }

  const fetchRoles = async () => {
    const res = await configApi.getRoleOptions(configApi.getAdminRoles)
    setRoleOptions(res)
  }

  return (
    <Modal
      title='新建账号'
      open={props.visible}
      onCancel={props.closeModal}
      footer={[
        <Button loading={loading} key='submit' type='primary' onClick={onSubmit}>
          添加
        </Button>,
      ]}
    >
      <div className='row'>
        <div className='label'> 用户名 </div>
        <div className='input'>
          <Input placeholder='4 ~ 18 位字符' value={username} onInput={(e: any) => setUsername(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 密码 </div>
        <div className='input'>
          <Input
            type='password'
            placeholder='6 ~ 18 位密码'
            value={password}
            onInput={(e: any) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 用户身份 </div>
        <div className='input'>
          <Select
            className='a-select'
            style={{ width: '250px' }}
            placeholder='选择身份'
            onDropdownVisibleChange={(open: boolean) => open && fetchRoles()}
            value={rid}
            onChange={(e: any) => setRid(e)}
          >
            {roleOptions.map(option => (
              <Option value={option.value} key={option.value}>
                &nbsp;
                {option.label}&nbsp;
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  )
}

export default AddUserModal
