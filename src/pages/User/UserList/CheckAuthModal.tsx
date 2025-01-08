import { configApi } from '@/api'
import AAuthElement from '@/components/snippets/AAuthElement'
import { errorMessage, handleResult } from '@/utils'
import { Button, Checkbox, Col, Modal, Row, Select, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useEffect, useMemo, useState } from 'react'
import './CheckAuthModal.scss'
import { AuthCode } from '@/config/constants'
import { UserRoleTag } from '@/components/snippets'

type CheckAuthModalProps = {
  visible: boolean
  userInfo: UserListItem
  closeModal: () => void
  setRefresh?: (refresh: boolean) => void
}

const columns: ColumnsType<any> = [
  {
    title: '权限ID',
    dataIndex: 'id',
    key: 'id',
    width: 40,
    render: (id: number) => <span>{id}</span>,
  },
  {
    title: '权限名',
    dataIndex: 'name',
    key: 'name',
    width: 80,
    render: (name: string) => <span>{name}</span>,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 120,
    render: (description: string) => <span>{description}</span>,
  },
]

const CheckAuthModal: React.FC<CheckAuthModalProps> = props => {
  // const [auth, setAuth] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [allAuth, setAllAuth] = useState<AuthItem[]>([])
  const [allRoles, setAllRoles] = useState<RoleItem[]>([])
  const [newRole, setNewRole] = useState<number>()
  const [newAuth, setNewAuth] = useState<number[]>([])

  useEffect(() => {
    if (!props.userInfo) {
      setNewAuth([])
    }
  }, [props.userInfo])

  useEffect(() => {
    if (!props.visible) {
      setIsEditing(false)
    } else {
      fetchAllAuth()
    }
  }, [props.visible])

  const changeEditingStatus = () => {
    if (isEditing) {
      setNewRole(props.userInfo.role.id)
      setIsEditing(false)
    } else {
      fetchAllRoles()
      setNewRole(props.userInfo.role.id)
      setIsEditing(true)
    }
  }

  const fetchAllAuth = async () => {
    const res = await configApi.getAuths()
    if (handleResult(res)) {
      setAllAuth(res.data.auth)
    }
  }
 
  const  fetchAllRoles = async () => {
    const res = await configApi.getRoles()
    if (handleResult(res)) {
      setAllRoles(res.data.roles)
    }
  }

  const onSubmit = async () => {
    // 参数校验
    if (!newRole) {
      errorMessage('请勾选身份')
      return
    }
    if (loading) return 
    try {
      setLoading(true)
      const res = await configApi.updateUserRole({ id: props.userInfo.id, rid: newRole })
      if (handleResult(res)) {
        props.closeModal()
        props.setRefresh && props.setRefresh(true)
      }
    } catch (error) {
      
    } finally {

      setLoading(false)
    }
   
    
  }

  const onRoleChange = (rid: number) => {
setNewRole(rid)
  }

  const readOnlySection = (
    <>
      <div className='row'>
        <div className='label'> 用户id </div>
        <div className='input'>{props.userInfo?.id}</div>
      </div>

      <div className='row'>
        <div className='label'> 用户名 </div>
        <div className='input'>{props.userInfo?.username}</div>
      </div>

      <div className='row'>
        <div className='label'> 用户角色 </div>
        <div className='input'> <UserRoleTag role={props.userInfo!.role}></UserRoleTag></div>
      </div>

      <Table columns={columns} dataSource={allAuth} pagination={false} />
    </>
  )

  const editSection = (
    <div className='auth-selector-list'>
      <div >
        <Select options={allRoles.map(r=>({
          value: r.id,
          label: r.description || r.name,
        }))} onChange={onRoleChange} style={{width: '200px'}} value={newRole} />
      </div>
      <div className='flex flex-col gap-1 my-4'>

        {allAuth.map((a,i) => (
          <div className='auth-name '>{i+1}. {`${a.name} # ${a.id}`}</div>
        ))}
        </div>
    </div>
  )

  const footer = [
    <div key={1}>
      {isEditing ? (
        <Button type='primary' onClick={onSubmit}>
          确认修改
        </Button>
      ) : (
        <></>
      )}
    </div>,
  ]

  return (
    <Modal title='用户权限' open={props.visible} onCancel={props.closeModal} footer={footer}>
      <AAuthElement auth={[AuthCode.MODIFY_ACCOUNT]}>
        <Button className='edit-btn' loading={loading} onClick={changeEditingStatus}>
          {isEditing ? '取消修改' : '修改权限'}
        </Button>
      </AAuthElement>
      {isEditing ? editSection : readOnlySection}
    </Modal>
  )
}

export default CheckAuthModal
