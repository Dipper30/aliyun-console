import { useAppSelector } from '@/hooks/redux'
import { checkAuth } from '@/utils'

type AAuthElementProps = {
  auth: number[]
  className?: string
  children: JSX.Element
  fallback?: JSX.Element
}

/**
 * 用于包裹需要指定权限的元素
 * @param {AAuthElementProps} props
 */
const AAuthElement: React.FC<AAuthElementProps> = props => {
  const user = useAppSelector(state => state.user)!

  if (!checkAuth(user.auth, props.auth)) {
    return <> {props.fallback ?? <></>} </>
  } else return <div className={`${props.className ?? ''}`}>{props.children}</div>
}

export default AAuthElement
