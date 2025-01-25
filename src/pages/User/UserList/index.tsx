import { useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Button, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { configApi } from '@/api';
import { handleResult } from '@/utils';
import ABreadCrumb from '@/components/ABreadCrumb';
import ATable from '@/components/ATable';
import { formatTime } from '@/utils/tools';
import CheckAuthModal from './CheckAuthModal';
import AddUserModal from './AddUserModal';
import AAuthElement from '@/components/snippets/AAuthElement';
import usePageCode from '@/hooks/usePageCode';
import { AuthCode, MenuPageCode } from '@/config/constants';
import useSiderMenu from '@/hooks/useSiderMenu';
import { UserRoleTag } from '@/components/snippets';

const UserList: React.FC = props => {
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [checkAuthModalVisible, setCheckAuthModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const navigate = useNavigate();

  const [menu] = useSiderMenu();
  const breadcrumb = usePageCode(MenuPageCode.USER_LIST, menu);

  const columnsConfig: ColumnsType<UserListItem> = [
    {
      title: '',
      dataIndex: 'id',
      key: 'index',
      width: 50,
      fixed: 'left',
      render: (item, record, index: number) => <>{index + 1}</>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (text: number) => <a>{text}</a>,
    },
    // {
    //   title: t('table-data.email'),
    //   width: 100,
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    {
      title: t('table-data.username'),
      width: 100,
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('table-data.role'),
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: { id: number; name: string }) => <UserRoleTag role={role} />,
    },
    {
      title: t('table-data.created-at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (ts: number) => <span> {formatTime(ts, '20YY-MM-DD')} </span>,
    },
    {
      title: t('table-data.creator'),
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: (creator: { id: number; username: string } | null) => (
        <>
          {creator ? (
            <span className='hoverable' onClick={() => onUserDetail(creator.id)}>
              &nbsp;
              {creator.username}&nbsp;
            </span>
          ) : (
            <> - </>
          )}
        </>
      ),
    },
    {
      title: t('table.options'),
      key: 'options',
      width: 120,
      fixed: 'right',
      render: (row: UserListItem) => (
        <div className='a-table-options'>
          <Button className='a-table-option-col' onClick={() => checkAuth(row)}>
            &nbsp;{t('table.check-auth')} &nbsp;
          </Button>
          <AAuthElement className='a-table-option-col' auth={[AuthCode.LOGIN_ADMIN]}>
            <Popconfirm
              title='确认删除该用户吗?'
              onConfirm={() => deleteUser(row.id)}
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
        label: t('table-data.user-id'),
        value: 'id',
        options: {
          min: 0,
          defaultValue: null,
        },
      },
      {
        type: 'input',
        label: t('table-data.username'),
        value: 'username',
        placeholder: 'username',
        options: {
          defaultValue: '',
        },
      },
      {
        type: 'selector',
        label: t('table-data.user-role'),
        placeholder: t('table-data.user-role-pl'),
        value: 'rid',
        dynamic: 'getRoles',
        optionName: 'option1',
        options: {
          width: 200,
        },
      },
    ],
    operation: {
      title: t('page.user-list'),
      buttons: [
        {
          label: t('table.create-user'),
          eventName: 'showAddModal',
          auth: [AuthCode.CREATE_ACCOUNT],
        },
      ],
    },
    table: {
      indexed: true,
      columns: columnsConfig,
    },
  };

  const showAddModal = () => setAddModalVisible(true);

  const checkAuth = (row: UserListItem) => {
    setCurrentRow(row);
    setCheckAuthModalVisible(true);
  };

  const getRoles = async () => {
    const roleOptions = await configApi.getRoleOptions(configApi.getRoles);
    return roleOptions;
  };

  const fetchData = async (filter: any) => {
    const res = await configApi.getUsers(filter);
    const tt = res.success;
    if (!handleResult(res)) return { data: [], total: 0 };
    else {
      const data = res.data.rows.map((v: any) => {
        v.key = v.id;
        return v;
      });
      const total = res.data.count;
      return { data, total };
    }
  };

  const deleteUser = async (id: number) => {
    const res = await configApi.deleteUserById({ id });
    if (!handleResult(res)) {
      setRefresh(true);
    }
  };

  const onUserDetail = (id: number) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className='user-list-page'>
      <ABreadCrumb config={breadcrumb} />

      <AddUserModal visible={addModalVisible} closeModal={() => setAddModalVisible(false)} setRefresh={setRefresh} />

      {currentRow && (
        <CheckAuthModal
          visible={checkAuthModalVisible}
          userInfo={currentRow}
          closeModal={() => setCheckAuthModalVisible(false)}
          setRefresh={setRefresh}
        />
      )}

      <ATable
        config={config}
        fetchData={fetchData}
        refresh={refresh}
        setRefresh={setRefresh}
        pagination={true}
        fns={{
          showAddModal,
          getRoles,
        }}
      />
    </div>
  );
};

export default UserList;
