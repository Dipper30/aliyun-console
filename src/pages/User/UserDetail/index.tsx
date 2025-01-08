import { configApi } from '@/api'
import ABreadCrumb from '@/components/ABreadCrumb'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { handleResult } from '@/utils'
import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { setUser as setUserAction } from '@/stores/actions/user'
import './index.scss'
import { setLocalStorage } from '@/utils/tools'
import { STORAGE_KEY } from '@/config/constants'

const UserDetail: React.FC<any> = () => {
  const p = useParams()
  const [uid, setUid] = useState<number>()
  const [user, setUser] = useState<UserDetail>()
  const myInfo = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const [editPassword, setEditPassword] = useState<boolean>(false)
  const [username, setUsername] = useState<string>()
  const [oldPassword, setOldPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    if (p) {
      const id = Number(p.id)
      setUid(id)
      fetchUserInfo(id)
    }
  }, [p])

  const fetchUserInfo = async (id: number) => {
    const res = await configApi.getUserById(id)
    if (handleResult(res)) {
      setUser(res.data)
    }
  }

  const changeEditingStatus = () => {
    if (!isEditing) {
      setUsername(user?.username)
      setIsEditing(true)
    } else {
      setEditPassword(false)
      setIsEditing(false)
      setUsername('')
      setOldPassword('')
      setPassword('')
    }
  }

  const onUsernameInput = (e: any) => {
    setUsername(e.target.value)
  }

  const onSubmitModification = async () => {
    const param: { username?: string; password?: string; newPassword?: string } = {}
    if (username) param.username = username
    if (oldPassword) param.password = oldPassword
    if (password) param.newPassword = password
    const res = await configApi.updateUserInfo(param)
    if (handleResult(res)) {
      dispatch(setUserAction(res.data.user))
      setLocalStorage(STORAGE_KEY.TOKEN, res.data.token)
      setIsEditing(false)
      fetchUserInfo(uid ?? Number(p.id))
    }
  }

  const editSection = (
    <div className='user-info'>
      <div className='row'>
        <div className='label'>用户ID</div>
        <div className='value'>{user?.id}</div>
      </div>
      <div className='row'>
        <div className='label'>用户名</div>
        <div className='value'>
          <Input value={username} onInput={onUsernameInput} />
        </div>
      </div>
      {editPassword ? (
        <>
          <div className='row'>
            <div className='label'>旧密码</div>
            <div className='value'>
              <Input.Password value={oldPassword} onInput={(e: any) => setOldPassword(e.target.value)} />
            </div>
          </div>
          <div className='row'>
            <div className='label'>新密码</div>
            <div className='value'>
              <Input.Password value={password} onInput={(e: any) => setPassword(e.target.value)} />
            </div>
          </div>
        </>
      ) : (
        <Button onClick={() => setEditPassword(!editPassword)}> 修改密码 </Button>
      )}
      <div className='row'>
        <Button type='primary' onClick={onSubmitModification}>
          保存修改
        </Button>
      </div>
    </div>
  )

  const readOnlyInfo = (
    <div className='user-info'>
      <div className='row'>
        <div className='label'>用户ID</div>
        <div className='value'>{user?.id}</div>
      </div>
      <div className='row'>
        <div className='label'>用户名</div>
        <div className='value'>{user?.username}</div>
      </div>
    </div>
  )

  return (
    <div className='user-detail-page'>
      <ABreadCrumb config={[{ text: '用户信息' }]} />
      {user?.id === myInfo?.id && (
        <Button className='edit-btn' onClick={changeEditingStatus}>
          &nbsp;
          {isEditing ? '取消修改' : '修改信息'}&nbsp;
        </Button>
      )}
      {isEditing ? editSection : readOnlyInfo}
    </div>
  )
}

export default UserDetail
