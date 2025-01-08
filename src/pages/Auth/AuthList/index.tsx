import { configApi } from '@/api'
import ATable from '@/components/ATable'
import { handleResult } from '@/utils'
import { Button, Popconfirm } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'

import './index.scss'
import ABreadCrumb from '@/components/ABreadCrumb'
import AAuthElement from '@/components/snippets/AAuthElement'
import EditModal from './EditModel'
import AddModal from './AddModal'
import usePageCode from '@/hooks/usePageCode'
import { AuthCode, MenuPageCode } from '@/config/constants'
import useSiderMenu from '@/hooks/useSiderMenu'

const AuthList: React.FC<any> = () => {
  const [refresh, setRefresh] = useState<boolean>(false)
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false)
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<AuthItem>()

  const [menu] = useSiderMenu()
  const breadcrumb = usePageCode(MenuPageCode.AUTH_LIST, menu)

  const columnsConfig: ColumnsType<any> = [
    {
      title: '',
      key: 'index',
      width: 50,
      fixed: 'left',
      ellipsis: true,
      render: (item: any, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id: string) => <span>{id}</span>,
    },
    {
      title: '权限名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (description: string) => <span>{description}</span>,
    },
    {
      title: '选项',
      key: 'options',
      width: 150,
      fixed: 'right',
      render: (row: any) => (
        <div className='a-table-options'>
          <AAuthElement className='a-table-option-col' auth={[AuthCode.MODIFY_AUTH]}>
            <Button onClick={() => onEditingAuth(row)}> 编辑权限 </Button>
          </AAuthElement>
          <AAuthElement className='a-table-option-col' auth={[AuthCode.MODIFY_AUTH]}>
            <Popconfirm
              title='确认删除该权限吗?'
              onConfirm={() => deleteAuth(row.id)}
              okText='确认'
              cancelText='点错了~'
            >
              <Button danger type='primary' shape='circle' icon={<DeleteOutlined />} />
            </Popconfirm>
          </AAuthElement>
        </div>
      ),
    },
  ]

  const config: ATableConfig = {
    filter: {},
    filterOptions: [
      {
        type: 'inputNumber',
        label: '权限ID',
        value: 'id',
        options: {
          min: 0,
          defaultValue: null,
        },
      },
    ],
    operation: {
      title: '权限列表',
      buttons: [
        {
          label: '添加权限',
          auth: [AuthCode.MODIFY_AUTH],
          eventName: 'showAddModal',
        },
      ],
    },
    table: {
      indexed: false,
      columns: columnsConfig,
    },
  }

  const fetchData = async (filter: { id?: number; name?: string }) => {
    const res = await configApi.getAuths(filter)
    if (!handleResult(res)) return { data: [], total: 0 }
    if (!Array.isArray(res.data.auth)) res.data.auth = [res.data.auth]
    const data = res.data.auth.map((v: any) => ({
      ...v,
      key: v.id,
    }))
    return { data, total: data.length }
  }

  const onEditingAuth = (row: any) => {
    setCurrentRow(row)
    if (!editModalVisible) setEditModalVisible(true)
  }

  const deleteAuth = async (id: number) => {
    const res = await configApi.deleteAuthById({ id })
    if (!handleResult(res)) {
      setRefresh(true)
    }
  }

  const showAddModal = () => setAddModalVisible(true)

  return (
    <div className='auth-list-page'>
      <ABreadCrumb config={breadcrumb} />

      <AddModal visible={addModalVisible} closeModal={() => setAddModalVisible(false)} setRefresh={setRefresh} />

      <EditModal
        authInfo={currentRow}
        visible={editModalVisible}
        closeModal={() => setEditModalVisible(false)}
        setRefresh={setRefresh}
      />

      <ATable
        config={config}
        fetchData={fetchData}
        refresh={refresh}
        setRefresh={setRefresh}
        fns={{
          showAddModal,
        }}
      />
    </div>
  )
}

export default AuthList
