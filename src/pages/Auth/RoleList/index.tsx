import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.scss';
import ABreadCrumb from '@/components/ABreadCrumb';
import ATable from '@/components/ATable';
import { ColumnsType } from 'antd/lib/table';
import AAuthElement from '@/components/snippets/AAuthElement';
import { useState } from 'react';
import { configApi } from '@/api';
import { handleResult } from '@/utils';
import AddModal from './AddModal';
import EditModal from './EditModal';
import usePageCode from '@/hooks/usePageCode';
import { AuthCode, MenuPageCode } from '@/config/constants';
import useSiderMenu from '@/hooks/useSiderMenu';

const RoleList: React.FC<any> = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<RoleItem>();

  const [menu] = useSiderMenu();
  const breadcrumb = usePageCode(MenuPageCode.ROLE_LIST, menu);

  const columnsConfig: ColumnsType<RoleItem> = [
    {
      title: '',
      key: 'index',
      width: 50,
      fixed: 'left',
      ellipsis: true,
      render: (item: any, record, index: number) => <>{index + 1}</>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id: string) => <span>{id}</span>,
    },
    {
      title: '角色名',
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
      title: '权限',
      dataIndex: 'auth',
      key: 'auth',
      width: 250,
      render: (auth: any[]) => (
        <AAuthElement auth={[AuthCode.MODIFY_AUTH]} fallback={<> - </>}>
          <>
            {auth.map(a => (
              <div key={a.id}> {a.name} </div>
            ))}
          </>
        </AAuthElement>
      ),
    },
    {
      title: '选项',
      key: 'options',
      width: 150,
      fixed: 'right',
      render: (row: any) => (
        <div className='a-table-options'>
          <AAuthElement className='a-table-option-col' auth={[AuthCode.MODIFY_AUTH]}>
            <Button onClick={() => onEditingAuth(row)}> 编辑角色 </Button>
          </AAuthElement>
          <AAuthElement className='a-table-option-col' auth={[AuthCode.MODIFY_AUTH]}>
            <Popconfirm
              title='确认删除该角色吗?'
              onConfirm={() => deleteRole(row.id)}
              okText='确认'
              cancelText='点错了~'
            >
              <Button danger type='primary' shape='circle' icon={<DeleteOutlined />} />
            </Popconfirm>
          </AAuthElement>
        </div>
      ),
    },
  ];

  const config: ATableConfig = {
    filter: {},
    filterOptions: [
      {
        type: 'inputNumber',
        label: '角色ID',
        value: 'id',
        options: {
          min: 0,
          defaultValue: null,
        },
      },
    ],
    operation: {
      title: '角色列表',
      buttons: [
        {
          label: '添加角色',
          auth: [AuthCode.MODIFY_AUTH],
          eventName: 'showAddModal',
        },
      ],
    },
    table: {
      indexed: false,
      columns: columnsConfig,
    },
  };

  const fetchData = async (filter: { id?: number }) => {
    const res = await configApi.getRoles(filter);
    if (!handleResult(res)) return { data: [], total: 0 };
    const data = res.data.roles.map((v: any) => ({
      ...v,

      key: v.id,
    }));
    return { data, total: data.length };
  };

  const onEditingAuth = (row: any) => {
    setCurrentRow(row);
    if (!editModalVisible) setEditModalVisible(true);
  };

  const deleteRole = async (id: number) => {
    const res = await configApi.deleteRoleById({ id });
    if (!handleResult(res)) {
      setRefresh(true);
    }
  };

  const showAddModal = () => setAddModalVisible(true);

  return (
    <div className='role-list-page'>
      <ABreadCrumb config={breadcrumb} />

      <AddModal visible={addModalVisible} setRefresh={setRefresh} closeModal={() => setAddModalVisible(false)} />

      <EditModal
        visible={editModalVisible}
        setRefresh={setRefresh}
        roleInfo={currentRow}
        closeModal={() => setEditModalVisible(false)}
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
  );
};

export default RoleList;
