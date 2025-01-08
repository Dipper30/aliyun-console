import { Tag } from 'antd'
import { useEffect, useState } from 'react'

type UserRoleTagProps = {
  role: { id: number; name: string }
}

const UserRoleTag: React.FC<UserRoleTagProps> = props => {
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    if (props.role.id === 1) setColor('volcano')
    else if (props.role.id === 2) setColor('geekblue')
    else setColor('green')
  }, [props.role])

  return <Tag color={color}> {props.role.name} </Tag>
}

export default UserRoleTag
