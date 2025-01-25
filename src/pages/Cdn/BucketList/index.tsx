import { cdnApi } from '@/api';
import ABreadCrumb from '@/components/ABreadCrumb';
import ATable from '@/components/ATable';
import { AAuthElement } from '@/components/snippets';
import { AuthCode, MenuPageCode } from '@/config/constants';
import usePageCode from '@/hooks/usePageCode';
import useSiderMenu from '@/hooks/useSiderMenu';
import { handleResult } from '@/utils';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OSS from 'ali-oss';

type BucketListProps = {};

const BucketList: React.FC<BucketListProps> = props => {
  const [menu] = useSiderMenu();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadcrumb = usePageCode(MenuPageCode.BUCKET_LIST, menu);

  const columnsConfig: ColumnsType<OSS.Bucket> = [
    {
      title: '',
      dataIndex: 'id',
      key: 'index',
      width: 50,
      fixed: 'left',
      render: (item, record, index: number) => <>{index + 1}</>,
    },
    {
      title: '桶名',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地区',
      width: 100,
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: t('table.options'),
      key: 'options',
      width: 40,
      fixed: 'right',
      render: (item, record) => (
        <div className='a-table-options'>
          <AAuthElement auth={[AuthCode.LOGIN_ADMIN]}>
            <a onClick={() => onBucketDetail(record.name)}> 查看详情 </a>
          </AAuthElement>
        </div>
      ),
    },
  ];

  const config: ATableConfig = {
    operation: {
      title: '存储空间列表',
    },
    table: {
      indexed: true,
      columns: columnsConfig,
    },
  };

  const fetchData = async () => {
    const res = await cdnApi.getBuckets();
    if (!handleResult(res)) return { data: [], total: 0 };
    return {
      data: res.data.buckets.map(b => ({ ...b, key: `${b.region}_${b.name}` })),
      total: res.data.buckets.length,
    };
  };

  const onBucketDetail = (name: string) => {
    navigate(`/cdn/bucket/${name}`);
  };

  return (
    <div className='cdn-bucket-list'>
      <ABreadCrumb config={breadcrumb} />
      <ATable config={config} fetchData={fetchData} pagination={true} fns={undefined} />
    </div>
  );
};

export default BucketList;
