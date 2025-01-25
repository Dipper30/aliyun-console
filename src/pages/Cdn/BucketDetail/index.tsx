import { cdnApi } from '@/api';
import { errorMessage, handleResult, successMessage, warningMessage } from '@/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useRoutes, useSearchParams } from 'react-router-dom';
import { DownloadOutlined, FolderFilled, FolderTwoTone, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Breadcrumb, Button, message, Popconfirm, Table, Tag, Tooltip, Upload } from 'antd';
import usePageCode from '@/hooks/usePageCode';
import { MenuPageCode } from '@/config/constants';
import useSiderMenu from '@/hooks/useSiderMenu';
import ABreadCrumb from '@/components/ABreadCrumb';
import { ColumnsType } from 'antd/es/table';
import { formatTime, getCdnDirName, getFileSize } from '@/utils/tools';
import FileUploader, { SelectFileModalRef } from './SelectFileModal';
import CreateDirectoryModal, { CreateDirectoryModalRef } from './CreateDirectoryModal';
import ATable from '@/components/ATable';
import useCdnUpload from '@/hooks/useCdnUpload';
import FileProgress from './FileProgress';
import { CopyAction } from '@/components/snippets';
import copy from 'copy-to-clipboard';

type BucketDetailProps = {};

const BucketDetail: React.FC<BucketDetailProps> = props => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menu] = useSiderMenu();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);

  const [bucketName, setBucketName] = useState<string>();
  const [dirId, setDirId] = useState<string>();
  const [bucketInfo, setBucketInfo] = useState<BucketDetail>();

  const [uploading, setUploading] = useState(false);
  const selectFileModalRef = useRef<SelectFileModalRef>(null);
  const createDirectoryModalRef = useRef<CreateDirectoryModalRef>(null);
  const [directory, setDirectory] = useState<{
    parents: ModelType.BucketFileDir[];
    current?: ModelType.BucketFileDir;
    children: ModelType.BucketFileDir[];
  }>();
  const [files, setFiles] = useState<ModelType.BucketFile[]>([]);
  const [fileCount, setFileCount] = useState<number>(0);

  useEffect(() => {
    if (params) {
      const name = params.name;
      fetchBucketInfo(name);
      setBucketName(name);
    }
  }, [params.name]);

  useEffect(() => {
    if (searchParams) {
      setRefresh(true);
    }
  }, [searchParams]);

  type RowType =
    | ({
        dirId: string;
      } & ModelType.BucketFileDir)
    | ({
        dirId: undefined;
      } & ModelType.BucketFile);
  const fetchData = async (filter: { keyword?: string }) => {
    if (!bucketInfo) return { data: [], total: 0 };
    const res = await cdnApi.getFilesByDirectory({
      bucketName: bucketInfo.name,
      bucketRegion: bucketInfo.location,
      dirId: searchParams.get('dirId') || null,
      ...filter,
      // prefix: 'fe',
    });
    const files = res.data.rows.map(f => ({ ...f, key: f.id }));
    if (handleResult(res)) {
      setFiles(files);
      setFileCount(res.data.count);
      setDirectory(res.data.directory);
    }
    const data: RowType[] = res.data.directory.children
      .map(d => ({
        ...d,
        dirId: `dir_${d.id}`,
        key: `dir_${d.id}`,
      }))
      .concat(files.map(f => ({ ...f, dirId: undefined, key: f.id })) as any);
    return { data, total: res.data.count };
  };

  const fetchBucketInfo = async (name?: string) => {
    if (!name) {
      errorMessage('存储空间名解析错误');
      return;
    }
    const res = await cdnApi.getBucketInfo(name);
    if (handleResult(res)) {
      setBucketInfo(res.data);
    }
  };

  //   const handleChange: UploadProps['onChange'] = async info => {
  //     let newFileList = [...info.fileList];
  //     info.file.crossOrigin = 'anonymous';
  //     if (bucketInfo) {
  //       const res = await cdnApi.getPresignedUrl({
  //         fileName: info.file.name,
  //         bucketName: bucketInfo?.name,
  //         bucketRegion: bucketInfo?.location,
  //         method: 'PUT',
  //       });
  //       if (res.data) {
  //         const formData = new FormData();
  //         formData.append('file', info.file as any);
  //         fetch(res.data, {
  //           method: 'PUT',
  //           headers: new Headers({
  //             'Content-Type': 'image/png',
  //             /**
  //              * 指定该Object被下载时网页的缓存行为。取值如下：

  // no-cache：不可直接使用缓存，而是先到服务端验证Object是否已更新。如果Object已更新，表明缓存已过期，需从服务端重新下载Object；如果Object未更新，表明缓存未过期，此时将使用本地缓存。

  // no-store：所有内容都不会被缓存。

  // public：所有内容都将被缓存。

  // private：所有内容只在客户端缓存。

  // max-age=<seconds>：缓存内容的相对过期时间，单位为秒。此选项仅在HTTP 1.1中可用。

  // 默认值：无
  //              */
  //             'Cache-Control': 'no-cache',
  //           }),
  //           body: info.file as any,
  //         })
  //           .then(response => {
  //             if (!response.ok) {
  //               throw new Error('文件上传到OSS失败');
  //             }
  //             console.log(response);
  //             alert('文件已上传');
  //           })
  //           .catch(error => {
  //             console.error('发生错误:', error);
  //             alert(error.message);
  //           });
  //       }
  //     }

  //     // 1. Limit the number of uploaded files
  //     // Only to show two recent uploaded files, and old ones will be replaced by the new
  //     newFileList = newFileList.slice(-5);

  //     // 2. Read from response and show file link
  //     newFileList = newFileList.map(file => {
  //       if (file.response) {
  //         // Component will show file.url as link
  //         file.url = file.response.url;
  //       }
  //       return file;
  //     });

  //     setFileList(newFileList);
  //   };

  // const uploadProps: UploadProps = {
  //   onRemove: file => {
  //     const index = fileList.indexOf(file);
  //     const newFileList = fileList.slice();
  //     newFileList.splice(index, 1);
  //     setFileList(newFileList);
  //   },
  //   beforeUpload: file => {
  //     setFileList([...fileList, file]);
  //     return false;
  //   },
  //   onChange: handleChange,
  //   multiple: true,
  //   fileList,
  // };

  useEffect(() => {
    if (bucketInfo?.name && bucketInfo.location) {
      setRefresh(true);
    }
  }, [bucketInfo?.name, bucketInfo?.location]);

  // const fetchFileList = async () => {
  //   if (!bucketInfo) return;
  //   const res = await cdnApi.getFilesByDirectory({
  //     bucketName: bucketInfo.name,
  //     bucketRegion: bucketInfo.location,
  //     dirId: searchParams.get('dirId') || null,
  //     // prefix: 'fe',
  //   });
  //   if (handleResult(res)) {
  //     setFiles(res.data.rows.map(f => ({ ...f, key: f.id })));
  //     setFileCount(res.data.count);
  //     setDirectory(res.data.directory);
  //   }
  // };

  const openFileUploader = () => {
    selectFileModalRef.current?.openModal();
  };

  const openCreateDirectoryModal = () => {
    if (!bucketInfo) return;
    createDirectoryModalRef.current?.openModal();
  };

  const enterDir = (id?: string | null) => {
    setSearchParams(params => {
      if (id) {
        params.set('dirId', id);
      } else {
        params.delete('dirId');
      }
      return params;
    });
  };

  const [fileUrlLoadingStatus, setFileUrlLoadingStatus] = useState<{ name: string; status: 'loading' | 'finished' }[]>(
    [],
  );

  /**
   * 获取预签地址，需要根据 fileUrl 获取 OSS 带文件夹前缀的地址
   * @param file
   * @returns
   */
  const getDownloadUrl = async (file: ModelType.BucketFile) => {
    if (!bucketInfo) return;
    const fileName = file.fileUrl.split('aliyuncs.com/')[1];
    if (fileUrlLoadingStatus.find(f => f.name === fileName && f.status === 'loading')) {
      warningMessage('请勿频繁操作');
      return;
    }
    try {
      const presignRes = await cdnApi.getPresignedUrl({
        fileType: file.fileType,
        fileName,
        bucketName: bucketInfo.name,
        bucketRegion: bucketInfo.location,
        method: 'GET',
      });
      if (handleResult(presignRes) && presignRes.data) {
        if (copy(presignRes.data)) {
          successMessage('复制成功');
        }
      }
    } catch (error) {
    } finally {
      setFileUrlLoadingStatus(prev => prev.filter(f => f.name !== fileName));
    }
  };

  const columnsConfig: ColumnsType<RowType> = [
    // {
    //   title: '',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 50,
    //   fixed: 'left',
    //   render: (value, record, index: number) => <>{index + 1}</>,
    // },
    {
      title: '文件名',
      width: 120,
      key: 'name',
      render: (value, record: RowType) => (
        <div className='flex gap-2 items-center'>
          {record.dirId === undefined ? (
            <>
              <div>{record.fileName}</div>
              <CopyAction text={record.fileName} tooltip='复制文件名' />
              <Tooltip title='获取加签地址' mouseEnterDelay={0.2}>
                <DownloadOutlined onClick={() => getDownloadUrl(record)} />
              </Tooltip>
            </>
          ) : (
            <>
              <FolderTwoTone twoToneColor='#ffce3d' style={{ fontSize: '20px' }} />
              <div onClick={() => enterDir(record.id)} className='text-link'>
                {record.name}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: '文件大小',
      width: 80,
      dataIndex: 'size',
      render: (value, record: RowType) => (
        <div>{record.dirId === undefined ? getFileSize(record.size || 0) : <div></div>}</div>
      ),
    },
    {
      title: '文件类型',
      width: 80,
      dataIndex: 'type',
      render: (value, record: RowType) => <div>{record.dirId === undefined ? record.fileType : <div></div>}</div>,
    },
    {
      title: '更新时间',
      width: 100,
      dataIndex: 'updatedAt',
      render: (value, record) => <>{formatTime(record.updatedAt)}</>,
    },
    {
      title: '创建时间',
      width: 100,
      dataIndex: 'createdAt',
      render: (value, record) => <>{formatTime(record.createdAt)}</>,
    },
    {
      title: '操作',
      key: 'options',
      width: 80,
      fixed: 'right',
      render: (row, record) => (
        <div className='a-table-options'>
          {record.dirId === undefined ? (
            <>
              <Popconfirm
                title='删除文件'
                description='确认连同 OSS 文件资源一起删除吗？'
                onConfirm={() => onDeleteFile(record.id)}
                okText='确认'
                cancelText='取消'
              >
                {' '}
                <a className='text-error'>删除</a>
              </Popconfirm>

              <a>覆盖</a>
            </>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const directoryTree =
    directory &&
    (!directory.current ? (
      <Breadcrumb rootClassName='text-lg inline-block mb-0!' items={[{ title: 'root' }]} separator='/' />
    ) : directory.parents ? (
      <Breadcrumb
        rootClassName='text-lg inline-block mb-0!'
        items={[
          {
            title: 'root',
            className: 'text-link',
            onClick: () => {
              enterDir(null);
            },
          },
          ...directory.parents.map(p => ({
            key: p.id,
            title: p.name,
            className: 'text-link',
            onClick: () => {
              enterDir(p.id);
            },
          })),
          {
            key: directory.current.id,
            title: directory.current.name,
            onClick: () => {
              enterDir(directory.current!.id);
            },
          },
        ]}
        separator='/'
      />
    ) : (
      <></>
    ));
  const config: ATableConfig = {
    filter: {
      dirId: '',
      keyword: '',
    },
    filterOptions: [
      {
        type: 'input',
        label: '文件名',
        value: 'keyword',
      },
    ],
    operation: {
      title: () => directoryTree,
      render: () => (
        <div>
          {bucketInfo && directory && (
            <div className='flex item-center gap-4'>
              <Button type='default' onClick={openCreateDirectoryModal}>
                新建文件夹
              </Button>
              <Button type='primary' onClick={openFileUploader}>
                上传文件
              </Button>
              <CreateDirectoryModal
                ref={createDirectoryModalRef}
                bucketInfo={bucketInfo}
                dirContext={directory}
                refetch={() => {
                  setRefresh(true);
                }}
              />
              <FileUploader ref={selectFileModalRef} dirContext={directory} addFile={onAddFile} />
            </div>
          )}
        </div>
      ),
    },
    table: {
      indexed: false,
      columns: columnsConfig,
    },
  };

  const breadcrumbConfig = useMemo(
    () => [
      {
        route: '/cdn/bucket/list',
        text: `存储空间列表`,
      },
      {
        text: `${bucketInfo?.name} 文件列表`,
      },
    ],
    [bucketInfo?.name],
  );

  // 上传文件
  const onFileUploaded = (file: UploadFile) => {
    setRefresh(true);
  };
  const { fileList, upload } = useCdnUpload({
    onSuccess: onFileUploaded,
  });
  const onAddFile = async (
    file: UploadFile,
    options: {
      cache?: number;
    },
  ) => {
    if (!directory || !bucketInfo) return;
    const fileNamePrefix = `${getCdnDirName(directory).replaceAll(' ', '')}`;
    upload(file, {
      prefix: fileNamePrefix,
      dirId: searchParams.get('dirId'),
      bucketName: bucketInfo?.name,
      bucketRegion: bucketInfo?.location,
      cacheControl: options.cache,
    });
  };

  const onDeleteFile = async (id: string) => {
    const res = await cdnApi.deleteFiles({ ids: [id] });
    if (handleResult(res) && res.data) {
      const failedFiles = res.data.filter(r => !r.success);
      if (failedFiles.length === res.data.length) {
        errorMessage(`删除失败: ${failedFiles.map(f => f.errMsg).join(', ')}`);
      } else if (failedFiles.length === 0) {
        successMessage('删除成功');
        setRefresh(true);
      } else {
        warningMessage(`部分文件删除失败: ${failedFiles.map(f => f.errMsg).join(', ')}`);
        setRefresh(true);
      }
    }
  };

  return (
    <div className='bucket-detail-page'>
      <div className='flex justify-between items-center'>
        {breadcrumbConfig && <ABreadCrumb config={breadcrumbConfig} />}
      </div>
      <FileProgress fileList={fileList} />
      <ATable config={config} fetchData={fetchData} refresh={refresh} setRefresh={setRefresh} fns={undefined} />
      <div></div>
    </div>
  );
};

export default BucketDetail;
